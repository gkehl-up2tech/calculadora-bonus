import type { ReactNode } from 'react'
import { PageHeader, type PageHeaderProps } from '../organisms'

export interface ListPageProps {
  header: PageHeaderProps
  /** FilterBar (opcional). */
  filters?: ReactNode
  /** DataTable ou outra lista. */
  children: ReactNode
}

/** Listagem: cabeçalho → filtros → tabela. */
export function ListPage({ header, filters, children }: ListPageProps) {
  return (
    <div className="grid gap-6">
      <PageHeader {...header} />
      {filters}
      {children}
    </div>
  )
}
