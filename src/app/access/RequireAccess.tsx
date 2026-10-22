import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'
import { ShieldAlert } from 'lucide-react'
import { Button, EmptyState } from '@/design-system'
import { usePageTitle } from '@/lib/usePageTitle'
import { routes } from '../navigation'
import { can, type Action } from './permissions'
import { useSession } from './session'
import { ROLE_LABEL, type Role } from './users'

/** Mostra o conteúdo só se o perfil tem a permissão; senão, o aviso de acesso negado. */
export function RequireAccess({ action, children }: { action: Action; children: ReactNode }) {
  const user = useSession()
  return can(user, action) ? <>{children}</> : <AccessDenied role={user.role} />
}

function AccessDenied({ role }: { role: Role }) {
  usePageTitle('Acesso negado')
  return (
    <EmptyState
      headingLevel={1}
      icon={ShieldAlert}
      title="Você não tem acesso a esta página"
      description={`O perfil ${ROLE_LABEL[role]} não inclui esta área. Fale com um Admin se precisar dela.`}
      actions={<Button asChild variant="secondary"><RouterLink to={routes.home}>Voltar ao Início</RouterLink></Button>}
    />
  )
}
