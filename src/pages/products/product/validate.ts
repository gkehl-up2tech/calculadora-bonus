import { PRODUCTS } from '@/app/products/sample-products'
import { DRAFT_REQUIRED, FIELDS, SECTIONS, applies, isEmpty, type TabId, type Values } from '@/app/products/schema'
import { isValidCnpj, isValidGtin, unmask } from '@/lib/masks'

export type Errors = Record<string, string>

const str = (v: Values[string]) => (typeof v === 'string' ? v : '')
const num = (v: Values[string]) => (typeof v === 'number' ? v : null)

/**
 * Regras de preenchimento. Formatos inválidos e duplicidades bloqueiam sempre; "recomendado" nunca bloqueia.
 * Obrigatórios: em RASCUNHO só o essencial (DRAFT_REQUIRED); ativar ou inativar exige todos.
 */
export function validate(values: Values, productId: string): Errors {
  const e: Errors = {}
  const draft = values.status === 'draft'
  for (const f of FIELDS) {
    if (!applies(f, values) || f.importance !== 'required' || !isEmpty(values[f.id])) continue
    if (draft && !DRAFT_REQUIRED.includes(f.id)) continue
    e[f.id] = draft ? 'Preencha este campo.' : 'Obrigatório para ativar o produto.'
  }
  const digits = (id: string, len: number, msg: string) => {
    if (!e[id] && !isEmpty(values[id]) && unmask(str(values[id]), '9').length !== len) e[id] = msg
  }
  digits('ncm', 8, 'O NCM tem 8 dígitos.')
  digits('cest', 7, 'O CEST tem 7 dígitos.')
  for (const id of ['ean', 'gtinCaixa', 'eanTrib']) {
    if (!isEmpty(values[id]) && !isValidGtin(str(values[id]))) e[id] = 'GTIN inválido: confira os dígitos (8, 12, 13 ou 14).'
  }
  if (!isEmpty(values.cnpjFab) && !isValidCnpj(str(values.cnpjFab))) e.cnpjFab = 'CNPJ inválido.'
  if (values.indEscala === 'N' && isEmpty(values.cnpjFab)) e.cnpjFab = 'Obrigatório quando a escala não é relevante.'

  const gtin = str(values.ean)
  const sameGtin = gtin && !e.ean ? PRODUCTS.find((p) => p.id !== productId && p.ean === gtin) : undefined
  if (sameGtin) e.ean = `Este GTIN já está no produto "${sameGtin.title}" (${sameGtin.sku}).`

  const sku = str(values.sku).trim().toLowerCase()
  if (sku && PRODUCTS.some((p) => p.id !== productId && p.sku.toLowerCase() === sku)) e.sku = 'Já existe outro produto com este SKU.'

  const [liq, bruto] = [num(values.pesoLiquido), num(values.pesoBruto)]
  if (liq !== null && bruto !== null && liq > bruto) e.pesoLiquido = 'O peso líquido não pode passar do bruto.'
  return e
}

const tabOfSection = new Map(SECTIONS.map((s) => [s.id, s.tab]))
export const tabOfField = (fieldId: string): TabId | undefined => {
  const f = FIELDS.find((x) => x.id === fieldId)
  return f ? tabOfSection.get(f.section) : undefined
}
