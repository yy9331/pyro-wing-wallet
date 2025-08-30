import React, { useState } from "react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { validateMnemonic } from "bip39"

interface ImportWalletProps {
  onImport: (password: string, mnemonic: string) => void
  onBack: () => void
}

export const ImportWallet: React.FC<ImportWalletProps> = ({ onImport, onBack }) => {
  const [password, setPassword] = useState("")
  const [words, setWords] = useState<string[]>(Array(12).fill(""))
  const [error, setError] = useState("")

  const handleWordChange = (index: number, value: string) => {
    const next = [...words]
    next[index] = value.trim().toLowerCase()
    setWords(next)
  }

  const focusNext = (index: number) => {
    const next = document.getElementById(`mnemonic-${index + 1}`) as HTMLInputElement | null
    next?.focus()
  }

  const handleImport = async () => {
    if (!password) {
      setError("请输入密码")
      return
    }
    if (password.length < 8) {
      setError("密码至少需要8位")
      return
    }
    const mnemonic = words.join(" ").trim()
    if (!mnemonic || words.some(w => !w)) {
      setError("请完整填写12个助记词")
      return
    }
    if (mnemonic.split(" ").length !== 12) {
      setError("助记词应该是12个单词")
      return
    }
    if (!validateMnemonic(mnemonic)) {
      setError("助记词不合法，请检查拼写与顺序")
      return
    }

    try {
      await onImport(password, mnemonic)
    } catch (err: any) {
      setError(err.message || "导入失败")
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">助记词</label>
          <div className="grid grid-cols-3 gap-2">
            {words.map((w, i) => (
              <input
                key={i}
                id={`mnemonic-${i}`}
                value={w}
                onChange={(e) => handleWordChange(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault()
                    focusNext(i)
                  }
                }}
                className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`${i + 1}`}
              />
            ))}
          </div>
        </div>

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
        disabled={!password || words.some(w => !w)}
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