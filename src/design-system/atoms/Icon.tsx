import type { LucideIcon, LucideProps } from 'lucide-react'
import { cn } from '@/lib/cn'

const sizes = { xs: 'size-3.5', sm: 'size-4', md: 'size-5', lg: 'size-6', xl: 'size-8' } as const

export interface IconProps extends Omit<LucideProps, 'size' | 'ref'> {
  icon: LucideIcon
  size?: keyof typeof sizes
  /** Só informe `label` quando o ícone carrega significado sozinho; caso contrário fica oculto a leitores de tela. */
  label?: string
}

/** Wrapper único para ícones (Lucide). Garante tamanhos do sistema e acessibilidade. */
export function Icon({ icon: Glyph, size = 'sm', label, className, strokeWidth = 1.75, ...props }: IconProps) {
  return (
    <Glyph
      className={cn('shrink-0', sizes[size], className)}
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      {...props}
    />
  )
}
