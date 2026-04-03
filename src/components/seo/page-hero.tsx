export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description: string
}) {
  return (
    <section className="w-full bg-background pt-24 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground leading-8">{description}</p>
        </div>
      </div>
    </section>
  )
}
