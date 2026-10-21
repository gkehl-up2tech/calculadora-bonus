import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const headingVariants = cva('font-semibold text-fg text-balance', {
  variants: {
    size: {
      display: 'text-4xl leading-10 font-bold tracking-tight',
      '3xl': 'text-3xl leading-9 font-bold tracking-tight',
      '2xl': 'text-2xl leading-8 font-semibold tracking-tight',
      xl: 'text-xl leading-7 font-semibold tracking-tight',
      lg: 'text-lg leading-7 font-semibold',
      md: 'text-base leading-6 font-semibold',
      sm: 'text-sm leading-5 font-semibold',
    },
  },
  defaultVariants: { size: 'xl' },
})

export interface HeadingProps extends ComponentProps<'h2'>, VariantProps<typeof headingVariants> {
  /** Nível semântico (h1–h6) — independente do tamanho visual. */
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export function Heading({ level = 2, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as 'h2'
  return <Tag className={cn(headingVariants({ size }), className)} {...props} />
}
