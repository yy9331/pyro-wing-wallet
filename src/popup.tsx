import { useEffect, useState } from "react"
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
import { Settings } from "./pages/Settings"

// 消息通信函数
const call = async<T = any>(msg: any): Promise<T> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (res) => resolve(res))
  }) as Promise<T>
}

// 页面类型
type Page = "welcome" | "create" | "import" | "importPrivateKey" | "unlock" | "assets" | "send" | "receive" | "settings"

type CustomToken = { address: `0x${string}`; symbol: string; decimals: number }

const IndexPopup = () => {
  // 状态管理
  const [currentPage, setCurrentPage] = useState<Page>("welcome")
  const [network, setNetwork] = useState("sepolia")
  const [address, setAddress] = useState<string>("")
  const [balance, setBalance] = useState<string>("0")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [hasVault, setHasVault] = useState(false)
  const [tokens, setTokens] = useState<CustomToken[]>([])
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({})

  // 检查钱包状态
  useEffect(() => {
    checkWalletStatus()
  }, [])

  // 加载自定义代币列表
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pyro-custom-tokens")
      if (raw) setTokens(JSON.parse(raw))
    } catch {}
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
  const handleSend = async (to: string, amount: string, tokenAddress?: string, tokenDecimals?: number) => {
    try {
      let res: { ok: boolean; hash?: string; error?: string }
      
      if (tokenAddress && tokenDecimals) {
        // 发送ERC20代币
        res = await call<{ ok: boolean; hash?: string; error?: string }>({
          type: "wallet:sendErc20",
          token: tokenAddress as `0x${string}`,
          to: to as `0x${string}`,
          amount,
          decimals: tokenDecimals
        })
      } else {
        // 发送ETH
        res = await call<{ ok: boolean; hash?: string; error?: string }>({
          type: "wallet:sendTx",
          to: to as `0x${string}`,
          valueEth: amount
        })
      }
      
      if (res.ok && res.hash) {
        alert(`交易已发送！\n交易哈希: ${res.hash}`)
        setCurrentPage("assets")
        // 更新余额
        const balRes = await call<{ ok: boolean; balance?: string; error?: string }>({ type: "wallet:getBalance" })
        if (balRes.ok && balRes.balance) {
          setBalance(balRes.balance)
        }
        // 如果发送的是ERC20代币，刷新代币余额
        if (tokenAddress) {
          const tokenRes = await call<{ ok: boolean; balance?: string }>({ type: "wallet:getErc20", token: tokenAddress as `0x${string}` })
          if (tokenRes.ok && tokenRes.balance) {
            setTokenBalances((s) => ({ ...s, [tokenAddress]: tokenRes.balance! }))
          }
        }
      } else {
        alert(`发送失败: ${res.error}`)
      }
    } catch (error) {
      alert(`发送失败: ${error}`)
    }
  }

  // 复制地址
  const handleCopyAddress = async () => {
    if (!address) return
    
    try {
      await navigator.clipboard.writeText(address)
      alert("地址已复制到剪贴板")
    } catch (error) {
      console.error("复制失败:", error)
      // 降级方案：使用传统的复制方法
      const textArea = document.createElement("textarea")
      textArea.value = address
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      alert("地址已复制到剪贴板")
    }
  }

  // 退出钱包
  const handleLogout = () => {
    if (confirm("确定要退出钱包吗？")) {
      setIsUnlocked(false)
      setAddress("")
      setBalance("0")
      setCurrentPage("unlock")
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
            onAddToken={async () => {
              let input = prompt("输入 ERC20 合约地址 (0x...)") || ""
              input = input.trim()
              if (!input) return
              if (!input.startsWith("0x")) input = `0x${input}`
              if (!/^0x[0-9a-fA-F]{40}$/.test(input)) {
                alert("合约地址格式不正确")
                return
              }
              const tokenAddr = input.toLowerCase() as `0x${string}`
              const res = await call<{ ok: boolean; symbol?: string; balance?: string; decimals?: number; error?: string }>({ type: "wallet:getErc20", token: tokenAddr })
              if (res.ok && res.symbol && typeof res.decimals === "number") {
                const next = [...tokens, { address: tokenAddr, symbol: res.symbol, decimals: res.decimals }]
                setTokens(next)
                localStorage.setItem("pyro-custom-tokens", JSON.stringify(next))
                if (res.balance) setTokenBalances((s) => ({ ...s, [tokenAddr]: res.balance! }))
              } else {
                alert(res.error || "查询失败")
              }
            }}
          />
        )
      case "send":
        return (
          <Send
            balance={balance}
            tokens={tokens}
            tokenBalances={tokenBalances}
            onSend={handleSend}
            onBack={() => setCurrentPage("assets")}
          />
        )
      case "receive":
        return (
          <div className="space-y-6">
            {/* 标题 */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentPage("assets")}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-white">接收</h2>
            </div>

            {/* 二维码 */}
            <div className="text-center space-y-4">
              <div className="bg-white rounded-lg p-4 inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address || "")}`}
                  alt="钱包地址二维码"
                  className="w-48 h-48"
                  onError={(e) => {
                    // 如果二维码加载失败，显示备用文本
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden text-gray-800 text-sm font-mono break-all p-2">
                  {address || "未连接"}
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                扫描二维码或复制地址来接收代币
              </div>
            </div>

            {/* 地址显示和复制 */}
            <div className="space-y-3">
              <div className="text-sm text-gray-400">你的钱包地址</div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-white font-mono text-sm break-all mb-3">
                  {address || "未连接"}
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  复制地址
                </button>
              </div>
            </div>

            {/* 安全提示 */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="text-sm text-blue-300">
                <div className="font-medium mb-2">安全提示：</div>
                <ul className="space-y-1 text-xs">
                  <li>• 只向此地址发送支持的代币</li>
                  <li>• 确保网络选择正确</li>
                  <li>• 小额测试后再进行大额转账</li>
                </ul>
              </div>
            </div>
          </div>
        )
      case "settings":
        return (
          <Settings
            onBack={() => setCurrentPage("assets")}
            onLogout={handleLogout}
            address={address}
          />
        )
      default:
        return <div>页面不存在</div>
    }
  }

  // 如果当前页面是欢迎、创建、导入或解锁页面，不显示布局
  if (["welcome", "create", "import", "importPrivateKey", "unlock"].includes(currentPage)) {
    return (
      <Layout>
        <div className="flex-1">
          {renderContent()}
        </div>
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
          onSettingsClick={() => setCurrentPage("settings")}
          onCopyAddress={handleCopyAddress}
          onLogout={handleLogout}
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
          {/* 渲染自定义代币 */}
          {currentPage === "assets" && tokens.length > 0 && (
            <div className="space-y-2 mt-4">
              {tokens.map((t) => (
                <div key={t.address} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">{t.symbol}</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{t.symbol}</div>
                      <div className="text-sm text-gray-400">{tokenBalances[t.address] ?? "-"}</div>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      const res = await call<{ ok: boolean; balance?: string }>({ type: "wallet:getErc20", token: t.address })
                      if (res.ok && res.balance) setTokenBalances((s) => ({ ...s, [t.address]: res.balance! }))
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >刷新</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Content>
    </Layout>
  )
}

export default IndexPopup