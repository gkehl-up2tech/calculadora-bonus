import { useSyncExternalStore } from 'react'
import { USERS, type AppUser } from './users'

const KEY = 'up2tech.demo-user'
const listeners = new Set<() => void>()
const admin = () => USERS.find((u) => u.role === 'admin' && u.active) ?? USERS[0]!

function load(): AppUser {
  try {
    const id = localStorage.getItem(KEY)
    return USERS.find((u) => u.id === id && u.active) ?? admin()
  } catch {
    return admin()
  }
}

let current = load()

/** Troca o usuário de demonstração. Substituir pelo login real quando existir. */
export function setSession(id: string) {
  const next = USERS.find((u) => u.id === id && u.active)
  if (!next || next.id === current.id) return
  current = next
  try {
    localStorage.setItem(KEY, id)
  } catch {
    /* sem armazenamento: vale só nesta carga */
  }
  listeners.forEach((l) => l())
}

export const getSession = () => current

/** Usuário logado (hoje: usuário de demonstração). Um usuário desativado volta ao Admin. */
export function useSession(): AppUser {
  const user = useSyncExternalStore((cb) => (listeners.add(cb), () => void listeners.delete(cb)), () => current, () => USERS[0]!)
  return user.active ? user : admin()
}
