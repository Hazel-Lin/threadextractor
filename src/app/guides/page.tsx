import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { PageHero } from "@/components/seo/page-hero"
import { RelatedLinks } from "@/components/seo/related-links"
import { buildMetadata } from "@/lib/metadata"
import { indexableGuidePages } from "@/lib/seo-pages"
import { buildBreadcrumbSchema, buildWebsiteSchema } from "@/lib/schema"

export const metadata: Metadata = buildMetadata({
  title: "Threads Download Guides",
  description:
    "Browse Threads download guides covering how-to instructions, troubleshooting, device-specific help, FAQs, and workflow comparisons.",
  path: "/guides",
  keywords: ["threads guides", "threads downloader help", "threads download tutorial"],
})

export default function GuidesIndexPage() {
  return (
    <div className="bg-background">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ]),
          buildWebsiteSchema(),
        ]}
      />
      <PageHero
        eyebrow="Guide Hub"
        title="Threads Download Guides and Troubleshooting"
        description="Browse the maintained Threads guides: the basic download workflow, the most common failure checks, and device-specific browser behavior."
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
          ]}
        />
      </div>
      <RelatedLinks
        title="Maintained Threads guides"
        links={indexableGuidePages.map((guide) => ({
          title: guide.title,
          description: guide.description,
          href: `/guides/${guide.slug}`,
        }))}
      />
    </div>
  )
}
