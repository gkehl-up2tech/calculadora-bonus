import type { ReactNode } from 'react'
import { ToggleGroup } from 'radix-ui'
import { cn } from '@/lib/cn'

export interface SegmentedOption<T extends string> {
  value: T
  label: ReactNode
  /** Nome acessível quando `label` é só um ícone. */
  ariaLabel?: string
}

export interface SegmentedControlProps<T extends string> {
  value: T
  onValueChange: (value: T) => void
  options: SegmentedOption<T>[]
  size?: 'sm' | 'md'
  'aria-label': string
  className?: string
}

/** Escolha única entre poucas opções visíveis (densidade, visualização, período). */
export function SegmentedControl<T extends string>({ value, onValueChange, options, size = 'md', className, ...props }: SegmentedControlProps<T>) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      // Clicar no item já ativo não deve desmarcar: ignoramos o valor vazio.
      onValueChange={(v) => v && onValueChange(v as T)}
      aria-label={props['aria-label']}
      className={cn('inline-flex rounded-lg bg-subtle p-0.5', className)}
    >
      {options.map((o) => (
        <ToggleGroup.Item
          key={o.value}
          value={o.value}
          aria-label={o.ariaLabel}
          className={cn(
            'inline-flex items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium text-fg-muted',
            size === 'sm' ? 'h-7' : 'h-control-sm',
            'transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:text-fg active:scale-[0.97]',
            'data-[state=on]:bg-surface data-[state=on]:text-fg data-[state=on]:shadow-border',
          )}
        >
          {o.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
