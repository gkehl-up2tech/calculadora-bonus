import type { ComponentProps } from 'react'
import { X } from 'lucide-react'
import { Icon } from '../atoms'
import { cn } from '@/lib/cn'

export interface ChipProps extends Omit<ComponentProps<'span'>, 'onClick'> {
  /** Quando presente, exibe o botão de remover. */
  onRemove?: () => void
  removeLabel?: string
}

/** Texto + botão de remover: filtros ativos, e-mails, tags. */
export function Chip({ onRemove, removeLabel = 'Remover', className, children, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex h-7 max-w-full items-center gap-1 rounded-full bg-primary-soft pr-1 pl-3 text-sm font-medium text-primary-soft-fg',
        !onRemove && 'pr-3',
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${removeLabel}: ${typeof children === 'string' ? children : ''}`.trim()}
          className="relative inline-flex size-5 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-150 ease-out hover:bg-primary-soft-hover active:scale-90 after:absolute after:-inset-1 after:content-['']"
        >
          <Icon icon={X} size="xs" />
        </button>
      ) : null}
    </span>
  )
}
