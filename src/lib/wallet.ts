import { createPublicClient, createWalletClient, formatEther, http, parseEther, type Account } from "viem"
import { mainnet, sepolia } from "viem/chains"
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts"
import { generateMnemonic, validateMnemonic } from "bip39"
import type { EncryptedPayload } from "./crypto"
import { encryptJson, decryptJson } from "./crypto"

// IndexedDB 备选存储方案
const DB_NAME = "PyroWingWallet"
const DB_VERSION = 1
const STORE_NAME = "vault"

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" })
      }
    }
  })
}

const saveToIndexedDB = async (encrypted: unknown) => {
  const db = await getDB()
  const transaction = db.transaction([STORE_NAME], "readwrite")
  const store = transaction.objectStore(STORE_NAME)
  
  await new Promise((resolve, reject) => {
    const request = store.put({ id: "vault", data: encrypted })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  
  console.log("钱包数据已保存到 IndexedDB")
}

const loadFromIndexedDB = async <T = unknown>(): Promise<T | null> => {
  const db = await getDB()
  const transaction = db.transaction([STORE_NAME], "readonly")
  const store = transaction.objectStore(STORE_NAME)
  
  const result = await new Promise<any>((resolve, reject) => {
    const request = store.get("vault")
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  
  if (result && (result as any).data) {
    console.log("从 IndexedDB 找到钱包数据")
    return (result as any).data as T
  }
  return null
}
// 使用 Chrome Storage API 作为持久化存储
const saveVaultToStorage = async (encrypted: unknown) => {
  try {
    console.log("使用 Chrome Storage API 保存钱包数据...")
    console.log("当前环境:", typeof window !== 'undefined' ? 'popup' : 'service worker')
    console.log("chrome 对象:", typeof chrome)
    console.log("chrome.storage:", chrome?.storage)
    console.log("chrome.storage.local:", chrome?.storage?.local)
    
    // 确保在正确的上下文中
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      console.error("Chrome Storage API 不可用，尝试使用备选方案")
      // 使用备选方案：IndexedDB
      await saveToIndexedDB(encrypted)
      return
    }
    
    await chrome.storage.local.set({ "pyro-wing-wallet-vault": encrypted })
    console.log("钱包数据已保存到 Chrome Storage")
  } catch (error) {
    console.error("保存金库失败:", error)
    // 尝试使用备选方案
    try {
      await saveToIndexedDB(encrypted)
    } catch (fallbackError) {
      console.error("备选方案也失败:", fallbackError)
      throw error
    }
  }
}

const loadVaultFromStorage = async <T = unknown>(): Promise<T | null> => {
  try {
    console.log("从 Chrome Storage API 加载钱包数据...")
    console.log("当前环境:", typeof window !== 'undefined' ? 'popup' : 'service worker')
    
    // 优先尝试 Chrome Storage API
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      try {
        const result = await chrome.storage.local.get("pyro-wing-wallet-vault")
        const data = result["pyro-wing-wallet-vault"]
        
        if (data) {
          console.log("从 Chrome Storage 找到钱包数据")
          return data as T
        }
      } catch (chromeError) {
        console.error("Chrome Storage 加载失败:", chromeError)
      }
    }
    
    // 备选方案：IndexedDB
    console.log("尝试从 IndexedDB 加载钱包数据...")
    const indexedDBData = await loadFromIndexedDB<T>()
    if (indexedDBData) {
      return indexedDBData
    }
    
    console.log("没有找到钱包数据")
    return null
  } catch (error) {
    console.error("加载金库失败:", error)
    return null
  }
}

type VaultData = { mnemonic?: string; privateKey?: string }
type NetworkId = "sepolia" | "mainnet"

let currentAccount: Account | null = null
let publicClient = createPublicClient({ chain: sepolia, transport: http() })
let walletClient: ReturnType<typeof createWalletClient> | null = null

export const setNetwork = (net: NetworkId): void => {
  const chain = net === "mainnet" ? mainnet : sepolia
  publicClient = createPublicClient({ chain, transport: http() }) as typeof publicClient
  if (currentAccount) {
    walletClient = createWalletClient({ chain, account: currentAccount, transport: http() })
  }
}

export const createVault = async (password: string, maybeMnemonic?: string): Promise<{ mnemonic: string }> => {
  const mnemonic = maybeMnemonic?.trim() || generateMnemonic(128)
  
  // 如果用户传入助记词，进行合法性校验
  if (maybeMnemonic && !validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic")
  }
  
  const encrypted = await encryptJson({ mnemonic }, password)
  await saveVaultToStorage(encrypted)
  return { mnemonic } // 仅在创建阶段返回，供用户备份；不会存明文
}

export const createVaultFromPrivateKey = async (password: string, privateKey: string): Promise<void> => {
  const encrypted = await encryptJson({ privateKey }, password)
  await saveVaultToStorage(encrypted)
}

export const hasVault = async (): Promise<boolean> => {
  const v = await loadVaultFromStorage()
  console.log("检查钱包是否存在:", !!v)
  return !!v
}

export const unlockVault = async (password: string): Promise<void> => {
  console.log("尝试解锁钱包...")
  const encrypted = await loadVaultFromStorage<EncryptedPayload>()
  if (!encrypted) {
    console.error("未找到钱包数据")
    throw new Error("Vault not found")
  }
  console.log("找到加密的钱包数据，尝试解密...")
  
  try {
    const vaultData = await decryptJson<VaultData>(encrypted, password)
    console.log("解密成功，钱包数据类型:", vaultData.mnemonic ? "助记词" : "私钥")
    
    if (vaultData.mnemonic) {
      currentAccount = mnemonicToAccount(vaultData.mnemonic)
    } else if (vaultData.privateKey) {
      currentAccount = privateKeyToAccount(vaultData.privateKey as `0x${string}`)
    } else {
      throw new Error("Invalid vault data")
    }
    
    walletClient = createWalletClient({
      chain: publicClient.chain!,
      account: currentAccount as Account,
      transport: http()
    })
    console.log("钱包已解锁，地址:", currentAccount!.address)
  } catch (error) {
    console.error("解密失败:", error)
    throw new Error("密码错误或数据损坏")
  }
}

export const getAddress = (): string | null => {
  return currentAccount?.address ?? null
}

export const getBalance = async (): Promise<string> => {
  if (!currentAccount) throw new Error("Wallet locked")
  const balance = await publicClient.getBalance({ address: currentAccount.address })
  return formatEther(balance)
}

export const sendTransaction = async (to: `0x${string}`, valueEth: string): Promise<`0x${string}`> => {
  if (!walletClient || !currentAccount) throw new Error("Wallet locked")
  const hash = await walletClient.sendTransaction({
    to,
    value: parseEther(valueEth),
    account: currentAccount,
    chain: publicClient.chain
  })
  return hash as `0x${string}`
}

// ERC20 读取
const ERC20_ABI = [
  { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "owner", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "transfer", type: "function", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] }
] as const

export const getErc20Balance = async (token: `0x${string}`): Promise<{ symbol: string; decimals: number; balance: string }> => {
  if (!currentAccount) throw new Error("Wallet locked")
  const [decimals, symbol, raw] = await Promise.all([
    publicClient.readContract({ address: token, abi: ERC20_ABI, functionName: "decimals" }) as Promise<number>,
    publicClient.readContract({ address: token, abi: ERC20_ABI, functionName: "symbol" }) as Promise<string>,
    publicClient.readContract({ address: token, abi: ERC20_ABI, functionName: "balanceOf", args: [currentAccount.address] }) as Promise<bigint>
  ])
  // format using decimals
  const divisor = BigInt(10) ** BigInt(decimals)
  const integer = raw / divisor
  const fraction = raw % divisor
  const fracStr = fraction.toString().padStart(decimals, "0").replace(/0+$/, "")
  const balance = fracStr ? `${integer.toString()}.${fracStr}` : integer.toString()
  return { symbol, decimals, balance }
}

export const sendErc20Transaction = async (token: `0x${string}`, to: `0x${string}`, amount: string, decimals: number): Promise<`0x${string}`> => {
  if (!walletClient || !currentAccount) throw new Error("Wallet locked")
  
  // 将金额转换为wei (考虑decimals)
  const divisor = BigInt(10) ** BigInt(decimals)
  const [integer, fraction] = amount.split('.')
  const integerPart = BigInt(integer || '0')
  const fractionPart = BigInt((fraction || '').padEnd(decimals, '0').slice(0, decimals))
  const value = integerPart * divisor + fractionPart
  
  const hash = await walletClient.writeContract({
    address: token,
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [to, value],
    account: currentAccount,
    chain: publicClient.chain
  })
  
  return hash as `0x${string}`
}