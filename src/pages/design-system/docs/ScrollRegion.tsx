import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Contêiner rolável acessível por teclado (tabIndex + nome). Use em tabelas largas e blocos de código. */
export function ScrollRegion({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div role="region" tabIndex={0} aria-label={label} className={cn('overflow-x-auto rounded-lg bg-surface shadow-card', className)}>
      {children}
    </div>
  )
}
