import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

/** Estilo de campo compartilhado por Input, Textarea e NativeSelect. */
export const fieldVariants = cva(
  [
    'block w-full min-w-0 rounded-md border border-line-control bg-surface text-fg placeholder:text-fg-subtle',
    'transition-[border-color,box-shadow,background-color] duration-150 ease-out hover:border-fg-subtle',
    'focus-visible:border-focus focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus/25',
    'aria-invalid:border-danger aria-invalid:hover:border-danger aria-invalid:focus-visible:ring-danger/25',
    'disabled:cursor-not-allowed disabled:border-line disabled:bg-subtle disabled:text-fg-disabled disabled:hover:border-line',
    '[&[readonly]]:bg-subtle', // não use read-only: — ele também casa com <button>
    // 16px em telas de toque evita o zoom automático do iOS; 14px com mouse.
    'text-base pointer-fine:text-sm',
  ],
  {
    variants: {
      size: {
        sm: 'h-control-sm px-2.5',
        md: 'h-control-md px-3',
        lg: 'h-control-lg px-4 !text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export interface InputProps extends Omit<ComponentProps<'input'>, 'size'>, VariantProps<typeof fieldVariants> {
  /** Marca o campo como inválido (borda de erro + aria-invalid). */
  invalid?: boolean
}

export function Input({ className, size, invalid, ...props }: InputProps) {
  return (
    <input
      className={cn(fieldVariants({ size }), 'file:mr-3 file:border-0 file:bg-transparent file:font-medium', className)}
      aria-invalid={invalid || props['aria-invalid']}
      {...props}
    />
  )
}
