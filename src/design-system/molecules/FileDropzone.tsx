import { useId, useState, type DragEvent, type ReactNode } from 'react'
import { Upload } from 'lucide-react'
import { Icon } from '../atoms'
import { cn } from '@/lib/cn'

export interface FileRejection {
  file: File
  reason: string
}

export interface FileDropzoneProps {
  /** Tipos aceitos: MIME ("image/png") e/ou extensões (".csv"). */
  accept: string[]
  multiple?: boolean
  /** Tamanho máximo por arquivo, em MB. */
  maxSizeMb?: number
  /** Recebe os arquivos válidos e os recusados (com o motivo, em português, pronto para mostrar). */
  onFiles: (files: File[], rejected: FileRejection[]) => void
  title?: ReactNode
  hint?: ReactNode
  disabled?: boolean
  /** Versão baixa, para quando já há arquivos na tela. */
  compact?: boolean
  className?: string
}

const matches = (file: File, accept: string[]) =>
  accept.some((a) => (a.startsWith('.') ? file.name.toLowerCase().endsWith(a.toLowerCase()) : a.endsWith('/*') ? file.type.startsWith(a.slice(0, -1)) : file.type === a))

/**
 * Área para escolher arquivos: clique, teclado (o campo de arquivo recebe o foco) ou arrastar e soltar.
 * Valida tipo e tamanho e devolve os recusados com o motivo; quem usa decide como mostrar.
 */
export function FileDropzone({ accept, multiple, maxSizeMb, onFiles, title, hint, disabled, compact, className }: FileDropzoneProps) {
  const id = useId()
  const [dragging, setDragging] = useState(false)

  function handle(list: FileList | null) {
    if (!list || list.length === 0) return
    const all = Array.from(list)
    const files: File[] = []
    const rejected: FileRejection[] = []
    for (const file of multiple ? all : all.slice(0, 1)) {
      if (!matches(file, accept)) rejected.push({ file, reason: 'Tipo de arquivo não aceito.' })
      else if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) rejected.push({ file, reason: `Passa de ${maxSizeMb} MB.` })
      else files.push(file)
    }
    onFiles(files, rejected)
  }

  const stop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <label
      htmlFor={id}
      onDragEnter={(e) => { stop(e); if (!disabled) setDragging(true) }}
      onDragOver={stop}
      onDragLeave={(e) => { stop(e); if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false) }}
      onDrop={(e) => { stop(e); setDragging(false); if (!disabled) handle(e.dataTransfer.files) }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line-control bg-subtle text-center',
        'transition-[background-color,border-color] duration-150 ease-out hover:border-fg-subtle',
        'has-[input:focus-visible]:border-focus has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-focus/25',
        compact ? 'px-4 py-4' : 'px-4 py-7',
        dragging && 'border-primary bg-primary-soft',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <input
        id={id}
        type="file"
        className="sr-only"
        accept={accept.join(',')}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          handle(e.target.files)
          e.target.value = '' // permite escolher o mesmo arquivo de novo
        }}
      />
      <Icon icon={Upload} size={compact ? 'md' : 'lg'} className="text-fg-subtle" />
      <span className="text-sm font-semibold text-fg">{title ?? 'Arraste o arquivo aqui ou clique para escolher'}</span>
      {hint ? <span className="text-xs text-fg-muted">{hint}</span> : null}
    </label>
  )
}
