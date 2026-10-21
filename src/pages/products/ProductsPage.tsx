import { usePageTitle } from '@/lib/usePageTitle'

/** Todos os produtos — página em branco (a construir). É por aqui, ou pela busca, que se chega ao produto. */
export function ProductsPage() {
  usePageTitle('Todos os produtos')
  return <h1 className="sr-only">Todos os produtos</h1>
}
