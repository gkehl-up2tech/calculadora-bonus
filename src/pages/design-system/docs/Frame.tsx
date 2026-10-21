import type { ReactNode } from 'react'
import { Text } from '@/design-system'
import { cn } from '@/lib/cn'

/** Moldura para exibir organismos/páginas em contexto, com rolagem própria. */
export function Frame({ label, children, className, bodyClassName, maxHeight }: { label?: string; children: ReactNode; className?: string; bodyClassName?: string; maxHeight?: string }) {
  return (
    <figure className={cn('grid overflow-hidden rounded-lg border border-line bg-canvas', className)}>
      {label ? (
        <figcaption className="flex items-center gap-1.5 border-b border-line-subtle bg-surface px-3 py-2">
          <span aria-hidden className="size-2.5 rounded-full bg-muted" />
          <span aria-hidden className="size-2.5 rounded-full bg-muted" />
          <span aria-hidden className="size-2.5 rounded-full bg-muted" />
          <Text as="span" variant="small" tone="muted" className="ml-2">{label}</Text>
        </figcaption>
      ) : null}
      <div className={cn('overflow-auto', bodyClassName)} style={{ maxHeight }}>{children}</div>
    </figure>
  )
}
