"use client"

import { useEffect, useState } from "react"
import { adsenseConfig } from "@/config/adsense"

interface StickyAdProps {
  slot: string
  position?: "left" | "right" | "bottom"
  className?: string
  closeButton?: boolean
}

export function StickyAd({ 
  slot, 
  position = "right",
  className = "",
  closeButton = true
}: StickyAdProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // 延迟加载，避免影响页面初始加载性能
    const timer = setTimeout(() => {
      setHasLoaded(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (hasLoaded && isVisible) {
      try {
        const adsbygoogle = window.adsbygoogle || []
        adsbygoogle.push({})
      } catch (error) {
        console.error("Sticky Ad loading error:", error)
      }
    }
  }, [hasLoaded, isVisible])

  if (!isVisible || !hasLoaded) return null

  const positionStyles = {
    left: "left-4 top-1/2 -translate-y-1/2",
    right: "right-4 top-1/2 -translate-y-1/2",
    bottom: "bottom-4 left-1/2 -translate-x-1/2"
  }

  return (
    <div 
      className={`fixed z-40 ${positionStyles[position]} ${className}`}
      style={{ maxWidth: "300px" }}
    >
      {closeButton && (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow z-50"
          aria-label="关闭广告"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "280px", height: "250px" }}
          data-ad-client={adsenseConfig.publisherId}
          data-ad-slot={slot}
        />
      </div>
    </div>
  )
}