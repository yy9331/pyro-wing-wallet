import React, { useState } from "react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"

interface ImportPrivateKeyProps {
  onImport: (password: string, privateKey: string) => Promise<void>
  onBack: () => void
}

export const ImportPrivateKey: React.FC<ImportPrivateKeyProps> = ({
  onImport,
  onBack
}) => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async () => {
    if (password !== confirmPassword) {
      setError("密码不匹配")
      return
    }
    if (password.length < 8) {
      setError("密码至少需要8个字符")
      return
    }
    if (!privateKey.trim()) {
      setError("请输入私钥")
      return
    }
    if (!privateKey.startsWith("0x")) {
      setError("私钥格式错误，应以0x开头")
      return
    }
    if (privateKey.length !== 66) {
      setError("私钥长度错误，应为64位十六进制字符（不含0x前缀）")
      return
    }

    setError("")
    setIsLoading(true)
    
    try {
      await onImport(password, privateKey.trim())
    } catch (error: any) {
      setError(error.message || "导入失败")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-6">
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
        <h2 className="text-xl font-semibold text-white">导入私钥</h2>
      </div>

      {/* 表单 */}
      <div className="space-y-4">
        <Input
          type="password"
          label="设置密码"
          placeholder="用于加密钱包"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Input
          type="password"
          label="确认密码"
          placeholder="再次输入密码"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        
        <Input
          type="password"
          label="私钥"
          placeholder="输入你的私钥（0x开头）"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}
      </div>

      {/* 导入按钮 */}
      <Button
        onClick={handleImport}
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isLoading || !password || !confirmPassword || !privateKey}
      >
        {isLoading ? "导入中..." : "导入钱包"}
      </Button>

      {/* 提示 */}
      <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-400 text-xl">💡</span>
          <div className="text-blue-200 text-sm">
            <p className="font-semibold mb-2">导入说明：</p>
            <ul className="space-y-1">
              <li>• 输入你的私钥（64位十六进制字符）</li>
              <li>• 设置新的密码用于本地加密</li>
              <li>• 私钥不会被上传，仅本地存储</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}