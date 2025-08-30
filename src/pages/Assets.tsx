import React from "react"
import { Button } from "../components/Button"

interface AssetsProps {
  balance: string
  address?: string
  onSend: () => void
  onReceive: () => void
  onSwap: () => void
  onAddToken?: () => void
}

export const Assets: React.FC<AssetsProps> = ({
  balance,
  address,
  onSend,
  onReceive,
  onSwap,
  onAddToken
}) => {
  return (
    <div className="space-y-6">
      {/* 余额显示 */}
      <div className="text-center">
        <div className="text-3xl font-bold text-white mb-2">
          {balance} ETH
        </div>
        <div className="text-sm text-gray-400">
          ≈ $0.00 USD
        </div>
      </div>

      {/* 快速操作按钮 */}
      <div className="grid grid-cols-4 gap-3">
        <Button
          onClick={onSend}
          variant="primary"
          size="md"
          className="flex flex-col items-center space-y-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span className="text-xs">发送</span>
        </Button>

        <Button
          onClick={onReceive}
          variant="secondary"
          size="md"
          className="flex flex-col items-center space-y-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l-7-7m7 7l7-7" />
          </svg>
          <span className="text-xs">接收</span>
        </Button>

        <Button
          onClick={onSwap}
          variant="secondary"
          size="md"
          className="flex flex-col items-center space-y-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span className="text-xs">兑换</span>
        </Button>

        <Button
          onClick={onAddToken}
          variant="secondary"
          size="md"
          className="flex flex-col items-center space-y-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs">添加代币</span>
        </Button>
      </div>

      {/* 代币列表 */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">代币</h3>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">ETH</span>
              </div>
              <div>
                <div className="text-white font-medium">Ethereum</div>
                <div className="text-sm text-gray-400">{balance} ETH</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">$0.00</div>
              <div className="text-sm text-gray-400">0.00%</div>
            </div>
          </div>
        </div>
        {/* 未来：在 popup 中拉取并渲染自定义代币列表 */}
      </div>
    </div>
  )
}