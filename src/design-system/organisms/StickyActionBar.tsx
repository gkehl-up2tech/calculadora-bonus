import type { ReactNode } from 'react'
import { Badge } from '../atoms'
import { cn } from '@/lib/cn'

export interface StickyActionBarProps {
  /** Mostra o aviso de alterações não salvas. */
  dirty?: boolean
  /** Botões: Cancelar (secundário) e Salvar (primário). */
  children: ReactNode
  className?: string
}

/** Barra de ações presa ao rodapé do formulário. Respeita a área segura do iPhone. */
export function StickyActionBar({ dirty, children, className }: StickyActionBarProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-sticky -mx-4 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8',
        className,
      )}
    >
      <div className="mx-auto flex max-w-(--content-max) items-center justify-between gap-3">
        <div aria-live="polite" className="min-h-6">
          {dirty ? <Badge tone="warning">Alterações não salvas</Badge> : null}
        </div>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </div>
  )
}
