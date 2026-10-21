import type { ComponentProps, ReactNode } from 'react'
import { Avatar, Text, type AvatarProps } from '../atoms'
import { cn } from '@/lib/cn'

export interface PersonaProps extends ComponentProps<'div'> {
  name: string
  description?: ReactNode
  src?: string
  size?: AvatarProps['size']
}

/** Avatar + nome + texto secundário (cargo, e-mail). */
export function Persona({ name, description, src, size = 'md', className, ...props }: PersonaProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)} {...props}>
      <Avatar name={name} src={src} size={size} decorative />
      <div className="min-w-0">
        <Text weight="semibold" truncate>{name}</Text>
        {description ? <Text variant="small" tone="muted" truncate>{description}</Text> : null}
      </div>
    </div>
  )
}
