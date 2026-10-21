import { useState, type ReactNode } from 'react'
import { Check, Code2, Copy } from 'lucide-react'
import { Badge, Button, Heading, Text } from '@/design-system'
import { cn } from '@/lib/cn'

export interface SpecimenProps {
  title: string
  description?: ReactNode
  /** Átomos/células usados na composição (mostra a hierarquia). */
  composedOf?: string[]
  code?: string
  children: ReactNode
  /** Classes do container de visualização (padrão: linha com quebra). */
  previewClassName?: string
  className?: string
}

/** Bloco de documentação: título, descrição, visualização ao vivo e código copiável. */
export function Specimen({ title, description, composedOf, code, children, previewClassName, className }: SpecimenProps) {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copy() {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard indisponível */
    }
  }

  return (
    <article className={cn('grid gap-3', className)}>
      <div className="grid gap-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Heading level={5} size="lg">{title}</Heading>
          {composedOf?.length ? (
            <div className="flex flex-wrap items-center gap-1" aria-label="Composto por">
              <Text as="span" variant="small" tone="subtle">composto por</Text>
              {composedOf.map((c) => <Badge key={c} tone="neutral" appearance="outline" size="sm">{c}</Badge>)}
            </div>
          ) : null}
        </div>
        {description ? <Text tone="muted" className="max-w-prose text-pretty">{description}</Text> : null}
      </div>

      <div className="overflow-hidden rounded-lg bg-surface shadow-card">
        <div className={cn('flex flex-wrap items-center gap-3 p-5', previewClassName)}>{children}</div>
        {code ? (
          <div className="border-t border-line-subtle">
            <div className="flex items-center justify-between px-3 py-1.5">
              <Button variant="ghost" size="sm" leadingIcon={<Code2 aria-hidden />} aria-expanded={showCode} onClick={() => setShowCode((v) => !v)}>
                {showCode ? 'Ocultar código' : 'Ver código'}
              </Button>
              {showCode ? (
                <Button variant="ghost" size="sm" leadingIcon={copied ? <Check aria-hidden /> : <Copy aria-hidden />} onClick={copy}>
                  {copied ? 'Copiado' : 'Copiar'}
                </Button>
              ) : null}
            </div>
            {showCode ? (
              <pre tabIndex={0} aria-label={`Código de exemplo: ${title}`} className="overflow-x-auto bg-subtle p-4 font-mono text-[0.8125rem] leading-6 text-fg"><code>{code}</code></pre>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
