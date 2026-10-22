import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Button, ConfirmDialog, Dialog, DialogContent, FieldLabel, FieldMessage, FormGrid, SegmentedControl, Text, toast,
} from '@/design-system'
import { can } from '@/app/access/permissions'
import { useSession } from '@/app/access/session'
import { createProduct, emptyValues, suggestSku } from '@/app/products/detail'
import { FIELDS, TABS, pendingFields, type FieldValue, type Values } from '@/app/products/schema'
import { routes } from '@/app/navigation'
import { FieldControl } from './product/FieldControl'
import { displayText } from './product/value'
import { validate } from './product/validate'

const field = (id: string) => FIELDS.find((f) => f.id === id)!

/** Ordem em que os campos aparecem: define também qual erro recebe o foco primeiro. */
const ORDER = ['title', 'departamento', 'unidade', 'tipo', 'sku', 'marca', 'ean', 'responsavel', 'descricaoCurta', 'ncm', 'origem']

const TIPO_HINT: Record<string, string> = {
  simples: 'Um item único, sem variações.',
  variacoes: 'Tamanho, cor… As variações são cadastradas depois, na aba Variações e kits.',
  kit: 'Junta outros produtos. Os itens do kit são definidos depois, na aba Variações e kits.',
}

function initialValues(userId: string): Values {
  return { ...emptyValues(), status: 'draft', tipo: 'simples', unidade: 'UN', condicao: 'novo', sku: suggestSku(), responsavel: userId }
}

export interface NewProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Novo produto, em modal. Pede só o essencial para existir (título, departamento, tipo, SKU, unidade) e, se já se
 * souber, marca, GTIN, descrição e NCM/origem. O produto nasce como RASCUNHO e o resto é completado na página dele;
 * o rodapé mostra, ao vivo, o que ficará pendente. "Criar e adicionar outro" mantém departamento, marca e unidade.
 */
export function NewProductDialog({ open, onOpenChange }: NewProductDialogProps) {
  const navigate = useNavigate()
  const user = useSession()
  const [values, setValues] = useState<Values>(() => initialValues(user.id))
  const [initial, setInitial] = useState<Values>(values)
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [wasOpen, setWasOpen] = useState(open)

  // Cada abertura começa do zero (ajuste de estado durante a renderização, sem efeito).
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      const fresh = initialValues(user.id)
      setValues(fresh)
      setInitial(fresh)
      setTouched(new Set())
      setSubmitted(false)
    }
  }

  const dirty = JSON.stringify(values) !== JSON.stringify(initial)
  const errors = validate(values, '')
  const visible = (id: string) => (submitted || touched.has(id) ? errors[id] : undefined)
  const isMaster = can(user, 'product.reassign')

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
    const product = createProduct(values, user)
    const open = () => navigate(routes.product(product.id))
    if (another) {
      toast.success(`Produto criado: ${product.title}`, { description: 'Rascunho. Complete o restante na página do produto.', action: { label: 'Abrir', onClick: open } })
      // Mantém o contexto de um lote: departamento, tipo, unidade, marca e responsável.
      const next = { ...initialValues(user.id), departamento: values.departamento, tipo: values.tipo, unidade: values.unidade, marca: values.marca, responsavel: values.responsavel }
      setValues(next)
      setInitial(next)
      setTouched(new Set())
      setSubmitted(false)
      requestAnimationFrame(() => document.getElementById('campo-title')?.focus())
    } else {
      onOpenChange(false)
      open()
      toast.success('Produto criado', { description: 'Está como rascunho. Complete os dados pendentes aqui na página dele.' })
    }
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
          title="Novo produto"
          description="Preencha o essencial. O produto nasce como rascunho e você completa o restante na página dele."
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            document.getElementById('campo-title')?.focus()
          }}
          footer={
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Text variant="small" tone="muted" className="min-w-0 sm:max-w-sm">
                {pendingTotal > 0 ? <>Depois de criar, {pendingTotal === 1 ? 'fica 1 informação' : `ficam ${pendingTotal} informações`} a completar: {breakdown}.</> : 'Cadastro completo.'}
              </Text>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:shrink-0">
                <Button variant="ghost" onClick={requestClose}>Cancelar</Button>
                <Button variant="secondary" onClick={() => submit(true)}>Criar e adicionar outro</Button>
                <Button onClick={() => submit(false)}>Criar produto</Button>
              </div>
            </div>
          }
        >
          {/* Sem <form> nativo: páginas hospedadas em iframe isolado bloqueiam o envio de formulários.
              O Enter em um campo de texto cria o produto; a validação e o foco são nossos. */}
          <div
            role="group"
            aria-label="Dados do novo produto"
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
              {isMaster ? control('responsavel') : <div className="grid content-start gap-1.5"><FieldLabel>Responsável</FieldLabel><Text className="flex h-control-md items-center">{user.name} (você)</Text></div>}
              {control('descricaoCurta', 'sm:col-span-2')}
            </FormGrid>

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
