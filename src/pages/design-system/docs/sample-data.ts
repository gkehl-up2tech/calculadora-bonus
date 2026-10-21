/**
 * DADOS ILUSTRATIVOS para os exemplos do Design System.
 * Códigos fiscais (NCM, CEST, CFOP, CST) são apenas amostras de formato — não use para emitir documentos.
 */
export type ProductStatus = 'active' | 'inactive' | 'draft'

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  ncm: string
  price: number
  stock: number
  status: ProductStatus
}

const bases = [
  { name: 'Parafuso sextavado M8', category: 'Ferragens', ncm: '7318.15.00', price: 0.85 },
  { name: 'Cabo de energia 3x2,5 mm', category: 'Elétrica', ncm: '8544.42.00', price: 6.9 },
  { name: 'Smartphone 128 GB', category: 'Eletrônicos', ncm: '8517.13.00', price: 1899 },
  { name: 'Organizador plástico', category: 'Utilidades', ncm: '3926.90.90', price: 24.9 },
  { name: 'Mesa de escritório', category: 'Móveis', ncm: '9403.30.00', price: 649 },
  { name: 'Notebook 14 pol.', category: 'Informática', ncm: '8471.30.19', price: 3799 },
  { name: 'Camiseta algodão', category: 'Vestuário', ncm: '6109.10.00', price: 49.9 },
  { name: 'Carregador USB-C 20 W', category: 'Eletrônicos', ncm: '8504.40.90', price: 89.9 },
  { name: 'Creme hidratante 200 ml', category: 'Cosméticos', ncm: '3304.99.90', price: 32.5 },
  { name: 'Smart TV 50 pol.', category: 'Eletrônicos', ncm: '8528.72.00', price: 2599 },
  { name: 'Tênis esportivo', category: 'Calçados', ncm: '6403.99.90', price: 279.9 },
  { name: 'Cabo HDMI 2 m', category: 'Eletrônicos', ncm: '8544.42.00', price: 39.9 },
]
const variants = ['', ' · Pequeno', ' · Médio', ' · Grande', ' · Premium']
const statuses: ProductStatus[] = ['active', 'active', 'active', 'inactive', 'active', 'draft', 'active']

/** 57 produtos determinísticos (sem aleatoriedade, para o visual não mudar a cada carga). */
export const PRODUCTS: Product[] = Array.from({ length: 57 }, (_, i) => {
  const base = bases[i % bases.length]!
  const variant = variants[Math.floor(i / bases.length) % variants.length]!
  return {
    id: `p${i + 1}`,
    sku: `UP-${String(1000 + i * 7)}`,
    name: `${base.name}${variant}`,
    category: base.category,
    ncm: base.ncm,
    price: Math.round(base.price * (1 + (i % 5) * 0.15) * 100) / 100,
    stock: (i * 37) % 420,
    status: statuses[i % statuses.length]!,
  }
})

export const STATUS_LABEL: Record<ProductStatus, string> = { active: 'Ativo', inactive: 'Inativo', draft: 'Rascunho' }
export const STATUS_TONE = { active: 'success', inactive: 'neutral', draft: 'warning' } as const

export const CATEGORIES = [...new Set(bases.map((b) => b.category))].sort((a, b) => a.localeCompare(b, 'pt-BR'))

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
