import { usePageTitle } from '@/lib/usePageTitle'

/** Início — página em branco (a construir). O h1 existe só para leitores de tela. */
export function HomePage() {
  usePageTitle('Início')
  return <h1 className="sr-only">Início</h1>
}
