import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { buildMetadata } from "@/lib/metadata"
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/schema"

export const metadata: Metadata = buildMetadata({
  title: "Editorial Policy",
  description:
    "Read the editorial policy for Threads Extractor, including how guides are updated, how pages are reviewed, and how the site separates utility content from advertising.",
  path: "/editorial-policy",
  type: "article",
  keywords: ["threads extractor editorial policy", "threads downloader policy", "website editorial standards"],
})

const policyBlocks = [
  {
    title: "Original page intent",
    body: "Every page should answer a distinct user question, such as downloading a public Threads video, understanding why a download failed, or learning how different media types behave.",
  },
  {
    title: "Review and updates",
    body: "Guides and policy pages are reviewed when the downloader behavior changes, when the site adds a new landing page, or when legal and advertising disclosures need to be clarified.",
  },
  {
    title: "Advertising separation",
    body: "Ads are not meant to replace the main downloader interaction or mimic system buttons. The site places ads around content sections instead of using ads as the core page experience.",
  },
  {
    title: "Public-media scope",
    body: "The site describes workflows for public Threads posts only. Pages should not imply support for private account access, unauthorized content bypass, or account takeovers.",
  },
]

export default function EditorialPolicyPage() {
  return (
    <div className="bg-background py-20">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Editorial Policy", path: "/editorial-policy" },
          ]),
          buildArticleSchema({
            headline: "Threads Extractor Editorial Policy",
            description: "How the website writes, reviews, and updates downloader pages and guides.",
            path: "/editorial-policy",
          }),
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Editorial Policy", href: "/editorial-policy" },
          ]}
        />
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Editorial Policy</p>
            <h1 className="text-4xl font-bold text-foreground">Editorial Policy</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              This site combines a free web utility with informational content. The editorial policy exists to make that balance
              explicit for visitors, search engines, and advertising reviewers.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {policyBlocks.map((block) => (
              <Card key={block.title} className="border border-border bg-card">
                <CardContent className="space-y-3 p-6">
                  <h2 className="text-xl font-semibold text-foreground">{block.title}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">{block.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border border-border bg-card">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-foreground">Corrections and policy questions</h2>
              <p className="leading-7 text-muted-foreground">
                If you find a factual issue, outdated instruction, or policy concern, send it through the{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact page
                </Link>
                . Material corrections are reflected in the relevant page updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
