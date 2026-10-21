import { useEffect } from 'react'
import { Command } from 'cmdk'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { Search, type LucideIcon } from 'lucide-react'
import { Icon, Spinner } from '../atoms'
import { ShortcutHint } from '../cells'

export interface CommandItem {
  id: string
  label: string
  /** Texto secundário à direita (ex.: SKU · NCM). */
  hint?: string
  icon?: LucideIcon
  shortcut?: string[]
  /** Palavras extras para a busca (sinônimos). */
  keywords?: string[]
  onSelect: () => void
}

export interface CommandGroup {
  id: string
  heading: string
  items: CommandItem[]
}

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: CommandGroup[]
  placeholder?: string
  /** Liga o atalho global Ctrl/⌘ + K. Deixe true em apenas UMA instância por tela. */
  shortcut?: boolean
  /**
   * Busca controlada pelo chamador (ex.: no servidor). Desliga o filtro local: os grupos recebidos
   * já devem refletir o texto digitado.
   */
  onSearchChange?: (query: string) => void
  loading?: boolean
  emptyText?: string
}

/**
 * Paleta de comandos (Ctrl/⌘ + K). É usada dezenas de vezes ao dia por teclado,
 * então abre e fecha SEM animação — de propósito.
 */
export function CommandPalette({ open, onOpenChange, groups, placeholder = 'Digite uma página ou ação…', shortcut = true, onSearchChange, loading, emptyText = 'Nada encontrado.' }: CommandPaletteProps) {
  useEffect(() => {
    if (!shortcut) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange, shortcut])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-overlay bg-overlay" />
        <DialogPrimitive.Content
          aria-label="Paleta de comandos"
          aria-describedby={undefined}
          className="fixed top-[12dvh] left-1/2 z-modal w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl bg-raised text-fg shadow-popover outline-none"
        >
          <DialogPrimitive.Title className="sr-only">Paleta de comandos</DialogPrimitive.Title>
          <Command loop shouldFilter={!onSearchChange}>
            <div className="flex items-center gap-3 border-b border-line-subtle px-4">
              <Icon icon={Search} size="md" className="text-fg-subtle" />
              <Command.Input placeholder={placeholder} onValueChange={onSearchChange} className="h-14 w-full bg-transparent text-base outline-none placeholder:text-fg-subtle" />
              {loading ? <Spinner size="sm" label="Buscando" /> : null}
            </div>
            <Command.List className="max-h-[min(24rem,60dvh)] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-8 text-center text-sm text-fg-muted">{emptyText}</Command.Empty>
              {groups.map((group) => (
                <Command.Group
                  key={group.id}
                  heading={group.heading}
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-fg-subtle [&_[cmdk-group-heading]]:uppercase"
                >
                  {group.items.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.label} ${(item.keywords ?? []).join(' ')}`}
                      onSelect={() => {
                        onOpenChange(false)
                        item.onSelect()
                      }}
                      className="flex min-h-control-md cursor-default items-center gap-3 rounded-md px-3 text-sm outline-none select-none data-[selected=true]:bg-primary-soft data-[selected=true]:text-primary-soft-fg"
                    >
                      {item.icon ? <Icon icon={item.icon} size="md" /> : null}
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.hint ? <span className="shrink-0 font-mono text-xs text-fg-muted">{item.hint}</span> : null}
                      {item.shortcut ? <ShortcutHint keys={item.shortcut} /> : null}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
