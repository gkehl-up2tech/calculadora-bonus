import { useSyncExternalStore } from 'react'

/** true quando a media query casa. Ex.: useMediaQuery('(min-width: 768px)') */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
