import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

/** Placeholder de carregamento. Pulsa só a opacidade (barato, sem repaint de gradiente). */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div aria-hidden className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
}
