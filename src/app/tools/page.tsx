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
    "Legacy topic index retained for compatibility. The maintained downloader now lives on the homepage.",
  path: "/tools",
  keywords: ["threads downloader tools", "threads media tools", "threads video downloader pages"],
  noIndex: true,
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
        eyebrow="Legacy Index"
        title="Legacy Threads Topic Pages"
        description="These older topic pages remain online for existing links, but the maintained downloader experience now lives on the homepage."
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
        title="Legacy topic pages"
        links={toolPages.map((tool) => ({
          title: tool.title,
          description: tool.description,
          href: `/${tool.slug}`,
        }))}
      />
    </div>
  )
}
