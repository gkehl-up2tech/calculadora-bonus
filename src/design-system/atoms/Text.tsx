import type { ComponentProps, ElementType } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const textVariants = cva('', {
  variants: {
    variant: {
      body: 'text-sm leading-5',
      lead: 'text-base leading-6',
      small: 'text-xs leading-4',
      caption: 'text-xs leading-4',
      overline: 'text-xs leading-4 font-semibold tracking-wider uppercase',
      code: 'font-mono text-[0.8125rem] leading-5',
    },
    tone: {
      default: 'text-fg',
      muted: 'text-fg-muted',
      subtle: 'text-fg-subtle',
      success: 'text-tone-success-fg',
      warning: 'text-tone-warning-fg',
      danger: 'text-tone-danger-fg',
      info: 'text-tone-info-fg',
    },
    weight: { regular: 'font-normal', medium: 'font-medium', semibold: 'font-semibold' },
  },
  defaultVariants: { variant: 'body', tone: 'default', weight: 'regular' },
})

export interface TextProps extends Omit<ComponentProps<'p'>, 'color'>, VariantProps<typeof textVariants> {
  as?: ElementType
  /** Números alinhados em colunas (valores, códigos, quantidades). */
  tabular?: boolean
  truncate?: boolean
}

export function Text({ as: Tag = 'p', variant, tone, weight, tabular, truncate, className, ...props }: TextProps) {
  // `caption` já nasce discreto; o tom padrão vira "subtle" para não repetir a prop.
  const resolvedTone = tone ?? (variant === 'caption' || variant === 'overline' ? 'subtle' : 'default')
  return (
    <Tag
      className={cn(textVariants({ variant, tone: resolvedTone, weight }), tabular && 'tabular-nums', truncate && 'truncate', className)}
      {...props}
    />
  )
}
