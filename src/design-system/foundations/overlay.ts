/** Classes compartilhadas por menus, popovers, selects e tooltips. */
export const overlayPanel = 'z-popover rounded-lg bg-raised text-fg shadow-popover outline-none'

/** Entrada/saída de painéis ancorados: escala a partir do gatilho (origem fornecida pelo Radix). */
export const popAnimation = 'data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out'

/** Item de menu/lista: realce por teclado (data-highlighted) e por mouse. */
export const menuItem = [
  'relative flex min-h-control-sm cursor-default items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm text-fg outline-none select-none',
  'transition-colors duration-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  'data-[highlighted]:bg-subtle',
].join(' ')
