import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { Home, Monitor, Moon, Package, Palette, Plug, Plus, Settings, Sun } from 'lucide-react'
import {
  AppShell, Button, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, Logo,
  toast, type CommandGroup, type CommandItem,
} from '@/design-system'
import { setThemePreference } from '@/lib/theme'
import { can } from './access/permissions'
import { setSession, useSession } from './access/session'
import { ROLE_LABEL, USERS } from './access/users'
import { NewProductDialog } from '@/pages/products/NewProductDialog'
import { searchProducts } from './products/search'
import { mainNav, routes, userMenuItems } from './navigation'

/** Mínimo de letras para consultar produtos (evita listar o catálogo inteiro ao digitar a primeira letra). */
const MIN_QUERY = 2

const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

/** Moldura de todas as páginas: cabeçalho (busca global), toggle de navegação e o conteúdo da rota. */
export function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = useSession()
  const [query, setQuery] = useState('')
  const [newOpen, setNewOpen] = useState(false)

  const groups = useMemo<CommandGroup[]>(() => {
    const q = normalize(query.trim())
    const match = (items: CommandItem[]) => items.filter((i) => !q || normalize(`${i.label} ${(i.keywords ?? []).join(' ')}`).includes(q))

    const products = q.length >= MIN_QUERY ? searchProducts(query) : []
    const pages = match([
      { id: 'go-home', label: 'Início', icon: Home, onSelect: () => navigate(routes.home) },
      { id: 'go-products', label: 'Produtos', icon: Package, keywords: ['catálogo', 'lista', 'todos os produtos'], onSelect: () => navigate(routes.products) },
      ...(can(user, 'product.create') ? [{ id: 'new-product', label: 'Novo produto', icon: Plus, keywords: ['cadastrar', 'criar', 'adicionar'], onSelect: () => setNewOpen(true) }] : []),
      ...(can(user, 'connections.view') ? [{ id: 'go-connections', label: 'Conexões', icon: Plug, keywords: ['integrações'], onSelect: () => navigate(routes.connections) }] : []),
      ...(can(user, 'settings.view')
        ? [
            { id: 'go-settings', label: 'Configurações', icon: Settings, onSelect: () => navigate(routes.settings) },
            { id: 'go-ds', label: 'Design System', icon: Palette, keywords: ['componentes', 'tokens', 'cores'], onSelect: () => navigate(routes.designSystem) },
          ]
        : []),
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
  }, [query, navigate, user])

  return (
    <AppShell
      nav={mainNav}
      // "Novo produto" fica na linha do toggle, só em Início e Produtos.
      navActions={
        can(user, 'product.create') && (pathname === routes.home || pathname === routes.products) ? (
          <Button onClick={() => setNewOpen(true)}>Novo produto</Button>
        ) : undefined
      }
      user={{ name: user.name, email: user.email, role: ROLE_LABEL[user.role] }}
      linkAs={NavLink}
      hrefProp="to"
      search={{
        groups,
        onSearchChange: setQuery,
        placeholder: 'Buscar produto por nome, SKU ou NCM…',
        emptyText: 'Nenhum produto ou página encontrado.',
      }}
      userMenu={
        <>
          {userMenuItems.filter((item) => can(user, item.access)).map((item) => (
            <DropdownMenuItem key={item.id} icon={item.icon} onSelect={() => navigate(item.href)}>
              {item.label}
            </DropdownMenuItem>
          ))}
          {/* Provisório: sem login, o perfil de demonstração é escolhido aqui. */}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Entrar como (demonstração)</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={user.id}
            onValueChange={(id) => {
              setSession(id)
              const next = USERS.find((u) => u.id === id)
              if (next) toast.info(`Agora você é ${next.name}`, { description: ROLE_LABEL[next.role] })
            }}
          >
            {USERS.map((u) => (
              <DropdownMenuRadioItem key={u.id} value={u.id}>
                <span className="grid min-w-0 leading-tight">
                  <span className="truncate">{u.name}</span>
                  <span className="truncate text-xs text-fg-muted">{ROLE_LABEL[u.role]}</span>
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </>
      }
      logo={
        <NavLink to={routes.home} aria-label="UP2Tech — Início" className="rounded-md">
          <Logo wordmarkOnly />
        </NavLink>
      }
    >
      <Outlet />
      <NewProductDialog open={newOpen} onOpenChange={setNewOpen} />
    </AppShell>
  )
}
