"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { adsenseConfig } from "@/config/adsense"

interface AdSenseContextType {
  isLoaded: boolean
  isBlocked: boolean
  refreshAds: () => void
}

const AdSenseContext = createContext<AdSenseContextType>({
  isLoaded: false,
  isBlocked: false,
  refreshAds: () => {}
})

export function AdSenseProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    // 检测广告拦截器
    const detectAdBlock = () => {
      const testAd = document.createElement("div")
      testAd.innerHTML = "&nbsp;"
      testAd.className = "adsbox"
      testAd.style.position = "absolute"
      testAd.style.left = "-999px"
      document.body.appendChild(testAd)
      
      setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          setIsBlocked(true)
          console.log("AdBlock detected")
        }
        document.body.removeChild(testAd)
      }, 100)
    }

    // 检查 AdSense 脚本是否加载
    const checkAdSenseLoaded = () => {
      if ((window as any).adsbygoogle) {
        setIsLoaded(true)
      } else {
        setTimeout(checkAdSenseLoaded, 500)
      }
    }

    detectAdBlock()
    checkAdSenseLoaded()

    // 页面可见性变化时刷新广告
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshAds()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const refreshAds = () => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || []
      // 触发广告刷新
      const ads = document.querySelectorAll(".adsbygoogle")
      ads.forEach(() => {
        adsbygoogle.push({})
      })
    } catch (error) {
      console.error("Error refreshing ads:", error)
    }
  }

  return (
    <AdSenseContext.Provider value={{ isLoaded, isBlocked, refreshAds }}>
      {children}
      {isBlocked && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-4 py-2 rounded-lg shadow-lg z-50">
          <p className="text-sm">
            请考虑关闭广告拦截器以支持我们的免费服务 ❤️
          </p>
        </div>
      )}
    </AdSenseContext.Provider>
  )
}

export const useAdSense = () => useContext(AdSenseContext)