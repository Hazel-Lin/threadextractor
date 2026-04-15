import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ThreadsExtractor from "@/components/threads-extractor"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { ContentAd } from "@/components/seo/content-ad"
import { ContentSections } from "@/components/seo/content-sections"
import { FAQSection } from "@/components/seo/faq-section"
import { JsonLd } from "@/components/seo/json-ld"
import { PageHero } from "@/components/seo/page-hero"
import { RelatedLinks } from "@/components/seo/related-links"
import { buildMetadata } from "@/lib/metadata"
import { getGuidePage, getToolPage, indexableGuidePages, toolPages } from "@/lib/seo-pages"
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
} from "@/lib/schema"

export function generateStaticParams() {
  return toolPages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = getToolPage(slug)
  if (!page) {
    return {}
  }

  return buildMetadata({
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
    keywords: [page.keyword, "threads downloader", "threads media downloader"],
    noIndex: !page.indexable,
  })
}

export default async function ToolLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getToolPage(slug)
  if (!page) {
    notFound()
  }

  const relatedGuideLinks = page.relatedGuideSlugs
    .map((slug) => getGuidePage(slug))
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined)
    .filter((item) => item.indexable)
    .map((item) => ({
      title: item.title,
      description: item.description,
      href: `/guides/${item.slug}`,
    }))

  const howToSteps = [
    "Copy the public Threads post URL.",
    "Paste the URL into the downloader form.",
    "Submit the request and save the returned media file.",
  ]

  return (
    <div className="bg-background">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: page.title, path: `/${page.slug}` },
          ]),
          buildSoftwareApplicationSchema({
            name: page.title,
            description: page.description,
            path: `/${page.slug}`,
          }),
          buildFaqSchema(page.faqs),
          buildHowToSchema({
            name: page.title,
            description: page.description,
            path: `/${page.slug}`,
            steps: howToSteps,
          }),
        ]}
      />
      <PageHero eyebrow={page.indexable ? "Tool Page" : "Legacy Topic"} title={page.headline} description={page.intro} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: page.title, href: `/${page.slug}` },
          ]}
        />
      </div>
      <section className="pb-8">
        <ThreadsExtractor title={page.ctaTitle} description={page.ctaDescription} />
      </section>
      <ContentSections sections={page.sections} />
      <FAQSection items={page.faqs} />
      <ContentAd minHeight={250} />
      <RelatedLinks
        title="Maintained Threads guides"
        links={relatedGuideLinks.length ? relatedGuideLinks : indexableGuidePages.map((guide) => ({
          title: guide.title,
          description: guide.description,
          href: `/guides/${guide.slug}`,
        }))}
      />
      <section className="w-full py-16 bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground">Maintained support pages</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {indexableGuidePages.map((guide) => (
              <a
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-foreground">{guide.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-6">{guide.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
