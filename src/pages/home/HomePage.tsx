import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { Button, PageHeader } from '@/design-system'
import { routes } from '@/app/navigation'
import { usePageTitle } from '@/lib/usePageTitle'
import { ProductsDashboard } from './ProductsDashboard'

/** Início: o botão "Novo produto" e, abaixo, os indicadores do catálogo. */
export function HomePage() {
  usePageTitle('Início')
  const navigate = useNavigate()
  return (
    <>
      <PageHeader
        title="Início"
        hideTitle
        actions={
          <Button leadingIcon={<Plus aria-hidden />} onClick={() => navigate(routes.newProduct)}>
            Novo produto
          </Button>
        }
      />
      <ProductsDashboard />
    </>
  )
}
