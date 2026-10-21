import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export interface LogoProps extends ComponentProps<'span'> {
  /** Só o símbolo (menus recolhidos, favicon). */
  markOnly?: boolean
  /** Só o texto "UP2Tech", sem o símbolo. */
  wordmarkOnly?: boolean
}

/** Marca da UP2Tech. Provisória: troque o SVG/texto pelo logotipo oficial quando disponível. */
export function Logo({ className, markOnly, wordmarkOnly, ...props }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-fg', className)} {...props}>
      {wordmarkOnly ? null : (
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" role="img" aria-label={markOnly ? 'UP2Tech' : undefined} aria-hidden={markOnly ? undefined : true}>
        <rect width="32" height="32" rx="8" className="fill-brand-800" />
        <path
          d="M9 22V10m0 0-3 3m3-3 3 3M16 10v8a3 3 0 0 0 6 0v-8"
          className="stroke-brand-300"
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      )}
      {markOnly ? null : (
        <span className="text-lg leading-none font-bold tracking-tight">
          UP<span className="text-link">2</span>Tech
        </span>
      )}
    </span>
  )
}
