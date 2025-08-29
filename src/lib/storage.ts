const VAULT_KEY = "pyro-wing-wallet-vault"

export const saveVault = async (encrypted: unknown) => await chrome.storage.local.set({ [VAULT_KEY]: encrypted })

export const loadVault = async <T = unknown> (): Promise<T | null>  => {
    const res = await chrome.storage.local.get(VAULT_KEY)
    return (res?.[VAULT_KEY] ?? null) as T | null
}

export const clearVault = async () => await chrome.storage.local.remove(VAULT_KEY)