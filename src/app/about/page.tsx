import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { buildMetadata } from "@/lib/metadata"
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/schema"

export const metadata: Metadata = buildMetadata({
  title: "About Threads Extractor",
  description:
    "Learn what Threads Extractor does, what kinds of public Threads media workflows it supports, and how the site approaches safety, publishing, and advertising.",
  path: "/about",
  type: "article",
  keywords: ["about threads extractor", "threads extractor contact", "threads downloader website"],
})

const principles = [
  {
    title: "Public-post workflows only",
    description:
      "The site is designed around publicly accessible Threads posts. It is not positioned as a private-content bypass or account-based media archive.",
  },
  {
    title: "One maintained downloader entry point",
    description:
      "The homepage is the maintained downloader entry point. Support content is kept to a small set of reviewed guides instead of spreading the same workflow across many near-duplicate pages.",
  },
  {
    title: "Manual review before publication",
    description:
      "Guides are reviewed against observed downloader behavior and browser save behavior. AI may assist with drafting, but the published guidance is manually reviewed before release.",
  },
]

export default function AboutPage() {
  return (
    <div className="bg-background py-20">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          buildArticleSchema({
            headline: "About Threads Extractor",
            description:
              "Background, publishing intent, and trust information for the Threads Extractor website.",
            path: "/about",
          }),
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
          ]}
        />
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">About</p>
            <h1 className="text-4xl font-bold text-foreground">About Threads Extractor</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Threads Extractor is a small utility site focused on one job: helping visitors use a browser-based workflow to save public Threads videos.
              The site pairs that tool with a short set of maintained support guides so visitors can understand what works, what fails, and how device behavior changes the save flow.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((principle) => (
              <Card key={principle.title} className="border border-border bg-card">
                <CardContent className="space-y-3 p-6">
                  <h2 className="text-xl font-semibold text-foreground">{principle.title}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border border-border bg-card">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-foreground">What the website publishes</h2>
              <p className="leading-7 text-muted-foreground">
                The maintained site publishes one primary downloader page, a small set of manually reviewed troubleshooting and device guides,
                and trust pages that explain policies, contact routes, and responsible use.
              </p>
              <p className="leading-7 text-muted-foreground">
                If you want review standards, publication details, or update policies, see the{" "}
                <Link href="/editorial-policy" className="text-primary hover:underline">
                  Editorial Policy
                </Link>
                . For contact details, visit the{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact page
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
