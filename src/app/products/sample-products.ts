/**
 * DADOS DE EXEMPLO — TEMPORÁRIOS. Existem só para a busca e as telas poderem ser exercitadas antes de
 * haver uma fonte real de produtos. Troque este módulo pelo acesso real a dados (mantendo `searchProducts`).
 * Códigos fiscais (NCM etc.) são apenas amostras de formato — não use para emitir documentos.
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

