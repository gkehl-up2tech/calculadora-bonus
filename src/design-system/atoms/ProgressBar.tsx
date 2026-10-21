import type { ComponentProps } from 'react'
import { Progress } from 'radix-ui'
import { cn } from '@/lib/cn'
import type { Tone } from '../foundations'

const barTone: Record<Tone, string> = {
  neutral: 'bg-tone-neutral-solid',
  brand: 'bg-tone-brand-solid',
  success: 'bg-tone-success-solid',
  warning: 'bg-tone-warning-solid',
  danger: 'bg-tone-danger-solid',
  info: 'bg-tone-info-solid',
}

export interface ProgressBarProps extends ComponentProps<typeof Progress.Root> {
  tone?: Tone
}

export function ProgressBar({ className, value = 0, max = 100, tone = 'brand', ...props }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, ((value ?? 0) / max) * 100))
  return (
    <Progress.Root value={value} max={max} className={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)} {...props}>
      <Progress.Indicator
        className={cn('size-full rounded-full transition-transform duration-300 ease-out', barTone[tone])}
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </Progress.Root>
  )
}
