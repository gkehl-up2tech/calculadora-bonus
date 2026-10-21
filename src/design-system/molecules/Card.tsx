import type { ComponentProps } from 'react'
import { Heading, Text } from '../atoms'
import { cn } from '@/lib/cn'

/** Superfície agrupadora. Borda é um anel translúcido (shadow-card), não uma linha sólida. */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('rounded-lg bg-surface text-fg shadow-card', className)} {...props} />
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-start justify-between gap-4 p-5 pb-0', className)} {...props} />
}

export function CardTitle({ className, level = 3, ...props }: ComponentProps<typeof Heading>) {
  return <Heading level={level} size="md" className={className} {...props} />
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return <Text variant="body" tone="muted" className={cn('mt-1', className)} {...props} />
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('p-5', className)} {...props} />
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-center justify-end gap-2 border-t border-line-subtle px-5 py-3', className)} {...props} />
}
