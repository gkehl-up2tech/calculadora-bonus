import { createBrowserRouter, RouterProvider } from 'react-router'
import { Toaster, TooltipProvider } from '@/design-system'
import { HomePage } from '@/pages/HomePage'
import { DesignSystemPage } from '@/pages/design-system/DesignSystemPage'
import { SettingsGeneralPage } from '@/pages/settings/SettingsGeneralPage'
import { SettingsRoute } from '@/pages/settings/SettingsRoute'
import { AppLayout } from './AppLayout'

const router = createBrowserRouter(
  [
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
  ],
  // BASE_URL permite publicar em subcaminho (ex.: GitHub Pages).
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)

export function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster />
    </TooltipProvider>
  )
}
