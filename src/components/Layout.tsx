import React from "react"

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export const Layout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={`w-[380px] h-[600px] text-white flex flex-col ${className}`}>
      {children}
    </div>
  )
}

export const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-gray-800/80 border-b border-orange-500/20 p-4 backdrop-blur-sm">
      {children}
    </div>
  )
}

export const Content: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-orange-500/50 scrollbar-track-transparent ${className}`}>
      {children}
    </div>
  )
}

export const Footer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-gray-800/80 border-t border-orange-500/20 p-3 backdrop-blur-sm">
      {children}
    </div>
  )
}