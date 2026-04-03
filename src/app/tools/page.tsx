import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { PageHero } from "@/components/seo/page-hero"
import { RelatedLinks } from "@/components/seo/related-links"
import { buildMetadata } from "@/lib/metadata"
import { toolPages } from "@/lib/seo-pages"
import { buildBreadcrumbSchema, buildWebsiteSchema } from "@/lib/schema"

export const metadata: Metadata = buildMetadata({
  title: "Threads Downloader Tools",
  description:
    "Browse long-tail Threads downloader pages covering public video downloads, GIF-style media, MP4 workflows, carousel intent, and browser-based download use cases.",
  path: "/tools",
  keywords: ["threads downloader tools", "threads media tools", "threads video downloader pages"],
})

export default function ToolsIndexPage() {
  return (
    <div className="bg-background">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
          ]),
          buildWebsiteSchema(),
        ]}
      />
      <PageHero
        eyebrow="Tool Hub"
        title="Threads Downloader Tools and Landing Pages"
        description="Explore focused downloader pages for Threads video, MP4, GIF-style media, carousel intent, and browser-based online download workflows."
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
          ]}
        />
      </div>
      <RelatedLinks
        title="All downloader landing pages"
        links={toolPages.map((tool) => ({
          title: tool.title,
          description: tool.description,
          href: `/${tool.slug}`,
        }))}
      />
    </div>
  )
}
