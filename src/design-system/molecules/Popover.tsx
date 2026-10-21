import type { ComponentProps } from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { overlayPanel, popAnimation } from '../foundations'
import { cn } from '@/lib/cn'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverClose = PopoverPrimitive.Close

export function PopoverContent({ className, align = 'start', sideOffset = 6, ...props }: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={cn(overlayPanel, popAnimation, 'w-72 origin-(--radix-popover-content-transform-origin) p-4', className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}
