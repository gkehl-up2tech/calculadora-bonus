import type { ReactNode } from 'react'
import { Heading, Text } from '@/design-system'

export interface DocSectionProps {
  id: string
  eyebrow?: string
  title: string
  description?: ReactNode
  children: ReactNode
}

/** Seção de primeiro nível da documentação (âncora na navegação). */
export function DocSection({ id, eyebrow, title, description, children }: DocSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-40 gap-10">
      <header className="grid gap-2 border-b border-line-subtle pb-5">
        {eyebrow ? <Text variant="overline" className="text-link">{eyebrow}</Text> : null}
        <Heading level={3} size="3xl" id={`${id}-title`}>{title}</Heading>
        {description ? <Text variant="lead" tone="muted" className="max-w-prose text-pretty">{description}</Text> : null}
      </header>
      {children}
    </section>
  )
}

/** Subgrupo dentro de uma seção (ex.: "Cores primitivas"). */
export function SubSection({ id, title, description, children }: { id?: string; title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <div id={id} className="grid scroll-mt-40 gap-5">
      <div className="grid gap-1">
        <Heading level={4} size="xl">{title}</Heading>
        {description ? <Text tone="muted" className="max-w-prose text-pretty">{description}</Text> : null}
      </div>
      {children}
    </div>
  )
}
