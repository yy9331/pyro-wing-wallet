import React, { useState } from "react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"

interface SendProps {
  balance: string
  onSend: (to: string, amount: string) => void
  onBack: () => void
}

export const Send: React.FC<SendProps> = ({ balance, onSend, onBack }) => {
  const [to, setTo] = useState("")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")

  const handleSend = () => {
    if (!to) {
      setError("请输入接收地址")
      return
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("请输入有效金额")
      return
    }
    if (parseFloat(amount) > parseFloat(balance)) {
      setError("余额不足")
      return
    }
    
    setError("")
    onSend(to, amount)
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
        <h2 className="text-xl font-semibold text-white">发送</h2>
      </div>

      {/* 表单 */}
      <div className="space-y-4">
        <Input
          label="接收地址"
          value={to}
          onChange={setTo}
          placeholder="0x..."
          error={error}
        />

        <Input
          label="金额 (ETH)"
          value={amount}
          onChange={setAmount}
          type="number"
          placeholder="0.0"
        />

        <div className="text-sm text-gray-400">
          可用余额: {balance} ETH
        </div>
      </div>

      {/* 发送按钮 */}
      <Button
        onClick={handleSend}
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!to || !amount}
      >
        发送交易
      </Button>
    </div>
  )
}