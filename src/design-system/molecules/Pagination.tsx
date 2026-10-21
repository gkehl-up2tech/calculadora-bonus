import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../atoms'
import { IconButton } from '../cells'
import { cn } from '@/lib/cn'

export interface PaginationProps {
  /** Página atual, começando em 1. */
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  /** Páginas vizinhas exibidas de cada lado da atual. */
  siblings?: number
  /** Nome do landmark. Diferencie quando houver mais de uma paginação na página. */
  label?: string
  className?: string
}

/** [1, '…', 4, 5, 6, '…', 20] */
export function getPageRange(page: number, pageCount: number, siblings = 1): (number | 'gap')[] {
  const total = siblings * 2 + 5
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const left = Math.max(page - siblings, 2)
  const right = Math.min(page + siblings, pageCount - 1)
  const range: (number | 'gap')[] = [1]
  if (left > 2) range.push('gap')
  for (let p = left; p <= right; p++) range.push(p)
  if (right < pageCount - 1) range.push('gap')
  range.push(pageCount)
  return range
}

/** Navegação entre páginas. No celular mostra "Página X de Y". */
export function Pagination({ page, pageCount, onPageChange, siblings = 1, label = 'Paginação', className }: PaginationProps) {
  const range = getPageRange(page, pageCount, siblings)
  return (
    <nav aria-label={label} className={cn('flex items-center gap-1', className)}>
      <IconButton icon={ChevronLeft} label="Página anterior" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
      <span className="px-2 text-sm text-fg-muted tabular-nums sm:hidden">Página {page} de {pageCount}</span>
      <ul className="hidden items-center gap-1 sm:flex">
        {range.map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden className="w-7 text-center text-fg-subtle">…</li>
          ) : (
            <li key={p}>
              <Button
                size="sm"
                variant="ghost"
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Página ${p}`}
                className={cn('min-w-control-sm px-2 tabular-nums', p === page && 'bg-primary-soft text-primary-soft-fg hover:bg-primary-soft-hover hover:text-primary-soft-fg')}
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            </li>
          ),
        )}
      </ul>
      <IconButton icon={ChevronRight} label="Próxima página" size="sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} />
    </nav>
  )
}
