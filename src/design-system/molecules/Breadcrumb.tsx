import { Fragment, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

/** No celular o item anterior ganha uma seta de voltar. */
function BackLabel({ parent, children }: { parent: boolean; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 max-sm:min-h-control-sm">
      {parent ? <Icon icon={ChevronLeft} size="xs" className="sm:hidden" /> : null}
      {children}
    </span>
  )
}

const linkClass = 'rounded-xs text-fg-muted transition-colors duration-150 ease-out hover:text-fg'

/**
 * Trilha de navegação. O último item é a página atual (aria-current).
 * No celular vira um link de volta para o item anterior ("‹ Produtos"): a página atual já aparece no título.
 */
export function Breadcrumb({ items, renderLink, label = 'Trilha de navegação', className }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1
          const parent = i === items.length - 2
          // Celular: só o item anterior (com seta de voltar). Se houver um item só, ele fica.
          const hiddenOnPhone = items.length > 1 && !parent
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li className={cn('min-w-0', hiddenOnPhone && 'max-sm:hidden')}>
                {last || !item.href ? (
                  <span aria-current={last ? 'page' : undefined} className="block truncate font-medium text-fg">{item.label}</span>
                ) : renderLink ? (
                  renderLink(item, <BackLabel parent={parent}>{item.label}</BackLabel>, linkClass)
                ) : (
                  <a href={item.href} className={linkClass}><BackLabel parent={parent}>{item.label}</BackLabel></a>
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
