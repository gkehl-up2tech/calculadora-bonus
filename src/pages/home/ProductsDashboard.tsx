import { useMemo } from 'react'
import { CircleCheck, CirclePause, PackageX, TriangleAlert } from 'lucide-react'
import {
  BarList, Card, CardContent, CardDescription, CardHeader, CardTitle, DistributionBar, ProgressField, StatCard, Text,
} from '@/design-system'
import { computeDashboardMetrics, LOW_STOCK_LIMIT } from '@/app/dashboard/metrics'
import { PRODUCTS } from '@/app/products/sample-products'
import { formatBRL, formatNumber } from '@/lib/format'

/** Mantém os N maiores e junta o resto em "Outras" (gráficos de barra ficam legíveis com poucas linhas). */
function topWithOthers<T extends { id: string; label: string; count: number }>(items: T[], n: number) {
  if (items.length <= n + 1) return items
  const rest = items.slice(n)
  return [...items.slice(0, n), { id: 'others', label: `Outras (${rest.length} categorias)`, count: rest.reduce((s, i) => s + i.count, 0) }]
}

const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0)
const compactBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 })

/** Indicadores do catálogo de produtos. Os dados são de exemplo (temporários) até existir a fonte real. */
export function ProductsDashboard() {
  const m = useMemo(() => computeDashboardMetrics(PRODUCTS), [])

  return (
    <div className="grid gap-4">
      <section aria-labelledby="kpis-titulo" className="grid gap-3">
        <h2 id="kpis-titulo" className="sr-only">Indicadores principais</h2>
        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
          <StatCard hero label="Produtos cadastrados" value={formatNumber(m.total)} helper="Total do catálogo" className="col-span-2" />
          <StatCard label="Produtos ativos" value={formatNumber(m.active)} helper={`${pct(m.active, m.total)}% do cadastro`} icon={CircleCheck} tone="success" />
          <StatCard label="Produtos incompletos" value={formatNumber(m.incomplete)} helper={`${pct(m.incomplete, m.total)}% com pendências`} icon={TriangleAlert} tone="warning" />
          <StatCard label="Produtos inativos" value={formatNumber(m.inactive)} helper={`${pct(m.inactive, m.total)}% do cadastro`} icon={CirclePause} tone="neutral" />
          <StatCard label="Sem estoque" value={formatNumber(m.stock.out)} helper="Saldo zerado" icon={PackageX} tone="danger" />
        </dl>
      </section>

      <section aria-labelledby="graficos-titulo" className="grid items-start gap-4 lg:grid-cols-2">
        <h2 id="graficos-titulo" className="sr-only">Detalhamento do catálogo</h2>

        {/* Duas colunas independentes: cada cartão tem a altura do próprio conteúdo (sem vazios esticados). */}
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Situação dos produtos</CardTitle>
                <CardDescription>Como o catálogo se distribui por status.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5">
              <DistributionBar
                segments={[
                  { id: 'active', label: 'Ativos', value: m.active, tone: 'success' },
                  { id: 'inactive', label: 'Inativos', value: m.inactive, tone: 'neutral' },
                  { id: 'draft', label: 'Rascunhos', value: m.draft, tone: 'warning' },
                ]}
              />
              <div className="border-t border-line-subtle pt-4">
                <ProgressField label="Cadastros completos" value={m.complete} max={m.total} valueLabel={`${formatNumber(m.complete)} de ${formatNumber(m.total)} · ${pct(m.complete, m.total)}%`} tone="success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Estoque</CardTitle>
                <CardDescription>Saldo por produto. Baixo = menos de {LOW_STOCK_LIMIT} unidades.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5">
              <DistributionBar
                segments={[
                  { id: 'healthy', label: 'Estoque saudável', value: m.stock.healthy, tone: 'success' },
                  { id: 'low', label: 'Estoque baixo', value: m.stock.low, tone: 'warning' },
                  { id: 'out', label: 'Sem estoque', value: m.stock.out, tone: 'danger' },
                ]}
              />
              <dl className="grid grid-cols-2 gap-4 border-t border-line-subtle pt-4">
                <div>
                  <dt className="text-sm text-fg-muted">Unidades em estoque</dt>
                  <dd className="mt-1 text-xl font-semibold tracking-tight text-fg">{formatNumber(m.units)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-muted">Valor, a preço de venda</dt>
                  <dd className="mt-1 text-xl font-semibold tracking-tight text-fg" title={formatBRL(m.stockValue)}>{compactBRL.format(m.stockValue)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Pendências de cadastro</CardTitle>
                <CardDescription>Dados que faltam, por tipo. Um produto pode ter mais de uma.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <BarList
                aria-label="Pendências de cadastro por tipo"
                tone="warning"
                total={m.incomplete}
                items={m.pendencias.map((p) => ({ id: p.id, label: p.label, value: p.count }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Produtos por categoria</CardTitle>
                <CardDescription>Da maior para a menor.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <BarList
                aria-label="Produtos por categoria"
                total={m.total}
                items={topWithOthers(m.byCategory, 6).map((c) => ({ id: c.id, label: c.label, value: c.count }))}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Text variant="caption">Dados de exemplo. Serão substituídos pelos produtos reais quando a fonte de dados estiver ligada.</Text>
    </div>
  )
}
