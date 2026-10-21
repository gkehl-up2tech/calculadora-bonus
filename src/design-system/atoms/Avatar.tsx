import type { ComponentProps } from 'react'
import { Avatar as AvatarPrimitive } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { getInitials } from '@/lib/format'

const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft font-semibold text-primary-soft-fg select-none',
  {
    variants: {
      size: {
        xs: 'size-6 text-[0.625rem]',
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-12 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export interface AvatarProps extends ComponentProps<typeof AvatarPrimitive.Root>, VariantProps<typeof avatarVariants> {
  /** Nome da pessoa: gera as iniciais do fallback e o texto alternativo. */
  name: string
  src?: string
  /** Use quando o nome já aparece em texto ao lado (ex.: Persona): oculta o avatar de leitores de tela. */
  decorative?: boolean
}

export function Avatar({ className, size, name, src, decorative, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      // role=img + nome: o conjunto vira UMA imagem (as iniciais não são lidas nem contam como texto visível).
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {src ? <AvatarPrimitive.Image src={src} alt="" className="size-full object-cover" /> : null}
      {/* Iniciais desenhadas por CSS (content: attr): são decorativas — o nome acessível está no role=img. */}
      <AvatarPrimitive.Fallback
        delayMs={src ? 300 : 0}
        aria-hidden
        data-initials={getInitials(name)}
        className="after:content-[attr(data-initials)]"
      />
    </AvatarPrimitive.Root>
  )
}
