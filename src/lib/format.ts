const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const num = new Intl.NumberFormat('pt-BR')

export const formatBRL = (value: number) => brl.format(value)
export const formatNumber = (value: number) => num.format(value)

/** "1.234,56" / "R$ 1.234,56" → 1234.56 (NaN-safe: retorna null quando vazio). */
export function parseBRL(text: string): number | null {
  const digits = text.replace(/\D/g, '')
  if (!digits) return null
  return Number(digits) / 100
}

/** "Maria da Silva" → "MS" (primeira e última palavra). */
export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0]![0]!
  const last = parts.length > 1 ? parts[parts.length - 1]![0]! : ''
  return (first + last).toUpperCase()
}

const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' })
/** "21/10/2026 09:40" no horário de Brasília. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso))
