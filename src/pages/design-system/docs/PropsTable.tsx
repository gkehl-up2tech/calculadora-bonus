import { Text } from '@/design-system'
import { ScrollRegion } from './ScrollRegion'

export interface PropRow {
  name: string
  type: string
  default?: string
  description: string
}

/** Tabela de propriedades de um componente. */
export function PropsTable({ rows, of }: { rows: PropRow[]; of: string }) {
  return (
    <ScrollRegion label={`Propriedades de ${of}`}>
      <table className="w-full min-w-xl border-collapse text-left text-sm">
        <thead className="bg-subtle">
          <tr>
            {['Propriedade', 'Tipo', 'Padrão', 'Descrição'].map((h) => (
              <th key={h} scope="col" className="h-10 px-3 text-xs font-semibold text-fg-muted">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-line-subtle align-top">
              <td className="px-3 py-2.5"><Text as="code" variant="code" weight="semibold">{r.name}</Text></td>
              <td className="px-3 py-2.5"><Text as="code" variant="code" tone="muted" className="break-words">{r.type}</Text></td>
              <td className="px-3 py-2.5"><Text as="code" variant="code" tone="muted">{r.default ?? '—'}</Text></td>
              <td className="px-3 py-2.5 text-fg-muted">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  )
}
