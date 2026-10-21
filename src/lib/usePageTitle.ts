import { useEffect } from 'react'

/** Define o título da aba: "Página · Cadastro de Produtos · UP2Tech". */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · Cadastro de Produtos · UP2Tech`
  }, [title])
}
