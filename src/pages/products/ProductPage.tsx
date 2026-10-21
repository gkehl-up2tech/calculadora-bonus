import { useParams } from 'react-router'
import { usePageTitle } from '@/lib/usePageTitle'

/**
 * Página do produto — em branco (a construir). Rota /produtos/:produtoId.
 * Sem item de menu: o acesso é pela lista "Todos os produtos" ou pela busca global.
 */
export function ProductPage() {
  const { produtoId } = useParams()
  usePageTitle('Produto')
  return <h1 className="sr-only" data-produto-id={produtoId}>Página do produto</h1>
}
