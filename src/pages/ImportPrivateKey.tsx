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
    <div className="flex flex-col h-full p-6 bg-gray-900">
      {/* 头部 */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-white">导入私钥</h1>
      </div>

      {/* 表单 */}
      <div className="flex-1 space-y-6">
        <div className="space-y-4">
          <Input
            type="password"
            label="设置密码"
            placeholder="用于加密钱包"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
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
        </div>

        <Button
          onClick={handleImport}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "导入中..." : "导入钱包"}
        </Button>
      </div>

      {/* 说明 */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-blue-300">
            <h3 className="font-semibold mb-2">导入说明:</h3>
            <ul className="space-y-1 text-xs">
              <li>• 输入你的私钥（64位十六进制字符）</li>
              <li>• 设置新的密码用于本地加密</li>
              <li>• 私钥不会被上传，仅本地存储</li>
              <li className="text-red-400 font-semibold">⚠️ 请确保在安全环境下操作</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}