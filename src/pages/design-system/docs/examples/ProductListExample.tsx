import { useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Copy, Download, MoreHorizontal, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import {
  Button, ConfirmDialog, DataTable, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger, IconButton, SearchField, Select, StatusBadge, Text, toast,
} from '@/design-system'
import { DEPARTMENTS, PRODUCTS, STATUS_LABEL, STATUS_TONE, type Product, type ProductStatus } from '../sample-data'

const ALL = 'all'

/** Lista de produtos com busca, filtros, seleção em lote e exclusão confirmada. Todos os dados são ilustrativos. */
export function ProductListExample({ caption = 'Produtos' }: { caption?: string }) {
  const [rows, setRows] = useState<Product[]>(PRODUCTS)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState(ALL)
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
        (department === ALL || p.department === department) &&
        (status === ALL || p.status === status) &&
        (!q || p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.ncm.includes(q)),
    )
  }, [rows, search, department, status])

  const columns = useMemo<ColumnDef<Product, any>[]>( // eslint-disable-line @typescript-eslint/no-explicit-any
    () => [
      {
        accessorKey: 'title',
        header: 'Produto',
        meta: { className: 'min-w-52' },
        cell: ({ row }) => (
          <div className="min-w-0 py-1">
            <Text weight="semibold" truncate className="max-w-72">{row.original.title}</Text>
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
      { accessorKey: 'department', header: 'Departamento' },
      { accessorKey: 'ncm', header: 'NCM', cell: ({ getValue }) => <Text as="span" variant="code">{getValue<string>()}</Text> },
      {
        id: 'actions',
        enableSorting: false,
        header: () => <span className="sr-only">Ações</span>,
        meta: { align: 'right', className: 'w-12' },
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton icon={MoreHorizontal} label={`Ações de ${row.original.title}`} size="sm" onClick={(e) => e.stopPropagation()} />
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

  return (
    <div className="grid w-full gap-4">
      <DataTable
        caption={caption}
        data={data}
        columns={columns}
        getRowId={(p) => p.id}
        selectable
        loading={loading}
        toolbar={
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <div className="min-w-0 flex-1 basis-56 sm:max-w-xs">
              <SearchField value={search} onValueChange={setSearch} aria-label="Buscar na tabela" placeholder="Título, SKU ou NCM" />
            </div>
            <Select
              aria-label="Departamento"
              className="sm:w-48"
              value={department}
              onValueChange={setDepartment}
              options={[{ value: ALL, label: 'Todos os departamentos' }, ...DEPARTMENTS.map((c) => ({ value: c, label: c }))]}
            />
            <Select
              aria-label="Status"
              className="sm:w-40"
              value={status}
              onValueChange={setStatus}
              options={[{ value: ALL, label: 'Todos os status' }, ...(['active', 'inactive', 'draft'] as const).map((s) => ({ value: s, label: STATUS_LABEL[s] }))]}
            />
          </div>
        }
        actions={
          <>
            <Button variant="secondary" size="sm" leadingIcon={<RefreshCw aria-hidden />} onClick={() => setLoading(true)}>Atualizar</Button>
            <Button variant="secondary" size="sm" leadingIcon={<Download aria-hidden />} onClick={() => toast.success('Exportação iniciada')} className="max-sm:hidden">Exportar</Button>
          </>
        }
        bulkActions={(selected, clear) => (
          <>
            <Button variant="secondary" size="sm" leadingIcon={<Download aria-hidden />} onClick={() => { toast.success(`${selected.length} produtos exportados`); clear() }}>Exportar</Button>
            <Button variant="danger" size="sm" leadingIcon={<Trash2 aria-hidden />} onClick={() => setToDelete(selected)}>Excluir</Button>
          </>
        )}
        onRowClick={(p) => toast.info(`Abrir ${p.title}`)}
      />
      {rows.length < PRODUCTS.length ? <Button variant="ghost" size="sm" className="justify-self-start" onClick={() => setRows(PRODUCTS)}>Restaurar dados de exemplo</Button> : null}
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
    </div>
  )
}
