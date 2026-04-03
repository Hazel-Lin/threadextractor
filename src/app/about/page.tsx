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
    title: "Useful content around the tool",
    description:
      "The website publishes landing pages, tutorials, troubleshooting guides, and policy pages so visitors can understand how Threads media download workflows behave before clicking anything.",
  },
  {
    title: "Advertising supports the free service",
    description:
      "Google AdSense helps fund hosting and maintenance. Ads are intended to sit between substantive content sections rather than replacing the core downloader experience.",
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
              Threads Extractor is an information-rich utility site built around public Threads media workflows.
              The goal is simple: help visitors understand how downloading public Threads videos and related media
              works, then provide a straightforward browser-based tool supported by educational pages and clear site policies.
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
                The site includes long-tail downloader landing pages, device-specific how-to content, troubleshooting,
                and legal-use guidance. Each page is intended to address a real search question rather than exist as a thin copy
                of the homepage.
              </p>
              <p className="leading-7 text-muted-foreground">
                If you want editorial standards, review workflow details, or update policies, see the{" "}
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
