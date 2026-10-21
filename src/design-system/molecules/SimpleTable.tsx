import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface SimpleTableColumn<T> {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  align?: 'left' | 'right'
  /** Total no rodapé (opcional). */
  footer?: ReactNode
  className?: string
}

export interface SimpleTableProps<T> extends Omit<ComponentProps<'div'>, 'children'> {
  /** Nome da tabela para leitores de tela (obrigatório). */
  caption: string
  columns: SimpleTableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  /** Mostrado no lugar da tabela quando não há linhas. */
  empty?: ReactNode
}

/**
 * Tabela curta e somente leitura (sem ordenação nem paginação): saldos por depósito, fornecedores, histórico.
 * Para listas longas use DataTable. Rola na horizontal em telas estreitas.
 */
export function SimpleTable<T>({ caption, columns, rows, getRowId, empty, className, ...props }: SimpleTableProps<T>) {
  if (rows.length === 0 && empty) return <div className="py-2 text-sm text-fg-muted">{empty}</div>
  const hasFooter = columns.some((c) => c.footer !== undefined)
  const align = (a?: 'left' | 'right') => (a === 'right' ? 'text-right tabular-nums' : 'text-left')
  return (
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className={cn('relative -mx-1 overflow-x-auto rounded-md px-1', className)}
      {...props}
    >
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line">
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn('px-3 py-2 text-xs font-semibold whitespace-nowrap text-fg-muted first:pl-0 last:pr-0', align(c.align))}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowId(row)} className="border-b border-line-subtle last:border-0">
              {columns.map((c) => (
                <td key={c.key} className={cn('px-3 py-2.5 align-top first:pl-0 last:pr-0', align(c.align), c.className)}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {hasFooter ? (
          <tfoot>
            <tr className="border-t border-line font-semibold">
              {columns.map((c) => (
                <td key={c.key} className={cn('px-3 py-2.5 first:pl-0 last:pr-0', align(c.align))}>{c.footer}</td>
              ))}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  )
}
