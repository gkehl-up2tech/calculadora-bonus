import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Button, ConfirmDialog, Dialog, DialogContent, FieldLabel, FieldMessage, FormGrid, SegmentedControl, Text, toast, type FileRejection,
} from '@/design-system'
import { can } from '@/app/access/permissions'
import { useSession } from '@/app/access/session'
import { canOwn, userName, type AppUser } from '@/app/access/users'
import { completeRequest, formatFileSize, type RegistrationRequest } from '@/app/requests/requests'
import { createProduct, createProducts, emptyValues, suggestSku, type ProductImage } from '@/app/products/detail'
import { MAX_IMPORT_MB, parseImport, type ImportResult } from '@/app/products/import'
import { FIELDS, TABS, pendingFields, type FieldValue, type Values } from '@/app/products/schema'
import { routes } from '@/app/navigation'
import { ImportPanel } from './ImportPanel'
import { FieldControl } from './product/FieldControl'
import { ImageManager } from './product/ImageManager'
import { displayText } from './product/value'
import { validate } from '@/app/products/validate'

const field = (id: string) => FIELDS.find((f) => f.id === id)!

/** Ordem em que os campos aparecem: define também qual erro recebe o foco primeiro. */
const ORDER = ['title', 'departamento', 'unidade', 'tipo', 'sku', 'marca', 'ean', 'responsavel', 'descricaoCurta', 'ncm', 'origem']

const TIPO_HINT: Record<string, string> = {
  simples: 'Um item único, sem variações.',
  variacoes: 'Tamanho, cor… As variações são cadastradas depois, na aba Variações e kits.',
  kit: 'Junta outros produtos. Os itens do kit são definidos depois, na aba Variações e kits.',
}

/** Quem só cadastra (Acesso comum) não é responsável por produtos: escolhe o responsável. A solicitação já traz quem pediu. */
function initialValues(user: AppUser, request?: RegistrationRequest): Values {
  const base: Values = { ...emptyValues(), status: 'draft', tipo: 'simples', unidade: 'UN', sku: suggestSku(), responsavel: canOwn(user) ? user.id : '' }
  return request ? { ...base, title: request.title, departamento: request.departamento, categoria: request.categoria, responsavel: request.requestedBy } : base
}

export interface NewProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Atende uma solicitação: parte dos dados do pedido e, ao criar, marca a solicitação como atendida. */
  request?: RegistrationRequest
}

/**
 * Novo produto, em modal, de duas formas: UM produto (cadastro rápido) ou VÁRIOS por CSV (ImportPanel).
 * Cadastro rápido: pede só o essencial para existir (título, departamento, tipo, SKU, unidade) e, se já se
 * souber, marca, GTIN, descrição e NCM/origem. O produto nasce como RASCUNHO e o resto é completado na página dele;
 * o rodapé mostra, ao vivo, o que ficará pendente. "Criar e adicionar outro" mantém departamento, marca e unidade.
 */
export function NewProductDialog({ open, onOpenChange, request }: NewProductDialogProps) {
  const navigate = useNavigate()
  const user = useSession()
  const [values, setValues] = useState<Values>(() => initialValues(user, request))
  const [initial, setInitial] = useState<Values>(values)
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [wasOpen, setWasOpen] = useState(open)
  const [mode, setMode] = useState<'um' | 'csv'>('um')
  const [images, setImages] = useState<ProductImage[]>([])
  const [csv, setCsv] = useState<{ name: string; result: ImportResult } | null>(null)
  const [csvBusy, setCsvBusy] = useState(false)
  const [csvRejection, setCsvRejection] = useState<string | null>(null)

  // Cada abertura começa do zero (ajuste de estado durante a renderização, sem efeito).
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      const fresh = initialValues(user, request)
      setValues(fresh)
      setInitial(fresh)
      setTouched(new Set())
      setSubmitted(false)
      setMode('um')
      setImages([])
      setCsv(null)
      setCsvRejection(null)
    }
  }

  const dirty = mode === 'csv' ? csv !== null : JSON.stringify(values) !== JSON.stringify(initial) || images.length > 0
  const errors = validate(values, '')
  const visible = (id: string) => (submitted || touched.has(id) ? errors[id] : undefined)
  const isAdmin = can(user, 'product.reassign')

  const pending = pendingFields(values)
  const pendingTotal = TABS.reduce((n, t) => n + pending[t.id].length, 0)
  const breakdown = TABS.filter((t) => pending[t.id].length > 0).map((t) => `${t.label} ${pending[t.id].length}`).join(' · ')

  const set = (id: string, value: FieldValue) => setValues((v) => ({ ...v, [id]: value }))
  const touch = (id: string) => setTouched((t) => (t.has(id) ? t : new Set(t).add(id)))

  function requestClose() {
    if (dirty) setDiscardOpen(true)
    else onOpenChange(false)
  }

  function submit(another: boolean) {
    const firstError = ORDER.find((id) => errors[id])
    if (Object.keys(errors).length > 0) {
      setSubmitted(true)
      // Foca o primeiro campo com problema (os erros de outros campos já aparecem).
      const target = firstError ?? Object.keys(errors)[0]!
      document.getElementById(`campo-${target}`)?.focus()
      return
    }
    const product = createProduct(values, user, images, request?.id)
    if (request) completeRequest(request.id, product.id, user)
    const open = () => navigate(routes.product(product.id))
    if (another && !request) {
      toast.success(`Produto criado: ${product.title}`, { description: 'Rascunho. Complete o restante na página do produto.', action: { label: 'Abrir', onClick: open } })
      // Mantém o contexto de um lote: departamento, tipo, unidade, marca e responsável.
      const next = { ...initialValues(user), departamento: values.departamento, tipo: values.tipo, unidade: values.unidade, marca: values.marca, responsavel: values.responsavel }
      setValues(next)
      setInitial(next)
      setTouched(new Set())
      setSubmitted(false)
      setImages([])
      requestAnimationFrame(() => document.getElementById('campo-title')?.focus())
    } else {
      onOpenChange(false)
      open()
      toast.success(request ? `Solicitação atendida: ${product.title}` : 'Produto criado', { description: request ? `${userName(request.requestedBy)} vê o produto na lista de solicitações. Complete os dados pendentes aqui.` : 'Está como rascunho. Complete os dados pendentes aqui na página dele.' })
    }
  }

  async function readCsv(files: File[], rejected: FileRejection[]) {
    setCsvRejection(rejected[0] ? `${rejected[0].file.name}: ${rejected[0].reason} Envie um arquivo .csv de até ${MAX_IMPORT_MB} MB.` : null)
    const file = files[0]
    if (!file) return
    setCsvBusy(true)
    try {
      setCsv({ name: file.name, result: parseImport(await file.arrayBuffer(), user) })
    } catch {
      setCsvRejection('Não foi possível ler o arquivo. Confira se é um CSV válido.')
    } finally {
      setCsvBusy(false)
    }
  }

  const readyRows = csv?.result.rows.filter((r) => r.errors.length === 0) ?? []
  const skipped = (csv?.result.rows.length ?? 0) - readyRows.length

  function importAll() {
    if (readyRows.length === 0) return
    createProducts(readyRows.map((r) => r.values), user)
    onOpenChange(false)
    navigate(routes.products)
    toast.success(`${readyRows.length} ${readyRows.length === 1 ? 'produto importado' : 'produtos importados'} como rascunho`, {
      description: skipped > 0 ? `${skipped} ${skipped === 1 ? 'linha ficou' : 'linhas ficaram'} de fora por problemas. Corrija o arquivo e importe de novo.` : 'Complete os dados pendentes na página de cada produto.',
    })
  }

  const control = (id: string, wrapperClass?: string) => (
    <div key={id} className={wrapperClass} onBlur={() => touch(id)}>
      <FieldControl field={field(id)} values={values} error={visible(id)} onChange={set} />
    </div>
  )

  const ncmLabel = displayText(field('ncm'), values.ncm, values)

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : requestClose())}>
        <DialogContent
          size="lg"
          title={request ? 'Criar produto da solicitação' : 'Novo produto'}
          description={request ? 'Confira os dados do pedido e complete o essencial. O produto nasce como rascunho.' : mode === 'um' ? 'Preencha o essencial. O produto nasce como rascunho e você completa o restante na página dele.' : 'Crie vários produtos de uma vez a partir de uma planilha. Eles nascem como rascunhos.'}
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            document.getElementById(mode === 'um' ? 'campo-title' : 'novo-produto-modo')?.focus()
          }}
          footer={
            mode === 'um' ? (
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Text variant="small" tone="muted" className="min-w-0 sm:max-w-sm">
                  {pendingTotal > 0 ? <>Depois de criar, {pendingTotal === 1 ? 'fica 1 informação' : `ficam ${pendingTotal} informações`} a completar: {breakdown}.</> : 'Cadastro completo.'}
                </Text>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:shrink-0">
                  <Button variant="ghost" onClick={requestClose}>Cancelar</Button>
                  {request ? null : <Button variant="secondary" onClick={() => submit(true)}>Criar e adicionar outro</Button>}
                  <Button onClick={() => submit(false)}>Criar produto</Button>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Text variant="small" tone="muted" className="min-w-0 sm:max-w-sm">
                  {csv && csv.result.rows.length > 0
                    ? skipped > 0 ? `${skipped} ${skipped === 1 ? 'linha com problema fica' : 'linhas com problema ficam'} de fora.` : 'Todas as linhas estão prontas.'
                    : 'Envie o arquivo para conferir as linhas.'}
                </Text>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:shrink-0">
                  <Button variant="ghost" onClick={requestClose}>Cancelar</Button>
                  <Button disabled={readyRows.length === 0} onClick={importAll}>
                    {readyRows.length === 0 ? 'Importar' : `Importar ${readyRows.length} ${readyRows.length === 1 ? 'produto' : 'produtos'}`}
                  </Button>
                </div>
              </div>
            )
          }
        >
          <div className="grid gap-5">
            {request ? (
              <div className="grid gap-1 rounded-lg bg-subtle p-4">
                <Text weight="semibold">Solicitação de {userName(request.requestedBy)}{request.urgent ? ' · Urgente' : ''}</Text>
                <Text variant="small" tone="muted">Categoria: {request.categoria} · Arquivo: {request.file.name} ({formatFileSize(request.file.size)})</Text>
              </div>
            ) : (
            <SegmentedControl
              id="novo-produto-modo"
              aria-label="Forma de cadastro"
              value={mode}
              onValueChange={setMode}
              options={[{ value: 'um', label: 'Um produto' }, { value: 'csv', label: 'Importar vários (CSV)' }]}
              className="justify-self-start max-sm:w-full [&>button]:max-sm:flex-1"
            />
            )}

            {mode === 'csv' ? (
              <ImportPanel
                user={user}
                fileName={csv?.name ?? null}
                result={csv?.result ?? null}
                busy={csvBusy}
                rejection={csvRejection}
                onFiles={readCsv}
                onReset={() => { setCsv(null); setCsvRejection(null) }}
              />
            ) : (
              <div
                role="group"
                aria-label="Dados do novo produto"
                // Sem <form> nativo: páginas hospedadas em iframe isolado bloqueiam o envio de formulários.
                // O Enter em um campo de texto cria o produto; a validação e o foco são nossos.
                onKeyDown={(e) => {
                  const t = e.target
                  if (e.key !== 'Enter' || e.defaultPrevented || !(t instanceof HTMLInputElement) || !e.currentTarget.contains(t)) return
                  e.preventDefault()
                  submit(false)
                }}
                className="grid gap-6"
              >
                <FormGrid>
                  {control('title', 'sm:col-span-2')}
                  {control('departamento')}
                  {control('unidade')}
                  <div className="grid content-start gap-1.5 sm:col-span-2">
                    <FieldLabel required>Tipo de produto</FieldLabel>
                    <SegmentedControl
                      aria-label="Tipo de produto"
                      value={String(values.tipo) as 'simples' | 'variacoes' | 'kit'}
                      onValueChange={(v) => set('tipo', v)}
                      options={[{ value: 'simples', label: 'Simples' }, { value: 'variacoes', label: 'Com variações' }, { value: 'kit', label: 'Kit' }]}
                      className="justify-self-start max-sm:w-full [&>button]:max-sm:flex-1"
                    />
                    <FieldMessage>{TIPO_HINT[String(values.tipo)]}</FieldMessage>
                  </div>
                  {control('sku')}
                  {control('marca')}
                  {control('ean')}
                  {isAdmin ? control('responsavel') : <div className="grid content-start gap-1.5"><FieldLabel>Responsável</FieldLabel><Text className="flex h-control-md items-center">{user.name} (você)</Text></div>}
                  {control('descricaoCurta', 'sm:col-span-2')}
                </FormGrid>

                <section className="grid gap-2" aria-labelledby="np-fotos">
                  <div>
                    <Text id="np-fotos" weight="semibold">Fotos</Text>
                    <Text variant="small" tone="muted">Opcional. Você também pode adicionar depois, na aba Imagens. Marketplaces pedem ao menos 1000 × 1000 px e, em geral, uma foto com fundo branco.</Text>
                  </div>
                  <ImageManager images={images} onChange={setImages} />
                </section>

                <fieldset className="grid gap-3 rounded-lg bg-subtle p-4">
                  <legend className="sr-only">Dados fiscais</legend>
                  <div>
                    <Text weight="semibold">Dados fiscais</Text>
                    <Text variant="small" tone="muted">Pode deixar para depois: CFOP, ICMS, PIS e COFINS são completados na aba Fiscal do produto.</Text>
                  </div>
                  <FormGrid>
                    {control('ncm')}
                    {control('origem')}
                  </FormGrid>
                  {ncmLabel && ncmLabel.includes('—') ? <FieldMessage kind="success">{ncmLabel.split('— ')[1]}</FieldMessage> : null}
                </fieldset>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        tone="danger"
        title="Descartar o cadastro?"
        description="O que você preencheu neste produto será perdido."
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
