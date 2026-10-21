import type { ComponentProps } from 'react'
import { Separator } from 'radix-ui'
import { cn } from '@/lib/cn'

export function Divider({ className, orientation = 'horizontal', decorative = true, ...props }: ComponentProps<typeof Separator.Root>) {
  return (
    <Separator.Root
      orientation={orientation}
      decorative={decorative}
      className={cn('shrink-0 bg-line-subtle', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
      {...props}
    />
  )
}
