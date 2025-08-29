import React, { useEffect, useState } from "react"
import "./style.css"
import { Layout, Header, Content } from "./components/Layout"
import { WalletHeader } from "./components/Header"
import { Tabs } from "./components/Tabs"
import { Welcome } from "./pages/Welcome"
import { CreateWallet } from "./pages/CreateWallet"
import { ImportWallet } from "./pages/ImportWallet"
import { ImportPrivateKey } from "./pages/ImportPrivateKey"
import { Unlock } from "./pages/Unlock"
import { Assets } from "./pages/Assets"
import { Send } from "./pages/Send"

// 消息通信函数
const call = async<T = any>(msg: any): Promise<T> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (res) => resolve(res))
  }) as Promise<T>
}

// 页面类型
type Page = "welcome" | "create" | "import" | "importPrivateKey" | "unlock" | "assets" | "send" | "receive" | "settings"

const IndexPopup = () => {
  // 状态管理
  const [currentPage, setCurrentPage] = useState<Page>("welcome")
  const [network, setNetwork] = useState("sepolia")
  const [address, setAddress] = useState<string>("")
  const [balance, setBalance] = useState<string>("0")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [hasVault, setHasVault] = useState(false)

  // 检查钱包状态
  useEffect(() => {
    checkWalletStatus()
  }, [])

  const checkWalletStatus = async () => {
    try {
      console.log("检查钱包状态...")
      
      // 直接从 background 获取钱包状态
      const vaultRes = await call<{ ok: boolean }>({ type: "wallet:hasVault" })
      console.log("Background 钱包状态:", vaultRes.ok)
      setHasVault(vaultRes.ok)
      
      if (vaultRes.ok) {
        // 检查是否已解锁
        const addrRes = await call<{ ok: boolean; address: string | null }>({ type: "wallet:getAddress" })
        if (addrRes.ok && addrRes.address) {
          // 已解锁，直接进入资产页面
          console.log("钱包已解锁，地址:", addrRes.address)
          setAddress(addrRes.address)
          setIsUnlocked(true)
          setCurrentPage("assets")
          // 获取余额
          const balRes = await call<{ ok: boolean; balance?: string; error?: string }>({ type: "wallet:getBalance" })
          if (balRes.ok && balRes.balance) {
            setBalance(balRes.balance)
          }
        } else {
          // 有金库但未解锁，显示解锁页面
          console.log("钱包存在但未解锁")
          setCurrentPage("unlock")
        }
      } else {
        // 没有金库，显示欢迎页面
        console.log("钱包不存在，显示欢迎页面")
        setCurrentPage("welcome")
      }
    } catch (error) {
      console.error("检查钱包状态失败:", error)
      setCurrentPage("welcome")
    }
  }

  // 网络切换
  const handleNetworkChange = async (newNetwork: string) => {
    setNetwork(newNetwork)
    await call<{ ok: boolean }>({ type: "wallet:setNetwork", net: newNetwork as "sepolia" | "mainnet" })
    // 重新获取余额
    if (isUnlocked) {
      const balRes = await call<{ ok: boolean; balance?: string; error?: string }>({ type: "wallet:getBalance" })
      if (balRes.ok && balRes.balance) {
        setBalance(balRes.balance)
      }
    }
  }

  // 创建钱包
  const handleCreateWallet = async (password: string, mnemonic?: string) => {
    try {
      const res = await call<{ ok: boolean; mnemonic?: string; error?: string }>({
        type: "wallet:createVault",
        password,
        mnemonic
      })
      if (res.ok) {
        // 不跳转，返回助记词以便在创建页展示备份步骤
        setHasVault(true)
        return res.mnemonic
      } else {
        throw new Error(res.error || "创建失败")
      }
    } catch (error: any) {
      console.error("创建钱包错误:", error)
      throw new Error(error.message || "创建失败")
    }
  }

  // 导入钱包
  const handleImportWallet = async (password: string, mnemonic: string) => {
    try {
      const res = await call<{ ok: boolean; error?: string }>({
        type: "wallet:createVault",
        password,
        mnemonic
      })
      if (res.ok) {
        setHasVault(true)
        // 导入成功后直接解锁并进入资产页面
        await handleUnlock(password)
      } else {
        throw new Error(res.error || "导入失败")
      }
    } catch (error: any) {
      throw new Error(error.message || "导入失败")
    }
  }

  // 导入私钥
  const handleImportPrivateKey = async (password: string, privateKey: string) => {
    try {
      const res = await call<{ ok: boolean; error?: string }>({
        type: "wallet:createVaultFromPrivateKey",
        password,
        privateKey
      })
      if (res.ok) {
        setHasVault(true)
        // 导入成功后直接解锁并进入资产页面
        await handleUnlock(password)
      } else {
        throw new Error(res.error || "导入失败")
      }
    } catch (error: any) {
      throw new Error(error.message || "导入失败")
    }
  }

  // 处理"我已有钱包"点击
  const handleIHaveWallet = () => {
    // 直接进入解锁页面，让用户输入密码
    setCurrentPage("unlock")
  }

  // 解锁钱包
  const handleUnlock = async (password: string) => {
    try {
      const res = await call<{ ok: boolean; error?: string }>({ type: "wallet:unlock", password })
      if (res.ok) {
        setIsUnlocked(true)
        setCurrentPage("assets")
        // 获取地址和余额
        const addrRes = await call<{ ok: boolean; address: string | null }>({ type: "wallet:getAddress" })
        if (addrRes.ok && addrRes.address) {
          setAddress(addrRes.address)
        }
        const balRes = await call<{ ok: boolean; balance?: string; error?: string }>({ type: "wallet:getBalance" })
        if (balRes.ok && balRes.balance) {
          setBalance(balRes.balance)
        }
      } else {
        throw new Error(res.error || "密码错误")
      }
    } catch (error: any) {
      throw new Error(error.message || "解锁失败")
    }
  }

  // 发送交易
  const handleSend = async (to: string, amount: string) => {
    try {
      const res = await call<{ ok: boolean; hash?: string; error?: string }>({
        type: "wallet:sendTx",
        to: to as `0x${string}`,
        valueEth: amount
      })
      if (res.ok && res.hash) {
        alert(`交易已发送！\n交易哈希: ${res.hash}`)
        setCurrentPage("assets")
        // 更新余额
        const balRes = await call<{ ok: boolean; balance?: string; error?: string }>({ type: "wallet:getBalance" })
        if (balRes.ok && balRes.balance) {
          setBalance(balRes.balance)
        }
      } else {
        alert(`发送失败: ${res.error}`)
      }
    } catch (error) {
      alert(`发送失败: ${error}`)
    }
  }

  // 渲染页面内容
  const renderContent = () => {
    switch (currentPage) {
      case "welcome":
        return (
          <Welcome
            onCreateWallet={() => setCurrentPage("create")}
            onImportWallet={() => setCurrentPage("import")}
            onImportPrivateKey={() => setCurrentPage("importPrivateKey")}
            onScanQR={() => alert("扫描功能开发中...")}
            onIHaveWallet={handleIHaveWallet}
          />
        )
      case "create":
        return (
          <CreateWallet
            onCreate={handleCreateWallet}
            onBack={() => setCurrentPage("welcome")}
            onBackupDone={() => setCurrentPage("unlock")}
          />
        )
      case "import":
        return (
          <ImportWallet
            onImport={handleImportWallet}
            onBack={() => setCurrentPage("welcome")}
          />
        )
      case "importPrivateKey":
        return (
          <ImportPrivateKey
            onImport={handleImportPrivateKey}
            onBack={() => setCurrentPage("welcome")}
          />
        )
      case "unlock":
        return (
          <Unlock
            onUnlock={handleUnlock}
            onBack={() => setCurrentPage("welcome")}
          />
        )
      case "assets":
        return (
          <Assets
            balance={balance}
            address={address}
            onSend={() => setCurrentPage("send")}
            onReceive={() => setCurrentPage("receive")}
            onSwap={() => alert("兑换功能开发中...")}
          />
        )
      case "send":
        return (
          <Send
            balance={balance}
            onSend={handleSend}
            onBack={() => setCurrentPage("assets")}
          />
        )
      case "receive":
        return (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-white">接收</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">你的地址</div>
              <div className="text-white font-mono text-sm break-all">{address || "未连接"}</div>
            </div>
            <button 
              onClick={() => setCurrentPage("assets")}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors w-full"
            >
              返回
            </button>
          </div>
        )
      default:
        return <div>页面不存在</div>
    }
  }

  // 如果当前页面是欢迎、创建、导入或解锁页面，不显示布局
  if (["welcome", "create", "import", "importPrivateKey", "unlock"].includes(currentPage)) {
    return (
      <Layout>
        <Content className="p-0">
          {renderContent()}
        </Content>
      </Layout>
    )
  }

  // 主钱包界面
  return (
    <Layout>
      <Header>
        <WalletHeader
          network={network}
          address={address}
          onNetworkChange={handleNetworkChange}
          onSettingsClick={() => alert("设置功能开发中...")}
        />
      </Header>

      <Content>
        {currentPage === "assets" && (
          <Tabs
            tabs={[
              { id: "assets", label: "资产" },
              { id: "defi", label: "DeFi" },
              { id: "nft", label: "NFT" },
              { id: "history", label: "历史" }
            ]}
            activeTab="assets"
            onTabChange={() => {}}
          />
        )}
        
        <div className="mt-4">
          {renderContent()}
        </div>
      </Content>
    </Layout>
  )
}

export default IndexPopup