import { useMemo } from 'react'
import { useTheme } from '@/lib/theme'

/** Lê o valor resolvido de uma variável CSS. Recalcula quando o tema muda (o atributo já foi aplicado). */
export function useCssVar(name: string) {
  const { resolved } = useTheme()
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `resolved` é a dependência que invalida a leitura
  return useMemo(() => getComputedStyle(document.documentElement).getPropertyValue(name).trim(), [name, resolved])
}
