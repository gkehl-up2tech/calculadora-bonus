import { NavLink, Outlet } from 'react-router'
import { SettingsLayout } from '@/design-system'
import { settingsItems } from '@/app/navigation'

/** Moldura de Configurações: navegação secundária + conteúdo da sub-rota. */
export function SettingsRoute() {
  return (
    <SettingsLayout items={settingsItems} linkAs={NavLink} hrefProp="to">
      <Outlet />
    </SettingsLayout>
  )
}
