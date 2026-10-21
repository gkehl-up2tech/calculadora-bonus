import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

export interface DocNavItem {
  id: string
  label: string
}

/** Navegação fixa por âncoras com destaque da seção visível (scroll-spy). */
export function DocNav({ items }: { items: DocNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e)
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-160px 0px -65% 0px' },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [items])

  return (
    <nav
      aria-label="Seções do Design System"
      className="sticky top-[calc(var(--header-h)+env(safe-area-inset-top))] z-sticky -mx-4 border-b border-line-subtle bg-canvas/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <ul className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              className={cn(
                'inline-flex h-control-sm items-center rounded-md px-3 text-sm font-medium text-fg-muted transition-[background-color,color] duration-150 ease-out hover:bg-subtle hover:text-fg',
                'aria-[current=true]:bg-primary-soft aria-[current=true]:font-semibold aria-[current=true]:text-primary-soft-fg',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
