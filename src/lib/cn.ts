import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/** twMerge ciente dos tokens do sistema (alturas de controle, sombras e camadas customizadas). */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ['control-sm', 'control-md', 'control-lg', 'header'],
      shadow: ['border', 'xs', 'sm', 'md', 'lg', 'card', 'popover'],
    },
    classGroups: {
      z: [{ z: ['sticky', 'header', 'overlay', 'modal', 'popover', 'toast', 'tooltip'] }],
    },
  },
})

/** Junta classes condicionais e resolve conflitos do Tailwind (a última vence). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
