import { useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, EmptyState, PageHeader, SegmentedControl, StatusBadge, Text, Thumbnail } from '@/design-system'
import { userName } from '@/app/access/users'
import { getProductDetail, useCatalogVersion } from '@/app/products/detail'
import { PRODUCTS, FISCAL_LABEL, FISCAL_TONE, type Product } from '@/app/products/sample-products'
import { routes } from '@/app/navigation'
import { formatDateTime } from '@/lib/format'
import { usePageTitle } from '@/lib/usePageTitle'

type Filter = 'todas' | 'review' | 'adjust'

const link = (p: Product) => `${routes.product(p.id)}?aba=fiscal`

/** Data que importa em cada situação: quando entrou na fila ou quando o ajuste foi pedido. */
function sinceOf(p: Product) {
  const w = getProductDetail(p).extras.workflow
  return (p.fiscal === 'review' ? w.submittedAt : w.reviewedAt) ?? ''
}

/**
 * Fila da Tributação: produtos aguardando análise e os que voltaram com pedido de ajuste. Os mais antigos primeiro.
 * Clicar leva direto à aba Fiscal do produto, onde a Tributação revisa, aprova ou pede ajuste.
 */
export function TaxQueuePage() {
  usePageTitle('Tributação')
  const navigate = useNavigate()
  const catalog = useCatalogVersion()
  const [filter, setFilter] = useState<Filter>('review')

  const all = useMemo(
    () => PRODUCTS.filter((p) => p.fiscal === 'review' || p.fiscal === 'adjust'),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `catalog` muda quando algo é enviado, aprovado ou devolvido
    [catalog],
  )
  const data = useMemo(
    () => all.filter((p) => filter === 'todas' || p.fiscal === filter).sort((a, b) => sinceOf(a).localeCompare(sinceOf(b))),
    [all, filter],
  )
  const count = (s: 'review' | 'adjust') => all.filter((p) => p.fiscal === s).length

  const columns = useMemo<ColumnDef<Product, any>[]>( // eslint-disable-line @typescript-eslint/no-explicit-any
    () => [
      { id: 'photo', header: 'Foto', enableSorting: false, meta: { className: 'w-20 py-2' }, cell: ({ row }) => <Thumbnail src={row.original.photo} alt="" size="lg" /> },
      { accessorKey: 'sku', header: 'SKU', cell: ({ getValue }) => <Text as="span" variant="code">{getValue<string>()}</Text> },
      {
        accessorKey: 'title',
        header: 'Título',
        meta: { className: 'min-w-64' },
        cell: ({ row }) => (
          <RouterLink to={link(row.original)} onClick={(e) => e.stopPropagation()} className="rounded-xs font-semibold text-fg underline-offset-4 hover:text-link hover:underline">
            {row.original.title}
          </RouterLink>
        ),
      },
      { accessorKey: 'ncm', header: 'NCM', cell: ({ getValue }) => <Text as="span" variant="code">{getValue<string>() || '—'}</Text> },
      { accessorKey: 'department', header: 'Departamento' },
      { id: 'owner', accessorFn: (p: Product) => userName(p.owner), header: 'Responsável' },
      {
        id: 'status',
        accessorFn: (p: Product) => p.fiscal,
        header: 'Situação',
        cell: ({ row }) => <StatusBadge tone={FISCAL_TONE[row.original.fiscal]}>{FISCAL_LABEL[row.original.fiscal]}</StatusBadge>,
      },
      {
        id: 'since',
        accessorFn: (p: Product) => sinceOf(p),
        header: 'Desde',
        cell: ({ getValue }) => <span className="whitespace-nowrap tabular-nums">{getValue<string>() ? formatDateTime(getValue<string>()) : '—'}</span>,
      },
    ],
    [],
  )

  return (
    <>
      <PageHeader title="Tributação" />
      <DataTable
        caption="Produtos na fila da Tributação"
        data={data}
        columns={columns}
        getRowId={(p) => p.id}
        onRowClick={(p) => navigate(link(p))}
        showDensityToggle={false}
        defaultDensity="comfortable"
        pageSize={25}
        pageSizeOptions={[25, 50, 100]}
        maxHeight="max(24rem, calc(100dvh - 22rem))"
        emptyState={<EmptyState compact title={filter === 'adjust' ? 'Nenhum produto com ajuste pedido' : 'Fila vazia'} description="Os produtos enviados para a Tributação aparecem aqui." />}
        toolbar={
          <SegmentedControl
            aria-label="Filtrar a fila"
            value={filter}
            onValueChange={setFilter}
            options={[
              { value: 'review', label: `Aguardando análise (${count('review')})` },
              { value: 'adjust', label: `Ajuste pedido (${count('adjust')})` },
              { value: 'todas', label: 'Todas' },
            ]}
          />
        }
      />
    </>
  )
}
