import type { ComponentProps } from 'react'
import { Select as SelectPrimitive } from 'radix-ui'
import { Check, ChevronDown } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'
import { fieldVariants } from '../atoms'
import { menuItem, overlayPanel, popAnimation } from '../foundations'
import { cn } from '@/lib/cn'

export interface SelectOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface SelectProps
  extends Pick<ComponentProps<typeof SelectPrimitive.Root>, 'value' | 'defaultValue' | 'onValueChange' | 'disabled' | 'name' | 'required'>,
    Pick<ComponentProps<'button'>, 'id' | 'aria-describedby' | 'aria-invalid' | 'aria-label' | 'className' | 'onBlur'>,
    VariantProps<typeof fieldVariants> {
  options: SelectOption[]
  placeholder?: string
  invalid?: boolean
}

/** Select customizado (lista estilizada, teclado completo). Para celulares prefira NativeSelect. */
export function Select({ options, placeholder = 'Selecione…', size, invalid, className, ...props }: SelectProps) {
  const { id, onBlur, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, 'aria-label': ariaLabel, ...root } = props
  return (
    <SelectPrimitive.Root {...root}>
      <SelectPrimitive.Trigger
        id={id}
        onBlur={onBlur}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-invalid={invalid || ariaInvalid}
        className={cn(fieldVariants({ size }), 'flex items-center justify-between gap-2 text-left data-[placeholder]:text-fg-subtle [&>span]:truncate', className)}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown aria-hidden className="size-4 shrink-0 text-fg-subtle" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          collisionPadding={8}
          className={cn(
            overlayPanel,
            popAnimation,
            'max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) min-w-40 origin-(--radix-select-content-transform-origin) overflow-hidden',
          )}
        >
          <SelectPrimitive.Viewport className="max-h-72 p-1">
            {options.map((o) => (
              <SelectPrimitive.Item key={o.value} value={o.value} disabled={o.disabled} className={cn(menuItem, 'pr-8')}>
                <div className="grid min-w-0">
                  <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
                  {o.description ? <span className="truncate text-xs text-fg-muted">{o.description}</span> : null}
                </div>
                <SelectPrimitive.ItemIndicator className="absolute right-2.5 inline-flex">
                  <Check aria-hidden className="size-4 text-primary-soft-fg" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
