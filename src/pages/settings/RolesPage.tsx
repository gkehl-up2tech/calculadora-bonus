import { Check, Minus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Heading, Icon, Text } from '@/design-system'
import { PERMISSIONS, ROLE_PERMISSIONS } from '@/app/access/permissions'
import { ROLES, ROLE_LABEL, ROLE_SUMMARY, USERS, useUsersVersion } from '@/app/access/users'
import { usePageTitle } from '@/lib/usePageTitle'

const groups = [...new Set(PERMISSIONS.map((p) => p.group))]

/** Configurações › Papéis: o que cada papel pode fazer. Papéis fixos, montados por permissões (somente leitura por enquanto). */
export function RolesPage() {
  usePageTitle('Papéis · Configurações')
  useUsersVersion()
  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <Heading level={2} size="lg">Papéis e permissões</Heading>
        <Text tone="muted">Cada papel é um conjunto de permissões. Os papéis são fixos; para mudar a pessoa de papel, use Usuários.</Text>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ROLES.map((r) => {
          const people = USERS.filter((u) => u.active && u.role === r)
          return (
            <li key={r}>
              <Card className="h-full">
                <CardHeader>
                  <div>
                    <CardTitle level={3}>{ROLE_LABEL[r]}</CardTitle>
                    <CardDescription>{ROLE_SUMMARY[r]}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Text variant="small" tone="muted">{people.length === 0 ? 'Nenhuma pessoa ativa.' : people.map((p) => p.name).join(', ')}</Text>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>

      <div className="relative overflow-x-auto rounded-lg bg-surface shadow-border" role="region" aria-label="Matriz de permissões por papel" tabIndex={0}>
        <table className="w-full min-w-2xl border-collapse text-left text-sm">
          <caption className="sr-only">Permissões de cada papel</caption>
          <thead className="bg-subtle">
            <tr>
              <th scope="col" className="h-10 px-4 text-xs font-semibold text-fg-muted">Permissão</th>
              {ROLES.map((r) => <th key={r} scope="col" className="h-10 px-3 text-center text-xs font-semibold whitespace-nowrap text-fg-muted">{ROLE_LABEL[r]}</th>)}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g}>
              <tr><th scope="colgroup" colSpan={ROLES.length + 1} className="border-t border-line-subtle bg-canvas px-4 py-2 text-xs font-semibold tracking-wide text-fg-subtle uppercase">{g}</th></tr>
              {PERMISSIONS.filter((p) => p.group === g).map((p) => (
                <tr key={p.id} className="border-t border-line-subtle">
                  <th scope="row" className="px-4 py-2.5 text-left font-normal">{p.label}</th>
                  {ROLES.map((r) => {
                    const yes = ROLE_PERMISSIONS[r].includes(p.id)
                    return (
                      <td key={r} className="px-3 py-2.5 text-center">
                        <Icon icon={yes ? Check : Minus} size="sm" className={yes ? 'text-tone-success-fg' : 'text-fg-subtle'} />
                        <span className="sr-only">{yes ? 'Sim' : 'Não'}</span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <Text variant="small" tone="muted">“Próprios” = produtos de que a pessoa é responsável. Criar papéis personalizados é uma evolução prevista: as regras já são montadas por permissões. Estas regras controlam a interface; a verificação real precisa existir também no servidor.</Text>
    </div>
  )
}
