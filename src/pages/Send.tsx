import React, { useState } from "react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"

type CustomToken = { address: `0x${string}`; symbol: string; decimals: number }

interface SendProps {
  balance: string
  tokens: CustomToken[]
  tokenBalances: Record<string, string>
  onSend: (to: string, amount: string, tokenAddress?: string, tokenDecimals?: number) => void
  onBack: () => void
}

export const Send: React.FC<SendProps> = ({ balance, tokens, tokenBalances, onSend, onBack }) => {
  const [to, setTo] = useState("")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [selectedToken, setSelectedToken] = useState<"ETH" | string>("ETH")

  // 获取当前选中代币的余额
  const getCurrentBalance = () => {
    if (selectedToken === "ETH") {
      return balance
    }
    return tokenBalances[selectedToken] || "0"
  }

  // 获取当前选中代币的符号
  const getCurrentSymbol = () => {
    if (selectedToken === "ETH") {
      return "ETH"
    }
    const token = tokens.find(t => t.address === selectedToken)
    return token?.symbol || "TOKEN"
  }

  // 获取当前选中代币的小数位数
  const getCurrentDecimals = () => {
    if (selectedToken === "ETH") {
      return 18
    }
    const token = tokens.find(t => t.address === selectedToken)
    return token?.decimals || 18
  }

  const handleSend = () => {
    if (!to) {
      setError("请输入接收地址")
      return
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("请输入有效金额")
      return
    }
    
    const currentBalance = getCurrentBalance()
    if (parseFloat(amount) > parseFloat(currentBalance)) {
      setError("余额不足")
      return
    }
    
    setError("")
    
    if (selectedToken === "ETH") {
      onSend(to, amount)
    } else {
      onSend(to, amount, selectedToken, getCurrentDecimals())
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
        <h2 className="text-xl font-semibold text-white">发送</h2>
      </div>

      {/* 代币选择 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">选择代币</label>
        <div className="flex flex-wrap gap-2">
          {/* ETH 选项 */}
          <button
            onClick={() => setSelectedToken("ETH")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedToken === "ETH"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>ETH</span>
            </div>
          </button>
          
          {/* 自定义代币选项 */}
          {tokens.map((token) => (
            <button
              key={token.address}
              onClick={() => setSelectedToken(token.address)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedToken === token.address
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{token.symbol}</span>
                </div>
                <span>{token.symbol}</span>
              </div>
            </button>
          ))}
        </div>
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
          label={`金额 (${getCurrentSymbol()})`}
          value={amount}
          onChange={setAmount}
          type="number"
          placeholder="0.0"
        />

        <div className="text-sm text-gray-400">
          可用余额: {getCurrentBalance()} {getCurrentSymbol()}
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