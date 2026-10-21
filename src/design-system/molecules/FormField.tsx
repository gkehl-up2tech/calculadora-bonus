import { useId, type ReactNode } from 'react'
import { FieldLabel, FieldMessage } from '../cells'
import { cn } from '@/lib/cn'

/** Props de acessibilidade que o campo recebe. Espalhe-as no controle: <Input {...control} />. */
export interface FormFieldControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
  'aria-required'?: true
}

export interface FormFieldProps {
  label: ReactNode
  hint?: ReactNode
  /** Mensagem de erro. Quando presente, marca o controle como inválido e substitui a dica. */
  error?: ReactNode
  required?: boolean
  optional?: boolean
  id?: string
  className?: string
  children: (control: FormFieldControlProps) => ReactNode
}

/**
 * Label + controle + dica/erro, com ids e ARIA conectados.
 *
 *   <FormField label="Nome" required error={errors.name}>
 *     {(control) => <Input {...control} />}
 *   </FormField>
 */
export function FormField({ label, hint, error, required, optional, id, className, children }: FormFieldProps) {
  const auto = useId()
  const fieldId = id ?? auto
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('grid content-start gap-1.5', className)}>
      <FieldLabel htmlFor={fieldId} required={required} optional={optional}>
        {label}
      </FieldLabel>
      {children({
        id: fieldId,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required ? true : undefined,
      })}
      {error ? <FieldMessage id={errorId} kind="error">{error}</FieldMessage> : null}
      {hint ? <FieldMessage id={hintId} kind="hint">{hint}</FieldMessage> : null}
    </div>
  )
}
