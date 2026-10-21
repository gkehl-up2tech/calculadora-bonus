import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { fieldVariants } from './Input'

export interface TextareaProps extends ComponentProps<'textarea'> {
  invalid?: boolean
}

export function Textarea({ className, invalid, rows = 3, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(fieldVariants({ size: 'md' }), 'h-auto min-h-20 resize-y py-2', className)}
      aria-invalid={invalid || props['aria-invalid']}
      {...props}
    />
  )
}
