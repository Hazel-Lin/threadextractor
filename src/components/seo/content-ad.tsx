import { ResponsiveAd } from "@/components/ads"
import { adsenseConfig, hasManualAdSlot } from "@/config/adsense"

export function ContentAd({
  slot = adsenseConfig.ads.homePage.afterExtractor,
  minHeight = 250,
}: {
  slot?: string
  minHeight?: number
}) {
  if (!hasManualAdSlot(slot)) {
    return null
  }

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-2xl border border-dashed border-border bg-muted/30 px-3 py-4">
        <ResponsiveAd
          slot={slot}
          className="mx-auto"
          style={{ minHeight: `${minHeight}px` }}
          lazyLoad={adsenseConfig.settings.enableLazyLoad}
        />
      </div>
    </section>
  )
}
