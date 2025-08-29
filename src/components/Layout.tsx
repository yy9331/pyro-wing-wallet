import React from "react"

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export const Layout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={`w-[380px] h-[600px] bg-gray-900 text-white flex flex-col ${className}`}>
      {children}
    </div>
  )
}

export const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      {children}
    </div>
  )
}

export const Content: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`flex-1 overflow-y-auto p-4 ${className}`}>
      {children}
    </div>
  )
}

export const Footer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-gray-800 border-t border-gray-700 p-3">
      {children}
    </div>
  )
}