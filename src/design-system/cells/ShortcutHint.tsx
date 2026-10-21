import { Fragment, type ComponentProps } from 'react'
import { Kbd } from '../atoms'
import { cn } from '@/lib/cn'

export interface ShortcutHintProps extends ComponentProps<'span'> {
  keys: string[]
}

/** Sequência de teclas: ⌘ + K. */
export function ShortcutHint({ keys, className, ...props }: ShortcutHintProps) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)} {...props}>
      {keys.map((k, i) => (
        <Fragment key={`${k}-${i}`}>
          {i > 0 ? <span aria-hidden className="text-xs text-fg-subtle">+</span> : null}
          <Kbd>{k}</Kbd>
        </Fragment>
      ))}
    </span>
  )
}
