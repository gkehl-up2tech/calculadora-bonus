import type { ComponentProps, ReactNode } from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { X } from 'lucide-react'
import { Heading, Text } from '../atoms'
import { IconButton } from '../cells'
import { cn } from '@/lib/cn'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close

const sides = {
  right: 'inset-y-0 right-0 h-full w-full max-w-md data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right',
  left: 'inset-y-0 left-0 h-full w-full max-w-xs data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left',
  bottom: 'inset-x-0 bottom-0 max-h-[85dvh] w-full rounded-t-xl pb-[env(safe-area-inset-bottom)] data-[state=open]:animate-slide-in-bottom data-[state=closed]:animate-slide-out-bottom',
} as const

export interface SheetContentProps extends Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title'> {
  title: ReactNode
  description?: ReactNode
  side?: keyof typeof sides
  footer?: ReactNode
  /** Esconde o título visualmente (continua lido por leitores de tela). */
  hideTitle?: boolean
}

/** Painel lateral ou inferior: filtros, detalhes rápidos, menu no celular. */
export function SheetContent({ title, description, side = 'right', footer, hideTitle, className, children, ...props }: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-overlay bg-overlay data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Content
        className={cn('fixed z-modal flex flex-col bg-raised text-fg shadow-popover outline-none', sides[side], className)}
        {...props}
      >
        <div className={cn('flex items-start justify-between gap-4 p-4', hideTitle ? 'pb-0' : 'border-b border-line-subtle')}>
          {/* hideTitle: o texto continua para leitores de tela, mas o botão de fechar fica visível. */}
          <div className={cn('grid gap-1', hideTitle && 'sr-only')}>
            <DialogPrimitive.Title asChild><Heading level={2} size="md">{title}</Heading></DialogPrimitive.Title>
            {description ? <DialogPrimitive.Description asChild><Text variant="small" tone="muted">{description}</Text></DialogPrimitive.Description> : null}
          </div>
          <DialogPrimitive.Close asChild>
            <IconButton icon={X} label="Fechar" size="sm" className="-mt-1 -mr-1" />
          </DialogPrimitive.Close>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer ? <div className="flex justify-end gap-2 border-t border-line-subtle p-4">{footer}</div> : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
