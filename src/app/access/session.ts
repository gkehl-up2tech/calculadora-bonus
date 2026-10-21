import { useSyncExternalStore } from 'react'
import { USERS, type AppUser } from './users'

const KEY = 'up2tech.demo-user'
const listeners = new Set<() => void>()

function load(): AppUser {
  try {
    const id = localStorage.getItem(KEY)
    return USERS.find((u) => u.id === id) ?? USERS[0]!
  } catch {
    return USERS[0]!
  }
}

let current = load()

/** Troca o perfil de demonstração. Substituir pelo login real quando existir. */
export function setSession(id: string) {
  const next = USERS.find((u) => u.id === id)
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

/** Usuário logado (hoje: perfil de demonstração). */
export function useSession(): AppUser {
  return useSyncExternalStore((cb) => (listeners.add(cb), () => void listeners.delete(cb)), () => current, () => USERS[0]!)
}
