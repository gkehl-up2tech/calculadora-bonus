import { useId, type ComponentProps, type ReactNode } from 'react'
import { Label, Switch, Text } from '../atoms'
import { cn } from '@/lib/cn'

export interface SwitchFieldProps extends Omit<ComponentProps<typeof Switch>, 'children'> {
  label: ReactNode
  description?: ReactNode
}

/** Linha de configuração: texto à esquerda, Switch à direita. */
export function SwitchField({ label, description, id, className, ...props }: SwitchFieldProps) {
  const auto = useId()
  const fieldId = id ?? auto
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div className="grid gap-0.5">
        <Label htmlFor={fieldId}>{label}</Label>
        {description ? <Text id={`${fieldId}-desc`} variant="small" tone="muted">{description}</Text> : null}
      </div>
      <Switch id={fieldId} aria-describedby={description ? `${fieldId}-desc` : undefined} {...props} />
    </div>
  )
}
