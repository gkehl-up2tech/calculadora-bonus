import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, X } from 'lucide-react'
import {
  Alert, Button, ConfirmDialog, Dialog, DialogContent, FieldMessage, FileDropzone, FormField, FormGrid, Icon, IconButton, Input, Select, SwitchField, Text, Textarea, toast,
  type FileRejection,
} from '@/design-system'
import { useSession } from '@/app/access/session'
import { DEPARTMENTS } from '@/app/products/sample-products'
import { templateCsv } from '@/app/products/import'
import {
  MAX_REQUEST_FILE_MB, REQUEST_FILE_TYPES, createRequest, formatFileSize, isCsv, readRequestFile, validateRequest,
  type RequestErrors, type RequestFile, type RequestInput,
} from '@/app/requests/requests'
import { EMBEDDED } from '@/lib/embedded'

const EMPTY: RequestInput = { title: '', departamento: '', categoria: '', urgent: false, file: null }

export interface NewRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Solicitar cadastro (gerente de produto): o essencial para a equipe de cadastro começar, num formato único.
 * Título, departamento e categoria, se é urgente e o arquivo (CSV ou DOC) com os dados do produto.
 */
export function NewRequestDialog({ open, onOpenChange }: NewRequestDialogProps) {
  const user = useSession()
  const [input, setInput] = useState<RequestInput>(EMPTY)
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [wasOpen, setWasOpen] = useState(open)
  const [fileProblem, setFileProblem] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [showText, setShowText] = useState(false)

  // Cada abertura começa do zero (ajuste de estado durante a renderização, sem efeito).
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setInput(EMPTY)
      setTouched(new Set())
      setSubmitted(false)
      setFileProblem(null)
      setShowText(false)
    }
  }

  const errors: RequestErrors = validateRequest(input)
  const visible = (id: keyof RequestErrors) => (submitted || touched.has(id) ? errors[id] : undefined)
  const dirty = JSON.stringify({ ...input, file: input.file?.name }) !== JSON.stringify({ ...EMPTY, file: undefined })
  const template = templateCsv(user).slice(1) /* sem o BOM */

  const set = <K extends keyof RequestInput>(key: K, value: RequestInput[K]) => setInput((v) => ({ ...v, [key]: value }))
  const touch = (id: string) => setTouched((t) => (t.has(id) ? t : new Set(t).add(id)))

  function requestClose() {
    if (dirty) setDiscardOpen(true)
    else onOpenChange(false)
  }

  async function pick(files: File[], rejected: FileRejection[]) {
    setFileProblem(rejected[0] ? `${rejected[0].file.name}: ${rejected[0].reason} Envie um arquivo CSV ou DOC de até ${MAX_REQUEST_FILE_MB} MB.` : null)
    const file = files[0]
    if (!file) return
    setBusy(true)
    try {
      set('file', await readRequestFile(file))
    } catch {
      setFileProblem('Não foi possível ler o arquivo. Tente de novo.')
    } finally {
      setBusy(false)
    }
  }

  function submit() {
    const first = (['title', 'departamento', 'categoria', 'file'] as const).find((id) => errors[id])
    if (first) {
      setSubmitted(true)
      document.getElementById(`pedido-${first}`)?.focus()
      return
    }
    const request = createRequest(input, user)
    onOpenChange(false)
    toast.success('Solicitação enviada', { description: `${request.title} entrou na fila da equipe de cadastro${request.urgent ? ' como urgente' : ''}. Você acompanha em Solicitações.` })
  }

  function downloadTemplate() {
    const url = URL.createObjectURL(new Blob([templateCsv(user)], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'modelo-solicitacao-produto.csv'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(template)
      toast.success('Modelo copiado', { description: 'Cole em uma planilha, preencha e salve como CSV.' })
    } catch {
      setShowText(true)
    }
  }

  const file: RequestFile | null = input.file

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : requestClose())}>
        <DialogContent
          size="lg"
          title="Solicitar cadastro"
          description="Peça à equipe de cadastro para criar um produto. Informe o essencial e anexe o arquivo com os dados."
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            document.getElementById('pedido-title')?.focus()
          }}
          footer={
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={requestClose}>Cancelar</Button>
              <Button onClick={submit} disabled={busy}>Enviar solicitação</Button>
            </div>
          }
        >
          <div
            role="group"
            aria-label="Dados da solicitação"
            // Sem <form> nativo: páginas hospedadas em iframe isolado bloqueiam o envio de formulários.
            onKeyDown={(e) => {
              const t = e.target
              if (e.key !== 'Enter' || e.defaultPrevented || !(t instanceof HTMLInputElement) || !e.currentTarget.contains(t)) return
              e.preventDefault()
              submit()
            }}
            className="grid gap-5"
          >
            <FormGrid>
              <FormField id="pedido-title" label="Título do produto" required error={visible('title')} className="sm:col-span-2">
                {(c) => <Input {...c} value={input.title} maxLength={120} autoComplete="off" onChange={(e) => set('title', e.target.value)} onBlur={() => touch('title')} />}
              </FormField>
              <FormField id="pedido-departamento" label="Departamento" required error={visible('departamento')}>
                {(c) => (
                  <Select {...c} value={input.departamento} onValueChange={(v) => { set('departamento', v); touch('departamento') }} options={DEPARTMENTS.map((d) => ({ value: d, label: d }))} invalid={Boolean(visible('departamento'))} />
                )}
              </FormField>
              <FormField id="pedido-categoria" label="Categoria" required hint="Dentro do departamento. Ex.: Cadeiras, Celulares, Fontes de alimentação." error={visible('categoria')}>
                {(c) => <Input {...c} value={input.categoria} maxLength={60} autoComplete="off" onChange={(e) => set('categoria', e.target.value)} onBlur={() => touch('categoria')} />}
              </FormField>
            </FormGrid>

            <SwitchField
              id="pedido-urgente"
              label="Urgente"
              description="Marque só quando houver prazo que não pode esperar. A equipe vê estas solicitações primeiro."
              checked={input.urgent}
              onCheckedChange={(v) => set('urgent', v)}
              className="min-h-control-md rounded-md border border-line px-3 py-2"
            />

            <section className="grid gap-2" aria-labelledby="pedido-arquivo-titulo">
              <div>
                <Text id="pedido-arquivo-titulo" weight="semibold">Arquivo com os dados do produto <span aria-hidden className="text-tone-danger-fg">*</span></Text>
                <Text variant="small" tone="muted">CSV ou DOC com tudo o que já se sabe: marca, medidas, GTIN, NCM, descrição, fotos em link… Use o modelo CSV para manter o mesmo formato.</Text>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {EMBEDDED ? (
                  <Button variant="secondary" size="sm" leadingIcon={<FileSpreadsheet aria-hidden />} onClick={copyTemplate}>Copiar modelo CSV</Button>
                ) : (
                  <Button variant="secondary" size="sm" leadingIcon={<Download aria-hidden />} onClick={downloadTemplate}>Baixar modelo CSV</Button>
                )}
              </div>
              {showText ? <Textarea readOnly rows={4} value={template} aria-label="Modelo de CSV" className="font-mono text-xs" onFocus={(e) => e.currentTarget.select()} /> : null}

              {file ? (
                <div className="flex items-center gap-3 rounded-lg bg-subtle px-3 py-2">
                  <Icon icon={isCsv(file) ? FileSpreadsheet : FileText} className="text-fg-subtle" />
                  <div className="min-w-0 flex-1">
                    <Text className="truncate font-medium">{file.name}</Text>
                    <Text variant="small" tone="muted">{formatFileSize(file.size)}</Text>
                  </div>
                  <IconButton label="Remover o arquivo" icon={X} size="sm" onClick={() => set('file', null)} />
                </div>
              ) : (
                <div onBlur={() => touch('file')}>
                  <FileDropzone
                    accept={REQUEST_FILE_TYPES}
                    maxSizeMb={MAX_REQUEST_FILE_MB}
                    onFiles={pick}
                    disabled={busy}
                    title={busy ? 'Lendo o arquivo…' : undefined}
                    hint={`CSV, DOC ou DOCX, até ${MAX_REQUEST_FILE_MB} MB`}
                  />
                  <span id="pedido-file" tabIndex={-1} className="sr-only" />
                </div>
              )}
              {fileProblem ? <Alert tone="danger" title="Arquivo não aceito">{fileProblem}</Alert> : null}
              {visible('file') && !file ? <FieldMessage kind="error">{errors.file}</FieldMessage> : null}
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        tone="danger"
        title="Descartar a solicitação?"
        description="O que você preencheu será perdido."
        confirmLabel="Descartar"
        cancelLabel="Continuar editando"
        onConfirm={() => {
          setDiscardOpen(false)
          onOpenChange(false)
        }}
      />
    </>
  )
}
