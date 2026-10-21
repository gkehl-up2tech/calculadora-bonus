import type { ReactNode } from 'react'
import { Avatar, Badge, Logo } from '../atoms'
import { Persona } from '../cells'
import { DropdownMenu, DropdownMenuContent, DropdownMenuHeader, DropdownMenuSeparator, DropdownMenuTrigger, ThemeToggle } from '../molecules'

export interface AppHeaderProps {
  /** Marca à esquerda, já embrulhada no link para a página inicial. */
  logo?: ReactNode
  /** `role` aparece como selo no menu do usuário (ex.: perfil de acesso). */
  user: { name: string; email?: string; role?: string }
  /** Itens do menu do usuário (DropdownMenuItem…). Destinos secundários (Conexões, Configurações) ficam aqui. */
  userMenu?: ReactNode
  /** Sem esta função, o botão de busca não aparece. */
  onSearchClick?: () => void
  searchLabel?: string
}

/**
 * Cabeçalho fixo: marca à esquerda, botão de busca centralizado, tema e usuário à direita.
 * A navegação principal NÃO fica aqui — ela é o toggle (SegmentedNav) acima do PageHeader de cada página.
 */
export function AppHeader({ logo = <Logo wordmarkOnly />, user, userMenu, onSearchClick, searchLabel = 'Buscar produtos' }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-header border-b border-line-subtle bg-surface pt-[env(safe-area-inset-top)]">
      <div className="mx-auto grid h-14 max-w-(--content-max) grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 sm:px-6 md:grid-cols-[1fr_minmax(0,28rem)_1fr] md:gap-4 lg:px-8">
        <div className="flex min-w-0 justify-self-start">{logo}</div>

        {onSearchClick ? (
          <button
            type="button"
            onClick={onSearchClick}
            aria-keyshortcuts="Control+K Meta+K"
            className="inline-flex h-control-md min-w-0 items-center justify-center rounded-md bg-subtle px-4 text-sm font-medium text-fg-muted transition-[background-color,color,transform] duration-150 ease-out hover:bg-muted hover:text-fg active:scale-[0.99]"
          >
            <span className="truncate">{searchLabel}</span>
          </button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1 justify-self-end">
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
                {user.role ? <Badge tone="brand" size="sm" className="mt-2">{user.role}</Badge> : null}
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
