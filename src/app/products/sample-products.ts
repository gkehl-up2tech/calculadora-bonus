/**
 * DADOS DE EXEMPLO — TEMPORÁRIOS. Existem só para a busca e as telas poderem ser exercitadas antes de
 * haver uma fonte real de produtos. Troque este módulo pelo acesso real a dados (mantendo `searchProducts`).
 * Códigos fiscais (NCM etc.) são apenas amostras de formato — não use para emitir documentos.
 */
import { PRODUCT_PHOTOS } from './photos'

export type ProductStatus = 'active' | 'inactive' | 'draft'

/** Dado que falta para o cadastro ficar completo. */
export type Pendencia = 'fiscal' | 'gtin' | 'descricao'

export const PENDENCIA_LABEL: Record<Pendencia, string> = {
  fiscal: 'Sem dados fiscais',
  gtin: 'Sem GTIN',
  descricao: 'Sem descrição',
}

export interface Product {
  id: string
  sku: string
  title: string
  department: string
  ncm: string
  /** EAN-13 (só dígitos). Vazio = produto sem GTIN. */
  ean: string
  /** Foto do produto (URL ou data URI). */
  photo: string
  status: ProductStatus
  /** Id do gerente de produto responsável (src/app/access/users.ts). */
  owner: string
  /** Vazio = cadastro completo. */
  pendencias: Pendencia[]
}

const bases = [
  { title: 'Parafuso sextavado M8', department: 'Ferragens', ncm: '7318.15.00' },
  { title: 'Cabo de energia 3x2,5 mm', department: 'Elétrica', ncm: '8544.42.00' },
  { title: 'Smartphone 128 GB', department: 'Eletrônicos', ncm: '8517.13.00' },
  { title: 'Organizador plástico', department: 'Utilidades', ncm: '3926.90.90' },
  { title: 'Mesa de escritório', department: 'Móveis', ncm: '9403.30.00' },
  { title: 'Notebook 14 pol.', department: 'Informática', ncm: '8471.30.19' },
  { title: 'Camiseta algodão', department: 'Vestuário', ncm: '6109.10.00' },
  { title: 'Carregador USB-C 20 W', department: 'Eletrônicos', ncm: '8504.40.90' },
  { title: 'Creme hidratante 200 ml', department: 'Cosméticos', ncm: '3304.99.90' },
  { title: 'Smart TV 50 pol.', department: 'Eletrônicos', ncm: '8528.72.00' },
  { title: 'Tênis esportivo', department: 'Calçados', ncm: '6403.99.90' },
  { title: 'Cabo HDMI 2 m', department: 'Eletrônicos', ncm: '8544.42.00' },
]
const variants = ['', ' · Pequeno', ' · Médio', ' · Grande', ' · Premium']
const statuses: ProductStatus[] = ['active', 'active', 'active', 'inactive', 'active', 'draft', 'active']

/** EAN-13 válido (prefixo 789 = Brasil) a partir de um número sequencial; calcula o dígito verificador. */
function ean13(seq: number) {
  const body = `7891000${String(10000 + seq).padStart(5, '0')}`
  const sum = [...body].reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 1 : 3), 0)
  return body + ((10 - (sum % 10)) % 10)
}

/** 57 produtos determinísticos (sem aleatoriedade, para o visual não mudar a cada carga). */
export const PRODUCTS: Product[] = Array.from({ length: 57 }, (_, i) => {
  const base = bases[i % bases.length]!
  const variant = variants[Math.floor(i / bases.length) % variants.length]!
  const status = statuses[i % statuses.length]!
  const pendencias: Pendencia[] = []
  if (status === 'draft') {
    pendencias.push('fiscal')
  }
  if (i % 9 === 0) pendencias.push('gtin')
  if (i % 11 === 3) pendencias.push('descricao')
  return {
    id: `p${i + 1}`,
    sku: `UP-${String(1000 + i * 7)}`,
    title: `${base.title}${variant}`,
    department: base.department,
    ncm: base.ncm,
    // Coerente com a pendência: sem GTIN cadastrado = sem EAN.
    ean: pendencias.includes('gtin') ? '' : ean13(i),
    photo: PRODUCT_PHOTOS[i % bases.length]!,
    status,
    owner: i % 2 === 0 ? 'u-marina' : 'u-rafael',
    pendencias,
  }
})

export const STATUS_LABEL: Record<ProductStatus, string> = { active: 'Ativo', inactive: 'Inativo', draft: 'Rascunho' }
export const STATUS_TONE = { active: 'success', inactive: 'neutral', draft: 'warning' } as const

export const DEPARTMENTS = [...new Set(bases.map((b) => b.department))].sort((a, b) => a.localeCompare(b, 'pt-BR'))

