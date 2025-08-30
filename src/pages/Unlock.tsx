import React, { useState } from "react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"

interface UnlockProps {
  onUnlock: (password: string) => void
  onBack: () => void
}

export const Unlock: React.FC<UnlockProps> = ({ onUnlock, onBack }) => {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleUnlock = async () => {
    if (!password) {
      setError("请输入密码")
      return
    }

    try {
      await onUnlock(password)
    } catch (err: any) {
      setError(err.message || "密码错误")
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
        <h2 className="text-xl font-semibold text-white">解锁钱包</h2>
      </div>

      {/* 图标 */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl">🔒</span>
        </div>
      </div>

      {/* 说明文字 */}
      <div className="text-center">
        <p className="text-gray-400">
          输入密码以访问你的钱包
        </p>
      </div>

      {/* 密码输入 */}
      <div className="space-y-4">
        <Input
          label="密码"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="输入你的钱包密码"
        />

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}
      </div>

      {/* 解锁按钮 */}
      <Button
        onClick={handleUnlock}
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!password}
      >
        解锁
      </Button>

      {/* 返回按钮 */}
      <Button
        onClick={onBack}
        variant="secondary"
        size="md"
        className="w-full"
      >
        返回
      </Button>
    </div>
  )
}