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
    <div className="flex flex-col items-center justify-center h-full p-6">
      {/* 图标 */}
      <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mb-6">
        <span className="text-white text-2xl">🔒</span>
      </div>

      {/* 标题 */}
      <h2 className="text-2xl font-bold text-white mb-2">解锁钱包</h2>
      <p className="text-gray-400 text-center mb-8">
        输入密码以访问你的钱包
      </p>

      {/* 密码输入 */}
      <div className="w-full space-y-4 mb-6">
        <Input
          label="密码"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="输入你的钱包密码"
          error={error}
        />
      </div>

      {/* 解锁按钮 */}
      <Button
        onClick={handleUnlock}
        variant="primary"
        size="lg"
        className="w-full mb-4"
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