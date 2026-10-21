import { useSyncExternalStore } from 'react'
import { EMBEDDED } from './embedded'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const KEY = 'ds-theme'
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())
const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

function readPreference(): ThemePreference {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* storage indisponível (janela privada, iframe isolado etc.) */
  }
  return 'system'
}

let preference = readPreference()

/** Tema realmente em vigor: o atributo da raiz manda; sem atributo, vale o do sistema. */
function currentResolved(): ResolvedTheme {
  const attr = document.documentElement.dataset.theme
  if (attr === 'light' || attr === 'dark') return attr
  return media?.matches ? 'dark' : 'light'
}

const THEME_COLOR: Record<ResolvedTheme, string> = { light: '#ffffff', dark: '#0b1220' }

function apply() {
  const root = document.documentElement
  if (preference === 'system') {
    // Embutido: sem escolha do usuário, deixamos o tema com a página hospedeira / o CSS (prefers-color-scheme).
    if (EMBEDDED) root.removeAttribute('data-theme')
    else root.dataset.theme = media?.matches ? 'dark' : 'light'
  } else {
    root.dataset.theme = preference
  }
  // A barra de status acompanha o tema escolhido no app, não só o do sistema.
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta, i) => {
    if (i === 0) {
      meta.removeAttribute('media')
      meta.content = THEME_COLOR[currentResolved()]
    } else meta.remove()
  })
  notify()
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

export function initTheme() {
  // Embutido e sem preferência salva: não mexe no que a página hospedeira definiu.
  if (!(EMBEDDED && preference === 'system')) apply()
  media?.addEventListener('change', () => preference === 'system' && !EMBEDDED && apply())
  media?.addEventListener('change', notify)
  // Mudanças externas no atributo (ex.: o seletor de tema da página hospedeira) atualizam quem lê o tema.
  new MutationObserver(notify).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
}

/** Hook: preferência escolhida e tema efetivamente aplicado. */
export function useTheme() {
  const subscribe = (cb: () => void) => (listeners.add(cb), () => void listeners.delete(cb))
  const pref = useSyncExternalStore(subscribe, () => preference)
  const resolved = useSyncExternalStore(subscribe, currentResolved)
  return { preference: pref, resolved, setPreference: setThemePreference }
}
