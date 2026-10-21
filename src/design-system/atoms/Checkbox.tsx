import type { ComponentProps } from 'react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'

/** true | false | 'indeterminate' */
export type CheckedState = boolean | 'indeterminate'

export function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'peer relative inline-flex size-5 shrink-0 items-center justify-center rounded-xs border border-line-control bg-surface text-on-primary',
        'transition-[background-color,border-color,transform] duration-150 ease-out active:scale-90',
        // Área de toque ampliada além dos 20px visuais (WCAG 2.5.8).
        'after:absolute after:-inset-1 after:content-[""]',
        'hover:border-fg-subtle focus-visible:outline-2 focus-visible:outline-offset-2',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
        'aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex animate-fade-in items-center justify-center">
        {props.checked === 'indeterminate' ? <Minus aria-hidden className="size-3.5" strokeWidth={3} /> : <Check aria-hidden className="size-3.5" strokeWidth={3} />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
