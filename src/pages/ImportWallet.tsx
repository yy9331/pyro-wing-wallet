import React, { useState } from "react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"

interface ImportWalletProps {
  onImport: (password: string, mnemonic: string) => void
  onBack: () => void
}

export const ImportWallet: React.FC<ImportWalletProps> = ({ onImport, onBack }) => {
  const [password, setPassword] = useState("")
  const [mnemonic, setMnemonic] = useState("")
  const [error, setError] = useState("")

  const handleImport = async () => {
    if (!password) {
      setError("请输入密码")
      return
    }
    if (!mnemonic) {
      setError("请输入助记词")
      return
    }
    if (mnemonic.split(" ").length !== 12) {
      setError("助记词应该是12个单词")
      return
    }

    try {
      await onImport(password, mnemonic)
    } catch (err: any) {
      setError(err.message || "导入失败")
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
        <h2 className="text-xl font-semibold text-white">导入钱包</h2>
      </div>

      {/* 表单 */}
      <div className="space-y-4">
        <Input
          label="设置密码"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="用于加密钱包"
        />

        <Input
          label="助记词"
          value={mnemonic}
          onChange={setMnemonic}
          placeholder="输入12个助记词，用空格分隔"
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
        disabled={!password || !mnemonic}
      >
        导入钱包
      </Button>

      {/* 提示 */}
      <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-400 text-xl">💡</span>
          <div className="text-blue-200 text-sm">
            <p className="font-semibold mb-2">导入说明：</p>
            <ul className="space-y-1">
              <li>• 输入你的12个助记词</li>
              <li>• 设置新的密码用于本地加密</li>
              <li>• 助记词不会被上传，仅本地存储</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}