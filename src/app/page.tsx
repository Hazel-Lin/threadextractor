import type { Metadata } from "next"
import ThreadsExtractor from "@/components/threads-extractor"
import { ResponsiveAd } from "@/components/ads"
import { AboutSection } from "@/components/sections/about-section"
import { HowToSection } from "@/components/sections/how-to-section"
import { FAQSection } from "@/components/seo/faq-section"
import { JsonLd } from "@/components/seo/json-ld"
import { RelatedLinks } from "@/components/seo/related-links"
import Link from "next/link"
import { adsenseConfig, hasManualAdSlot } from "@/config/adsense"
import { buildMetadata } from "@/lib/metadata"
import { indexableGuidePages } from "@/lib/seo-pages"
import { buildBreadcrumbSchema, buildFaqSchema, buildHowToSchema, buildSoftwareApplicationSchema } from "@/lib/schema"

export const metadata: Metadata = buildMetadata({
  title: "Threads Video Downloader",
  description:
    "Download public Threads videos online, explore Threads to MP4 workflows, and read practical guides for saving Threads media on desktop and mobile.",
  path: "/",
  keywords: [
    "threads video downloader",
    "download threads video online",
    "threads to mp4",
    "how to download videos from threads",
  ],
})

export default function Home() {
  const afterExtractorSlot = adsenseConfig.ads.homePage.afterExtractor
  const afterHelpSlot = adsenseConfig.ads.homePage.afterHelp
  const trustSignals = [
    {
      title: "Who maintains this site",
      body: "Threads Extractor is maintained by the site editorial team. The same team reviews the homepage workflow and the published support guides.",
    },
    {
      title: "How guidance is reviewed",
      body: "Support pages are updated against manual checks of public Threads post URLs and browser save behavior. AI can assist with drafting, but the published guidance is manually reviewed.",
    },
    {
      title: "Why this site exists",
      body: "The site is meant to help users complete a public-post download workflow and troubleshoot normal failure cases. It is not meant to publish near-duplicate keyword pages.",
    },
  ]
  const homeFaqs = [
    {
      question: "Can I download public Threads videos online?",
      answer:
        "Yes. The maintained workflow on this site is built for public Threads post URLs and is supported by manually reviewed guides for troubleshooting and device behavior.",
    },
    {
      question: "What is the best way to retry a failed download?",
      answer:
        "Start again from the original public Threads post URL. Reusing an old media asset URL is less reliable because upstream links can expire or rotate.",
    },
    {
      question: "What should I do if a Threads video is not downloading?",
      answer:
        "Retry from the original public post URL and review the troubleshooting guide. Private posts and expired upstream media URLs are the most common reasons for failure.",
    },
  ]

  return (
    <div className="flex flex-col bg-background transition-colors mt-16">
      <JsonLd
        data={[
          buildBreadcrumbSchema([{ name: "Home", path: "/" }]),
          buildSoftwareApplicationSchema({
            name: "Threads Video Downloader",
            description: "Download public Threads videos online with a simple browser workflow.",
            path: "/",
          }),
          buildFaqSchema(homeFaqs),
          buildHowToSchema({
            name: "How to download a public Threads video",
            description: "Copy the post URL, paste it into the downloader, and save the media file.",
            path: "/",
            steps: [
              "Copy the public Threads post URL.",
              "Paste the URL into the downloader form.",
              "Submit the request and save the returned file.",
            ],
          }),
        ]}
      />
      <section id="home" className="flex-1 flex items-center justify-center bg-background">
        <ThreadsExtractor
          title="Download Public Threads Videos Online"
          description="Paste a public Threads post URL to start the maintained downloader. For failure checks and device-specific save behavior, use the guides below."
          submitLabel="Start Download"
        />
      </section>

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

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Who / How / Why</p>
            <h2 className="text-2xl font-bold text-foreground">How the maintained content is produced</h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              The site now keeps one primary downloader page and a small set of maintained support guides. That makes the workflow easier to review and reduces thin topic duplication.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {trustSignals.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-background p-5">
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">Last reviewed: 2026-04-15</p>
        </div>
      </section>

      <FAQSection title="Homepage FAQ" items={homeFaqs} />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Site Trust</p>
            <h2 className="text-2xl font-bold text-foreground">Website policies and contact details</h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Threads Extractor maintains dedicated pages for site background, editorial standards, support routes,
              privacy disclosures, and acceptable use. These pages help visitors understand how the site works beyond the downloader itself.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
              { href: "/editorial-policy", label: "Editorial Policy" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RelatedLinks
        title="Maintained Threads guides"
        links={indexableGuidePages.map((page) => ({
          title: page.title,
          description: page.description,
          href: `/guides/${page.slug}`,
        }))}
      />

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
