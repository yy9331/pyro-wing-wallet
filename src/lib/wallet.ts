import { createPublicClient, createWalletClient, formatEther, http, parseEther } from "viem"
import { mainnet, sepolia } from "viem/chains"
import { mnemonicToAccount } from "viem/accounts"
import { generateMnemonic } from "bip39"
import type { EncryptedPayload } from "./crypto"
import { encryptJson, decryptJson } from "./crypto"
import { saveVault, loadVault } from "./storage"

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
  await saveVault(encrypted)
  return { mnemonic } // 仅在创建阶段返回，供用户备份；不会存明文
}

export const hasVault = async (): Promise<boolean> => {
  const v = await loadVault()
  return !!v
}

export const unlockVault = async (password: string): Promise<void> => {
  const encrypted = await loadVault<EncryptedPayload>()
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