import React from "react"

interface HeaderProps {
  network: string
  address?: string
  onNetworkChange: (network: string) => void
  onSettingsClick: () => void
}

export const WalletHeader: React.FC<HeaderProps> = ({
  network,
  address,
  onNetworkChange,
  onSettingsClick
}) => {
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "未连接"

  return (
    <div className="flex items-center justify-between">
      {/* 网络选择器 */}
      <div className="flex items-center space-x-2">
        <select
          value={network}
          onChange={(e) => onNetworkChange(e.target.value)}
          className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600"
        >
          <option value="sepolia">Sepolia</option>
          <option value="mainnet">Mainnet</option>
        </select>
      </div>

      {/* 账户信息 */}
      <div className="flex items-center space-x-3">
        <div className="text-sm">
          <div className="text-gray-300">{shortAddress}</div>
        </div>
        
        {/* 设置按钮 */}
        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  )
}