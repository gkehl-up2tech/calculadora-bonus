import type { ComponentProps } from 'react'
import { AlertCircle, CheckCircle2, TriangleAlert } from 'lucide-react'
import { Icon, Text } from '../atoms'
import { cn } from '@/lib/cn'

const config = {
  hint: { icon: null, tone: 'muted' },
  error: { icon: AlertCircle, tone: 'danger' },
  success: { icon: CheckCircle2, tone: 'success' },
  warning: { icon: TriangleAlert, tone: 'warning' },
} as const

export interface FieldMessageProps extends Omit<ComponentProps<'div'>, 'color'> {
  kind?: keyof typeof config
}

/** Icon + Text: dica ou mensagem de validação abaixo de um campo. Erros são anunciados por leitores de tela. */
export function FieldMessage({ kind = 'hint', className, children, ...props }: FieldMessageProps) {
  const { icon, tone } = config[kind]
  return (
    <div
      className={cn('flex items-start gap-1.5', className)}
      role={kind === 'error' ? 'alert' : undefined}
      {...props}
    >
      {icon ? <Icon icon={icon} size="sm" className={cn('mt-px', kind === 'error' ? 'text-tone-danger-fg' : kind === 'success' ? 'text-tone-success-fg' : 'text-tone-warning-fg')} /> : null}
      <Text as="span" variant="small" tone={tone}>
        {children}
      </Text>
    </div>
  )
}
