import { useState, type ComponentProps } from 'react'
import { Command } from 'cmdk'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { Check, ChevronsUpDown } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'
import { fieldVariants, Spinner } from '../atoms'
import { overlayPanel, popAnimation } from '../foundations'
import { cn } from '@/lib/cn'

/** Sem acento, minúsculo e sem pontuação de códigos: "7318.15.00" casa com "73181500". */
const normalize = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[.\-/]/g, '')

/** Todos os termos digitados precisam aparecer no item (nada de correspondência "aproximada" entre letras soltas). */
function matchAllTerms(value: string, search: string) {
  const haystack = normalize(value)
  const terms = search.split(/\s+/).map(normalize).filter(Boolean)
  return terms.every((t) => haystack.includes(t)) ? 1 : 0
}

export interface ComboboxOption {
  value: string
  label: string
  /** Texto secundário à direita (ex.: código NCM). */
  hint?: string
  /** Termos extras que também casam na busca. */
  keywords?: string[]
}

export interface ComboboxProps
  extends Pick<ComponentProps<'button'>, 'id' | 'aria-describedby' | 'aria-invalid' | 'aria-label' | 'className' | 'disabled' | 'onBlur'>,
    VariantProps<typeof fieldVariants> {
  options: ComboboxOption[]
  value: string | null
  onValueChange: (value: string | null) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  invalid?: boolean
  /** Busca no servidor: desliga o filtro local e avisa a cada digitação. */
  onSearchChange?: (query: string) => void
  loading?: boolean
  /** Permite limpar a seleção clicando de novo no item marcado. */
  clearable?: boolean
}

/** Select com busca. Ideal para listas longas (NCM, CFOP, categorias). */
export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Selecione…',
  searchPlaceholder = 'Buscar…',
  emptyText = 'Nenhum resultado.',
  size,
  invalid,
  onSearchChange,
  loading,
  clearable,
  className,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)
  const { 'aria-invalid': ariaInvalid, ...rest } = props

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid || ariaInvalid}
          className={cn(fieldVariants({ size }), 'flex items-center justify-between gap-2 text-left', !selected && 'text-fg-subtle', className)}
          {...rest}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-fg-subtle" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={4}
          collisionPadding={8}
          align="start"
          className={cn(overlayPanel, popAnimation, 'w-(--radix-popover-trigger-width) min-w-64 origin-(--radix-popover-content-transform-origin) overflow-hidden')}
        >
          <Command shouldFilter={!onSearchChange} filter={matchAllTerms} loop>
            <div className="flex items-center border-b border-line-subtle px-3">
              <Command.Input
                placeholder={searchPlaceholder}
                onValueChange={onSearchChange}
                className="h-control-md w-full bg-transparent text-base outline-none placeholder:text-fg-subtle pointer-fine:text-sm"
              />
              {loading ? <Spinner size="sm" label="Buscando" /> : null}
            </div>
            <Command.List className="max-h-64 overflow-y-auto p-1">
              <Command.Empty className="px-3 py-6 text-center text-sm text-fg-muted">{emptyText}</Command.Empty>
              {options.map((o) => (
                <Command.Item
                  key={o.value}
                  value={`${o.label} ${o.hint ?? ''} ${o.value} ${(o.keywords ?? []).join(' ')}`}
                  onSelect={() => {
                    onValueChange(clearable && o.value === value ? null : o.value)
                    setOpen(false)
                  }}
                  className="relative flex min-h-control-sm cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2.5 text-sm outline-none select-none data-[selected=true]:bg-subtle"
                >
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {o.hint ? <span className="shrink-0 font-mono text-xs text-fg-muted">{o.hint}</span> : null}
                  {o.value === value ? <Check aria-hidden className="absolute right-2.5 size-4 text-primary-soft-fg" /> : null}
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
