import { Card } from "@/components/ui/card"

export function ContentSections({
  sections,
}: {
  sections: Array<{
    title: string
    body: string[]
  }>
}) {
  return (
    <section className="w-full py-16 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6">
          {sections.map((section) => (
            <Card key={section.title} className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-muted-foreground leading-7">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
