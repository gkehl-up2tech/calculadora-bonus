/** Leitura e escrita de CSV (RFC 4180 com os usos do Excel em português: ";" como separador e codificação ANSI). */

/** Decodifica o arquivo: UTF-8 (com ou sem BOM) e, se houver bytes inválidos, Windows-1252 (o "CSV" padrão do Excel no Brasil). */
export function decodeCsv(buffer: ArrayBuffer): string {
  let text: string
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(buffer)
  } catch {
    text = new TextDecoder('windows-1252').decode(buffer)
  }
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}

const DELIMITERS = [';', ',', '\t'] as const
export type Delimiter = (typeof DELIMITERS)[number]

/** Escolhe o separador pela primeira linha (fora de aspas). Empate: ";". */
export function detectDelimiter(text: string): Delimiter {
  const counts: Record<Delimiter, number> = { ';': 0, ',': 0, '\t': 0 }
  let quoted = false
  for (const ch of text) {
    if (ch === '"') quoted = !quoted
    else if (!quoted && (ch === '\n' || ch === '\r')) break
    else if (!quoted && ch in counts) counts[ch as Delimiter]++
  }
  return DELIMITERS.reduce((best, d) => (counts[d] > counts[best] ? d : best), ';' as Delimiter)
}

/** Lê o texto em linhas × colunas. Aceita campos entre aspas (com quebras de linha e "" escapado) e ignora linhas vazias. */
export function parseCsv(text: string, delimiter: Delimiter = detectDelimiter(text)): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  const endField = () => {
    row.push(field)
    field = ''
  }
  const endRow = () => {
    endField()
    if (row.some((c) => c.trim() !== '')) rows.push(row)
    row = []
  }
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else quoted = false
      } else field += ch
    } else if (ch === '"' && field === '') quoted = true
    else if (ch === delimiter) endField()
    else if (ch === '\n') endRow()
    else if (ch === '\r') {
      if (text[i + 1] === '\n') i++
      endRow()
    } else field += ch
  }
  if (field !== '' || row.length > 0) endRow()
  return rows
}

/** Monta o CSV; campos com separador, aspas ou quebra de linha vão entre aspas. */
export function toCsv(rows: string[][], delimiter: Delimiter = ';'): string {
  const cell = (v: string) => (v.includes(delimiter) || /["\n\r]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v)
  return rows.map((r) => r.map(cell).join(delimiter)).join('\r\n')
}
