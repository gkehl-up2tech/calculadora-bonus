import type { ReactNode } from 'react'
import { Badge, Chip } from '@/design-system'
import { OWNERS } from '@/app/access/users'
import { OPTION_SETS, NCM_OPTIONS, type Option } from '@/app/products/options'
import { DEPARTMENTS } from '@/app/products/sample-products'
import { isEmpty, type FieldDef, type FieldValue, type Values } from '@/app/products/schema'
import { formatBRL, formatNumber } from '@/lib/format'

/** Opções de um campo de lista (o departamento vem do catálogo). */
export function optionsOf(field: FieldDef): Option[] {
  if (field.options === 'departamento') return DEPARTMENTS.map((d) => ({ value: d, label: d }))
  if (field.options === 'responsavel') return OWNERS.map((u) => ({ value: u.id, label: u.name }))
  return field.options ? [...OPTION_SETS[field.options]] : []
}

const decimal = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 3 })

export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return y && m && d ? `${d}/${m}/${y}` : iso
}

/** Texto de leitura do valor (sem vazio). Usado na leitura da página e no histórico. */
export function displayText(field: FieldDef, value: FieldValue | undefined, values: Values): string {
  if (field.kind === 'computed') return field.compute?.(values) ?? '—'
  if (isEmpty(value) && typeof value !== 'boolean') return ''
  switch (field.kind) {
    case 'money': return formatBRL(value as number)
    case 'integer': return `${formatNumber(value as number)}${field.unit ? ` ${field.unit}` : ''}`
    case 'decimal': return `${decimal(value as number)}${field.unit ? ` ${field.unit}` : ''}`
    case 'percent': return `${decimal(value as number)}%`
    case 'boolean': return value ? 'Sim' : 'Não'
    case 'date': return formatDate(value as string)
    case 'tags': case 'lines': return (value as string[]).join(', ')
    case 'select': case 'combobox': return optionsOf(field).find((o) => o.value === value)?.label ?? String(value)
    case 'ncm': {
      const label = NCM_OPTIONS.find((o) => o.value === value)?.label
      return label ? `${value} — ${label}` : String(value)
    }
    default: return String(value)
  }
}

const mono: FieldDef['kind'][] = ['ncm', 'cest', 'gtin', 'cnpj']

/** Valor formatado para a leitura. Vazio e pendente vira um aviso com texto (nunca só cor). */
export function renderValue(field: FieldDef, values: Values): ReactNode {
  const value = values[field.id]
  const text = displayText(field, value, values)
  if (!text) {
    return field.importance === 'required' || field.importance === 'recommended'
      ? <Badge tone="warning" size="sm">Pendente</Badge>
      : null
  }
  if (field.kind === 'tags') return <span className="flex flex-wrap gap-1.5">{(value as string[]).map((t) => <Chip key={t}>{t}</Chip>)}</span>
  if (field.kind === 'lines') return <ul className="list-disc pl-4 font-normal">{(value as string[]).map((t) => <li key={t}>{t}</li>)}</ul>
  if (field.kind === 'textarea') return <span className="block font-normal whitespace-pre-line">{text}</span>
  if (field.kind === 'url') return <a className="text-link underline underline-offset-4" href={String(value)} target="_blank" rel="noreferrer">{text}</a>
  return mono.includes(field.kind) ? <span className="font-mono text-sm">{text}</span> : text
}
