import type { ComponentProps } from 'react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { cn } from '@/lib/cn'

export function RadioGroup({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} />
}

export function Radio({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'peer relative inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-line-control bg-surface',
        'transition-[background-color,border-color,transform] duration-150 ease-out active:scale-90',
        'after:absolute after:-inset-1 after:content-[""]',
        'hover:border-fg-subtle data-[state=checked]:border-primary data-[state=checked]:bg-primary',
        'aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-2 animate-fade-in rounded-full bg-on-primary" />
    </RadioGroupPrimitive.Item>
  )
}
