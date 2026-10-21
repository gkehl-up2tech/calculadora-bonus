import type { ComponentProps, ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react'
import { Icon, Text } from '../atoms'
import { IconButton } from '../cells'
import { toneSoft, toneText, type Tone } from '../foundations'
import { cn } from '@/lib/cn'

const defaultIcon: Record<Tone, LucideIcon> = {
  neutral: Info,
  brand: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
}

export interface AlertProps extends Omit<ComponentProps<'div'>, 'title'> {
  tone?: Tone
  title?: ReactNode
  icon?: LucideIcon
  /** Ação à direita/abaixo (ex.: <Button size="sm">Tentar novamente</Button>). */
  action?: ReactNode
  onDismiss?: () => void
}

/** Mensagem contextual persistente. Erros e avisos usam role="alert"; os demais, role="status". */
export function Alert({ tone = 'brand', title, icon, action, onDismiss, className, children, ...props }: AlertProps) {
  const urgent = tone === 'danger' || tone === 'warning'
  return (
    <div
      role={urgent ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-lg p-4', toneSoft[tone], className)}
      {...props}
    >
      <Icon icon={icon ?? defaultIcon[tone]} size="md" className={cn('mt-px', toneText[tone])} />
      <div className="min-w-0 flex-1">
        {title ? <Text weight="semibold" className="text-fg">{title}</Text> : null}
        {children ? <div className="text-sm leading-5 text-fg-muted [&_a]:underline">{children}</div> : null}
        {action ? <div className="mt-3 flex flex-wrap gap-2">{action}</div> : null}
      </div>
      {onDismiss ? <IconButton icon={X} label="Dispensar" size="sm" onClick={onDismiss} className="-my-1 -mr-1" /> : null}
    </div>
  )
}
