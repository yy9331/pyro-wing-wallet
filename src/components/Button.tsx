import React from "react"

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = ""
}) => {
  const baseClasses = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl focus:ring-orange-500",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white focus:ring-gray-500",
    ghost: "bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white focus:ring-gray-500"
  }
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}