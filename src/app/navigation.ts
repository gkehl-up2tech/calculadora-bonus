import { Palette, Plug, Settings, SlidersHorizontal } from 'lucide-react'
import type { NavEntry } from '@/design-system'

/**
 * Rotas do sistema. A página do produto (/produtos/:produtoId) NÃO aparece em nenhum menu:
 * só se chega a ela pela lista "Todos os produtos" ou pela busca global.
 */
export const routes = {
  home: '/',
  products: '/produtos',
  product: (id: string) => `/produtos/${id}`,
  newProduct: '/produtos/novo',
  connections: '/conexoes',
  settings: '/configuracoes',
  designSystem: '/configuracoes/design-system',
} as const

/** Navegação principal: o toggle exibido acima do PageHeader de cada página (sem ícones). */
export const mainNav: NavEntry[] = [
  { id: 'home', label: 'Início', href: routes.home, end: true },
  // end: na página do produto (/produtos/:id) nenhum item do menu fica marcado como "página atual".
  { id: 'products', label: 'Todos os produtos', href: routes.products, end: true },
]

/** Destinos do menu do usuário (ícone de perfil no cabeçalho). */
export const userMenuItems = [
  { id: 'connections', label: 'Conexões', href: routes.connections, icon: Plug },
  { id: 'settings', label: 'Configurações', href: routes.settings, icon: Settings },
] as const

/** Abas dentro de Configurações. */
export const settingsItems: NavEntry[] = [
  { id: 'general', label: 'Geral', href: routes.settings, icon: SlidersHorizontal, end: true },
  { id: 'design-system', label: 'Design System', href: routes.designSystem, icon: Palette },
]
