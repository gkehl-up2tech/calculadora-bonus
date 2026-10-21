import type { ElementType } from 'react'
import type { NavEntry } from '../cells'
import { cn } from '@/lib/cn'

export interface SegmentedNavProps {
  items: NavEntry[]
  /** Componente de link. Para React Router: linkAs={NavLink} hrefProp="to". */
  linkAs?: ElementType
  hrefProp?: 'href' | 'to'
  /** Para links simples (<a>): caminho atual, usado para marcar o item ativo. */
  currentPath?: string
  /** Nome do landmark (padrão "Principal"). */
  label?: string
  className?: string
}

function isActive(entry: NavEntry, path?: string) {
  if (!path) return false
  return path === entry.href || (!entry.end && path.startsWith(`${entry.href}/`))
}

/**
 * Navegação com a aparência de um toggle (SegmentedControl), mas feita de LINKS: cada opção leva a uma
 * página. O item atual usa aria-current="page". Fora das páginas do menu, nenhum item fica marcado.
 */
export function SegmentedNav({ items, linkAs, hrefProp = 'href', currentPath, label = 'Principal', className }: SegmentedNavProps) {
  const router = linkAs !== undefined && linkAs !== 'a'
  const Link: ElementType = linkAs ?? 'a'
  return (
    <nav aria-label={label} className={cn('max-w-full overflow-x-auto', className)}>
      <ul className="inline-flex rounded-lg bg-subtle p-0.5">
        {items.map((item) => {
          const linkProps: Record<string, unknown> = { [hrefProp]: item.href }
          if (router && item.end) linkProps.end = true
          return (
            <li key={item.id}>
              <Link
                aria-current={!router && isActive(item, currentPath) ? 'page' : undefined}
                className={cn(
                  'inline-flex h-control-md items-center justify-center rounded-md px-4 text-sm font-medium whitespace-nowrap text-fg-muted',
                  'transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:text-fg active:scale-[0.97]',
                  'aria-[current=page]:bg-surface aria-[current=page]:font-semibold aria-[current=page]:text-fg aria-[current=page]:shadow-sm',
                )}
                {...linkProps}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
