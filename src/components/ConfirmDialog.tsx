import React from "react"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "确定",
  cancelText = "取消",
  type = "warning"
}) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: (
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          confirmButton: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white",
          border: "border-red-500/30"
        }
      case "warning":
        return {
          icon: (
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          confirmButton: "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white",
          border: "border-orange-500/30"
        }
      case "info":
      default:
        return {
          icon: (
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          confirmButton: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white",
          border: "border-blue-500/30"
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* 对话框 */}
      <div className={`relative bg-gradient-to-br from-gray-800/95 via-gray-700/95 to-gray-800/95 border ${styles.border} rounded-lg shadow-2xl backdrop-blur-sm max-w-sm w-full mx-4 p-6`}>
        {/* 图标 */}
        <div className="flex justify-center mb-4">
          {styles.icon}
        </div>
        
        {/* 标题 */}
        <h3 className="text-lg font-semibold text-white text-center mb-2">
          {title}
        </h3>
        
        {/* 消息 */}
        <p className="text-gray-300 text-center mb-6">
          {message}
        </p>
        
        {/* 按钮 */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
