import { Card } from "@/components/ui/card"

export function ObservedCases({
  items,
}: {
  items: Array<{
    scenario: string
    observed: string
    implication: string
  }>
}) {
  if (!items.length) {
    return null
  }

  return (
    <section className="w-full py-16 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Observed Cases</p>
          <h2 className="text-3xl font-bold text-foreground">Observed patterns behind this guide</h2>
          <p className="text-muted-foreground leading-7">
            These notes summarize recurring patterns seen while reviewing public Threads post workflows. They are not a guarantee for every post, but they show the kinds of outcomes that shaped the guidance on this page.
          </p>
        </div>
        <div className="mt-8 grid gap-4">
          {items.map((item) => (
            <Card key={item.scenario} className="p-6">
              <h3 className="text-lg font-semibold text-foreground">{item.scenario}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-foreground">Observed:</span> {item.observed}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-foreground">Why it matters:</span> {item.implication}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
