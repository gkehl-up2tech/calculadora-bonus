import type { ElementType, ReactNode } from 'react'
import { NavItem } from '../cells'
import { PageHeader, type NavEntry } from '../organisms'

export interface SettingsLayoutProps {
  title?: string
  description?: string
  items: NavEntry[]
  linkAs?: ElementType
  hrefProp?: 'href' | 'to'
  currentPath?: string
  children: ReactNode
}

/** Configurações: navegação secundária à esquerda (rolagem horizontal no celular) e conteúdo à direita. */
export function SettingsLayout({ title = 'Configurações', description, items, linkAs, hrefProp = 'href', currentPath, children }: SettingsLayoutProps) {
  const router = linkAs !== undefined && linkAs !== 'a'
  return (
    <div className="grid gap-6">
      <PageHeader title={title} description={description} />
      <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8">
        <nav aria-label="Configurações" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
          <ul className="flex gap-1 lg:grid">
            {items.map((item) => {
              const linkProps: Record<string, unknown> = { [hrefProp]: item.href }
              if (router && item.end) linkProps.end = true
              return (
                <li key={item.id} className="shrink-0">
                  <NavItem
                    as={linkAs ?? 'a'}
                    icon={item.icon}
                    trailing={item.badge}
                    active={router ? undefined : currentPath === item.href}
                    {...linkProps}
                  >
                    {item.label}
                  </NavItem>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
