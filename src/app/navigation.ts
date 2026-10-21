import { Home, Palette, Settings, SlidersHorizontal } from 'lucide-react'
import type { NavEntry, NavGroup } from '@/design-system'

/** Menu principal. Novos módulos entram aqui — uma linha por item. */
export const navGroups: NavGroup[] = [
  {
    id: 'main',
    items: [{ id: 'home', label: 'Início', href: '/', icon: Home, end: true }],
  },
  {
    id: 'system',
    label: 'Sistema',
    items: [{ id: 'settings', label: 'Configurações', href: '/configuracoes', icon: Settings }],
  },
]

/** Navegação secundária dentro de Configurações. */
export const settingsItems: NavEntry[] = [
  { id: 'general', label: 'Geral', href: '/configuracoes', icon: SlidersHorizontal, end: true },
  { id: 'design-system', label: 'Design System', href: '/configuracoes/design-system', icon: Palette },
]
