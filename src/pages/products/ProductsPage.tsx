import { useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, PageHeader, SearchField, Select, Text, Thumbnail } from '@/design-system'
import { routes } from '@/app/navigation'
import { filterProducts } from '@/app/products/search'
import { DEPARTMENTS, PRODUCTS, type Product } from '@/app/products/sample-products'
import { usePageTitle } from '@/lib/usePageTitle'

const ALL = 'all'

/**
 * Produtos — tabela do catálogo: foto, SKU, título, NCM, EAN e departamento.
 * É daqui (ou da busca global) que se chega à página do produto: o título é um link e a linha inteira também abre o produto.
 * Os dados são de exemplo (temporários) até existir a fonte real.
 */
export function ProductsPage() {
  usePageTitle('Produtos')
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState(ALL)

  // Memoizado: a tabela volta à página 1 quando `data` muda de referência.
  const data = useMemo(
    () => filterProducts(PRODUCTS, search).filter((p) => department === ALL || p.department === department),
    [search, department],
  )

  const columns = useMemo<ColumnDef<Product, any>[]>( // eslint-disable-line @typescript-eslint/no-explicit-any
    () => [
      {
        id: 'photo',
        header: 'Foto',
        enableSorting: false,
        meta: { className: 'w-20 py-2' },
        // alt vazio: o título, na mesma linha, já descreve o item.
        cell: ({ row }) => <Thumbnail src={row.original.photo} alt="" size="lg" />,
      },
      { accessorKey: 'sku', header: 'SKU', cell: ({ getValue }) => <Text as="span" variant="code">{getValue<string>()}</Text> },
      {
        accessorKey: 'title',
        header: 'Título',
        meta: { className: 'min-w-64' },
        cell: ({ row }) => (
          <RouterLink
            to={routes.product(row.original.id)}
            // A linha inteira já navega; sem isto o clique no link navegaria duas vezes.
            onClick={(e) => e.stopPropagation()}
            className="rounded-xs font-semibold text-fg underline-offset-4 hover:text-link hover:underline"
          >
            {row.original.title}
          </RouterLink>
        ),
      },
      { accessorKey: 'ncm', header: 'NCM', cell: ({ getValue }) => <Text as="span" variant="code">{getValue<string>()}</Text> },
      {
        accessorKey: 'ean',
        header: 'EAN',
        cell: ({ getValue }) => {
          const ean = getValue<string>()
          return ean ? (
            <Text as="span" variant="code">{ean}</Text>
          ) : (
            <>
              <span aria-hidden className="text-fg-subtle">—</span>
              <span className="sr-only">Sem EAN</span>
            </>
          )
        },
      },
      { accessorKey: 'department', header: 'Departamento' },
    ],
    [],
  )

  return (
    <>
      <PageHeader title="Produtos" />
      <DataTable
        caption="Produtos"
        data={data}
        columns={columns}
        getRowId={(p) => p.id}
        onRowClick={(p) => navigate(routes.product(p.id))}
        // A altura da foto define a altura da linha: densidade fixa.
        showDensityToggle={false}
        defaultDensity="comfortable"
        pageSize={25}
        pageSizeOptions={[25, 50, 100]}
        // Rolagem dentro da tabela, com cabeçalho fixo e paginação sempre visível.
        maxHeight="max(24rem, calc(100dvh - 24rem))"
        toolbar={
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <div className="min-w-0 flex-1 basis-64 sm:max-w-sm">
              <SearchField value={search} onValueChange={setSearch} aria-label="Buscar na tabela" placeholder="Título, SKU, NCM ou EAN" />
            </div>
            <Select aria-label="Departamento" className="sm:w-56" value={department} onValueChange={setDepartment} options={[{ value: ALL, label: 'Todos os departamentos' }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]} />
          </div>
        }
      />
    </>
  )
}
