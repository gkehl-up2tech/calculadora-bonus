import type { ComponentProps, ReactNode } from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { X } from 'lucide-react'
import { Heading, Text } from '../atoms'
import { IconButton } from '../cells'
import { cn } from '@/lib/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' } as const

export interface DialogContentProps extends Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title'> {
  /** Obrigatório: nomeia o diálogo para leitores de tela. */
  title: ReactNode
  description?: ReactNode
  size?: keyof typeof sizes
  /** Botões alinhados à direita, abaixo do conteúdo. */
  footer?: ReactNode
  /** Esconde o X (use quando o rodapé já tem Cancelar e o fluxo é crítico). */
  hideClose?: boolean
}

/** Janela modal centralizada. Esc e clique fora fecham; o foco fica preso dentro. Origem da animação = centro. */
export function DialogContent({ title, description, size = 'md', footer, hideClose, className, children, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-overlay grid place-items-center overflow-y-auto bg-overlay p-4 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in">
        <DialogPrimitive.Content
          // Sem descrição, informamos explicitamente para o Radix não emitir aviso de acessibilidade.
          {...(description ? {} : { 'aria-describedby': undefined })}
          className={cn(
            // Nunca passa da altura da tela: o corpo rola e título e rodapé ficam sempre visíveis.
            'relative flex max-h-[calc(100dvh-2rem)] w-full origin-center flex-col rounded-xl bg-raised text-fg shadow-popover outline-none',
            'data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in',
            sizes[size],
            className,
          )}
          {...props}
        >
          <div className="flex shrink-0 items-start justify-between gap-4 p-5 pb-0">
            <div className="grid gap-1">
              <DialogPrimitive.Title asChild><Heading level={2} size="lg">{title}</Heading></DialogPrimitive.Title>
              {description ? <DialogPrimitive.Description asChild><Text tone="muted">{description}</Text></DialogPrimitive.Description> : null}
            </div>
            {hideClose ? null : (
              <DialogPrimitive.Close asChild>
                <IconButton icon={X} label="Fechar" size="sm" className="-mt-1 -mr-1" />
              </DialogPrimitive.Close>
            )}
          </div>
          {children ? <div className="relative min-h-0 flex-1 overflow-y-auto p-5">{children}</div> : <div className="h-5" />}
          {footer ? <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-line-subtle px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end">{footer}</div> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  )
}
