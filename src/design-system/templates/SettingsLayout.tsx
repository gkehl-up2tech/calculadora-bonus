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

/** Configurações: título, abas horizontais de seções (sem menu lateral) e o conteúdo da seção. */
export function SettingsLayout({ title = 'Configurações', description, items, linkAs, hrefProp = 'href', currentPath, children }: SettingsLayoutProps) {
  const router = linkAs !== undefined && linkAs !== 'a'
  return (
    <div className="grid gap-6">
      <PageHeader title={title} description={description} />
      <nav aria-label="Seções de configurações" className="-mx-4 overflow-x-auto border-b border-line-subtle px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        <ul className="flex gap-1 pb-3">
          {items.map((item) => {
            const linkProps: Record<string, unknown> = { [hrefProp]: item.href }
            if (router && item.end) linkProps.end = true
            return (
              <li key={item.id} className="shrink-0">
                <NavItem as={linkAs ?? 'a'} icon={item.icon} trailing={item.badge} active={router ? undefined : currentPath === item.href} {...linkProps}>
                  {item.label}
                </NavItem>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
