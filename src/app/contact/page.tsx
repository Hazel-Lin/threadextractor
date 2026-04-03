import type { Metadata } from "next"
import Link from "next/link"
import { Mail, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { buildMetadata } from "@/lib/metadata"
import { siteConfig } from "@/lib/site-config"
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/schema"

export const metadata: Metadata = buildMetadata({
  title: "Contact Threads Extractor",
  description:
    "Contact Threads Extractor for support, copyright questions, advertising concerns, or general website feedback.",
  path: "/contact",
  type: "article",
  keywords: ["contact threads extractor", "threads extractor support", "threads downloader contact"],
})

const contacts = [
  {
    title: "General support",
    email: siteConfig.contactEmail,
    description: "Questions about public Threads media workflows, broken pages, or site feedback.",
  },
  {
    title: "Copyright and DMCA",
    email: "dmca@threadsextractor.com",
    description: "Copyright complaints, removal requests, or questions about content ownership.",
  },
  {
    title: "Advertising and policy",
    email: "policy@threadsextractor.com",
    description: "Advertising placement concerns, compliance questions, or policy clarifications.",
  },
]

export default function ContactPage() {
  return (
    <div className="bg-background py-20">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          buildArticleSchema({
            headline: "Contact Threads Extractor",
            description: "Contact information and support routes for Threads Extractor.",
            path: "/contact",
          }),
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Contact", href: "/contact" },
          ]}
        />
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Contact</p>
            <h1 className="text-4xl font-bold text-foreground">Contact Threads Extractor</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              The site provides several direct email routes so visitors, rights holders, and reviewers can quickly reach the right
              inbox. Messages are handled manually and typically reviewed within a few business days.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {contacts.map((contact) => (
              <Card key={contact.email} className="border border-border bg-card">
                <CardContent className="space-y-3 p-6">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">{contact.title}</h2>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{contact.description}</p>
                  <a href={`mailto:${contact.email}`} className="text-sm font-medium text-primary hover:underline">
                    {contact.email}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border border-border bg-card">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">What to include in a message</h2>
              </div>
              <p className="leading-7 text-muted-foreground">
                For copyright requests, include the original content URL, a description of the material, and the action requested.
                For technical issues, include the public Threads post URL and a short description of what failed.
              </p>
              <p className="leading-7 text-muted-foreground">
                Before sending a support request, you may also want to check the{" "}
                <Link href="/guides" className="text-primary hover:underline">
                  guides library
                </Link>
                , the{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                , or the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
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
