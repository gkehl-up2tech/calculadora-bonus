import type { ComponentProps } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Icon, Text } from '../atoms'
import { cn } from '@/lib/cn'

export interface IconLabelProps extends ComponentProps<'span'> {
  icon: LucideIcon
}

/** Icon + Text na mesma linha, alinhados pela linha de base visual. */
export function IconLabel({ icon, children, className, ...props }: IconLabelProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)} {...props}>
      <Icon icon={icon} size="sm" className="text-fg-subtle" />
      <Text as="span" tone="muted">{children}</Text>
    </span>
  )
}
