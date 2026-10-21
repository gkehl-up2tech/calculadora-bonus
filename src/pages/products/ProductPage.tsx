import { useParams } from 'react-router'
import { usePageTitle } from '@/lib/usePageTitle'

/**
 * Página do produto — em branco (a construir). Rota /produtos/:produtoId.
 * Sem item de menu: o acesso é pela lista "Produtos", pela busca global ou, para cadastrar,
 * pelo botão "Novo produto" do Início (/produtos/novo, a mesma página em modo de criação).
 */
export function ProductPage({ isNew = false }: { isNew?: boolean }) {
  const { produtoId } = useParams()
  usePageTitle(isNew ? 'Novo produto' : 'Produto')
  return <h1 className="sr-only" data-produto-id={produtoId}>{isNew ? 'Novo produto' : 'Página do produto'}</h1>
}
