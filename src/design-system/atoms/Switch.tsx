import type { ComponentProps } from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'
import { cn } from '@/lib/cn'

export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer relative inline-flex h-6 w-10 shrink-0 items-center rounded-full bg-line-control p-0.5',
        'transition-[background-color] duration-200 ease-out data-[state=checked]:bg-primary',
        'after:absolute after:-inset-1 after:content-[""]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block size-5 rounded-full bg-white',
          'transition-transform duration-200 ease-out data-[state=checked]:translate-x-4',
        )}
      />
    </SwitchPrimitive.Root>
  )
}
