import type { ComponentProps, ReactNode } from 'react'
import { Heading, Text } from '../atoms'
import { Card } from '../molecules'
import { cn } from '@/lib/cn'

export interface FormSectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  title: ReactNode
  description?: ReactNode
  /** Nível do título da seção (padrão 2, abaixo do h1 da página). */
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

/** Bloco de formulário: explicação à esquerda, campos à direita (empilha no celular). */
export function FormSection({ title, description, headingLevel = 2, className, children, ...props }: FormSectionProps) {
  return (
    <section className={cn('grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-8', className)} {...props}>
      <div className="grid content-start gap-1">
        <Heading level={headingLevel} size="md">{title}</Heading>
        {description ? <Text tone="muted" className="text-pretty">{description}</Text> : null}
      </div>
      <Card className="p-5">{children}</Card>
    </section>
  )
}

/** Grade de campos: 1 coluna no celular, 2 a partir de `sm`. Use `sm:col-span-2` para campos largos. */
export function FormGrid({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('grid gap-x-4 gap-y-5 sm:grid-cols-2', className)} {...props} />
}
