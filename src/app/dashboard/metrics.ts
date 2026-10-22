import { PENDENCIA_LABEL, type Pendencia, type Product } from '../products/sample-products'

export interface DashboardMetrics {
  total: number
  active: number
  inactive: number
  draft: number
  /** Produtos com ao menos uma pendência de cadastro. */
  incomplete: number
  complete: number
  /** Produtos na fila da Tributação (aguardando análise) e os que voltaram com pedido de ajuste. */
  fiscalReview: number
  fiscalAdjust: number
  pendencias: { id: Pendencia; label: string; count: number }[]
  byDepartment: { id: string; label: string; count: number }[]
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

  const departments = new Map<string, number>()
  for (const p of products) departments.set(p.department, (departments.get(p.department) ?? 0) + 1)
  const byDepartment = [...departments]
    .map(([label, n]) => ({ id: label, label, count: n }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'pt-BR'))

  return {
    total: products.length,
    active: count((p) => p.status === 'active'),
    inactive: count((p) => p.status === 'inactive'),
    draft: count((p) => p.status === 'draft'),
    incomplete,
    complete: products.length - incomplete,
    fiscalReview: count((p) => p.fiscal === 'review'),
    fiscalAdjust: count((p) => p.fiscal === 'adjust'),
    pendencias,
    byDepartment,
  }
}
