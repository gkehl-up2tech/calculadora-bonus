import type { ComponentProps, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Heading, Icon, Text } from '../atoms'
import { cn } from '@/lib/cn'

export interface EmptyStateProps extends Omit<ComponentProps<'div'>, 'title'> {
  icon?: LucideIcon
  title: ReactNode
  description?: ReactNode
  /** Botões de ação (a principal primeiro). */
  actions?: ReactNode
  compact?: boolean
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

/** Ícone + título + explicação + próxima ação. Use para listas vazias, buscas sem resultado e erros. */
export function EmptyState({ icon, title, description, actions, compact, headingLevel = 3, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn('mx-auto flex max-w-sm flex-col items-center text-center', compact ? 'gap-2 py-6' : 'gap-3 py-12', className)} {...props}>
      {icon ? (
        <span className="mb-1 inline-flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary-soft-fg">
          <Icon icon={icon} size="lg" />
        </span>
      ) : null}
      <Heading level={headingLevel} size="md">{title}</Heading>
      {description ? <Text tone="muted" className="text-pretty">{description}</Text> : null}
      {actions ? <div className="mt-2 flex flex-wrap justify-center gap-2">{actions}</div> : null}
    </div>
  )
}
