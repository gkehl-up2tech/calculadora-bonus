import { createBrowserRouter, createMemoryRouter, RouterProvider, type RouteObject } from 'react-router'
import { Toaster, TooltipProvider } from '@/design-system'
import { ConnectionsPage } from '@/pages/ConnectionsPage'
import { HomePage } from '@/pages/home/HomePage'
import { ProductPage } from '@/pages/products/ProductPage'
import { ProductsPage } from '@/pages/products/ProductsPage'
import { DesignSystemPage } from '@/pages/design-system/DesignSystemPage'
import { SettingsGeneralPage } from '@/pages/settings/SettingsGeneralPage'
import { SettingsRoute } from '@/pages/settings/SettingsRoute'
import { EMBEDDED } from '@/lib/embedded'
import { AppLayout } from './AppLayout'

const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'produtos', element: <ProductsPage /> },
      // Sem item de menu: só pela lista de produtos, pela busca global ou pelo botão "Novo produto" do Início.
      { path: 'produtos/novo', element: <ProductPage isNew /> },
      { path: 'produtos/:produtoId', element: <ProductPage /> },
      { path: 'conexoes', element: <ConnectionsPage /> },
      {
        path: 'configuracoes',
        element: <SettingsRoute />,
        children: [
          { index: true, element: <SettingsGeneralPage /> },
          { path: 'design-system', element: <DesignSystemPage /> },
        ],
      },
    ],
  },
]

const router = EMBEDDED
  ? // Página hospedada: a URL não muda, então a navegação fica em memória.
    createMemoryRouter(routes, { initialEntries: ['/'] })
  : // BASE_URL permite publicar em subcaminho (ex.: GitHub Pages).
    createBrowserRouter(routes, { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' })

export function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster />
    </TooltipProvider>
  )
}
