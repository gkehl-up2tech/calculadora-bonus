import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, EmptyState, PageHeader, SegmentedControl, StatusBadge, Text } from '@/design-system'
import { can } from '@/app/access/permissions'
import { useSession } from '@/app/access/session'
import {
  REQUEST_STATUS_LABEL, REQUEST_STATUS_TONE, findRequest, requestsFor, requesterName, useRequestsVersion, type RegistrationRequest, type RequestStatus,
} from '@/app/requests/requests'
import { formatDateTime } from '@/lib/format'
import { usePageTitle } from '@/lib/usePageTitle'
import { NewProductDialog } from '@/pages/products/NewProductDialog'
import { RequestDialog } from './RequestDialog'

type Filter = RequestStatus | 'todas'

/** Urgentes primeiro, depois as mais antigas (quem espera há mais tempo). As já resolvidas, da mais recente. */
function order(a: RegistrationRequest, b: RegistrationRequest) {
  if (a.status === 'pending' && b.status === 'pending') return Number(b.urgent) - Number(a.urgent) || a.requestedAt.localeCompare(b.requestedAt)
  return b.requestedAt.localeCompare(a.requestedAt)
}

/**
 * Solicitações de cadastro. A equipe de cadastro (e o Admin) vê todas e atende; o gerente de produto vê as próprias
 * e acompanha a devolutiva (atendida, com o produto, ou recusada, com o motivo).
 */
export function RequestsPage() {
  usePageTitle('Solicitações')
  const user = useSession()
  const version = useRequestsVersion()
  const handler = can(user, 'request.handle')
  const [filter, setFilter] = useState<Filter>('pending')
  const [openId, setOpenId] = useState<string | null>(null)
  const [creating, setCreating] = useState<string | null>(null)

  const all = useMemo(
    () => requestsFor(user),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `version` muda quando algo é solicitado, atendido ou recusado
    [user, version],
  )
  const data = useMemo(() => all.filter((r) => filter === 'todas' || r.status === filter).sort(order), [all, filter])
  const count = (s: RequestStatus) => all.filter((r) => r.status === s).length
  const opened = openId ? (findRequest(openId) ?? null) : null
  const creatingRequest = creating ? findRequest(creating) : undefined

  const columns = useMemo<ColumnDef<RegistrationRequest, any>[]>( // eslint-disable-line @typescript-eslint/no-explicit-any
    () => [
      {
        id: 'urgent',
        accessorFn: (r: RegistrationRequest) => Number(r.urgent),
        header: 'Prioridade',
        cell: ({ row }) => (row.original.urgent ? <StatusBadge tone="danger">Urgente</StatusBadge> : <span className="text-fg-muted">Normal</span>),
      },
      {
        accessorKey: 'title',
        header: 'Título',
        meta: { className: 'min-w-64' },
        cell: ({ row }) => (
          <button type="button" onClick={(e) => { e.stopPropagation(); setOpenId(row.original.id) }} className="rounded-xs text-left font-semibold text-fg underline-offset-4 hover:text-link hover:underline">
            {row.original.title}
          </button>
        ),
      },
      { accessorKey: 'departamento', header: 'Departamento' },
      { accessorKey: 'categoria', header: 'Categoria' },
      { id: 'requester', accessorFn: (r: RegistrationRequest) => requesterName(r), header: 'Solicitante' },
      {
        id: 'at',
        accessorFn: (r: RegistrationRequest) => r.requestedAt,
        header: 'Solicitada em',
        cell: ({ getValue }) => <span className="whitespace-nowrap tabular-nums">{formatDateTime(getValue<string>())}</span>,
      },
      {
        id: 'status',
        accessorFn: (r: RegistrationRequest) => r.status,
        header: 'Situação',
        cell: ({ row }) => <StatusBadge tone={REQUEST_STATUS_TONE[row.original.status]}>{REQUEST_STATUS_LABEL[row.original.status]}</StatusBadge>,
      },
    ],
    [],
  )

  return (
    <>
      <PageHeader title="Solicitações" />
      <DataTable
        caption={handler ? 'Solicitações de cadastro' : 'Suas solicitações de cadastro'}
        data={data}
        columns={columns}
        getRowId={(r) => r.id}
        onRowClick={(r) => setOpenId(r.id)}
        showDensityToggle={false}
        defaultDensity="comfortable"
        pageSize={25}
        pageSizeOptions={[25, 50, 100]}
        maxHeight="max(24rem, calc(100dvh - 22rem))"
        emptyState={
          <EmptyState
            compact
            title={filter === 'pending' ? 'Nenhuma solicitação pendente' : 'Nada por aqui'}
            description={handler ? 'As solicitações dos gerentes de produto aparecem aqui.' : 'Use Solicitar cadastro para pedir um produto novo.'}
          />
        }
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedControl
              aria-label="Filtrar solicitações"
              value={filter}
              onValueChange={setFilter}
              options={[
                { value: 'pending', label: `Pendentes (${count('pending')})` },
                { value: 'done', label: `Atendidas (${count('done')})` },
                { value: 'rejected', label: `Recusadas (${count('rejected')})` },
                { value: 'todas', label: 'Todas' },
              ]}
            />
            {!handler ? <Text variant="small" tone="muted">Somente as suas solicitações.</Text> : null}
          </div>
        }
      />

      <RequestDialog
        request={opened}
        onOpenChange={(o) => !o && setOpenId(null)}
        onCreateProduct={(r) => {
          setOpenId(null)
          setCreating(r.id)
        }}
      />
      <NewProductDialog open={creatingRequest !== undefined && creatingRequest.status === 'pending'} onOpenChange={(o) => !o && setCreating(null)} request={creatingRequest} />
    </>
  )
}
