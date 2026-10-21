import type { ComponentProps, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Icon } from '../atoms'
import { toneSoft, type Tone } from '../foundations'
import { Card } from './Card'
import { cn } from '@/lib/cn'

export interface StatCardProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Frase curta, sem dois-pontos (ex.: "Produtos ativos"). */
  label: string
  /** O número. Valores grandes devem vir compactos (12,9 mil / R$ 4,2 mi). */
  value: ReactNode
  /** Contexto do número (ex.: "72% do cadastro"). */
  helper?: ReactNode
  icon?: LucideIcon
  /** Cor do ícone: o significado do indicador (sucesso, atenção, erro…). O número nunca é colorido. */
  tone?: Tone
  /** O número em destaque da tela (≥ 48 px). Use UM por visão. */
  hero?: boolean
}

/**
 * Indicador único: rótulo + número (+ contexto). Use dentro de um <dl> (agrupa os indicadores):
 *   <dl className="grid …"><StatCard label="Ativos" value={72} /></dl>
 */
export function StatCard({ label, value, helper, icon, tone = 'brand', hero, className, ...props }: StatCardProps) {
  return (
    // dt e dd são filhos DIRETOS do grupo (exigência do <dl>); o ícone fica posicionado no canto.
    <Card className={cn('relative flex flex-col p-5', className)} {...props}>
      {icon ? (
        <span aria-hidden className={cn('absolute top-5 right-5 inline-flex size-8 items-center justify-center rounded-full', toneSoft[tone])}>
          <Icon icon={icon} size="sm" />
        </span>
      ) : null}
      {/* Rótulos de até 2 linhas reservam a mesma altura: os números dos cartões vizinhos ficam alinhados. */}
      <dt className={cn('text-sm leading-5 font-medium text-fg-muted', icon && 'pr-10', !hero && 'min-h-10')}>{label}</dt>
      {/* Números grandes usam algarismos proporcionais (tabular só em colunas). */}
      <dd className={cn('mt-3 font-bold tracking-tight text-fg', hero ? 'text-5xl leading-none' : 'text-3xl leading-9')}>{value}</dd>
      {helper ? <dd className="mt-auto pt-1.5 text-sm leading-5 text-fg-muted">{helper}</dd> : null}
    </Card>
  )
}
