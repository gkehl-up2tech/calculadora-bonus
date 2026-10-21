import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { toneOutline, toneSoft, toneSolid, type Tone } from '../foundations'

const badgeVariants = cva('inline-flex shrink-0 items-center gap-1 rounded-full font-semibold whitespace-nowrap', {
  variants: {
    size: {
      sm: 'h-5 px-2 text-xs [&_svg]:size-3',
      md: 'h-6 px-2.5 text-xs [&_svg]:size-3.5',
    },
  },
  defaultVariants: { size: 'md' },
})

export interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {
  tone?: Tone
  /** soft = fundo suave (padrão) · solid = fundo forte · outline = só borda */
  appearance?: 'soft' | 'solid' | 'outline'
}

export function Badge({ className, size, tone = 'neutral', appearance = 'soft', ...props }: BadgeProps) {
  const toneClass = { soft: toneSoft, solid: toneSolid, outline: toneOutline }[appearance][tone]
  return <span className={cn(badgeVariants({ size }), toneClass, className)} {...props} />
}
