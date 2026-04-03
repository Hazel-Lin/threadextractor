import ThreadsExtractor from "@/components/threads-extractor"
import { ResponsiveAd } from "@/components/ads"
import { AboutSection } from "@/components/sections/about-section"
import { HowToSection } from "@/components/sections/how-to-section"
import { adsenseConfig, hasManualAdSlot } from "@/config/adsense"

export default function Home() {
  const topBannerSlot = adsenseConfig.ads.homePage.topBanner
  const afterExtractorSlot = adsenseConfig.ads.homePage.afterExtractor
  const afterHelpSlot = adsenseConfig.ads.homePage.afterHelp

  return (
    <div className="flex flex-col bg-background transition-colors mt-16">
      <section id="home" className="flex-1 flex items-center justify-center bg-background">
        <ThreadsExtractor />
      </section>

      {hasManualAdSlot(topBannerSlot) && (
        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border bg-card/60 px-3 py-4 shadow-sm">
            <ResponsiveAd
              slot={topBannerSlot}
              className="mx-auto min-h-[90px]"
              style={{ minHeight: "90px" }}
              lazyLoad={adsenseConfig.settings.enableLazyLoad}
            />
          </div>
        </section>
      )}

      <AboutSection />

      {hasManualAdSlot(afterExtractorSlot) && (
        <section className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-border bg-muted/30 px-3 py-4">
            <ResponsiveAd
              slot={afterExtractorSlot}
              format="rectangle"
              className="mx-auto min-h-[280px]"
              style={{ minHeight: "280px" }}
              lazyLoad={adsenseConfig.settings.enableLazyLoad}
            />
          </div>
        </section>
      )}

      <section id="help">
        <HowToSection />
      </section>

      {hasManualAdSlot(afterHelpSlot) && (
        <section className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border bg-card/60 px-3 py-4 shadow-sm">
            <ResponsiveAd
              slot={afterHelpSlot}
              className="mx-auto min-h-[90px]"
              style={{ minHeight: "90px" }}
              lazyLoad={adsenseConfig.settings.enableLazyLoad}
            />
          </div>
        </section>
      )}
    </div>
  )
}
