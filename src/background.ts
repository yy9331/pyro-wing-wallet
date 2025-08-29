import {
  createVault,
  createVaultFromPrivateKey,
  hasVault,
  unlockVault,
  getAddress,
  getBalance,
  sendTransaction,
  setNetwork
} from "./lib/wallet"

type Msg =
  | { type: "wallet:createVault"; password: string; mnemonic?: string }
  | { type: "wallet:createVaultFromPrivateKey"; password: string; privateKey: string }
  | { type: "wallet:hasVault" }
  | { type: "wallet:unlock"; password: string }
  | { type: "wallet:getAddress" }
  | { type: "wallet:getBalance" }
  | { type: "wallet:sendTx"; to: `0x${string}`; valueEth: string }
  | { type: "wallet:setNetwork"; net: "sepolia" | "mainnet" }
  | { type: "storage:saveVault"; data: unknown }
  | { type: "storage:loadVault" }
  | { type: "storage:clearVault" }

chrome.runtime.onMessage.addListener((msg: Msg, _sender, sendResponse) => {
  ;(async () => {
    try {
      switch (msg.type) {
        case "wallet:createVault": {
          const res = await createVault(msg.password, msg.mnemonic)
          sendResponse({ ok: true, mnemonic: res.mnemonic })
          break
        }
        case "wallet:createVaultFromPrivateKey": {
          await createVaultFromPrivateKey(msg.password, msg.privateKey)
          sendResponse({ ok: true })
          break
        }
        case "wallet:hasVault": {
          const ok = await hasVault()
          sendResponse({ ok })
          break
        }
        case "wallet:unlock": {
          await unlockVault(msg.password)
          sendResponse({ ok: true })
          break
        }
        case "wallet:getAddress": {
          sendResponse({ ok: true, address: getAddress() })
          break
        }
        case "wallet:getBalance": {
          const bal = await getBalance()
          sendResponse({ ok: true, balance: bal })
          break
        }
        case "wallet:sendTx": {
          const hash = await sendTransaction(msg.to, msg.valueEth)
          sendResponse({ ok: true, hash })
          break
        }
        case "wallet:setNetwork": {
          setNetwork(msg.net)
          sendResponse({ ok: true })
          break
        }

        default:
          sendResponse({ ok: false, error: "unknown_message" })
      }
    } catch (e: any) {
      sendResponse({ ok: false, error: e?.message || String(e) })
    }
  })()
  return true
})