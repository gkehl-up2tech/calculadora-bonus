import type { ComponentProps } from 'react'
import { Label } from '../atoms'
import { cn } from '@/lib/cn'

export interface FieldLabelProps extends ComponentProps<typeof Label> {
  required?: boolean
  /** Mostra "(opcional)". Use quando a maioria dos campos do formulário é obrigatória. */
  optional?: boolean
}

/** Label + indicador de obrigatoriedade. */
export function FieldLabel({ required, optional, children, className, ...props }: FieldLabelProps) {
  return (
    <Label className={cn('inline-flex items-baseline gap-1', className)} {...props}>
      {children}
      {required ? (
        <>
          <span aria-hidden className="text-tone-danger-fg">*</span>
          <span className="sr-only">(obrigatório)</span>
        </>
      ) : null}
      {optional ? <span className="text-xs font-normal text-fg-subtle">(opcional)</span> : null}
    </Label>
  )
}
