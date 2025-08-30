import React, { useState } from "react"
import { Button } from "../components/Button"

interface SettingsProps {
  onBack: () => void
  onLogout: () => void
  address?: string
}

export const Settings: React.FC<SettingsProps> = ({ onBack, onLogout, address }) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [showMnemonic] = useState(false)
  const [privateKey, setPrivateKey] = useState("")
  const [mnemonic, setMnemonic] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleViewPrivateKey = async () => {
    if (!password) {
      setError("请输入密码")
      return
    }

    try {
      // 先尝试获取助记词导出的私钥（因为大多数钱包都是助记词创建的）
      const mnemonicRes = await chrome.runtime.sendMessage({
        type: "wallet:getMnemonic",
        password
      })
      
      if (mnemonicRes.ok && mnemonicRes.mnemonic) {
        setPrivateKey(mnemonicRes.mnemonic) // 这里返回的实际上是私钥
        setShowPrivateKey(true)
        setError("")
        return
      }
      
      // 如果助记词获取失败，尝试获取私钥
      const res = await chrome.runtime.sendMessage({
        type: "wallet:getPrivateKey",
        password
      })
      
      if (res.ok && res.privateKey) {
        setPrivateKey(res.privateKey)
        setShowPrivateKey(true)
        setError("")
      } else {
        setError(res.error || "密码错误")
      }
    } catch (err: any) {
      setError(err.message || "获取失败")
    }
  }

  const handleCopyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey).then(() => {
        alert("私钥已复制到剪贴板")
      }).catch(() => {
        alert("复制失败，请手动复制")
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-white">设置</h2>
      </div>

      {/* 钱包信息 */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-3">钱包信息</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">地址:</span>
            <span className="text-white font-mono text-sm">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "未连接"}
            </span>
          </div>
        </div>
      </div>

      {/* 私钥/助记词管理 */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-3">密钥管理</h3>
        
        {!showPrivateKey && !showMnemonic ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">输入密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入钱包密码"
                className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}
            
            <Button
              onClick={handleViewPrivateKey}
              variant="primary"
              size="md"
              className="w-full"
              disabled={!password}
            >
              查看密钥
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">私钥</label>
              <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                <div className="text-white font-mono text-sm break-all">
                  {privateKey}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleCopyPrivateKey}
                variant="secondary"
                size="md"
                className="flex-1"
              >
                复制私钥
              </Button>
              <Button
                onClick={() => {
                  setShowPrivateKey(false)
                  setPrivateKey("")
                  setPassword("")
                  setError("")
                }}
                variant="ghost"
                size="md"
                className="flex-1"
              >
                隐藏
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 安全提醒 */}
      <div className="bg-red-900 border border-red-600 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-red-400 text-xl">⚠️</span>
          <div className="text-red-200 text-sm">
            <p className="font-semibold mb-2">安全提醒：</p>
            <ul className="space-y-1">
              <li>• 私钥/助记词是访问钱包的唯一凭证</li>
              <li>• 不要分享给任何人</li>
              <li>• 不要在公共场所显示</li>
              <li>• 建议在安全环境下查看</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 退出钱包 */}
      <Button
        onClick={onLogout}
        variant="secondary"
        size="lg"
        className="w-full"
      >
        退出钱包
      </Button>
    </div>
  )
}
