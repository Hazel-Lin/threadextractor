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
import { guidePages, toolPages } from "@/lib/seo-pages"
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
  const homeFaqs = [
    {
      question: "Can I download public Threads videos online?",
      answer:
        "Yes. This site is built for public Threads post workflows and provides a browser-based downloader experience supported by related guides and FAQs.",
    },
    {
      question: "Does the site cover Threads to MP4 and related queries?",
      answer:
        "Yes. The site includes dedicated pages for Threads to MP4, online download workflows, GIF-style media, carousel intent, and troubleshooting.",
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
          description="Paste a public Threads post URL to start the downloader, then explore related pages for MP4, GIF-style media, carousel intent, and troubleshooting."
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
        title="Top downloader pages"
        links={toolPages.map((page) => ({
          title: page.title,
          description: page.description,
          href: `/${page.slug}`,
        }))}
      />

      <RelatedLinks
        title="Helpful Threads guides"
        links={guidePages.map((page) => ({
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
