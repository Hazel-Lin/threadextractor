import { Card } from "@/components/ui/card"
import type { FAQItem } from "@/lib/seo-pages"

export function FAQSection({
  title = "Frequently asked questions",
  items,
}: {
  title?: string
  items: FAQItem[]
}) {
  return (
    <section className="w-full py-16 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.question} className="p-6">
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-3 text-muted-foreground leading-7">{item.answer}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
