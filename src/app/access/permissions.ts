import type { FieldDef } from '../products/schema'
import { isFiscalField } from '../products/schema'
import { ROLES, type AppUser, type Role } from './users'

/**
 * PERMISSÕES — cada papel é uma lista de permissões; a tela só pergunta `can(...)`.
 * Papéis fixos, mas montados assim: criar papéis personalizados depois é só ganhar uma tela, sem refazer regras.
 *
 * ATENÇÃO: isto só controla a interface. A regra real precisa ser aplicada também no servidor.
 */
export interface PermissionDef {
  id: Permission
  label: string
  group: string
}

export type Permission =
  | 'product.create'
  | 'request.create'
  | 'request.view.own'
  | 'request.view.any'
  | 'request.handle'
  | 'product.edit.own'
  | 'product.edit.any'
  | 'product.reassign'
  | 'product.activate.own'
  | 'product.activate.any'
  | 'fiscal.edit.own'
  | 'fiscal.edit.any'
  | 'fiscal.review'
  | 'queue.view'
  | 'sync.retry'
  | 'settings.view'
  | 'connections.view'
  | 'users.manage'
  | 'roles.view'

export const PERMISSIONS: PermissionDef[] = [
  { id: 'product.create', label: 'Criar produtos', group: 'Produtos' },
  { id: 'request.create', label: 'Solicitar o cadastro de um produto', group: 'Solicitações de cadastro' },
  { id: 'request.view.own', label: 'Acompanhar as próprias solicitações', group: 'Solicitações de cadastro' },
  { id: 'request.view.any', label: 'Ver todas as solicitações', group: 'Solicitações de cadastro' },
  { id: 'request.handle', label: 'Atender solicitações (criar o produto ou recusar)', group: 'Solicitações de cadastro' },
  { id: 'product.edit.own', label: 'Editar os produtos de que é responsável', group: 'Produtos' },
  { id: 'product.edit.any', label: 'Editar qualquer produto', group: 'Produtos' },
  { id: 'product.reassign', label: 'Trocar o responsável do produto', group: 'Produtos' },
  { id: 'product.activate.own', label: 'Ativar e inativar os próprios produtos', group: 'Produtos' },
  { id: 'product.activate.any', label: 'Ativar e inativar qualquer produto', group: 'Produtos' },
  { id: 'fiscal.edit.own', label: 'Editar a parte fiscal dos próprios produtos', group: 'Tributação' },
  { id: 'fiscal.edit.any', label: 'Editar a parte fiscal de qualquer produto', group: 'Tributação' },
  { id: 'fiscal.review', label: 'Aprovar a tributação ou pedir ajuste', group: 'Tributação' },
  { id: 'queue.view', label: 'Ver a fila da Tributação', group: 'Tributação' },
  { id: 'sync.retry', label: 'Reenviar produtos para a API', group: 'Integração' },
  { id: 'settings.view', label: 'Configurações e Design System', group: 'Administração' },
  { id: 'connections.view', label: 'Conexões', group: 'Administração' },
  { id: 'users.manage', label: 'Criar e gerir usuários', group: 'Administração' },
  { id: 'roles.view', label: 'Ver papéis e permissões', group: 'Administração' },
]

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: PERMISSIONS.map((p) => p.id),
  manager: ['request.create', 'request.view.own', 'product.edit.own', 'product.activate.own', 'fiscal.edit.own'],
  tax: ['fiscal.edit.any', 'fiscal.review', 'queue.view'],
  common: ['product.create', 'product.edit.any', 'product.reassign', 'request.view.any', 'request.handle'],
}

export const hasPermission = (user: AppUser, permission: Permission) => user.active && ROLE_PERMISSIONS[user.role].includes(permission)

/** O que a tela precisa saber de um produto para decidir. */
export interface AccessProduct {
  owner: string
  /** Situação da tributação (no cadastro novo ainda não existe). */
  fiscal?: 'none' | 'review' | 'adjust' | 'approved'
}

export type Action =
  | 'product.create'
  | 'request.create'
  | 'request.view'
  | 'request.handle'
  | 'product.edit'
  | 'product.reassign'
  | 'product.activate'
  | 'fiscal.edit'
  | 'fiscal.submit'
  | 'fiscal.review'
  | 'queue.view'
  | 'sync.retry'
  | 'connections.view'
  | 'settings.view'
  | 'users.manage'
  | 'roles.view'

const own = (user: AppUser, product?: AccessProduct) => product?.owner === user.id

/** Para solicitações, `owner` é quem pediu. */

export function can(user: AppUser, action: Action, product?: AccessProduct): boolean {
  const has = (p: Permission) => hasPermission(user, p)
  switch (action) {
    case 'product.create':
    case 'request.create':
    case 'request.handle':
    case 'product.reassign':
    case 'fiscal.review':
    case 'queue.view':
    case 'sync.retry':
    case 'connections.view':
    case 'settings.view':
    case 'users.manage':
    case 'roles.view':
      return has(action)
    case 'request.view':
      // Sem solicitação indicada: "pode abrir a página" (a própria lista ou todas).
      return has('request.view.any') || (has('request.view.own') && (!product || own(user, product)))
    case 'product.edit':
      return has('product.edit.any') || (has('product.edit.own') && own(user, product))
    case 'product.activate':
      return has('product.activate.any') || (has('product.activate.own') && own(user, product))
    case 'fiscal.edit':
      // Enquanto a Tributação analisa, o responsável não mexe no fiscal (senão o dado muda debaixo da análise).
      return has('fiscal.edit.any') || (has('fiscal.edit.own') && own(user, product) && product?.fiscal !== 'review')
    case 'fiscal.submit':
      return can(user, 'product.edit', product) || (has('fiscal.edit.own') && own(user, product))
  }
}

/** Pode editar este campo? A parte fiscal e o resto têm donos diferentes; "Responsável" é só de quem troca responsáveis. */
export function canEditField(user: AppUser, field: FieldDef, product: AccessProduct): boolean {
  if (field.adminOnly) return can(user, 'product.reassign')
  // Ativar e inativar é uma permissão à parte: quem edita o produto mas não ativa vê o status sem controle.
  if (field.id === 'status') return can(user, 'product.edit', product) && can(user, 'product.activate', product)
  return isFiscalField(field) ? can(user, 'fiscal.edit', product) : can(user, 'product.edit', product)
}

/** Resumo de edição de um produto para este usuário. */
export function editScope(user: AppUser, product: AccessProduct) {
  const general = can(user, 'product.edit', product)
  const fiscal = can(user, 'fiscal.edit', product)
  return { general, fiscal, any: general || fiscal }
}

/** Por que a edição está indisponível (para explicar na tela). Vazio quando pode editar algo. */
export function readOnlyReason(user: AppUser, product: AccessProduct, ownerName: string): string {
  if (editScope(user, product).any) return ''
  if (!hasPermission(user, 'product.edit.own')) return 'Seu acesso não permite editar produtos.'
  return `Produto de ${ownerName}: você só edita os seus.`
}

export const PERMISSIONS_BY_ROLE = ROLES.map((role) => ({ role, permissions: ROLE_PERMISSIONS[role] }))
