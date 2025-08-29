import { createPublicClient, createWalletClient, formatEther, http, parseEther } from "viem"
import { mainnet, sepolia } from "viem/chains"
import { mnemonicToAccount } from "viem/accounts"
import { generateMnemonic } from "bip39"
import type { EncryptedPayload } from "./crypto"
import { encryptJson, decryptJson } from "./crypto"
// 使用内存存储作为临时解决方案
let vaultData: unknown = null

const saveVaultToStorage = async (encrypted: unknown) => {
  try {
    // 优先使用 Chrome Storage API
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ "pyro-wing-wallet-vault": encrypted })
      vaultData = encrypted // 同时保存到内存
      return
    }
    
    // 如果 Chrome Storage 不可用，使用内存存储
    vaultData = encrypted
    console.log("使用内存存储（临时方案）")
    return
  } catch (error) {
    console.error("保存金库失败:", error)
    // 即使 Chrome Storage 失败，也保存到内存
    vaultData = encrypted
    console.log("Chrome Storage 失败，使用内存存储")
  }
}

const loadVaultFromStorage = async <T = unknown>(): Promise<T | null> => {
  try {
    // 优先使用 Chrome Storage API
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const res = await chrome.storage.local.get("pyro-wing-wallet-vault")
      const data = res["pyro-wing-wallet-vault"]
      if (data) {
        vaultData = data // 同步到内存
        return data as T
      }
    }
    
    // 如果 Chrome Storage 不可用或没有数据，使用内存存储
    return vaultData as T | null
  } catch (error) {
    console.error("加载金库失败:", error)
    // 返回内存中的数据
    return vaultData as T | null
  }
}

type VaultData = { mnemonic: string }
type NetworkId = "sepolia" | "mainnet"

let currentAccount: ReturnType<typeof mnemonicToAccount> | null = null
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
  const encrypted = await encryptJson({ mnemonic }, password)
  await saveVaultToStorage(encrypted)
  return { mnemonic } // 仅在创建阶段返回，供用户备份；不会存明文
}

export const hasVault = async (): Promise<boolean> => {
  const v = await loadVaultFromStorage()
  return !!v
}

export const unlockVault = async (password: string): Promise<void> => {
  const encrypted = await loadVaultFromStorage<EncryptedPayload>()
  if (!encrypted) throw new Error("Vault not found")
  const { mnemonic } = await decryptJson<VaultData>(encrypted, password)
  currentAccount = mnemonicToAccount(mnemonic)
  walletClient = createWalletClient({
    chain: publicClient.chain!,
    account: currentAccount,
    transport: http()
  })
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