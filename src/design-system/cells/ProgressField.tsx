import type { ComponentProps, ReactNode } from 'react'
import { ProgressBar, Text } from '../atoms'
import { cn } from '@/lib/cn'

export interface ProgressFieldProps extends ComponentProps<typeof ProgressBar> {
  label: ReactNode
  /** Texto à direita; por padrão, a porcentagem. */
  valueLabel?: ReactNode
}

/** ProgressBar + rótulo + valor. */
export function ProgressField({ label, valueLabel, value = 0, max = 100, className, ...props }: ProgressFieldProps) {
  const pct = Math.round(((value ?? 0) / max) * 100)
  return (
    <div className={cn('grid gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Text variant="body" weight="medium">{label}</Text>
        <Text variant="small" tone="muted" tabular>{valueLabel ?? `${pct}%`}</Text>
      </div>
      <ProgressBar value={value} max={max} aria-label={typeof label === 'string' ? label : undefined} {...props} />
    </div>
  )
}
