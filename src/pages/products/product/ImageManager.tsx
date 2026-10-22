import { useState } from 'react'
import { Star, Trash2 } from 'lucide-react'
import { Badge, FieldMessage, FileDropzone, IconButton, Input, NativeSelect, Spinner, Text, Thumbnail, Tooltip, type FileRejection } from '@/design-system'
import type { ImageKind, ProductImage } from '@/app/products/detail'
import { IMAGE_TYPES, MAX_IMAGE_MB, loadImage } from '@/lib/images'

export const MAX_IMAGES = 10

const KIND_LABEL: Record<ImageKind, string> = {
  principal: 'Principal',
  'fundo-branco': 'Fundo branco',
  detalhe: 'Detalhe',
  escala: 'Em uso / escala',
}

const newId = () => `img-${Math.random().toString(36).slice(2, 9)}`

export interface ImageManagerProps {
  images: ProductImage[]
  onChange: (images: ProductImage[]) => void
  /** Mostra texto alternativo e tipo de cada foto (aba Imagens). No cadastro rápido fica só o essencial. */
  detailed?: boolean
}

/**
 * Adicionar, remover e ordenar fotos. A primeira é a principal (a que aparece na lista de produtos); "Tornar principal"
 * leva a foto para o começo. As fotos são reduzidas a 2000 px e ficam em memória (provisório, como o resto dos dados).
 */
export function ImageManager({ images, onChange, detailed }: ImageManagerProps) {
  const [busy, setBusy] = useState(false)
  const [problems, setProblems] = useState<string[]>([])

  async function add(files: File[], rejected: FileRejection[]) {
    const issues = rejected.map((r) => `${r.file.name}: ${r.reason}`)
    const room = MAX_IMAGES - images.length
    if (files.length > room) issues.push(`Cabem no máximo ${MAX_IMAGES} fotos: ${files.length - room} ${files.length - room === 1 ? 'ficou' : 'ficaram'} de fora.`)
    setProblems(issues)
    const take = files.slice(0, Math.max(0, room))
    if (take.length === 0) return
    setBusy(true)
    const loaded: ProductImage[] = []
    for (const file of take) {
      try {
        const img = await loadImage(file)
        loaded.push({ id: newId(), src: img.src, kind: 'detalhe', alt: '', width: img.width, height: img.height, sizeKb: img.sizeKb })
      } catch (e) {
        issues.push(`${file.name}: ${e instanceof Error ? e.message : 'não foi possível ler.'}`)
      }
    }
    setProblems([...issues])
    setBusy(false)
    if (loaded.length) onChange([...images, ...loaded].map((img, i) => (i === 0 ? { ...img, kind: 'principal' } : img)))
  }

  const update = (id: string, patch: Partial<ProductImage>) => onChange(images.map((img) => (img.id === id ? { ...img, ...patch } : img)))
  const remove = (id: string) =>
    onChange(images.filter((img) => img.id !== id).map((img, i) => (i === 0 ? { ...img, kind: 'principal' } : img)))
  const makeMain = (id: string) => {
    const pick = images.find((img) => img.id === id)
    if (!pick) return
    const rest = images.filter((img) => img.id !== id).map((img) => (img.kind === 'principal' ? { ...img, kind: 'detalhe' as const } : img))
    onChange([{ ...pick, kind: 'principal' }, ...rest])
  }

  return (
    <div className="grid gap-3">
      {images.length < MAX_IMAGES ? (
        <FileDropzone
          accept={IMAGE_TYPES}
          multiple
          maxSizeMb={MAX_IMAGE_MB}
          compact={images.length > 0}
          disabled={busy}
          onFiles={add}
          title={images.length ? 'Adicionar mais fotos' : 'Arraste as fotos aqui ou clique para escolher'}
          hint={`JPG, PNG ou WebP, até ${MAX_IMAGE_MB} MB cada. Até ${MAX_IMAGES} fotos. A primeira é a principal.`}
        />
      ) : (
        <Text variant="small" tone="muted">Limite de {MAX_IMAGES} fotos atingido. Remova uma para adicionar outra.</Text>
      )}
      <div aria-live="polite" className="grid gap-1">
        {busy ? <span className="inline-flex items-center gap-2 text-sm text-fg-muted"><Spinner size="sm" label="Processando as fotos" />Processando as fotos…</span> : null}
        {problems.map((p) => <FieldMessage key={p} kind="error">{p}</FieldMessage>)}
      </div>
      {images.length > 0 ? (
        <ul className={detailed ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4' : 'grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5'}>
          {images.map((img, i) => (
            <li key={img.id} className="grid content-start gap-2">
              <div className="relative">
                <Thumbnail src={img.src} alt={img.alt || `Foto ${i + 1}`} size="fill" className="rounded-lg" />
                {i === 0 ? <Badge tone="brand" size="sm" className="absolute top-1.5 left-1.5">Principal</Badge> : null}
              </div>
              <div className="flex items-center justify-between gap-1">
                <Text variant="small" tone="muted" className="tabular-nums">{img.width} × {img.height}</Text>
                <div className="flex gap-0.5">
                  {i > 0 ? (
                    <Tooltip content="Tornar principal">
                      <IconButton icon={Star} label={`Tornar a foto ${i + 1} a principal`} size="sm" onClick={() => makeMain(img.id)} />
                    </Tooltip>
                  ) : null}
                  <Tooltip content="Remover">
                    <IconButton icon={Trash2} label={`Remover a foto ${i + 1}`} size="sm" onClick={() => remove(img.id)} />
                  </Tooltip>
                </div>
              </div>
              {detailed ? (
                <>
                  <Input size="sm" value={img.alt} onChange={(e) => update(img.id, { alt: e.target.value })} placeholder="Texto alternativo" aria-label={`Texto alternativo da foto ${i + 1}`} maxLength={125} />
                  {i === 0 ? null : (
                    <NativeSelect size="sm" aria-label={`Tipo da foto ${i + 1}`} value={img.kind} onChange={(e) => update(img.id, { kind: e.target.value as ImageKind })}>
                      {(['detalhe', 'fundo-branco', 'escala'] as const).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
                    </NativeSelect>
                  )}
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
