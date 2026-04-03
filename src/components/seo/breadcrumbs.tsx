import Link from "next/link"

interface Crumb {
  label: string
  href: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <span>/</span>}
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
