import { useState, type ReactNode } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Badge, Button } from '../atoms'
import { Chip } from '../cells'
import { SearchField, Sheet, SheetContent, SheetTrigger } from '../molecules'
import { cn } from '@/lib/cn'
import { useMediaQuery } from '@/lib/useMediaQuery'

export interface ActiveFilter {
  id: string
  label: string
}

export interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  /** Controles de filtro (Select, Combobox…). No celular vão para um painel "Filtros". */
  filters?: ReactNode
  activeFilters?: ActiveFilter[]
  onRemoveFilter?: (id: string) => void
  onClearAll?: () => void
  /** Ações à direita (ex.: Exportar). */
  actions?: ReactNode
  className?: string
}

/** Busca + filtros + chips dos filtros ativos + "Limpar tudo". */
export function FilterBar({ search, onSearchChange, searchPlaceholder, filters, activeFilters = [], onRemoveFilter, onClearAll, actions, className }: FilterBarProps) {
  const wide = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = useState(false)
  const hasActive = activeFilters.length > 0 || search.length > 0

  return (
    <div className={cn('grid gap-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-0 flex-1 basis-64 md:max-w-sm">
          <SearchField value={search} onValueChange={onSearchChange} placeholder={searchPlaceholder} />
        </div>
        {filters ? (
          wide ? (
            <div className="flex flex-wrap items-center gap-2">{filters}</div>
          ) : (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary" leadingIcon={<SlidersHorizontal aria-hidden />}>
                  Filtros
                  {activeFilters.length ? <Badge tone="brand" size="sm">{activeFilters.length}</Badge> : null}
                </Button>
              </SheetTrigger>
              <SheetContent
                title="Filtros"
                side="bottom"
                footer={<Button onClick={() => setOpen(false)} className="w-full">Ver resultados</Button>}
              >
                <div className="grid gap-4 p-4">{filters}</div>
              </SheetContent>
            </Sheet>
          )
        ) : null}
        {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
      </div>
      {hasActive && (activeFilters.length > 0 || onClearAll) ? (
        <div className="flex flex-wrap items-center gap-2" aria-label="Filtros ativos">
          {activeFilters.map((f) => (
            <Chip key={f.id} onRemove={onRemoveFilter ? () => onRemoveFilter(f.id) : undefined} removeLabel="Remover filtro">
              {f.label}
            </Chip>
          ))}
          {onClearAll ? <Button variant="ghost" size="sm" onClick={onClearAll}>Limpar tudo</Button> : null}
        </div>
      ) : null}
    </div>
  )
}
