/**
 * SOLICITAÇÕES DE CADASTRO — DADOS DE DEMONSTRAÇÃO EM MEMÓRIA. TEMPORÁRIOS.
 * O gerente de produto não cria produtos: ele solicita (título, departamento, categoria, urgência e um arquivo CSV/DOC).
 * A equipe de cadastro (Acesso comum) atende pela fila: cria o produto a partir do pedido ou recusa com motivo.
 * Com backend, troque as funções deste arquivo (mantendo as assinaturas) e guarde o arquivo em um armazenamento de objetos.
 */
import { useSyncExternalStore } from 'react'
import { can } from '../access/permissions'
import { userName, type AppUser } from '../access/users'
import { DEPARTMENTS } from '../products/sample-products'

export type RequestStatus = 'pending' | 'done' | 'rejected'

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = { pending: 'Pendente', done: 'Atendida', rejected: 'Recusada' }
export const REQUEST_STATUS_TONE: Record<RequestStatus, 'warning' | 'success' | 'danger'> = { pending: 'warning', done: 'success', rejected: 'danger' }

export interface RequestFile {
  name: string
  size: number
  /** Conteúdo como data URI. Vazio em dados de exemplo sem conteúdo. */
  src: string
}

export interface RegistrationRequest {
  id: string
  title: string
  departamento: string
  categoria: string
  urgent: boolean
  file: RequestFile
  requestedBy: string
  requestedAt: string
  status: RequestStatus
  handledBy?: string
  handledAt?: string
  /** Produto criado (situação Atendida). */
  productId?: string
  /** Motivo da recusa (situação Recusada). */
  reason?: string
}

export const REQUEST_FILE_TYPES = ['.csv', '.doc', '.docx']
export const MAX_REQUEST_FILE_MB = 5

export const isCsv = (file: Pick<RequestFile, 'name'>) => file.name.toLowerCase().endsWith('.csv')

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString()

/** Constrói o conteúdo de um CSV de exemplo (UTF-8 com BOM, ";"). */
function sampleCsv(rows: string[][]): RequestFile['src'] {
  const text = String.fromCharCode(0xfeff) + rows.map((r) => r.join(';')).join('\r\n')
  return `data:text/csv;base64,${toBase64(new TextEncoder().encode(text))}`
}

function toBase64(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(bin)
}

const sampleFile = (name: string, rows: string[][]): RequestFile => {
  const src = sampleCsv(rows)
  return { name, size: Math.round((src.length - src.indexOf(',') - 1) * 0.75), src }
}

export const REQUESTS: RegistrationRequest[] = [
  {
    id: 's005', title: 'Fonte chaveada 12 V 10 A', departamento: 'Elétrica', categoria: 'Fontes de alimentação', urgent: true,
    file: sampleFile('fonte-chaveada-12v.csv', [['titulo', 'marca', 'ean', 'ncm'], ['Fonte chaveada 12 V 10 A', 'Voltix', '7891234567895', '8504.40.90']]),
    requestedBy: 'u-marina', requestedAt: hoursAgo(3), status: 'pending',
  },
  {
    id: 's004', title: 'Cadeira de escritório ergonômica', departamento: 'Móveis', categoria: 'Cadeiras', urgent: false,
    file: { name: 'ficha-cadeira-ergonomica.docx', size: 48_200, src: '' },
    requestedBy: 'u-rafael', requestedAt: hoursAgo(26), status: 'pending',
  },
  {
    id: 's003', title: 'Kit de chaves Allen 9 peças', departamento: 'Ferragens', categoria: 'Ferramentas manuais', urgent: false,
    file: sampleFile('kit-chaves-allen.csv', [['titulo', 'marca', 'unidade'], ['Kit de chaves Allen 9 peças', 'Torque', 'KIT']]),
    requestedBy: 'u-marina', requestedAt: hoursAgo(50), status: 'pending',
  },
  {
    id: 's002', title: 'Smartphone 128 GB · Médio', departamento: 'Eletrônicos', categoria: 'Celulares', urgent: false,
    file: sampleFile('smartphone-128gb.csv', [['titulo', 'marca'], ['Smartphone 128 GB · Médio', 'Nexa']]),
    requestedBy: 'u-marina', requestedAt: hoursAgo(120), status: 'done', handledBy: 'u-carla', handledAt: hoursAgo(100), productId: 'p27',
  },
  {
    id: 's001', title: 'Mesa dobrável de camping', departamento: 'Móveis', categoria: 'Mesas', urgent: false,
    file: { name: 'mesa-camping.doc', size: 31_700, src: '' },
    requestedBy: 'u-marina', requestedAt: hoursAgo(200), status: 'rejected', handledBy: 'u-carla', handledAt: hoursAgo(190),
    reason: 'O arquivo não traz marca nem medidas. Envie de novo com a ficha preenchida.',
  },
]

const listeners = new Set<() => void>()
let version = 0
const bump = () => {
  version++
  listeners.forEach((l) => l())
}

/** Re-renderiza quando as solicitações mudam. */
export function useRequestsVersion() {
  return useSyncExternalStore((cb) => (listeners.add(cb), () => void listeners.delete(cb)), () => version)
}

export const findRequest = (id: string) => REQUESTS.find((r) => r.id === id)

/** Solicitações que este usuário pode ver: todas, ou só as dele. */
export const requestsFor = (user: AppUser) => REQUESTS.filter((r) => can(user, 'request.view', { owner: r.requestedBy }))

export const pendingCount = (user: AppUser) => requestsFor(user).filter((r) => r.status === 'pending').length

export interface RequestInput {
  title: string
  departamento: string
  categoria: string
  urgent: boolean
  file: RequestFile | null
}

export type RequestErrors = Partial<Record<'title' | 'departamento' | 'categoria' | 'file', string>>

export function validateRequest(input: RequestInput): RequestErrors {
  const e: RequestErrors = {}
  if (!input.title.trim()) e.title = 'Informe o título do produto.'
  if (!input.departamento) e.departamento = 'Escolha o departamento.'
  else if (!DEPARTMENTS.includes(input.departamento)) e.departamento = 'Departamento inválido.'
  if (!input.categoria.trim()) e.categoria = 'Informe a categoria.'
  if (!input.file) e.file = 'Anexe o arquivo com os dados do produto (CSV ou DOC).'
  return e
}

export function createRequest(input: RequestInput, user: AppUser): RegistrationRequest {
  if (!can(user, 'request.create')) throw new Error('Sem permissão para solicitar cadastros.')
  if (Object.keys(validateRequest(input)).length > 0 || !input.file) throw new Error('Solicitação inválida.')
  const n = REQUESTS.reduce((m, r) => Math.max(m, Number(r.id.slice(1))), 0) + 1
  const request: RegistrationRequest = {
    id: `s${String(n).padStart(3, '0')}`,
    title: input.title.trim(),
    departamento: input.departamento,
    categoria: input.categoria.trim(),
    urgent: input.urgent,
    file: input.file,
    requestedBy: user.id,
    requestedAt: new Date().toISOString(),
    status: 'pending',
  }
  REQUESTS.unshift(request)
  bump()
  return request
}

/** Marca como atendida, ligando ao produto criado. */
export function completeRequest(id: string, productId: string, user: AppUser) {
  const r = findRequest(id)
  if (!r || r.status !== 'pending' || !can(user, 'request.handle')) return
  Object.assign(r, { status: 'done', handledBy: user.id, handledAt: new Date().toISOString(), productId })
  bump()
}

/** Recusa com motivo (obrigatório): é a devolutiva que o gerente vê. */
export function rejectRequest(id: string, reason: string, user: AppUser): string | null {
  const r = findRequest(id)
  if (!r || r.status !== 'pending' || !can(user, 'request.handle')) return 'Esta solicitação não pode mais ser recusada.'
  if (!reason.trim()) return 'Explique o motivo para o gerente poder corrigir.'
  Object.assign(r, { status: 'rejected', handledBy: user.id, handledAt: new Date().toISOString(), reason: reason.trim() })
  bump()
  return null
}

/** Lê o arquivo escolhido como data URI. */
export function readRequestFile(file: File): Promise<RequestFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => resolve({ name: file.name, size: file.size, src: String(reader.result) })
    reader.readAsDataURL(file)
  })
}

/** Texto de um arquivo CSV guardado (para a pré-visualização). Vazio se não houver conteúdo. */
export function requestFileText(file: RequestFile): string {
  const comma = file.src.indexOf(',')
  if (comma < 0 || !file.src.slice(0, comma).includes('base64')) return ''
  const bin = atob(file.src.slice(comma + 1))
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  let text: string
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    text = new TextDecoder('windows-1252').decode(bytes)
  }
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}

export const requesterName = (r: RegistrationRequest) => userName(r.requestedBy)

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
}
