import { PRODUCTS } from '@/app/products/sample-products'
import { FIELDS, SECTIONS, applies, isEmpty, type TabId, type Values } from '@/app/products/schema'
import { isValidCnpj, isValidGtin, unmask } from '@/lib/masks'

export type Errors = Record<string, string>

const str = (v: Values[string]) => (typeof v === 'string' ? v : '')
const num = (v: Values[string]) => (typeof v === 'number' ? v : null)

/** Regras de preenchimento. Obrigatório vazio e formatos inválidos bloqueiam o salvamento; "recomendado" não. */
export function validate(values: Values, productId: string): Errors {
  const e: Errors = {}
  for (const f of FIELDS) {
    if (!applies(f, values)) continue
    if (f.importance === 'required' && isEmpty(values[f.id])) e[f.id] = 'Preencha este campo.'
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

  const sku = str(values.sku).trim().toLowerCase()
  if (sku && PRODUCTS.some((p) => p.id !== productId && p.sku.toLowerCase() === sku)) e.sku = 'Já existe outro produto com este SKU.'

  const [preco, promo] = [num(values.preco), num(values.precoPromo)]
  if (promo !== null && preco !== null && promo >= preco) e.precoPromo = 'A promoção deve ser menor que o preço de venda.'
  if (promo !== null && (isEmpty(values.promoInicio) || isEmpty(values.promoFim))) {
    if (isEmpty(values.promoInicio)) e.promoInicio = 'Informe o início da promoção.'
    if (isEmpty(values.promoFim)) e.promoFim = 'Informe o fim da promoção.'
  }
  if (!isEmpty(values.promoInicio) && !isEmpty(values.promoFim) && str(values.promoFim) < str(values.promoInicio)) e.promoFim = 'O fim vem depois do início.'
  const [min, max] = [num(values.estoqueMin), num(values.estoqueMax)]
  if (min !== null && max !== null && min > max) e.estoqueMin = 'O mínimo não pode passar do máximo.'
  const [liq, bruto] = [num(values.pesoLiquido), num(values.pesoBruto)]
  if (liq !== null && bruto !== null && liq > bruto) e.pesoLiquido = 'O peso líquido não pode passar do bruto.'
  return e
}

const tabOfSection = new Map(SECTIONS.map((s) => [s.id, s.tab]))
export const tabOfField = (fieldId: string): TabId | undefined => {
  const f = FIELDS.find((x) => x.id === fieldId)
  return f ? tabOfSection.get(f.section) : undefined
}
