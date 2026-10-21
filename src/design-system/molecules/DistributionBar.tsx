import type { ComponentProps } from 'react'
import { toneMark, type Tone } from '../foundations'
import { cn } from '@/lib/cn'

export interface DistributionSegment {
  id: string
  label: string
  value: number
  tone: Tone
}

export interface DistributionBarProps extends Omit<ComponentProps<'div'>, 'children'> {
  segments: DistributionSegment[]
  format?: (value: number) => string
  emptyText?: string
}

const defaultFormat = (n: number) => n.toLocaleString('pt-BR')

/**
 * Parte-do-todo em UMA barra horizontal empilhada (até ~4 partes) + legenda sempre presente com valor e %.
 * Segmentos separados por 2 px de respiro (sem bordas). A legenda é a leitura exata e o "gêmeo em tabela".
 */
export function DistributionBar({ segments, format = defaultFormat, emptyText = 'Sem dados.', className, ...props }: DistributionBarProps) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  if (total === 0) return <p className="text-sm text-fg-muted">{emptyText}</p>
  const summary = segments.map((s) => `${s.label}: ${format(s.value)}`).join('; ')
  return (
    <div className={cn('grid gap-4', className)} {...props}>
      <div role="img" aria-label={summary} className="flex h-3 gap-0.5 overflow-hidden rounded-xs">
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <div key={s.id} className={toneMark[s.tone]} style={{ flex: `${s.value} 1 0%`, minWidth: 3 }} />
          ))}
      </div>
      <ul className="grid gap-2 text-sm">
        {segments.map((s) => (
          <li key={s.id} className="flex items-center gap-2.5">
            <span aria-hidden className={cn('size-2.5 shrink-0 rounded-xs', toneMark[s.tone])} />
            <span className="min-w-0 flex-1 truncate text-fg">{s.label}</span>
            <span className="shrink-0 font-semibold text-fg tabular-nums">{format(s.value)}</span>
            <span className="w-10 shrink-0 text-right text-fg-muted tabular-nums">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
