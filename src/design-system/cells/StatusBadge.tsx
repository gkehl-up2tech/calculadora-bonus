import type { ComponentProps } from 'react'
import { Badge } from '../atoms'
import { toneDot } from '../foundations'
import { cn } from '@/lib/cn'

export type StatusBadgeProps = Omit<ComponentProps<typeof Badge>, 'appearance'>

/** Badge + ponto de cor. O texto sempre diz o status — a cor nunca é o único sinal (WCAG 1.4.1). */
export function StatusBadge({ tone = 'neutral', children, className, ...props }: StatusBadgeProps) {
  return (
    <Badge tone={tone} className={cn('gap-1.5', className)} {...props}>
      <span aria-hidden className={cn('size-1.5 rounded-full', toneDot[tone])} />
      {children}
    </Badge>
  )
}
