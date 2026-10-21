import type { ReactNode } from 'react'
import { PageHeader, StickyActionBar, type PageHeaderProps } from '../organisms'

export interface FormPageProps {
  header: PageHeaderProps
  dirty?: boolean
  /** Botões da barra inferior (Cancelar e Salvar). */
  actions: ReactNode
  /** Várias <FormSection>. */
  children: ReactNode
}

/** Cadastro/edição: cabeçalho → seções de formulário → barra de ações fixa. */
export function FormPage({ header, dirty, actions, children }: FormPageProps) {
  return (
    <div className="grid gap-6">
      <PageHeader {...header} />
      <div className="grid gap-8 lg:gap-10">{children}</div>
      <StickyActionBar dirty={dirty}>{actions}</StickyActionBar>
    </div>
  )
}
