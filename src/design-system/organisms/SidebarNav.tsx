import type { ElementType, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Text } from '../atoms'
import { NavItem } from '../cells'
import { cn } from '@/lib/cn'

export interface NavEntry {
  id: string
  label: string
  href: string
  icon?: LucideIcon
  /** Contador/Badge à direita. */
  badge?: ReactNode
  /** Só fica ativo na rota exata (use no item raiz "/"). */
  end?: boolean
}

export interface NavGroup {
  id: string
  label?: string
  items: NavEntry[]
}

export interface SidebarNavProps {
  groups: NavGroup[]
  /** Componente de link. Para React Router: linkAs={NavLink} hrefProp="to". */
  linkAs?: ElementType
  hrefProp?: 'href' | 'to'
  /** Para links simples (<a>): caminho atual, usado para marcar o item ativo. */
  currentPath?: string
  /** Chamado ao navegar (ex.: fechar o menu no celular). */
  onNavigate?: () => void
  /** Nome do landmark. Mude se houver mais de um menu na página. */
  label?: string
  className?: string
}

function isActive(entry: NavEntry, path?: string) {
  if (!path) return false
  return path === entry.href || (!entry.end && path.startsWith(`${entry.href}/`))
}

/** Menu lateral agrupado. Item ativo via aria-current="page". */
export function SidebarNav({ groups, linkAs, hrefProp = 'href', currentPath, onNavigate, label = 'Principal', className }: SidebarNavProps) {
  const router = linkAs !== undefined && linkAs !== 'a'
  return (
    <nav aria-label={label} className={cn('grid gap-6', className)}>
      {groups.map((group) => (
        <div key={group.id} className="grid gap-1">
          {group.label ? <Text variant="overline" className="px-3 pb-1">{group.label}</Text> : null}
          <ul className="grid gap-0.5">
            {group.items.map((entry) => {
              const linkProps: Record<string, unknown> = { [hrefProp]: entry.href }
              if (router && entry.end) linkProps.end = true
              return (
                <li key={entry.id}>
                  <NavItem
                    as={linkAs ?? 'a'}
                    icon={entry.icon}
                    trailing={entry.badge}
                    active={router ? undefined : isActive(entry, currentPath)}
                    onClick={onNavigate}
                    {...linkProps}
                  >
                    {entry.label}
                  </NavItem>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
