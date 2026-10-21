import type { ComponentProps } from 'react'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/cn'

export interface LinkProps extends ComponentProps<'a'> {
  /** Use com <RouterLink>/<NavLink> para manter a navegação do SPA. */
  asChild?: boolean
}

export function Link({ className, asChild, ...props }: LinkProps) {
  const Comp = asChild ? Slot.Root : 'a'
  return (
    <Comp
      className={cn(
        'rounded-xs font-medium text-link underline decoration-current/30 underline-offset-4',
        'transition-[text-decoration-color,color] duration-150 ease-out hover:decoration-current',
        className,
      )}
      {...props}
    />
  )
}
