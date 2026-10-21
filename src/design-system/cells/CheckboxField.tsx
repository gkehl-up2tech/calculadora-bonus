import { useId, type ComponentProps, type ReactNode } from 'react'
import { Checkbox, Label, Text } from '../atoms'
import { cn } from '@/lib/cn'

export interface CheckboxFieldProps extends Omit<ComponentProps<typeof Checkbox>, 'children'> {
  label: ReactNode
  description?: ReactNode
}

/** Checkbox + Label (+ descrição). O texto inteiro é clicável. */
export function CheckboxField({ label, description, id, className, ...props }: CheckboxFieldProps) {
  const auto = useId()
  const fieldId = id ?? auto
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <Checkbox id={fieldId} aria-describedby={description ? `${fieldId}-desc` : undefined} className="mt-px" {...props} />
      <div className="grid gap-0.5">
        <Label htmlFor={fieldId}>{label}</Label>
        {description ? <Text id={`${fieldId}-desc`} variant="small" tone="muted">{description}</Text> : null}
      </div>
    </div>
  )
}
