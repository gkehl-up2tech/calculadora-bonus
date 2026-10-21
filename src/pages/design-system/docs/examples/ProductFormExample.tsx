import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import {
  Alert, Button, CheckboxField, Combobox, CurrencyInput, FormField, FormGrid, FormPage, FormSection, Input, MaskedInput,
  Select, SwitchField, Textarea, toast,
} from '@/design-system'
import { isValidGtin } from '@/lib/masks'
import { DEPARTMENTS, CFOP_OPTIONS, CSOSN_OPTIONS, NCM_OPTIONS, ORIGEM_OPTIONS, UNIT_OPTIONS } from '../sample-data'

interface FormState {
  title: string
  sku: string
  gtin: string
  department: string
  description: string
  cost: number | null
  price: number | null
  unit: string
  minStock: string
  active: boolean
  trackStock: boolean
  ncm: string | null
  cest: string
  origem: string
  cfop: string | null
  csosn: string
}

const initial: FormState = {
  title: '', sku: '', gtin: '', department: '', description: '', cost: null, price: null, unit: 'UN', minStock: '',
  active: true, trackStock: true, ncm: null, cest: '', origem: '', cfop: null, csosn: '',
}

type Errors = Partial<Record<keyof FormState, string>>

function validate(f: FormState): Errors {
  const e: Errors = {}
  if (!f.title.trim()) e.title = 'Informe o título do produto.'
  if (!f.sku.trim()) e.sku = 'Informe o SKU.'
  if (f.gtin && !isValidGtin(f.gtin)) e.gtin = 'GTIN inválido: confira o dígito verificador.'
  if (!f.price) e.price = 'Informe o preço de venda.'
  if (!f.ncm) e.ncm = 'Selecione o NCM.'
  if (!f.origem) e.origem = 'Selecione a origem da mercadoria.'
  return e
}

/** Cadastro de produto com seções de identificação, vendas e dados fiscais. Dados ilustrativos. */
export function ProductFormExample() {
  const [f, setF] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const dirty = JSON.stringify(f) !== JSON.stringify(initial)
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setF((s) => ({ ...s, [key]: value }))
    // Limpa o erro do campo assim que o usuário o corrige.
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  async function save() {
    const next = validate(f)
    setErrors(next)
    if (Object.keys(next).length) {
      toast.error('Revise os campos destacados')
      return
    }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    setSaving(false)
    toast.success('Produto salvo')
    setF(initial)
  }

  const errorList = Object.values(errors).filter(Boolean)

  return (
    <FormPage
      header={{
        title: 'Novo produto',
        headingLevel: 5,
        description: 'Preencha os dados de identificação, venda e tributação.',
        breadcrumb: { label: 'Trilha do exemplo de cadastro', items: [{ label: 'Produtos', href: '#' }, { label: 'Novo produto' }] },
      }}
      dirty={dirty}
      actions={
        <>
          <Button variant="secondary" disabled={!dirty || saving} onClick={() => { setF(initial); setErrors({}) }}>Descartar</Button>
          <Button loading={saving} onClick={save}>Salvar produto</Button>
        </>
      }
    >
      {errorList.length ? (
        <Alert tone="danger" title={`${errorList.length} ${errorList.length === 1 ? 'campo precisa' : 'campos precisam'} de atenção`} icon={AlertCircle}>
          {errorList.join(' ')}
        </Alert>
      ) : null}

      <FormSection headingLevel={6} title="Identificação" description="Como o produto é reconhecido no catálogo e na nota fiscal.">
        <FormGrid>
          <FormField label="Título do produto" required error={errors.title} className="sm:col-span-2">
            {(c) => <Input {...c} value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="Ex.: Parafuso sextavado M8" />}
          </FormField>
          <FormField label="SKU" required error={errors.sku}>
            {(c) => <Input {...c} value={f.sku} onChange={(e) => set('sku', e.target.value.toUpperCase())} placeholder="UP-1000" autoCapitalize="characters" />}
          </FormField>
          <FormField label="GTIN / EAN" optional error={errors.gtin} hint="8, 12, 13 ou 14 dígitos.">
            {(c) => <MaskedInput {...c} mask="99999999999999" value={f.gtin} onValueChange={(v) => set('gtin', v)} placeholder="7891000100103" />}
          </FormField>
          <FormField label="Departamento" optional className="sm:col-span-2">
            {(c) => <Select {...c} options={DEPARTMENTS.map((x) => ({ value: x, label: x }))} value={f.department} onValueChange={(v) => set('department', v)} />}
          </FormField>
          <FormField label="Descrição" optional className="sm:col-span-2">
            {(c) => <Textarea {...c} value={f.description} onChange={(e) => set('description', e.target.value)} />}
          </FormField>
        </FormGrid>
      </FormSection>

      <FormSection headingLevel={6} title="Vendas" description="Preço, unidade e controle de estoque usados no ponto de venda.">
        <FormGrid>
          <FormField label="Preço de custo" optional>
            {(c) => <CurrencyInput {...c} value={f.cost} onValueChange={(v) => set('cost', v)} />}
          </FormField>
          <FormField label="Preço de venda" required error={errors.price}>
            {(c) => <CurrencyInput {...c} value={f.price} onValueChange={(v) => set('price', v)} />}
          </FormField>
          <FormField label="Unidade de medida">
            {(c) => <Select {...c} options={UNIT_OPTIONS} value={f.unit} onValueChange={(v) => set('unit', v)} />}
          </FormField>
          <FormField label="Estoque mínimo" optional>
            {(c) => <Input {...c} inputMode="numeric" value={f.minStock} onChange={(e) => set('minStock', e.target.value.replace(/\D/g, ''))} placeholder="0" className="text-right tabular-nums" />}
          </FormField>
          <SwitchField label="Produto ativo" description="Disponível para venda." checked={f.active} onCheckedChange={(v) => set('active', v)} className="sm:col-span-2" />
          <CheckboxField label="Controlar estoque" description="Baixa automática a cada venda." checked={f.trackStock} onCheckedChange={(v) => set('trackStock', v === true)} className="sm:col-span-2" />
        </FormGrid>
      </FormSection>

      <FormSection headingLevel={6} title="Dados fiscais" description="Classificação e tributação usadas na emissão da nota. Valores de exemplo, apenas ilustrativos.">
        <FormGrid>
          <FormField label="NCM" required error={errors.ncm} className="sm:col-span-2">
            {(c) => <Combobox {...c} options={NCM_OPTIONS} value={f.ncm} onValueChange={(v) => set('ncm', v)} placeholder="Buscar NCM…" searchPlaceholder="Digite o código ou a descrição" clearable />}
          </FormField>
          <FormField label="CEST" optional hint="Obrigatório se houver substituição tributária.">
            {(c) => <MaskedInput {...c} mask="cest" value={f.cest} onValueChange={(v) => set('cest', v)} placeholder="00.000.00" />}
          </FormField>
          <FormField label="Origem da mercadoria" required error={errors.origem}>
            {(c) => <Select {...c} options={ORIGEM_OPTIONS} value={f.origem} onValueChange={(v) => set('origem', v)} placeholder="Selecione…" />}
          </FormField>
          <FormField label="CFOP padrão" optional>
            {(c) => <Combobox {...c} options={CFOP_OPTIONS} value={f.cfop} onValueChange={(v) => set('cfop', v)} placeholder="Buscar CFOP…" clearable />}
          </FormField>
          <FormField label="CSOSN (Simples Nacional)" optional>
            {(c) => <Select {...c} options={CSOSN_OPTIONS} value={f.csosn} onValueChange={(v) => set('csosn', v)} placeholder="Selecione…" />}
          </FormField>
        </FormGrid>
      </FormSection>
    </FormPage>
  )
}
