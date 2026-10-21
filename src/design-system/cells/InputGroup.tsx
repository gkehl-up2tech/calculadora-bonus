import type { ComponentProps, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Icon, Input, type InputProps } from '../atoms'
import { cn } from '@/lib/cn'

export interface InputGroupProps extends InputProps {
  /** Texto fixo antes do valor, em bloco destacado (ex.: "R$"). */
  addonStart?: ReactNode
  /** Texto fixo depois do valor (ex.: "kg", "%"). */
  addonEnd?: ReactNode
  /** Ícone dentro do campo, à esquerda. */
  startIcon?: LucideIcon
  /** Slot dentro do campo, à direita (ex.: botão de limpar). */
  endSlot?: ReactNode
  groupClassName?: string
  groupProps?: ComponentProps<'div'>
}

const addon = 'flex shrink-0 items-center bg-subtle px-3 text-sm font-medium text-fg-muted select-none'

/** Input + adornos (prefixo, sufixo, ícone). O grupo inteiro responde a foco, erro e desabilitado. */
export function InputGroup({
  addonStart,
  addonEnd,
  startIcon,
  endSlot,
  groupClassName,
  groupProps,
  size = 'md',
  className,
  ...props
}: InputGroupProps) {
  const height = { sm: 'h-control-sm', md: 'h-control-md', lg: 'h-control-lg' }[size ?? 'md']
  return (
    <div
      {...groupProps}
      className={cn(
        'flex w-full min-w-0 items-stretch overflow-hidden rounded-md border border-line-control bg-surface',
        'transition-[border-color,box-shadow] duration-150 ease-out hover:border-fg-subtle',
        'has-[input:focus-visible]:border-focus has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-focus/25',
        'has-[input[aria-invalid=true]]:border-danger has-[input[aria-invalid=true]]:has-[input:focus-visible]:ring-danger/25',
        'has-[input:disabled]:border-line has-[input:disabled]:bg-subtle',
        height,
        groupClassName,
      )}
    >
      {addonStart ? <span className={cn(addon, 'border-r border-line')}>{addonStart}</span> : null}
      {startIcon ? <Icon icon={startIcon} size="sm" className="my-auto ml-3 text-fg-subtle" /> : null}
      <Input
        size={size}
        className={cn(
          'h-full flex-1 rounded-none border-0 bg-transparent shadow-none hover:border-0 focus-visible:border-0 focus-visible:ring-0 disabled:border-0 disabled:bg-transparent',
          className,
        )}
        {...props}
      />
      {endSlot ? <span className="my-auto flex shrink-0 items-center pr-1">{endSlot}</span> : null}
      {addonEnd ? <span className={cn(addon, 'border-l border-line')}>{addonEnd}</span> : null}
    </div>
  )
}
