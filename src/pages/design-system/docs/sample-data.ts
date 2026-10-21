/**
 * DADOS ILUSTRATIVOS para os exemplos do Design System.
 * Produtos vêm do módulo de exemplo do app; códigos fiscais (NCM, CEST, CFOP, CST) são apenas amostras de formato.
 */
export { CATEGORIES, PRODUCTS, STATUS_LABEL, STATUS_TONE } from '@/app/products/sample-products'
export type { Product, ProductStatus } from '@/app/products/sample-products'

export const NCM_OPTIONS = [
  { value: '7318.15.00', label: 'Parafusos e pinos', hint: '7318.15.00' },
  { value: '8544.42.00', label: 'Condutores elétricos com conectores', hint: '8544.42.00' },
  { value: '8517.13.00', label: 'Smartphones', hint: '8517.13.00' },
  { value: '3926.90.90', label: 'Outras obras de plástico', hint: '3926.90.90' },
  { value: '9403.30.00', label: 'Móveis de madeira para escritório', hint: '9403.30.00' },
  { value: '8471.30.19', label: 'Computadores portáteis', hint: '8471.30.19' },
  { value: '6109.10.00', label: 'Camisetas de algodão', hint: '6109.10.00' },
  { value: '8504.40.90', label: 'Conversores estáticos (carregadores)', hint: '8504.40.90' },
  { value: '3304.99.90', label: 'Produtos de beleza e cuidados com a pele', hint: '3304.99.90' },
  { value: '8528.72.00', label: 'Televisores em cores', hint: '8528.72.00' },
  { value: '6403.99.90', label: 'Calçados de couro', hint: '6403.99.90' },
]

export const CFOP_OPTIONS = [
  { value: '5102', label: 'Venda de mercadoria adquirida de terceiros (no estado)', hint: '5102' },
  { value: '6102', label: 'Venda de mercadoria adquirida de terceiros (fora do estado)', hint: '6102' },
  { value: '5101', label: 'Venda de produção do estabelecimento (no estado)', hint: '5101' },
  { value: '5405', label: 'Venda com substituição tributária', hint: '5405' },
]

export const ORIGEM_OPTIONS = [
  { value: '0', label: '0 — Nacional' },
  { value: '1', label: '1 — Estrangeira, importação direta' },
  { value: '2', label: '2 — Estrangeira, adquirida no mercado interno' },
  { value: '5', label: '5 — Nacional, conteúdo de importação ≤ 40%' },
  { value: '8', label: '8 — Nacional, conteúdo de importação > 70%' },
]

export const CSOSN_OPTIONS = [
  { value: '101', label: '101 — Tributada com permissão de crédito' },
  { value: '102', label: '102 — Tributada sem permissão de crédito' },
  { value: '500', label: '500 — ICMS cobrado antes por substituição tributária' },
]

export const UNIT_OPTIONS = [
  { value: 'UN', label: 'UN — Unidade' },
  { value: 'CX', label: 'CX — Caixa' },
  { value: 'KG', label: 'KG — Quilograma' },
  { value: 'M', label: 'M — Metro' },
  { value: 'L', label: 'L — Litro' },
  { value: 'PAR', label: 'PAR — Par' },
]
