import type { ComponentProps, ReactNode } from 'react'
import { Text } from '../atoms'
import { cn } from '@/lib/cn'

export interface KeyValueProps extends Omit<ComponentProps<'div'>, 'children'> {
  label: ReactNode
  children: ReactNode
  orientation?: 'vertical' | 'horizontal'
  /** Valor em fonte monoespaçada (NCM, GTIN, SKU). */
  mono?: boolean
}

/** Rótulo + valor, para telas de detalhe. Mostra "—" quando o valor está vazio. */
export function KeyValue({ label, children, orientation = 'vertical', mono, className, ...props }: KeyValueProps) {
  const empty = children === null || children === undefined || children === ''
  return (
    <div
      className={cn(orientation === 'horizontal' ? 'flex items-baseline justify-between gap-4' : 'grid gap-0.5', className)}
      {...props}
    >
      <Text as="dt" variant="small" tone="muted">{label}</Text>
      <Text as="dd" variant={mono ? 'code' : 'body'} weight="medium" tone={empty ? 'subtle' : 'default'} className="min-w-0 break-words">
        {empty ? '—' : children}
      </Text>
    </div>
  )
}
