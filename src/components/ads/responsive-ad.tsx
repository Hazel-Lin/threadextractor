"use client"

import { useEffect, useRef, useState } from "react"
import { adsenseConfig } from "@/config/adsense"

interface ResponsiveAdProps {
  slot: string
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal"
  className?: string
  style?: React.CSSProperties
  lazyLoad?: boolean
}

export function ResponsiveAd({ 
  slot, 
  format = "auto",
  className = "",
  style = {},
  lazyLoad = true
}: ResponsiveAdProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const insRef = useRef<HTMLModElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(!lazyLoad)

  useEffect(() => {
    if (!lazyLoad) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.disconnect()
          }
        })
      },
      { 
        rootMargin: "100px",
        threshold: 0.01 
      }
    )

    if (adRef.current) {
      observer.observe(adRef.current)
    }

    return () => observer.disconnect()
  }, [lazyLoad])

  useEffect(() => {
    if (!shouldLoad || !slot || !insRef.current) {
      return
    }

    if (insRef.current.dataset.adsbygoogleStatus === "done") {
      return
    }

    try {
      const adsbygoogle = window.adsbygoogle || []
      adsbygoogle.push({})
    } catch (error) {
      console.error("Responsive Ad loading error:", error)
    }
  }, [shouldLoad, slot])

  if (!slot) {
    return null
  }

  return (
    <div ref={adRef} className={`responsive-ad-container ${className}`}>
      {shouldLoad && (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", ...style }}
          data-ad-client={adsenseConfig.publisherId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
          data-adtest={adsenseConfig.settings.testMode ? "on" : undefined}
        />
      )}
    </div>
  )
}
