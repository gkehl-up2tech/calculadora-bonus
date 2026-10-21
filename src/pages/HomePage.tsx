import { usePageTitle } from '@/lib/usePageTitle'

/** Página inicial — intencionalmente vazia nesta fase. */
export function HomePage() {
  usePageTitle('Início')
  // Página vazia por decisão de produto; o h1 existe só para leitores de tela (estrutura do documento).
  return <h1 className="sr-only">Início</h1>
}
