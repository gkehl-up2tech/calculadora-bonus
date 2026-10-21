import { useMemo } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { Home, Monitor, Moon, Palette, Settings, Sun } from 'lucide-react'
import { AppShell, DropdownMenuItem, Logo, type CommandGroup } from '@/design-system'
import { setThemePreference } from '@/lib/theme'
import { navGroups } from './navigation'

const user = { name: 'Usuário UP2Tech', email: 'usuario@up2tech.com.br' }

/** Moldura de todas as páginas autenticadas. */
export function AppLayout() {
  const navigate = useNavigate()

  const commands = useMemo<CommandGroup[]>(
    () => [
      {
        id: 'go',
        heading: 'Ir para',
        items: [
          { id: 'go-home', label: 'Início', icon: Home, onSelect: () => navigate('/') },
          { id: 'go-settings', label: 'Configurações', icon: Settings, onSelect: () => navigate('/configuracoes') },
          { id: 'go-ds', label: 'Design System', icon: Palette, keywords: ['componentes', 'tokens', 'cores'], onSelect: () => navigate('/configuracoes/design-system') },
        ],
      },
      {
        id: 'theme',
        heading: 'Tema',
        items: [
          { id: 'theme-light', label: 'Tema claro', icon: Sun, onSelect: () => setThemePreference('light') },
          { id: 'theme-dark', label: 'Tema escuro', icon: Moon, onSelect: () => setThemePreference('dark') },
          { id: 'theme-system', label: 'Tema do sistema', icon: Monitor, onSelect: () => setThemePreference('system') },
        ],
      },
    ],
    [navigate],
  )

  return (
    <AppShell
      navGroups={navGroups}
      user={user}
      linkAs={NavLink}
      hrefProp="to"
      commands={commands}
      userMenu={<DropdownMenuItem icon={Settings} onSelect={() => navigate('/configuracoes')}>Configurações</DropdownMenuItem>}
      logo={
        <NavLink to="/" aria-label="UP2Tech — Início" className="rounded-md">
          <Logo />
        </NavLink>
      }
    >
      <Outlet />
    </AppShell>
  )
}
