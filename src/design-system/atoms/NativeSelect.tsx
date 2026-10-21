import type { ComponentProps } from 'react'
import { ChevronDown } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { fieldVariants } from './Input'

export interface NativeSelectProps
  extends Omit<ComponentProps<'select'>, 'size'>,
    VariantProps<typeof fieldVariants> {
  invalid?: boolean
}

/** <select> nativo estilizado: melhor opção em celulares (roda o seletor do sistema). */
export function NativeSelect({ className, size, invalid, children, ...props }: NativeSelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(fieldVariants({ size }), 'appearance-none pr-9', className)}
        aria-invalid={invalid || props['aria-invalid']}
        {...props}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fg-subtle" />
    </div>
  )
}
