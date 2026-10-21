import type { ComponentProps, ElementType, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Icon } from '../atoms'
import { cn } from '@/lib/cn'

type NavItemOwnProps = {
  icon?: LucideIcon
  /** Contador ou Badge à direita. */
  trailing?: ReactNode
  /** Marca como página atual para links simples. Com NavLink o aria-current já vem pronto. */
  active?: boolean
}

export type NavItemProps<T extends ElementType = 'a'> = NavItemOwnProps & { as?: T } & Omit<ComponentProps<T>, keyof NavItemOwnProps | 'as'>

/** Icon + texto (+ contador) como item de navegação. Estilo ativo via aria-current="page". */
export function NavItem<T extends ElementType = 'a'>({ as, icon, trailing, active, className, children, ...props }: NavItemProps<T>) {
  const Comp: ElementType = as ?? 'a'
  return (
    <Comp
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex h-control-md items-center gap-3 rounded-md px-3 text-sm font-medium text-fg-muted',
        'transition-[background-color,color,transform] duration-150 ease-out hover:bg-subtle hover:text-fg active:scale-[0.98]',
        'aria-[current=page]:bg-primary-soft aria-[current=page]:text-primary-soft-fg aria-[current=page]:font-semibold',
        className,
      )}
      {...props}
    >
      {icon ? <Icon icon={icon} size="md" /> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing}
    </Comp>
  )
}
