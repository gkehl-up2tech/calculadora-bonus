import type { ComponentProps, ReactNode } from 'react'
import { Slot } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

export const buttonVariants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold',
    // Feedback imediato ao toque: escala sutil no :active, 150ms ease-out. Só propriedades específicas (nunca `all`).
    'transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
        secondary: 'bg-surface text-fg shadow-card hover:bg-subtle active:bg-muted',
        soft: 'bg-primary-soft text-primary-soft-fg hover:bg-primary-soft-hover',
        ghost: 'text-fg-muted hover:bg-subtle hover:text-fg active:bg-muted',
        danger: 'bg-danger text-on-danger hover:bg-danger-hover active:bg-danger-active',
        'danger-ghost': 'text-tone-danger-fg hover:bg-tone-danger-soft',
      },
      size: {
        sm: 'h-control-sm gap-1.5 px-3 text-sm [&_svg]:size-4',
        md: 'h-control-md px-4 text-sm [&_svg]:size-4',
        lg: 'h-control-lg px-5 text-base [&_svg]:size-5',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

export interface ButtonProps extends ComponentProps<'button'>, ButtonVariants {
  /** Renderiza o filho (ex.: <Link>) com a aparência do botão. */
  asChild?: boolean
  /** Mostra spinner, desabilita o clique e marca aria-busy. A largura é preservada. */
  loading?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export function Button({
  className,
  variant,
  size,
  asChild,
  loading,
  leadingIcon,
  trailingIcon,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className)

  if (asChild) {
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leadingIcon
      )}
      {children}
      {trailingIcon}
    </button>
  )
}
