import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const spinnerVariants = cva('inline-block animate-spin rounded-full border-current border-t-transparent', {
  variants: {
    size: { sm: 'size-4 border-2', md: 'size-5 border-2', lg: 'size-8 border-[3px]' },
  },
  defaultVariants: { size: 'md' },
})

export interface SpinnerProps extends Omit<ComponentProps<'span'>, 'children'>, VariantProps<typeof spinnerVariants> {
  /** Texto lido por leitores de tela. */
  label?: string
}

export function Spinner({ className, size, label = 'Carregando', ...props }: SpinnerProps) {
  return (
    <span role="status" className={cn('inline-flex text-primary', className)} {...props}>
      <span aria-hidden className={spinnerVariants({ size })} />
      <span className="sr-only">{label}</span>
    </span>
  )
}
