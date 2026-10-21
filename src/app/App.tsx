import { createBrowserRouter, createMemoryRouter, RouterProvider, type RouteObject } from 'react-router'
import { Toaster, TooltipProvider } from '@/design-system'
import { HomePage } from '@/pages/HomePage'
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
  ? // Página hospedada: a URL não muda, então a navegação fica em memória. Abre direto no Design System.
    createMemoryRouter(routes, { initialEntries: ['/configuracoes/design-system'] })
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
