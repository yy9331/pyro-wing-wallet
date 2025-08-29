import React, { useState } from "react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"

interface CreateWalletProps {
  onCreate: (password: string, mnemonic?: string) => void
  onBack: () => void
}

export const CreateWallet: React.FC<CreateWalletProps> = ({ onCreate, onBack }) => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [mnemonic, setMnemonic] = useState("")
  const [error, setError] = useState("")
  const [step, setStep] = useState<"input" | "backup">("input")

  const handleCreate = async () => {
    if (!password) {
      setError("请输入密码")
      return
    }
    if (password.length < 8) {
      setError("密码至少需要8位")
      return
    }
    if (password !== confirmPassword) {
      setError("两次密码不一致")
      return
    }

    try {
      // 创建钱包
      const result = await onCreate(password, mnemonic || undefined)
      setStep("backup")
    } catch (err: any) {
      setError(err.message || "创建失败")
    }
  }

  const handleBackup = () => {
    setStep("input")
    onBack()
  }

  if (step === "backup") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">备份助记词</h2>
          <p className="text-gray-400 mb-6">
            请将以下12个单词按顺序抄写在安全的地方。这是恢复钱包的唯一方式。
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="grid grid-cols-3 gap-2 text-sm">
            {mnemonic.split(" ").map((word, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-gray-400 text-xs w-6">{index + 1}.</span>
                <span className="text-white font-mono">{word}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-yellow-400 text-xl">⚠️</span>
            <div className="text-yellow-200 text-sm">
              <p className="font-semibold mb-2">重要提醒：</p>
              <ul className="space-y-1">
                <li>• 不要截图或拍照</li>
                <li>• 不要分享给任何人</li>
                <li>• 保存在离线安全的地方</li>
                <li>• 这是恢复钱包的唯一方式</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          onClick={handleBackup}
          variant="primary"
          size="lg"
          className="w-full"
        >
          我已安全备份
        </Button>
      </div>
    )
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
        <h2 className="text-xl font-semibold text-white">创建钱包</h2>
      </div>

      {/* 表单 */}
      <div className="space-y-4">
        <Input
          label="设置密码"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="至少8位字符"
        />

        <Input
          label="确认密码"
          value={confirmPassword}
          onChange={setConfirmPassword}
          type="password"
          placeholder="再次输入密码"
        />

        <Input
          label="导入助记词（可选）"
          value={mnemonic}
          onChange={setMnemonic}
          placeholder="12个单词，用空格分隔"
        />

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}
      </div>

      {/* 创建按钮 */}
      <Button
        onClick={handleCreate}
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!password || !confirmPassword}
      >
        创建钱包
      </Button>
    </div>
  )
}