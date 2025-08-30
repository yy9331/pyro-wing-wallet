import { useState, useCallback } from "react"

type CustomToken = { address: `0x${string}`; symbol: string; decimals: number }

// 消息通信函数
const call = async<T = any>(msg: any): Promise<T> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (res) => resolve(res))
  }) as Promise<T>
}

export const useTokenBalances = () => {
  const [tokens, setTokens] = useState<CustomToken[]>([])
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({})
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  // 智能加载代币余额
  const loadTokenBalances = useCallback(async (tokenList: CustomToken[], isInitialLoad = false) => {
    if (tokenList.length === 0) return

    // 分批加载：首次只加载前3个，其余后台加载
    const initialBatch = isInitialLoad ? tokenList.slice(0, 3) : tokenList
    const remainingBatch = isInitialLoad ? tokenList.slice(3) : []

    // 加载初始批次
    await Promise.all(
      initialBatch.map(async (token: CustomToken) => {
        try {
          const tokenRes = await call<{ ok: boolean; balance?: string }>({ 
            type: "wallet:getErc20", 
            token: token.address 
          })
          if (tokenRes.ok && tokenRes.balance) {
            setTokenBalances(prev => ({ ...prev, [token.address]: tokenRes.balance! }))
          }
        } catch (error) {
          console.error(`加载代币 ${token.symbol} 余额失败:`, error)
        }
      })
    )

    // 后台加载剩余代币
    if (remainingBatch.length > 0) {
      setTimeout(async () => {
        await Promise.all(
          remainingBatch.map(async (token: CustomToken) => {
            try {
              const tokenRes = await call<{ ok: boolean; balance?: string }>({ 
                type: "wallet:getErc20", 
                token: token.address 
              })
              if (tokenRes.ok && tokenRes.balance) {
                setTokenBalances(prev => ({ ...prev, [token.address]: tokenRes.balance! }))
              }
            } catch (error) {
              console.error(`后台加载代币 ${token.symbol} 余额失败:`, error)
            }
          })
        )
      }, 100) // 延迟100ms，避免阻塞UI
    }
  }, [])

  // 加载单个代币余额
  const loadSingleTokenBalance = useCallback(async (tokenAddress: string) => {
    try {
      const tokenRes = await call<{ ok: boolean; balance?: string }>({ 
        type: "wallet:getErc20", 
        token: tokenAddress as `0x${string}` 
      })
      if (tokenRes.ok && tokenRes.balance) {
        setTokenBalances(prev => ({ ...prev, [tokenAddress]: tokenRes.balance! }))
      }
    } catch (error) {
      console.error(`加载代币余额失败:`, error)
    }
  }, [])

  // 添加新代币
  const addToken = useCallback(async (tokenAddress: string) => {
    try {
      const res = await call<{ ok: boolean; symbol?: string; balance?: string; decimals?: number; error?: string }>({ 
        type: "wallet:getErc20", 
        token: tokenAddress as `0x${string}` 
      })
      if (res.ok && res.symbol && typeof res.decimals === "number") {
        const newToken = { address: tokenAddress as `0x${string}`, symbol: res.symbol, decimals: res.decimals }
        const next = [...tokens, newToken]
        setTokens(next)
        localStorage.setItem("pyro-custom-tokens", JSON.stringify(next))
        if (res.balance) {
          setTokenBalances(prev => ({ ...prev, [tokenAddress]: res.balance! }))
        }
        return { success: true, token: newToken }
      } else {
        return { success: false, error: res.error || "查询失败" }
      }
    } catch (error) {
      return { success: false, error: "添加代币失败" }
    }
  }, [tokens])

  // 初始化代币列表
  const initializeTokens = useCallback(() => {
    try {
      const raw = localStorage.getItem("pyro-custom-tokens")
      if (raw) {
        const customTokens = JSON.parse(raw)
        setTokens(customTokens)
        return customTokens
      }
    } catch (error) {
      console.error("初始化代币列表失败:", error)
    }
    return []
  }, [])

  return {
    tokens,
    tokenBalances,
    isLoadingBalance,
    setIsLoadingBalance,
    loadTokenBalances,
    loadSingleTokenBalance,
    addToken,
    initializeTokens,
    setTokens,
    setTokenBalances
  }
}
