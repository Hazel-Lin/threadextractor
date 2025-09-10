import ThreadsExtractor from "@/components/threads-extractor"
import { HelpSection } from "@/components/sections/help-section"
import { ResponsiveAd, BannerAd } from "@/components/ads"
import { adsenseConfig } from "@/config/adsense"

export default function Home() {
  return (
    <div className="flex flex-col bg-background transition-colors mt-16">
      <section id="home" className="flex-1 flex items-center justify-center bg-background">
        <ThreadsExtractor />
      </section>

      <div className="container mx-auto px-4 py-8">
        <ResponsiveAd 
          slot={adsenseConfig.ads.homePage.afterExtractor}
          format="auto"
          className="my-8 max-w-4xl mx-auto"
          lazyLoad={true}
        />
      </div>

      <section id="help" className="flex-1 flex items-center justify-center bg-background my-16">
        <HelpSection />
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="hidden md:block">
          <BannerAd 
            slot={adsenseConfig.ads.homePage.bottomBanner}
            width={728}
            height={90}
            className="mx-auto"
          />
        </div>
        <div className="block md:hidden">
          <ResponsiveAd 
            slot={adsenseConfig.ads.homePage.afterHelp}
            format="auto"
            className="my-8"
            lazyLoad={true}
          />
        </div>
      </div>
    </div>
  )
}
