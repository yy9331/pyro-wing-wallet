import React from "react"
import { Button } from "../components/Button"

interface WelcomeProps {
  onCreateWallet: () => void
  onImportWallet: () => void
  onImportPrivateKey: () => void
  onScanQR: () => void
  onIHaveWallet: () => void
}

export const Welcome: React.FC<WelcomeProps> = ({
  onCreateWallet,
  onImportWallet,
  onImportPrivateKey,
  onScanQR,
  onIHaveWallet
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-gray-900 to-gray-800">
      {/* 中心图标区域 */}
      <div className="relative mb-8">
        {/* 主图标 */}
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">🔥</span>
          </div>
        </div>
        
        {/* 环绕的小图标 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* 顶部 */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">⭐</span>
            </div>
            {/* 右上 */}
            <div className="absolute top-4 right-4 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🐸</span>
            </div>
            {/* 右侧 */}
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">⛵</span>
            </div>
            {/* 右下 */}
            <div className="absolute bottom-4 right-4 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💳</span>
            </div>
            {/* 底部 */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">📈</span>
            </div>
            {/* 左下 */}
            <div className="absolute bottom-4 left-4 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">❤️</span>
            </div>
            {/* 左侧 */}
            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🔗</span>
            </div>
            {/* 左上 */}
            <div className="absolute top-4 left-4 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* 标题 */}
      <h1 className="text-3xl font-bold text-white mb-2">Pyro Wing Wallet</h1>
      <p className="text-gray-400 text-center mb-8 max-w-xs">
        DeFi 世界一站式畅游
      </p>

      {/* 主要按钮 */}
      <div className="w-full space-y-4 mb-6">
        <Button
          onClick={onCreateWallet}
          variant="primary"
          size="lg"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          创建钱包
        </Button>
        
        <Button
          onClick={onIHaveWallet}
          variant="secondary"
          size="lg"
          className="w-full bg-gray-700 hover:bg-gray-600"
        >
          我已有钱包
        </Button>
        
        <Button
          onClick={onImportWallet}
          variant="ghost"
          size="md"
          className="w-full text-gray-400 hover:text-white"
        >
          导入助记词
        </Button>
        
        <Button
          onClick={onImportPrivateKey}
          variant="ghost"
          size="md"
          className="w-full text-gray-400 hover:text-white"
        >
          导入私钥
        </Button>
      </div>

      {/* 分隔线 */}
      <div className="w-full border-t border-gray-600 mb-4"></div>

      {/* 导入选项 */}
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-2">有 Pyro Wing 应用？</p>
        <button
          onClick={onScanQR}
          className="flex items-center justify-center space-x-2 text-pink-400 hover:text-pink-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span className="text-sm">扫描二维码导入</span>
        </button>
      </div>

      {/* 法律声明 */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-gray-500 text-xs leading-relaxed">
          继续即表示我同意
          <a href="#" className="text-pink-400 hover:text-pink-300">服务条款</a>
          和
          <a href="#" className="text-pink-400 hover:text-pink-300">隐私政策</a>
        </p>
      </div>
    </div>
  )
}