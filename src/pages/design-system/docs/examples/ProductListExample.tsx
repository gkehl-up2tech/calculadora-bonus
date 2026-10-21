import { useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Copy, Download, MoreHorizontal, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'
import {
  Badge, Button, ConfirmDialog, DataTable, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger, FilterBar, IconButton, ListPage, Select, StatusBadge, Text, toast, type ActiveFilter,
} from '@/design-system'
import { formatBRL, formatNumber } from '@/lib/format'
import { CATEGORIES, PRODUCTS, STATUS_LABEL, STATUS_TONE, type Product, type ProductStatus } from '../sample-data'

const ALL = 'all'

/** Lista de produtos: FilterBar + DataTable (+ ListPage quando `page`). Todos os dados são ilustrativos. */
export function ProductListExample({ page = false, caption = 'Produtos' }: { page?: boolean; caption?: string }) {
  const [rows, setRows] = useState<Product[]>(PRODUCTS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(ALL)
  const [status, setStatus] = useState<string>(ALL)
  const [loading, setLoading] = useState(false)
  const [toDelete, setToDelete] = useState<Product[] | null>(null)

  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoading(false), 1400)
    return () => clearTimeout(t)
  }, [loading])

  // Memoizado: a DataTable volta à página 1 quando `data` muda de referência.
  const data = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter(
      (p) =>
        (category === ALL || p.category === category) &&
        (status === ALL || p.status === status) &&
        (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.ncm.includes(q)),
    )
  }, [rows, search, category, status])

  const columns = useMemo<ColumnDef<Product, any>[]>( // eslint-disable-line @typescript-eslint/no-explicit-any
    () => [
      {
        accessorKey: 'name',
        header: 'Produto',
        meta: { className: 'min-w-52' },
        cell: ({ row }) => (
          <div className="min-w-0 py-1">
            <Text weight="semibold" truncate className="max-w-72">{row.original.name}</Text>
            <Text variant="caption" truncate>{row.original.sku}</Text>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const s = getValue<ProductStatus>()
          return <StatusBadge tone={STATUS_TONE[s]}>{STATUS_LABEL[s]}</StatusBadge>
        },
      },
      { accessorKey: 'category', header: 'Categoria' },
      { accessorKey: 'ncm', header: 'NCM', cell: ({ getValue }) => <Text as="span" variant="code">{getValue<string>()}</Text> },
      { accessorKey: 'price', header: 'Preço', meta: { align: 'right' }, cell: ({ getValue }) => formatBRL(getValue<number>()) },
      {
        accessorKey: 'stock',
        header: 'Estoque',
        meta: { align: 'right' },
        cell: ({ getValue }) => {
          const n = getValue<number>()
          return n === 0 ? <Badge tone="danger" size="sm">Sem estoque</Badge> : formatNumber(n)
        },
      },
      {
        id: 'actions',
        enableSorting: false,
        header: () => <span className="sr-only">Ações</span>,
        meta: { align: 'right', className: 'w-12' },
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton icon={MoreHorizontal} label={`Ações de ${row.original.name}`} size="sm" onClick={(e) => e.stopPropagation()} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem icon={Pencil} onSelect={() => toast.info(`Editar ${row.original.sku}`)}>Editar</DropdownMenuItem>
              <DropdownMenuItem icon={Copy} onSelect={() => toast.success('Produto duplicado')}>Duplicar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={Trash2} destructive onSelect={() => setToDelete([row.original])}>Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  )

  const activeFilters: ActiveFilter[] = [
    ...(category !== ALL ? [{ id: 'category', label: `Categoria: ${category}` }] : []),
    ...(status !== ALL ? [{ id: 'status', label: `Status: ${STATUS_LABEL[status as ProductStatus]}` }] : []),
  ]
  const clearAll = () => {
    setSearch('')
    setCategory(ALL)
    setStatus(ALL)
  }

  const filters = (
    <FilterBar
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Buscar por nome, SKU ou NCM"
      activeFilters={activeFilters}
      onRemoveFilter={(id) => (id === 'category' ? setCategory(ALL) : setStatus(ALL))}
      onClearAll={clearAll}
      filters={
        <>
          <Select
            aria-label="Categoria"
            className="sm:w-48"
            value={category}
            onValueChange={setCategory}
            options={[{ value: ALL, label: 'Todas as categorias' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
          />
          <Select
            aria-label="Status"
            className="sm:w-40"
            value={status}
            onValueChange={setStatus}
            options={[{ value: ALL, label: 'Todos os status' }, ...(['active', 'inactive', 'draft'] as const).map((s) => ({ value: s, label: STATUS_LABEL[s] }))]}
          />
        </>
      }
    />
  )

  const table = (
    <>
      <DataTable
        caption={caption}
        data={data}
        columns={columns}
        getRowId={(p) => p.id}
        selectable
        loading={loading}
        actions={
          <>
            <Button variant="secondary" size="sm" leadingIcon={<RefreshCw aria-hidden />} onClick={() => setLoading(true)}>Atualizar</Button>
            <Button variant="secondary" size="sm" leadingIcon={<Download aria-hidden />} onClick={() => toast.success('Exportação iniciada')} className="max-sm:hidden">Exportar</Button>
          </>
        }
        bulkActions={(selected, clear) => (
          <>
            <Button variant="secondary" size="sm" leadingIcon={<Download aria-hidden />} onClick={() => { toast.success(`${selected.length} produtos exportados`); clear() }}>Exportar</Button>
            <Button variant="danger-ghost" size="sm" leadingIcon={<Trash2 aria-hidden />} onClick={() => setToDelete(selected)}>Excluir</Button>
          </>
        )}
        onRowClick={(p) => toast.info(`Abrir ${p.name}`)}
      />
      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
        tone="danger"
        title={toDelete && toDelete.length > 1 ? `Excluir ${toDelete.length} produtos?` : 'Excluir produto?'}
        description="Esta ação não pode ser desfeita. Produtos com movimentações fiscais devem ser inativados, não excluídos."
        confirmLabel="Excluir"
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 700))
          const ids = new Set(toDelete?.map((p) => p.id))
          setRows((r) => r.filter((p) => !ids.has(p.id)))
          toast.success(ids.size > 1 ? `${ids.size} produtos excluídos` : 'Produto excluído')
        }}
      />
    </>
  )

  if (!page) {
    return (
      <div className="grid w-full gap-4">
        {filters}
        {table}
        {rows.length < PRODUCTS.length ? <Button variant="ghost" size="sm" className="justify-self-start" onClick={() => setRows(PRODUCTS)}>Restaurar dados de exemplo</Button> : null}
      </div>
    )
  }

  return (
    <ListPage
      header={{
        title: 'Produtos',
        headingLevel: 5,
        description: 'Catálogo fiscal e comercial. Busque, filtre e edite em lote.',
        breadcrumb: { label: 'Trilha do exemplo de lista', items: [{ label: 'Início', href: '#' }, { label: 'Produtos' }] },
        actions: <Button leadingIcon={<Plus aria-hidden />}>Novo produto</Button>,
      }}
      filters={filters}
    >
      {table}
    </ListPage>
  )
}
