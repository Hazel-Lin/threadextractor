import { useEffect, useRef } from "react"

interface AdTrackingOptions {
  adSlot: string
  adType: string
  onView?: () => void
  onViewDuration?: (duration: number) => void
}

export function useAdTracking({
  adSlot,
  adType,
  onView,
  onViewDuration
}: AdTrackingOptions) {
  const startTimeRef = useRef<number | null>(null)
  const hasViewedRef = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasViewedRef.current) {
            // 广告进入视口
            startTimeRef.current = Date.now()
            hasViewedRef.current = true
            
            // 触发查看回调
            onView?.()
            
            // 记录事件（可以集成 Google Analytics）
            if ((window as any).gtag) {
              (window as any).gtag("event", "ad_impression", {
                ad_slot: adSlot,
                ad_type: adType,
              })
            }
          } else if (!entry.isIntersecting && startTimeRef.current) {
            // 广告离开视口
            const duration = Date.now() - startTimeRef.current
            onViewDuration?.(duration)
            
            // 记录查看时长
            if ((window as any).gtag && duration > 1000) {
              (window as any).gtag("event", "ad_view_duration", {
                ad_slot: adSlot,
                ad_type: adType,
                duration_ms: duration,
              })
            }
            
            startTimeRef.current = null
          }
        })
      },
      { threshold: 0.5 } // 广告50%可见时触发
    )

    // 获取广告元素
    const adElement = document.querySelector(`[data-ad-slot="${adSlot}"]`)
    if (adElement) {
      observer.observe(adElement)
    }

    return () => {
      if (adElement) {
        observer.unobserve(adElement)
      }
    }
  }, [adSlot, adType, onView, onViewDuration])

  return {
    isViewed: hasViewedRef.current,
    viewStartTime: startTimeRef.current
  }
}