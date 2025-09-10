"use client"

import { useEffect } from "react"
import { adsenseConfig } from "@/config/adsense"

interface BannerAdProps {
  slot: string
  width?: number
  height?: number
  className?: string
}

export function BannerAd({ 
  slot, 
  width = 728, 
  height = 90,
  className = "" 
}: BannerAdProps) {
  useEffect(() => {
    try {
      const adsbygoogle = window.adsbygoogle || []
      adsbygoogle.push({})
    } catch (error) {
      console.error("Banner Ad loading error:", error)
    }
  }, [])

  return (
    <div className={`banner-ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: "inline-block",
          width: `${width}px`,
          height: `${height}px`
        }}
        data-ad-client={adsenseConfig.publisherId}
        data-ad-slot={slot}
      />
    </div>
  )
}