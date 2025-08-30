import React, { useEffect, useState } from "react"

interface ToastProps {
  message: string
  type?: "success" | "error" | "info" | "warning"
  duration?: number
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = "info", 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 显示动画
    const showTimer = setTimeout(() => setIsVisible(true), 100)
    
    // 自动隐藏
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // 等待隐藏动画完成
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [duration, onClose])

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full mx-4 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300"
    
    switch (type) {
      case "success":
        return `${baseStyles} bg-gradient-to-r from-green-600/90 to-green-500/90 border border-green-400/30 text-white`
      case "error":
        return `${baseStyles} bg-gradient-to-r from-red-600/90 to-red-500/90 border border-red-400/30 text-white`
      case "warning":
        return `${baseStyles} bg-gradient-to-r from-orange-600/90 to-orange-500/90 border border-orange-400/30 text-white`
      case "info":
      default:
        return `${baseStyles} bg-gradient-to-r from-blue-600/90 to-blue-500/90 border border-blue-400/30 text-white`
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case "error":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case "warning":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case "info":
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  return (
    <div 
      className={`${getToastStyles()} ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1 text-sm font-medium">
          {message}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="flex-shrink-0 ml-3 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Toast管理器
interface ToastManagerProps {
  toasts: Array<{
    id: string
    message: string
    type: "success" | "error" | "info" | "warning"
  }>
  onRemove: (id: string) => void
}

export const ToastManager: React.FC<ToastManagerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          className="pointer-events-auto"
          style={{ 
            transform: `translateY(${index * 80}px)`,
            zIndex: 1000 - index
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}

// Toast服务
class ToastService {
  private static instance: ToastService
  private listeners: Array<(toasts: Array<{id: string, message: string, type: "success" | "error" | "info" | "warning"}>) => void> = []
  private toasts: Array<{id: string, message: string, type: "success" | "error" | "info" | "warning"}> = []

  static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService()
    }
    return ToastService.instance
  }

  subscribe(listener: (toasts: Array<{id: string, message: string, type: "success" | "error" | "info" | "warning"}>) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]))
  }

  show(message: string, type: "success" | "error" | "info" | "warning" = "info", duration: number = 3000) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const toast = { id, message, type }
    
    this.toasts.push(toast)
    this.notify()

    // 自动移除
    setTimeout(() => {
      this.remove(id)
    }, duration)
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.notify()
  }

  success(message: string, duration?: number) {
    this.show(message, "success", duration)
  }

  error(message: string, duration?: number) {
    this.show(message, "error", duration)
  }

  info(message: string, duration?: number) {
    this.show(message, "info", duration)
  }

  warning(message: string, duration?: number) {
    this.show(message, "warning", duration)
  }
}

export const toastService = ToastService.getInstance()
