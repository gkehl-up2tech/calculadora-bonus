import type { ComponentProps, ReactNode } from 'react'
import { Tooltip as TooltipPrimitive } from 'radix-ui'
import { ShortcutHint } from '../cells'
import { cn } from '@/lib/cn'

/**
 * Monte uma vez na raiz. Depois que um tooltip abre, os vizinhos abrem na hora e sem animação
 * (skipDelayDuration) — a barra de ferramentas inteira parece mais rápida.
 */
export function TooltipProvider(props: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={400} skipDelayDuration={300} {...props} />
}

export interface TooltipProps {
  content: ReactNode
  /** Atalho de teclado exibido ao lado do texto. */
  shortcut?: string[]
  side?: 'top' | 'right' | 'bottom' | 'left'
  children: ReactNode
}

/** Texto curto de apoio ao passar o mouse ou focar. Nunca coloque informação essencial aqui (não aparece no toque). */
export function Tooltip({ content, shortcut, side = 'top', children }: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          collisionPadding={8}
          className={cn(
            'z-tooltip flex max-w-64 origin-(--radix-tooltip-content-transform-origin) items-center gap-2 rounded-md bg-inverse px-2.5 py-1.5 text-xs font-medium text-fg-inverse',
            'data-[state=delayed-open]:animate-pop-in data-[state=closed]:animate-pop-out',
          )}
        >
          {content}
          {shortcut ? <ShortcutHint keys={shortcut} className="[&_kbd]:bg-fg-inverse/15 [&_kbd]:text-fg-inverse [&_kbd]:shadow-none" /> : null}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
