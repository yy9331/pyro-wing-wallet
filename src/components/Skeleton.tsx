import React from "react"

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "", 
  width = "w-full", 
  height = "h-4" 
}) => {
  return (
    <div 
      className={`${width} ${height} bg-gray-700 rounded animate-pulse ${className}`}
    />
  )
}

export const BalanceSkeleton: React.FC = () => {
  return (
    <div className="text-center space-y-2">
      <Skeleton width="w-48" height="h-8" className="mx-auto" />
      <Skeleton width="w-24" height="h-4" className="mx-auto" />
    </div>
  )
}

export const TokenSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton width="w-8" height="h-8" className="rounded-full" />
          <div className="space-y-2">
            <Skeleton width="w-20" height="h-4" />
            <Skeleton width="w-16" height="h-3" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <Skeleton width="w-16" height="h-4" />
          <Skeleton width="w-12" height="h-3" />
        </div>
      </div>
    </div>
  )
}

export const CustomTokenSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Skeleton width="w-8" height="h-8" className="rounded-full" />
        <div className="space-y-2">
          <Skeleton width="w-16" height="h-4" />
          <Skeleton width="w-12" height="h-3" />
        </div>
      </div>
      <Skeleton width="w-12" height="h-6" className="rounded" />
    </div>
  )
}

export const TokenListSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">代币</h3>
      <TokenSkeleton />
    </div>
  )
}
