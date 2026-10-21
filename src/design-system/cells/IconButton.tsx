import type { LucideIcon } from 'lucide-react'
import { Button, Icon, type ButtonProps } from '../atoms'
import { cn } from '@/lib/cn'

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leadingIcon' | 'trailingIcon' | 'aria-label'> {
  icon: LucideIcon
  /** Obrigatório: botão sem texto precisa de nome acessível. Também serve de texto para Tooltip. */
  label: string
}

const square = { sm: 'size-control-sm', md: 'size-control-md', lg: 'size-control-lg' } as const

/** Button + Icon quadrado. */
export function IconButton({ icon, label, size = 'md', variant = 'ghost', className, ...props }: IconButtonProps) {
  return (
    <Button variant={variant} size={size} aria-label={label} className={cn('px-0', square[size ?? 'md'], className)} {...props}>
      <Icon icon={icon} size={size === 'lg' ? 'md' : 'sm'} />
    </Button>
  )
}
