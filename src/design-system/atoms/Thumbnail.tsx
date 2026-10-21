import { useState, type ComponentProps } from 'react'
import { Package } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const thumbnailVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-subtle text-fg-subtle shadow-border',
  {
    variants: {
      size: { sm: 'size-8', md: 'size-10', lg: 'size-12', xl: 'size-16' },
    },
    defaultVariants: { size: 'md' },
  },
)

export interface ThumbnailProps extends Omit<ComponentProps<'span'>, 'children'>, VariantProps<typeof thumbnailVariants> {
  src?: string
  /**
   * Descrição da imagem. Passe "" quando o texto ao lado já descreve o item (ex.: o título do produto
   * na mesma linha da tabela): a foto vira decorativa e não é lida duas vezes.
   */
  alt: string
}

/**
 * Miniatura quadrada de foto (produto, anexo). Sem `src` ou se a imagem falhar ao carregar, mostra um
 * ícone no lugar — o layout nunca "quebra". Carrega sob demanda (lazy) para tabelas longas.
 */
export function Thumbnail({ src, alt, size, className, ...props }: ThumbnailProps) {
  // Guarda QUAL src falhou: ao trocar a imagem, a nova tenta carregar de novo.
  const [failedSrc, setFailedSrc] = useState<string>()
  const showImage = Boolean(src) && src !== failedSrc
  return (
    <span className={cn(thumbnailVariants({ size }), className)} {...props}>
      {showImage ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} onError={() => setFailedSrc(src)} className="size-full object-cover" />
      ) : (
        <span role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className="inline-flex size-full items-center justify-center">
          <Package aria-hidden className="size-1/2" strokeWidth={1.5} />
        </span>
      )}
    </span>
  )
}
