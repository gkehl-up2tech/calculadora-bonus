import { useState, type ReactNode } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, Rows2, Rows3, Rows4, SearchX } from 'lucide-react'
import { Button, Checkbox, Icon, NativeSelect, Skeleton, Text } from '../atoms'
import { EmptyState, Pagination, SegmentedControl } from '../molecules'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Alinhamento do conteúdo. Números e valores monetários: 'right'. */
    align?: 'left' | 'center' | 'right'
    /** Classes extras da célula (ex.: largura máxima + truncate). */
    className?: string
  }
}

export type Density = 'compact' | 'comfortable' | 'spacious'

/** Alturas de linha (px): 32 / 40 / 48. */
const rowHeight: Record<Density, string> = { compact: 'h-8', comfortable: 'h-10', spacious: 'h-12' }

export interface DataTableProps<T> {
  data: T[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- colunas com accessorKey têm TValue distintos por coluna
  columns: ColumnDef<T, any>[]
  getRowId: (row: T) => string
  /** Nome acessível da tabela (leitores de tela). */
  caption: string
  loading?: boolean
  selectable?: boolean
  /** Barra de ações em lote: aparece no lugar da toolbar quando há linhas selecionadas. */
  bulkActions?: (selected: T[], clear: () => void) => ReactNode
  /** Esquerda da toolbar (busca, filtros). */
  toolbar?: ReactNode
  /** Direita da toolbar (exportar, nova linha…). */
  actions?: ReactNode
  defaultDensity?: Density
  showDensityToggle?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  emptyState?: ReactNode
  onRowClick?: (row: T) => void
  /** Altura máxima da área rolável; o cabeçalho fica fixo. */
  maxHeight?: string
  className?: string
}

/**
 * Tabela de dados corporativa. Passe `data` MEMOIZADO (useMemo) — mudar a referência volta à página 1.
 * Clique na linha é só um atalho: a ação principal deve existir também como link/botão dentro da linha.
 */
export function DataTable<T>({
  data,
  columns,
  getRowId,
  caption,
  loading,
  selectable,
  bulkActions,
  toolbar,
  actions,
  defaultDensity = 'comfortable',
  showDensityToggle = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  emptyState,
  onRowClick,
  maxHeight,
  className,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [density, setDensity] = useState<Density>(defaultDensity)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: initialPageSize })

  const selectColumn: ColumnDef<T, unknown> = {
    id: '__select',
    enableSorting: false,
    meta: { className: 'w-11' },
    header: ({ table }) => (
      <Checkbox
        aria-label="Selecionar todas as linhas da página"
        checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(v === true)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Selecionar linha ${row.index + 1}`}
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(v === true)}
        onClick={(e) => e.stopPropagation()}
      />
    ),
  }

  // TanStack Table devolve funções não memoizáveis; o React Compiler apenas ignora este componente (comportamento esperado).
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<T>({
    data,
    columns: selectable ? [selectColumn, ...columns] : columns,
    getRowId,
    state: { sorting, rowSelection, pagination },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    enableRowSelection: selectable,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const selected = table.getSelectedRowModel().rows.map((r) => r.original)
  const clearSelection = () => table.resetRowSelection()
  const total = data.length
  const rows = table.getRowModel().rows
  const from = total === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const to = Math.min(total, (pagination.pageIndex + 1) * pagination.pageSize)
  const colCount = table.getVisibleLeafColumns().length
  const bulkMode = selectable && bulkActions && selected.length > 0

  return (
    <div className={cn('overflow-hidden rounded-lg bg-surface shadow-card', className)}>
      {/* Toolbar ⇄ barra de lote: mesma altura para não deslocar a tabela. */}
      {toolbar || actions || showDensityToggle || bulkMode ? (
        <div className="flex min-h-14 flex-wrap items-center gap-2 border-b border-line-subtle px-3 py-2">
          {bulkMode ? (
            <div className="flex w-full items-center gap-3" role="region" aria-label="Ações em lote" aria-live="polite">
              <Text weight="semibold" tabular>
                {formatNumber(selected.length)} {selected.length === 1 ? 'selecionado' : 'selecionados'}
              </Text>
              <div className="flex flex-wrap items-center gap-2">{bulkActions(selected, clearSelection)}</div>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={clearSelection}>Limpar seleção</Button>
            </div>
          ) : (
            <>
              <div className="flex min-w-0 flex-1 items-center gap-2">{toolbar}</div>
              <div className="flex items-center gap-2">
                {actions}
                {showDensityToggle ? (
                  <SegmentedControl
                    aria-label="Densidade das linhas"
                    size="sm"
                    value={density}
                    onValueChange={setDensity}
                    className="max-sm:hidden"
                    options={[
                      { value: 'compact', ariaLabel: 'Compacta', label: <Icon icon={Rows4} size="sm" /> },
                      { value: 'comfortable', ariaLabel: 'Padrão', label: <Icon icon={Rows3} size="sm" /> },
                      { value: 'spacious', ariaLabel: 'Ampla', label: <Icon icon={Rows2} size="sm" /> },
                    ]}
                  />
                ) : null}
              </div>
            </>
          )}
        </div>
      ) : null}

      {/* tabIndex: quem usa só o teclado precisa focar a região para rolar a tabela.
          relative: elementos absolutos (ex.: texto sr-only das células) ficam contidos na rolagem em vez de esticar a página. */}
      <div role="region" tabIndex={0} aria-label={`${caption} (rolável)`} className="relative overflow-auto overscroll-x-contain" style={{ maxHeight }}>
        <table className="w-full min-w-max border-collapse text-sm" aria-label={caption} aria-busy={loading || undefined}>
          <thead className="sticky top-0 z-sticky bg-subtle">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const meta = header.column.columnDef.meta
                  const sorted = header.column.getIsSorted()
                  const canSort = header.column.getCanSort()
                  const align = meta?.align ?? 'left'
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : canSort ? 'none' : undefined}
                      className={cn(
                        // <th> centraliza por padrão no navegador: o alinhamento é sempre explícito.
                        'h-10 border-b border-line-subtle px-3 text-xs font-semibold whitespace-nowrap text-fg-muted',
                        align === 'left' && 'text-left',
                        align === 'right' && 'text-right',
                        align === 'center' && 'text-center',
                        meta?.className,
                      )}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            'group -mx-1.5 inline-flex h-7 items-center gap-1.5 rounded-sm px-1.5 transition-colors duration-150 ease-out hover:bg-muted hover:text-fg',
                            align === 'right' && 'flex-row-reverse',
                            sorted && 'text-fg',
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <Icon
                            icon={sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown}
                            size="xs"
                            // Só a coluna ordenada mostra a seta fixa; as demais aparecem no hover/foco.
                            className={cn(!sorted && 'opacity-0 transition-opacity duration-150 group-hover:opacity-60 group-focus-visible:opacity-60')}
                          />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: Math.min(pagination.pageSize, 8) }, (_, i) => (
                  <tr key={`sk-${i}`} className={cn('border-b border-line-subtle last:border-b-0', rowHeight[density])}>
                    {Array.from({ length: colCount }, (_, c) => (
                      <td key={c} className="px-3"><Skeleton className="h-4 w-full max-w-40" /></td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr
                    key={row.id}
                    data-selected={row.getIsSelected() || undefined}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    className={cn(
                      'border-b border-line-subtle transition-colors duration-100 last:border-b-0 hover:bg-subtle data-[selected=true]:bg-primary-soft',
                      rowHeight[density],
                      onRowClick && 'cursor-pointer',
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta
                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            'px-3 align-middle',
                            meta?.align === 'right' && 'text-right tabular-nums',
                            meta?.align === 'center' && 'text-center',
                            meta?.className,
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                ))}
            {!loading && rows.length === 0 ? (
              <tr>
                <td colSpan={colCount}>
                  {emptyState ?? <EmptyState icon={SearchX} title="Nenhum resultado" description="Ajuste os filtros ou a busca para ver mais registros." />}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {total > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-subtle px-3 py-2">
          <div className="flex items-center gap-3">
            <Text variant="small" tone="muted" tabular aria-live="polite">
              {formatNumber(from)}–{formatNumber(to)} de {formatNumber(total)}
            </Text>
            <label className="flex items-center gap-2 max-sm:hidden">
              <Text as="span" variant="small" tone="muted">Por página</Text>
              <NativeSelect
                size="sm"
                className="w-20"
                value={pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
              </NativeSelect>
            </label>
          </div>
          <Pagination label={`Paginação de ${caption}`} page={pagination.pageIndex + 1} pageCount={Math.max(1, table.getPageCount())} onPageChange={(p) => table.setPageIndex(p - 1)} />
        </div>
      ) : null}
    </div>
  )
}
