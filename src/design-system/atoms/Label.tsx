import type { ComponentProps } from 'react'
import { Label as LabelPrimitive } from 'radix-ui'
import { cn } from '@/lib/cn'

export function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn('text-sm leading-5 font-medium text-fg select-none peer-disabled:opacity-60 has-[+:disabled]:opacity-60', className)}
      {...props}
    />
  )
}
