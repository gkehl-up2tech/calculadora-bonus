import { Fragment, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Icon } from '../atoms'
import { cn } from '@/lib/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** Troque para usar o Link do roteador: (item, children) => <RouterLink to={item.href}>{children}</RouterLink> */
  renderLink?: (item: BreadcrumbItem, children: ReactNode, className: string) => ReactNode
  /** Nome do landmark (padrão "Trilha de navegação"). */
  label?: string
  className?: string
}

const linkClass = 'rounded-xs text-fg-muted transition-colors duration-150 ease-out hover:text-fg'

/** Trilha de navegação. O último item é a página atual (aria-current). */
export function Breadcrumb({ items, renderLink, label = 'Trilha de navegação', className }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li className={cn('min-w-0', !last && 'max-sm:hidden')}>
                {last || !item.href ? (
                  <span aria-current={last ? 'page' : undefined} className="block truncate font-medium text-fg">{item.label}</span>
                ) : renderLink ? (
                  renderLink(item, item.label, linkClass)
                ) : (
                  <a href={item.href} className={linkClass}>{item.label}</a>
                )}
              </li>
              {!last ? <li aria-hidden className="max-sm:hidden"><Icon icon={ChevronRight} size="xs" className="text-fg-subtle" /></li> : null}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
