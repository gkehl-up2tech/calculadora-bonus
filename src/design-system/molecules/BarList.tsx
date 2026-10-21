import type { ComponentProps } from 'react'
import { toneDot, type Tone } from '../foundations'
import { cn } from '@/lib/cn'

export interface BarListItem {
  id: string
  label: string
  value: number
}

export interface BarListProps extends Omit<ComponentProps<'ul'>, 'children'> {
  items: BarListItem[]
  /** Uma cor só: categorias nominais não ganham uma cor cada (a barra já mostra a diferença). */
  tone?: Tone
  /** Base do "%": por padrão, a soma dos itens. */
  total?: number
  format?: (value: number) => string
  /** Mostra a participação (%) ao lado do valor. */
  showShare?: boolean
  emptyText?: string
}

const defaultFormat = (n: number) => n.toLocaleString('pt-BR')

/**
 * Ranking em barras horizontais. A lista de texto (rótulo + valor + %) é a leitura principal e a "tabela"
 * do gráfico — as barras são reforço visual (aria-hidden), então nenhum dado depende só da forma ou da cor.
 * Barra fina, ponta arredondada e base reta, ancorada à esquerda.
 */
export function BarList({ items, tone = 'brand', total, format = defaultFormat, showShare = true, emptyText = 'Sem dados.', className, ...props }: BarListProps) {
  if (items.length === 0) return <p className="text-sm text-fg-muted">{emptyText}</p>
  const max = Math.max(...items.map((i) => i.value), 1)
  const base = total ?? items.reduce((s, i) => s + i.value, 0)
  return (
    <ul className={cn('grid gap-3.5', className)} {...props}>
      {items.map((item) => {
        const share = base > 0 ? Math.round((item.value / base) * 100) : 0
        return (
          <li key={item.id} className="grid gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-fg">{item.label}</span>
              <span className="shrink-0 font-semibold text-fg tabular-nums">
                {format(item.value)}
                {/* Espaço de verdade no texto: leitores de tela não leem "741%" ao juntar valor e participação. */}
                {showShare ? ' ' : null}
                {showShare ? <span className="ml-2 inline-block w-9 text-right font-normal text-fg-muted">{share}%</span> : null}
              </span>
            </div>
            <div aria-hidden className="h-2 rounded-xs bg-subtle">
              <div className={cn('h-full rounded-r-xs', toneDot[tone])} style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
