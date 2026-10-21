import type { ReactNode } from 'react'
import { Menu, Search } from 'lucide-react'
import { Icon, Text } from '../atoms'
import { IconButton, Persona, ShortcutHint } from '../cells'
import { DropdownMenu, DropdownMenuContent, DropdownMenuHeader, DropdownMenuSeparator, DropdownMenuTrigger, ThemeToggle, Tooltip } from '../molecules'
import { Avatar } from '../atoms'

export interface AppHeaderProps {
  logo: ReactNode
  user: { name: string; email?: string }
  /** Itens do menu do usuário (DropdownMenuItem…). */
  userMenu?: ReactNode
  onMenuClick?: () => void
  onSearchClick?: () => void
  searchShortcut?: string[]
}

/** Barra superior fixa: menu (celular), logo, busca global, tema e usuário. */
export function AppHeader({ logo, user, userMenu, onMenuClick, onSearchClick, searchShortcut = ['Ctrl', 'K'] }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-header border-b border-line-subtle bg-surface pt-[env(safe-area-inset-top)]">
      <div className="flex h-header items-center gap-2 px-3 sm:px-4 lg:gap-4">
        {onMenuClick ? <IconButton icon={Menu} label="Abrir menu" onClick={onMenuClick} className="lg:hidden" /> : null}
        <div className="flex min-w-0 lg:w-[calc(var(--sidebar-w)-1rem)]">{logo}</div>

        <button
          type="button"
          onClick={onSearchClick}
          className="mx-auto hidden h-control-md w-full max-w-md items-center gap-2 rounded-md bg-subtle px-3 text-left text-sm text-fg-subtle transition-[background-color,transform] duration-150 ease-out hover:bg-muted active:scale-[0.99] md:flex"
        >
          <Icon icon={Search} size="sm" />
          <Text as="span" tone="subtle" className="flex-1">Buscar produtos, páginas e ações…</Text>
          <ShortcutHint keys={searchShortcut} />
        </button>

        <div className="ml-auto flex items-center gap-1">
          <Tooltip content="Buscar" shortcut={searchShortcut}>
            <IconButton icon={Search} label="Buscar" onClick={onSearchClick} className="md:hidden" />
          </Tooltip>
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
    </header>
  )
}
