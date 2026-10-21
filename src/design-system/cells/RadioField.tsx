import { useId, type ComponentProps, type ReactNode } from 'react'
import { Label, Radio, Text } from '../atoms'
import { cn } from '@/lib/cn'

export interface RadioFieldProps extends Omit<ComponentProps<typeof Radio>, 'children'> {
  label: ReactNode
  description?: ReactNode
}

/** Radio + Label (+ descrição). Use dentro de <RadioGroup>. */
export function RadioField({ label, description, id, className, ...props }: RadioFieldProps) {
  const auto = useId()
  const fieldId = id ?? auto
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <Radio id={fieldId} aria-describedby={description ? `${fieldId}-desc` : undefined} className="mt-px" {...props} />
      <div className="grid gap-0.5">
        <Label htmlFor={fieldId}>{label}</Label>
        {description ? <Text id={`${fieldId}-desc`} variant="small" tone="muted">{description}</Text> : null}
      </div>
    </div>
  )
}
