import { usePageTitle } from '@/lib/usePageTitle'
import { ProductsDashboard } from './ProductsDashboard'

/** Início: os indicadores do catálogo. O botão "Novo produto" fica na linha do toggle de navegação (AppLayout). */
export function HomePage() {
  usePageTitle('Início')
  return (
    <>
      <h1 className="sr-only">Início</h1>
      <ProductsDashboard />
    </>
  )
}
