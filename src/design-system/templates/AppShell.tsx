import { useState, type ElementType, type ReactNode } from 'react'
import { Sheet, SheetContent } from '../molecules'
import { AppHeader, CommandPalette, SidebarNav, type CommandGroup, type NavGroup } from '../organisms'
import { Logo } from '../atoms'

export interface AppShellProps {
  navGroups: NavGroup[]
  user: { name: string; email?: string }
  userMenu?: ReactNode
  commands?: CommandGroup[]
  linkAs?: ElementType
  hrefProp?: 'href' | 'to'
  currentPath?: string
  /** Link do logotipo (por padrão, uma âncora para "/"). */
  logo?: ReactNode
  children: ReactNode
}

/**
 * Estrutura global: link "pular para o conteúdo", cabeçalho fixo, menu lateral (desktop) ou gaveta (celular),
 * paleta de comandos e a área principal.
 */
export function AppShell({ navGroups, user, userMenu, commands = [], linkAs, hrefProp, currentPath, logo, children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)
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
        logo={logo ?? <Logo />}
        user={user}
        userMenu={userMenu}
        onMenuClick={() => setMenuOpen(true)}
        onSearchClick={() => setPaletteOpen(true)}
      />

      <div className="lg:grid lg:grid-cols-[var(--sidebar-w)_minmax(0,1fr)]">
        <aside className="sticky top-header hidden h-[calc(100dvh-var(--header-h))] overflow-y-auto overscroll-contain border-r border-line-subtle bg-surface p-3 lg:block">
          <SidebarNav groups={navGroups} linkAs={linkAs} hrefProp={hrefProp} currentPath={currentPath} />
        </aside>

        <main id="conteudo" tabIndex={-1} className="min-w-0 px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-(--content-max)">{children}</div>
        </main>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent title="Menu" side="left" hideTitle>
          <div className="px-3 pb-3">
            <div className="px-3 pb-4"><Logo /></div>
            <SidebarNav groups={navGroups} linkAs={linkAs} hrefProp={hrefProp} currentPath={currentPath} onNavigate={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} groups={commands} />
    </div>
  )
}
