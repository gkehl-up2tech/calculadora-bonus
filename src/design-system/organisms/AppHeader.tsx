import type { ElementType, ReactNode } from 'react'
import { Search, type LucideIcon } from 'lucide-react'
import { Avatar, Icon, Logo, Text } from '../atoms'
import { IconButton, NavItem, Persona, ShortcutHint } from '../cells'
import { DropdownMenu, DropdownMenuContent, DropdownMenuHeader, DropdownMenuSeparator, DropdownMenuTrigger, ThemeToggle, Tooltip } from '../molecules'
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

export interface AppHeaderProps {
  /** Logotipo já embrulhado no link para a página inicial. */
  logo?: ReactNode
  /** Navegação principal. Fica ao lado do logotipo; no celular desce para uma segunda linha. */
  nav?: NavEntry[]
  /** Componente de link. Para React Router: linkAs={NavLink} hrefProp="to". */
  linkAs?: ElementType
  hrefProp?: 'href' | 'to'
  /** Para links simples (<a>): caminho atual, usado para marcar o item ativo. */
  currentPath?: string
  /** Nome do landmark da navegação (padrão "Principal"). Só mude se houver mais de um cabeçalho na página. */
  navLabel?: string
  user: { name: string; email?: string }
  /** Itens do menu do usuário (DropdownMenuItem…). Destinos secundários (Conexões, Configurações) ficam aqui. */
  userMenu?: ReactNode
  /** Sem esta função, a busca não aparece. */
  onSearchClick?: () => void
  searchLabel?: string
  searchShortcut?: string[]
}

function isActive(entry: NavEntry, path?: string) {
  if (!path) return false
  return path === entry.href || (!entry.end && path.startsWith(`${entry.href}/`))
}

function HeaderNav({ nav, linkAs, hrefProp = 'href', currentPath, navLabel = 'Principal', className }: Pick<AppHeaderProps, 'nav' | 'linkAs' | 'hrefProp' | 'currentPath' | 'navLabel'> & { className?: string }) {
  if (!nav?.length) return null
  const router = linkAs !== undefined && linkAs !== 'a'
  return (
    <nav aria-label={navLabel} className={className}>
      <ul className="flex items-center gap-1">
        {nav.map((entry) => {
          const linkProps: Record<string, unknown> = { [hrefProp]: entry.href }
          if (router && entry.end) linkProps.end = true
          return (
            <li key={entry.id} className="shrink-0">
              <NavItem as={linkAs ?? 'a'} icon={entry.icon} trailing={entry.badge} active={router ? undefined : isActive(entry, currentPath)} {...linkProps}>
                {entry.label}
              </NavItem>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/**
 * Cabeçalho fixo e único menu do sistema: logotipo, navegação principal, busca global, tema e usuário.
 * Não há menu lateral. No celular a navegação ocupa uma segunda linha.
 */
export function AppHeader({
  logo = <Logo />,
  nav,
  linkAs,
  hrefProp,
  currentPath,
  navLabel,
  user,
  userMenu,
  onSearchClick,
  searchLabel = 'Buscar produtos por nome, SKU ou NCM…',
  searchShortcut = ['Ctrl', 'K'],
}: AppHeaderProps) {
  const navProps = { nav, linkAs, hrefProp, currentPath, navLabel }
  return (
    <header className="sticky top-0 z-header border-b border-line-subtle bg-surface pt-[env(safe-area-inset-top)]">
      <div className="mx-auto max-w-(--content-max) px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-2 md:gap-4">
          <div className="flex min-w-0 shrink-0">{logo}</div>
          <HeaderNav {...navProps} className="hidden md:block" />

          {onSearchClick ? (
            <button
              type="button"
              onClick={onSearchClick}
              className="ml-auto hidden h-control-md min-w-0 max-w-md flex-1 items-center gap-2 rounded-md bg-subtle px-3 text-left text-sm text-fg-subtle transition-[background-color,transform] duration-150 ease-out hover:bg-muted active:scale-[0.99] md:flex"
            >
              <Icon icon={Search} size="sm" />
              <Text as="span" tone="subtle" truncate className="flex-1">{searchLabel}</Text>
              <ShortcutHint keys={searchShortcut} />
            </button>
          ) : null}

          <div className={cn('ml-auto flex items-center gap-1', onSearchClick && 'md:ml-0')}>
            {onSearchClick ? (
              <Tooltip content="Buscar produtos" shortcut={searchShortcut}>
                <IconButton icon={Search} label="Buscar produtos" onClick={onSearchClick} className="md:hidden" />
              </Tooltip>
            ) : null}
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Menu do usuário: ${user.name}`}
                  className="ml-1 rounded-full transition-transform duration-150 ease-out active:scale-95"
                >
                  <Avatar name={user.name} size="sm" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuHeader>
                  <Persona name={user.name} description={user.email} size="sm" />
                </DropdownMenuHeader>
                {userMenu ? <DropdownMenuSeparator /> : null}
                {userMenu}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {nav?.length ? (
          <div className="-mx-1 flex h-11 items-center overflow-x-auto md:hidden">
            <HeaderNav {...navProps} />
          </div>
        ) : null}
      </div>
    </header>
  )
}
