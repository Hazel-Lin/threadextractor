import Link from "next/link"
import { Card } from "@/components/ui/card"

interface RelatedLink {
  title: string
  description: string
  href: string
}

export function RelatedLinks({
  title,
  links,
}: {
  title: string
  links: RelatedLink[]
}) {
  return (
    <section className="w-full py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {links.map((link) => (
            <Card key={link.href} className="p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-foreground">{link.title}</h3>
              <p className="mt-3 text-muted-foreground leading-7">{link.description}</p>
              <Link href={link.href} className="mt-4 inline-flex text-primary font-medium hover:underline">
                Read more
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
