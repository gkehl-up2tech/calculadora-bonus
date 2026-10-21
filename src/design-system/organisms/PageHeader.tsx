import type { ComponentProps, ReactNode } from 'react'
import { Heading, Text } from '../atoms'
import { Breadcrumb, type BreadcrumbProps } from '../molecules'
import { cn } from '@/lib/cn'

export interface PageHeaderProps extends Omit<ComponentProps<'header'>, 'title'> {
  title: ReactNode
  description?: ReactNode
  breadcrumb?: BreadcrumbProps
  /** Nível do título (padrão 1). Em documentação ou páginas incorporadas, use um nível mais profundo. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Ações da página (a principal por último/à direita). */
  actions?: ReactNode
}

/** Topo de página: trilha, título (h1), descrição e ações. Em telas pequenas as ações descem. */
export function PageHeader({ title, description, breadcrumb, headingLevel = 1, actions, className, ...props }: PageHeaderProps) {
  return (
    <header className={cn('grid gap-3', className)} {...props}>
      {breadcrumb ? <Breadcrumb {...breadcrumb} /> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="grid min-w-0 gap-1">
          <Heading level={headingLevel} size="2xl">{title}</Heading>
          {description ? <Text tone="muted" className="max-w-prose text-pretty">{description}</Text> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
