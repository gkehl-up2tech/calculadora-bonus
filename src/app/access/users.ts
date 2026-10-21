/**
 * USUÁRIOS E PERFIS DE ACESSO — DADOS DE DEMONSTRAÇÃO. TEMPORÁRIOS.
 * Enquanto não há login, o perfil ativo é escolhido no menu do usuário ("Entrar como").
 * Com autenticação real, `useSession` passa a vir do login e a lista abaixo da API de usuários.
 */
export type Role = 'master' | 'manager' | 'viewer'

export const ROLE_LABEL: Record<Role, string> = {
  master: 'Master',
  manager: 'Gerente de produto',
  viewer: 'Acesso comum',
}

export interface AppUser {
  id: string
  name: string
  email: string
  role: Role
}

export const USERS: AppUser[] = [
  { id: 'u-master', name: 'Usuário UP2Tech', email: 'usuario@up2tech.com.br', role: 'master' },
  { id: 'u-marina', name: 'Marina Costa', email: 'marina.costa@up2tech.com.br', role: 'manager' },
  { id: 'u-rafael', name: 'Rafael Lima', email: 'rafael.lima@up2tech.com.br', role: 'manager' },
  { id: 'u-carla', name: 'Carla Souza', email: 'carla.souza@up2tech.com.br', role: 'viewer' },
]

/** Quem pode ser responsável por um produto. */
export const OWNERS = USERS.filter((u) => u.role !== 'viewer')

export const userName = (id: string) => USERS.find((u) => u.id === id)?.name ?? '—'
