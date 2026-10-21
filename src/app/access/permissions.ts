import type { AppUser } from './users'

/**
 * Quem pode o quê:
 *
 *   Ação                              Master   Gerente de produto          Acesso comum
 *   Ver produtos e todas as abas      sim      sim                         sim
 *   Criar produto                     sim      sim                         não
 *   Editar produto                    sim      só os que são seus          não
 *   Trocar o responsável do produto   sim      não                         não
 *   Conexões e Configurações          sim      não                         não
 *
 * ATENÇÃO: isto só controla a interface. A regra real precisa ser aplicada também no servidor.
 */
export type Action = 'product.create' | 'product.edit' | 'product.reassign' | 'connections.view' | 'settings.view'

export function can(user: AppUser, action: Action, product?: { owner: string }): boolean {
  switch (action) {
    case 'product.create':
      return user.role === 'master' || user.role === 'manager'
    case 'product.edit':
      return user.role === 'master' || (user.role === 'manager' && product?.owner === user.id)
    case 'product.reassign':
    case 'connections.view':
    case 'settings.view':
      return user.role === 'master'
  }
}

/** Por que a edição está indisponível (para explicar na tela). Vazio quando pode editar. */
export function readOnlyReason(user: AppUser, product: { owner: string }, ownerName: string): string {
  if (can(user, 'product.edit', product)) return ''
  return user.role === 'viewer' ? 'Seu acesso é só de visualização.' : `Produto de ${ownerName}: você só edita os seus.`
}
