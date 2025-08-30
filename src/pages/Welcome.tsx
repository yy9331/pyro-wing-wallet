import React from "react"
import { Button } from "../components/Button"
import logoImage from "../../assets/logo.png"

interface WelcomeProps {
  onCreateWallet: () => void
  onImportWallet: () => void
  onImportPrivateKey: () => void
  onIHaveWallet: () => void
}

export const Welcome: React.FC<WelcomeProps> = ({
  onCreateWallet,
  onImportWallet,
  onImportPrivateKey,
  onIHaveWallet
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-orange-800/30 via-orange-700/20 to-orange-800/30 px-6 py-8">
      {/* Logo 图片 */}
      <div className="mb-8">
        <img 
          src={logoImage} 
          alt="Pyro Wing Wallet Logo" 
          className="w-24 h-24 object-contain"
        />
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
          className="w-full"
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

      {/* 法律声明 */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-gray-500 text-xs leading-relaxed">
          继续即表示我同意
          <a href="#" className="text-orange-400 hover:text-orange-300">服务条款</a>
          和
          <a href="#" className="text-orange-400 hover:text-orange-300">隐私政策</a>
        </p>
      </div>
    </div>
  )
}