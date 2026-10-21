import type { ComponentProps } from 'react'
import { Progress } from 'radix-ui'
import { cn } from '@/lib/cn'
import { toneMark, type Tone } from '../foundations'

export interface ProgressBarProps extends ComponentProps<typeof Progress.Root> {
  tone?: Tone
}

export function ProgressBar({ className, value = 0, max = 100, tone = 'brand', ...props }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, ((value ?? 0) / max) * 100))
  return (
    <Progress.Root value={value} max={max} className={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)} {...props}>
      <Progress.Indicator
        className={cn('size-full rounded-full transition-transform duration-300 ease-out', toneMark[tone])}
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </Progress.Root>
  )
}
