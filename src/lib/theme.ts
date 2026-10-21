import { useSyncExternalStore } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const KEY = 'ds-theme'
const listeners = new Set<() => void>()
const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

function readPreference(): ThemePreference {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* storage indisponível (janela privada etc.) */
  }
  return 'system'
}

let preference = readPreference()

function resolve(pref: ThemePreference): ResolvedTheme {
  return pref === 'system' ? (media?.matches ? 'dark' : 'light') : pref
}

const THEME_COLOR: Record<ResolvedTheme, string> = { light: '#ffffff', dark: '#0b1220' }

function apply() {
  const resolved = resolve(preference)
  document.documentElement.dataset.theme = resolved
  // A barra de status acompanha o tema escolhido no app, não só o do sistema.
  const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
  metas.forEach((meta, i) => {
    if (i === 0) {
      meta.removeAttribute('media')
      meta.content = THEME_COLOR[resolved]
    } else meta.remove()
  })
  listeners.forEach((l) => l())
}

export function setThemePreference(next: ThemePreference) {
  preference = next
  try {
    localStorage.setItem(KEY, next)
  } catch {
    /* ignora */
  }
  apply()
}

media?.addEventListener('change', () => preference === 'system' && apply())

export function initTheme() {
  apply()
}

/** Hook: preferência escolhida e tema efetivamente aplicado. */
export function useTheme() {
  const pref = useSyncExternalStore(
    (cb) => (listeners.add(cb), () => void listeners.delete(cb)),
    () => preference,
  )
  const resolved = useSyncExternalStore(
    (cb) => (listeners.add(cb), () => void listeners.delete(cb)),
    () => resolve(preference),
  )
  return { preference: pref, resolved, setPreference: setThemePreference }
}
