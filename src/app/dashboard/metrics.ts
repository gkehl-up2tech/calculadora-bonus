import { PENDENCIA_LABEL, type Pendencia, type Product } from '../products/sample-products'

/** Abaixo deste saldo (unidades) o produto conta como "estoque baixo". */
export const LOW_STOCK_LIMIT = 20

export interface DashboardMetrics {
  total: number
  active: number
  inactive: number
  draft: number
  /** Produtos com ao menos uma pendência de cadastro. */
  incomplete: number
  complete: number
  pendencias: { id: Pendencia; label: string; count: number }[]
  byCategory: { id: string; label: string; count: number }[]
  stock: { out: number; low: number; healthy: number }
  /** Soma dos saldos (unidades). */
  units: number
  /** Valor do estoque a preço de venda (soma de preço × saldo). */
  stockValue: number
}

/**
 * Indicadores do catálogo. Função pura sobre a lista de produtos: hoje recebe os dados de exemplo;
 * quando houver fonte real, passe os produtos reais (ou troque por agregações do servidor).
 */
export function computeDashboardMetrics(products: Product[]): DashboardMetrics {
  const count = (pred: (p: Product) => boolean) => products.filter(pred).length
  const incomplete = count((p) => p.pendencias.length > 0)

  const pendencias = (Object.keys(PENDENCIA_LABEL) as Pendencia[])
    .map((id) => ({ id, label: PENDENCIA_LABEL[id], count: count((p) => p.pendencias.includes(id)) }))
    .sort((a, b) => b.count - a.count)

  const categories = new Map<string, number>()
  for (const p of products) categories.set(p.category, (categories.get(p.category) ?? 0) + 1)
  const byCategory = [...categories]
    .map(([label, n]) => ({ id: label, label, count: n }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'pt-BR'))

  return {
    total: products.length,
    active: count((p) => p.status === 'active'),
    inactive: count((p) => p.status === 'inactive'),
    draft: count((p) => p.status === 'draft'),
    incomplete,
    complete: products.length - incomplete,
    pendencias,
    byCategory,
    stock: {
      out: count((p) => p.stock === 0),
      low: count((p) => p.stock > 0 && p.stock < LOW_STOCK_LIMIT),
      healthy: count((p) => p.stock >= LOW_STOCK_LIMIT),
    },
    units: products.reduce((sum, p) => sum + p.stock, 0),
    stockValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
  }
}
