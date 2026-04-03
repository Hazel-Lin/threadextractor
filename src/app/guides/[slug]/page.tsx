import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { ContentAd } from "@/components/seo/content-ad"
import { ContentSections } from "@/components/seo/content-sections"
import { FAQSection } from "@/components/seo/faq-section"
import { JsonLd } from "@/components/seo/json-ld"
import { PageHero } from "@/components/seo/page-hero"
import { RelatedLinks } from "@/components/seo/related-links"
import { buildMetadata } from "@/lib/metadata"
import { getGuidePage, getToolPage, guidePages } from "@/lib/seo-pages"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
} from "@/lib/schema"

export function generateStaticParams() {
  return guidePages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = getGuidePage(slug)
  if (!page) {
    return {}
  }

  return buildMetadata({
    title: page.title,
    description: page.description,
    path: `/guides/${page.slug}`,
    type: "article",
    keywords: [page.title.toLowerCase(), "threads downloader guide", "threads media help"],
  })
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getGuidePage(slug)
  if (!page) {
    notFound()
  }

  const relatedToolLinks = page.relatedToolSlugs
    .map((slug) => getToolPage(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      title: item.title,
      description: item.description,
      href: `/${item.slug}`,
    }))

  const schemaBlocks: Array<Record<string, unknown>> = [
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: page.title, path: `/guides/${page.slug}` },
    ]),
    buildArticleSchema({
      headline: page.title,
      description: page.description,
      path: `/guides/${page.slug}`,
    }),
  ]

  if (page.faqs?.length) {
    schemaBlocks.push(buildFaqSchema(page.faqs))
  }

  if (page.category === "how-to") {
    schemaBlocks.push(
      buildHowToSchema({
        name: page.title,
        description: page.description,
        path: `/guides/${page.slug}`,
        steps: page.sections.map((section) => section.title),
      })
    )
  }

  return (
    <div className="bg-background">
      <JsonLd data={schemaBlocks} />
      <PageHero eyebrow="Guide" title={page.headline} description={page.intro} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: page.title, href: `/guides/${page.slug}` },
          ]}
        />
      </div>
      <ContentSections sections={page.sections} />
      <ContentAd minHeight={250} />
      {page.faqs?.length ? <FAQSection items={page.faqs} /> : null}
      <RelatedLinks title="Related downloader pages" links={relatedToolLinks} />
    </div>
  )
}
