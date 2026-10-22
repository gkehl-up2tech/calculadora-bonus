/**
 * USUÁRIOS E PAPÉIS — DADOS DE DEMONSTRAÇÃO EM MEMÓRIA. TEMPORÁRIOS.
 * Enquanto não há login, o usuário ativo é escolhido no menu do usuário ("Entrar como"). Com autenticação real,
 * `useSession` passa a vir do login e a lista abaixo, da API de usuários (mantendo `addUser`/`updateUser`).
 */
import { useSyncExternalStore } from 'react'

export type Role = 'admin' | 'manager' | 'tax' | 'common'

export const ROLES: Role[] = ['admin', 'manager', 'tax', 'common']

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Admin',
  manager: 'Gerente de produto',
  tax: 'Tributação',
  common: 'Acesso comum',
}

export const ROLE_SUMMARY: Record<Role, string> = {
  admin: 'Gere usuários, papéis e configurações, e pode atuar em tudo.',
  manager: 'Solicita o cadastro de novos produtos; edita os seus, inclusive a parte fiscal, envia para a Tributação e ativa depois da aprovação.',
  tax: 'Equipe terceira: revisa, ajusta e aprova a tributação de qualquer produto.',
  common: 'Equipe de cadastro: atende as solicitações, cria produtos do zero e edita qualquer produto (sem ativar nem mexer no fiscal).',
}

export interface AppUser {
  id: string
  name: string
  email: string
  role: Role
  /** Usuário desativado não entra, não recebe produtos e não aparece nas escolhas. */
  active: boolean
  /** Pessoa de uma equipe externa (terceirizada). */
  external?: boolean
}

export const USERS: AppUser[] = [
  { id: 'u-admin', name: 'Usuário UP2Tech', email: 'usuario@up2tech.com.br', role: 'admin', active: true },
  { id: 'u-marina', name: 'Marina Costa', email: 'marina.costa@up2tech.com.br', role: 'manager', active: true },
  { id: 'u-rafael', name: 'Rafael Lima', email: 'rafael.lima@up2tech.com.br', role: 'manager', active: true },
  { id: 'u-beatriz', name: 'Beatriz Nunes', email: 'beatriz.nunes@contabilparceira.com.br', role: 'tax', active: true, external: true },
  { id: 'u-carla', name: 'Carla Souza', email: 'carla.souza@up2tech.com.br', role: 'common', active: true },
]

const listeners = new Set<() => void>()
let version = 0
const bump = () => {
  version++
  listeners.forEach((l) => l())
}

/** Re-renderiza quando a lista de usuários muda. */
export function useUsersVersion() {
  return useSyncExternalStore((cb) => (listeners.add(cb), () => void listeners.delete(cb)), () => version)
}

export const findUser = (id: string) => USERS.find((u) => u.id === id)
export const userName = (id: string) => findUser(id)?.name ?? '—'

/** Quem pode ser responsável por um produto: gerentes de produto e Admin ativos. */
export const owners = () => USERS.filter((u) => u.active && (u.role === 'admin' || u.role === 'manager'))

/** Esta pessoa pode ser responsável por produtos? (Quem só cadastra, como o Acesso comum, precisa indicar um responsável.) */
export const canOwn = (user: AppUser) => owners().some((u) => u.id === user.id)

export interface NewUser {
  name: string
  email: string
  role: Role
  external?: boolean
}

/** Valida nome, e-mail e unicidade. Devolve a mensagem por campo (vazio = ok). `ignoreId` é o usuário que está sendo editado. */
export function validateUser(input: Partial<NewUser>, ignoreId?: string): Partial<Record<'name' | 'email', string>> {
  const e: Partial<Record<'name' | 'email', string>> = {}
  if (!input.name?.trim()) e.name = 'Informe o nome.'
  const email = input.email?.trim().toLowerCase() ?? ''
  if (!email) e.email = 'Informe o e-mail.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'E-mail inválido.'
  else if (USERS.some((u) => u.id !== ignoreId && u.email.toLowerCase() === email)) e.email = 'Já existe um usuário com este e-mail.'
  return e
}

export function addUser(input: NewUser): AppUser {
  const user: AppUser = { id: `u-${Math.random().toString(36).slice(2, 8)}`, name: input.name.trim(), email: input.email.trim().toLowerCase(), role: input.role, active: true, external: input.external }
  USERS.push(user)
  bump()
  return user
}

export function updateUser(id: string, patch: Partial<Pick<AppUser, 'name' | 'email' | 'role' | 'active' | 'external'>>) {
  const user = findUser(id)
  if (!user) return
  Object.assign(user, patch, patch.email ? { email: patch.email.trim().toLowerCase() } : {}, patch.name ? { name: patch.name.trim() } : {})
  bump()
}
