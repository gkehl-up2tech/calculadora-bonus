import type { ComponentProps, ReactNode } from 'react'
import { DropdownMenu as MenuPrimitive } from 'radix-ui'
import { Check, Circle, type LucideIcon } from 'lucide-react'
import { Icon } from '../atoms'
import { ShortcutHint } from '../cells'
import { menuItem, overlayPanel, popAnimation } from '../foundations'
import { cn } from '@/lib/cn'

export const DropdownMenu = MenuPrimitive.Root
export const DropdownMenuTrigger = MenuPrimitive.Trigger
export const DropdownMenuGroup = MenuPrimitive.Group
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup

export function DropdownMenuContent({ className, align = 'end', sideOffset = 6, ...props }: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={cn(overlayPanel, popAnimation, 'min-w-48 origin-(--radix-dropdown-menu-content-transform-origin) p-1', className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  )
}

export interface DropdownMenuItemProps extends ComponentProps<typeof MenuPrimitive.Item> {
  icon?: LucideIcon
  shortcut?: string[]
  /** Ação destrutiva (excluir): texto em vermelho. */
  destructive?: boolean
}

export function DropdownMenuItem({ icon, shortcut, destructive, className, children, ...props }: DropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item
      className={cn(menuItem, destructive && 'text-tone-danger-fg data-[highlighted]:bg-tone-danger-soft', className)}
      {...props}
    >
      {icon ? <Icon icon={icon} size="sm" className={destructive ? undefined : 'text-fg-subtle'} /> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut ? <ShortcutHint keys={shortcut} className="ml-4" /> : null}
    </MenuPrimitive.Item>
  )
}

export function DropdownMenuCheckboxItem({ className, children, ...props }: ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem className={cn(menuItem, 'pl-8', className)} {...props}>
      <span className="absolute left-2.5 inline-flex">
        <MenuPrimitive.ItemIndicator><Check aria-hidden className="size-4" /></MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

export function DropdownMenuRadioItem({ className, children, ...props }: ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem className={cn(menuItem, 'pl-8', className)} {...props}>
      <span className="absolute left-2.5 inline-flex">
        <MenuPrimitive.ItemIndicator><Circle aria-hidden className="size-2 fill-current" /></MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label className={cn('px-2.5 py-1.5 text-xs font-semibold tracking-wide text-fg-subtle uppercase', className)} {...props} />
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={cn('-mx-1 my-1 h-px bg-line-subtle', className)} {...props} />
}

/** Cabeçalho livre dentro do menu (ex.: Persona do usuário). */
export function DropdownMenuHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-2.5 py-2', className)}>{children}</div>
}
