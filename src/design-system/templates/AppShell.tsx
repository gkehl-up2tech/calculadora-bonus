import { useState, type ElementType, type ReactNode } from 'react'
import { AppHeader, CommandPalette, type CommandPaletteProps, type NavEntry } from '../organisms'

export interface AppShellProps {
  nav: NavEntry[]
  user: { name: string; email?: string }
  /** Destinos do menu do usuário (ex.: Conexões, Configurações). */
  userMenu?: ReactNode
  /** Configuração da busca global (Ctrl/⌘ + K). Sem ela, a busca não aparece. */
  search?: Omit<CommandPaletteProps, 'open' | 'onOpenChange' | 'shortcut'>
  linkAs?: ElementType
  hrefProp?: 'href' | 'to'
  currentPath?: string
  /** Logotipo já embrulhado no link para a página inicial. */
  logo?: ReactNode
  children: ReactNode
}

/**
 * Estrutura global: link "pular para o conteúdo", cabeçalho fixo com a navegação (sem menu lateral),
 * busca global e a área principal.
 */
export function AppShell({ nav, user, userMenu, search, linkAs, hrefProp, currentPath, logo, children }: AppShellProps) {
  const [paletteOpen, setPaletteOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-canvas">
      <a
        href="#conteudo"
        className="sr-only z-tooltip rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Pular para o conteúdo
      </a>

      <AppHeader
        logo={logo}
        nav={nav}
        linkAs={linkAs}
        hrefProp={hrefProp}
        currentPath={currentPath}
        user={user}
        userMenu={userMenu}
        onSearchClick={search ? () => setPaletteOpen(true) : undefined}
      />

      <main id="conteudo" tabIndex={-1} className="px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-(--content-max)">{children}</div>
      </main>

      {search ? (
        <CommandPalette
          {...search}
          open={paletteOpen}
          onOpenChange={(open) => {
            setPaletteOpen(open)
            // Ao fechar, zera a busca para a próxima abertura começar limpa.
            if (!open) search.onSearchChange?.('')
          }}
        />
      ) : null}
    </div>
  )
}
