"use client"

import { useEffect } from "react"
import { adsenseConfig } from "@/config/adsense"

interface InArticleAdProps {
  slot: string
  className?: string
}

export function InArticleAd({ 
  slot, 
  className = "" 
}: InArticleAdProps) {
  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || []
      adsbygoogle.push({})
    } catch (error) {
      console.error("In-Article Ad loading error:", error)
    }
  }, [])

  return (
    <div className={`in-article-ad-container my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={adsenseConfig.publisherId}
        data-ad-slot={slot}
      />
    </div>
  )
}