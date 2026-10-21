import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { Home, Monitor, Moon, Package, Palette, Plug, Settings, Sun } from 'lucide-react'
import { AppShell, Button, DropdownMenuItem, Logo, type CommandGroup, type CommandItem } from '@/design-system'
import { setThemePreference } from '@/lib/theme'
import { searchProducts } from './products/search'
import { mainNav, routes, userMenuItems } from './navigation'

const user = { name: 'Usuário UP2Tech', email: 'usuario@up2tech.com.br' }

/** Mínimo de letras para consultar produtos (evita listar o catálogo inteiro ao digitar a primeira letra). */
const MIN_QUERY = 2

const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

/** Moldura de todas as páginas: cabeçalho (busca global), toggle de navegação e o conteúdo da rota. */
export function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [query, setQuery] = useState('')

  const groups = useMemo<CommandGroup[]>(() => {
    const q = normalize(query.trim())
    const match = (items: CommandItem[]) => items.filter((i) => !q || normalize(`${i.label} ${(i.keywords ?? []).join(' ')}`).includes(q))

    const products = q.length >= MIN_QUERY ? searchProducts(query) : []
    const pages = match([
      { id: 'go-home', label: 'Início', icon: Home, onSelect: () => navigate(routes.home) },
      { id: 'go-products', label: 'Produtos', icon: Package, keywords: ['catálogo', 'lista', 'todos os produtos'], onSelect: () => navigate(routes.products) },
      { id: 'go-connections', label: 'Conexões', icon: Plug, keywords: ['integrações'], onSelect: () => navigate(routes.connections) },
      { id: 'go-settings', label: 'Configurações', icon: Settings, onSelect: () => navigate(routes.settings) },
      { id: 'go-ds', label: 'Design System', icon: Palette, keywords: ['componentes', 'tokens', 'cores'], onSelect: () => navigate(routes.designSystem) },
    ])
    const theme = match([
      { id: 'theme-light', label: 'Tema claro', icon: Sun, onSelect: () => setThemePreference('light') },
      { id: 'theme-dark', label: 'Tema escuro', icon: Moon, onSelect: () => setThemePreference('dark') },
      { id: 'theme-system', label: 'Tema do sistema', icon: Monitor, onSelect: () => setThemePreference('system') },
    ])

    return [
      ...(products.length
        ? [{
            id: 'products',
            heading: 'Produtos',
            items: products.map<CommandItem>((p) => ({
              id: p.id,
              label: p.title,
              hint: `${p.sku} · ${p.ncm}`,
              icon: Package,
              onSelect: () => navigate(routes.product(p.id)),
            })),
          }]
        : []),
      ...(pages.length ? [{ id: 'go', heading: 'Ir para', items: pages }] : []),
      ...(theme.length ? [{ id: 'theme', heading: 'Tema', items: theme }] : []),
    ]
  }, [query, navigate])

  return (
    <AppShell
      nav={mainNav}
      // "Novo produto" fica na linha do toggle, só em Início e Produtos.
      navActions={
        pathname === routes.home || pathname === routes.products ? (
          <Button onClick={() => navigate(routes.newProduct)}>Novo produto</Button>
        ) : undefined
      }
      user={user}
      linkAs={NavLink}
      hrefProp="to"
      search={{
        groups,
        onSearchChange: setQuery,
        placeholder: 'Buscar produto por nome, SKU ou NCM…',
        emptyText: 'Nenhum produto ou página encontrado.',
      }}
      userMenu={userMenuItems.map((item) => (
        <DropdownMenuItem key={item.id} icon={item.icon} onSelect={() => navigate(item.href)}>
          {item.label}
        </DropdownMenuItem>
      ))}
      logo={
        <NavLink to={routes.home} aria-label="UP2Tech — Início" className="rounded-md">
          <Logo wordmarkOnly />
        </NavLink>
      }
    >
      <Outlet />
    </AppShell>
  )
}
