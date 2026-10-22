/**
 * Importação de produtos por CSV: modelo, leitura tolerante (separador, acentos, codificação) e validação por linha.
 * Cada linha vira um RASCUNHO, como no cadastro rápido. Não cria nada: devolve as linhas e o que há de errado em cada uma.
 */
import { decodeCsv, detectDelimiter, parseCsv, toCsv } from '@/lib/csv'
import { applyMask, MASKS } from '@/lib/masks'
import { can } from '../access/permissions'
import { canOwn, owners, type AppUser } from '../access/users'
import { ORIGEM_OPTIONS, UNIT_OPTIONS } from './options'
import { PRODUCTS, DEPARTMENTS } from './sample-products'
import { FIELDS, isEmpty, type Values } from './schema'
import { emptyValues } from './detail'
import { validate } from './validate'

export const MAX_IMPORT_ROWS = 500
export const MAX_IMPORT_MB = 2

export interface ImportColumn {
  key: string
  /** Cabeçalho do modelo. */
  header: string
  label: string
  required?: boolean
  help: string
  example: [string, string]
  adminOnly?: boolean
}

export const IMPORT_COLUMNS: ImportColumn[] = [
  { key: 'title', header: 'titulo', label: 'Título', required: true, help: 'Até 120 caracteres.', example: ['Luva de segurança G', 'Lâmpada LED 9 W'] },
  { key: 'departamento', header: 'departamento', label: 'Departamento', required: true, help: `Um destes: ${DEPARTMENTS.join(', ')}.`, example: ['Ferragens', 'Elétrica'] },
  { key: 'sku', header: 'sku', label: 'SKU', help: 'Em branco: o sistema gera o próximo livre.', example: ['', 'UP-5002'] },
  { key: 'tipo', header: 'tipo', label: 'Tipo', help: 'simples, variacoes ou kit. Em branco: simples.', example: ['simples', 'simples'] },
  { key: 'unidade', header: 'unidade', label: 'Unidade', help: 'UN, CX, KG, M… Em branco: UN.', example: ['PAR', 'UN'] },
  { key: 'marca', header: 'marca', label: 'Marca', help: 'Texto livre.', example: ['Fixa Forte', 'Brilho Max'] },
  { key: 'ean', header: 'ean', label: 'EAN / GTIN', help: '8, 12, 13 ou 14 dígitos, com dígito verificador correto.', example: ['', '7891000100110'] },
  { key: 'ncm', header: 'ncm', label: 'NCM', help: '8 dígitos, com ou sem pontos.', example: ['6116.10.00', '8539.50.00'] },
  { key: 'origem', header: 'origem', label: 'Origem', help: 'Número de 0 a 8 (0 = Nacional).', example: ['0', '0'] },
  { key: 'descricaoCurta', header: 'descricao_curta', label: 'Descrição curta', help: 'Até 255 caracteres.', example: ['Luva de malha com banho de látex.', 'Lâmpada LED branca de 9 W.'] },
  { key: 'responsavel', header: 'responsavel', label: 'Responsável', help: 'Nome ou e-mail de um gerente de produto. Só o Admin escolhe; para os demais, é você.', example: ['', ''], adminOnly: true },
]

/** Colunas que o perfil pode usar. */
export const importColumnsFor = (user: AppUser) => IMPORT_COLUMNS.filter((c) => !c.adminOnly || can(user, 'product.reassign'))

/** Texto do modelo (CSV com ";" e BOM, que o Excel abre direto em português). */
export function templateCsv(user: AppUser): string {
  const cols = importColumnsFor(user)
  return String.fromCharCode(0xfeff) + toCsv([cols.map((c) => c.header), cols.map((c) => c.example[0]), cols.map((c) => c.example[1])], ';')
}

const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
const slug = (s: string) => norm(s).replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

const ALIASES: Record<string, string> = {
  titulo: 'title', nome: 'title', nome_do_produto: 'title', produto: 'title', descricao: 'descricaoCurta',
  departamento: 'departamento', depto: 'departamento', sku: 'sku', codigo: 'sku', tipo: 'tipo', unidade: 'unidade', un: 'unidade',
  marca: 'marca', ean: 'ean', gtin: 'ean', codigo_de_barras: 'ean', ncm: 'ncm', origem: 'origem',
  descricao_curta: 'descricaoCurta', responsavel: 'responsavel', gerente: 'responsavel',
}

export interface ImportRow {
  /** Linha no arquivo (cabeçalho = 1). */
  line: number
  title: string
  sku: string
  departamento: string
  values: Values
  errors: string[]
}

export interface ImportResult {
  delimiter: string
  rows: ImportRow[]
  /** Problemas do arquivo como um todo (impedem a importação). */
  fileErrors: string[]
  /** Colunas do arquivo que o sistema não usa. */
  ignored: string[]
}

const TIPOS: Record<string, string> = { simples: 'simples', variacoes: 'variacoes', variacao: 'variacoes', com_variacoes: 'variacoes', kit: 'kit' }
const fieldLabel = (id: string) => FIELDS.find((f) => f.id === id)?.label ?? id

function nextSkuFrom(used: Set<string>) {
  const max = [...PRODUCTS.map((p) => p.sku), ...used].reduce((m, s) => Math.max(m, Number(/^UP-(\d+)$/i.exec(s)?.[1] ?? 0)), 0)
  let n = max
  return () => `UP-${++n}`
}

/** Lê o arquivo (bytes) e valida cada linha contra as regras do cadastro. */
export function parseImport(buffer: ArrayBuffer, user: AppUser): ImportResult {
  const text = decodeCsv(buffer)
  const delimiter = detectDelimiter(text)
  const table = parseCsv(text, delimiter)
  const empty = (fileErrors: string[]): ImportResult => ({ delimiter, rows: [], fileErrors, ignored: [] })
  if (table.length === 0) return empty(['O arquivo está vazio.'])

  const [header, ...body] = table
  const columns = header!.map((h) => ALIASES[slug(h)])
  const allowed = new Set(importColumnsFor(user).map((c) => c.key))
  const ignored = header!.filter((h, i) => h.trim() && (!columns[i] || !allowed.has(columns[i]!)))
  const fileErrors: string[] = []
  for (const key of ['title', 'departamento']) {
    if (!columns.includes(key)) fileErrors.push(`Não encontrei a coluna "${IMPORT_COLUMNS.find((c) => c.key === key)!.header}". Baixe o modelo para ver as colunas.`)
  }
  if (body.length === 0) fileErrors.push('O arquivo só tem o cabeçalho: faltam as linhas dos produtos.')
  if (body.length > MAX_IMPORT_ROWS) fileErrors.push(`O arquivo tem ${body.length} linhas. O máximo por importação é ${MAX_IMPORT_ROWS}: divida em partes.`)
  if (fileErrors.length) return { delimiter, rows: [], fileErrors, ignored }

  const usedSkus = new Set<string>()
  for (const r of body) {
    const i = columns.indexOf('sku')
    if (i >= 0 && r[i]?.trim()) usedSkus.add(r[i]!.trim().toUpperCase())
  }
  const nextSku = nextSkuFrom(usedSkus)
  const seenSku = new Set<string>()
  const seenEan = new Set<string>()
  const canPickOwner = can(user, 'product.reassign')

  const rows = body.map<ImportRow>((cells, idx) => {
    const raw: Record<string, string> = {}
    columns.forEach((key, i) => {
      if (key && allowed.has(key)) raw[key] = (cells[i] ?? '').trim()
    })
    const errors: string[] = []
    const values: Values = { ...emptyValues(), status: 'draft', responsavel: canOwn(user) ? user.id : '' }

    values.title = raw.title ?? ''
    values.marca = raw.marca ?? ''
    values.descricaoCurta = raw.descricaoCurta ?? ''
    values.ean = (raw.ean ?? '').replace(/\D/g, '')

    const dep = DEPARTMENTS.find((d) => norm(d) === norm(raw.departamento ?? ''))
    if (raw.departamento && !dep) errors.push(`Departamento "${raw.departamento}" não existe. Use: ${DEPARTMENTS.join(', ')}.`)
    values.departamento = dep ?? ''

    const tipo = raw.tipo ? TIPOS[slug(raw.tipo)] : 'simples'
    if (!tipo) errors.push(`Tipo "${raw.tipo}" inválido. Use simples, variacoes ou kit.`)
    values.tipo = tipo ?? 'simples'

    const un = raw.unidade ? UNIT_OPTIONS.find((o) => o.value === raw.unidade!.toUpperCase()) : { value: 'UN' }
    if (!un) errors.push(`Unidade "${raw.unidade}" não existe.`)
    values.unidade = un?.value ?? 'UN'

    if (raw.origem) {
      const o = ORIGEM_OPTIONS.find((x) => x.value === raw.origem) ?? ORIGEM_OPTIONS.find((x) => norm(x.label).includes(norm(raw.origem!)))
      if (!o) errors.push(`Origem "${raw.origem}" inválida. Use um número de 0 a 8.`)
      values.origem = o?.value ?? ''
    }

    const digits = (raw.ncm ?? '').replace(/\D/g, '')
    values.ncm = applyMask(digits, MASKS.ncm)

    if (canPickOwner && raw.responsavel) {
      const owner = owners().find((u) => norm(u.name) === norm(raw.responsavel!) || norm(u.email) === norm(raw.responsavel!))
      if (!owner) errors.push(`Responsável "${raw.responsavel}" não encontrado entre os gerentes de produto.`)
      else values.responsavel = owner.id
    }

    // SKU: explícito (único no arquivo) ou gerado.
    let sku = (raw.sku ?? '').trim()
    if (!sku) {
      do sku = nextSku()
      while (usedSkus.has(sku.toUpperCase()))
    }
    values.sku = sku
    if (seenSku.has(sku.toUpperCase())) errors.push(`SKU "${sku}" repetido no arquivo.`)
    seenSku.add(sku.toUpperCase())
    if (values.ean) {
      if (seenEan.has(String(values.ean))) errors.push(`GTIN ${values.ean} repetido no arquivo.`)
      seenEan.add(String(values.ean))
    }

    // Mesmas regras do cadastro (obrigatórios do rascunho, formatos, duplicidade com o catálogo).
    for (const [id, msg] of Object.entries(validate(values, ''))) {
      if (id === 'departamento' && raw.departamento) continue // já explicado acima
      if (id === 'departamento' && !isEmpty(values.departamento)) continue
      errors.push(`${fieldLabel(id)}: ${msg}`)
    }

    return { line: idx + 2, title: String(values.title), sku, departamento: dep ?? raw.departamento ?? '', values, errors }
  })

  return { delimiter, rows, fileErrors: [], ignored }
}
