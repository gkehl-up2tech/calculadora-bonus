import { X, Search } from 'lucide-react'
import { IconButton, InputGroup, ShortcutHint, type InputGroupProps } from '../cells'

export interface SearchFieldProps extends Omit<InputGroupProps, 'value' | 'onChange' | 'type' | 'startIcon' | 'endSlot'> {
  value: string
  onValueChange: (value: string) => void
  /** Dica visual de atalho, ex.: ['Ctrl', 'K']. */
  shortcut?: string[]
}

/** Campo de busca com ícone, botão de limpar e Esc para limpar. */
export function SearchField({ value, onValueChange, shortcut, placeholder = 'Buscar…', 'aria-label': ariaLabel = 'Buscar', onKeyDown, ...props }: SearchFieldProps) {
  return (
    <InputGroup
      type="search"
      role="searchbox"
      aria-label={ariaLabel}
      placeholder={placeholder}
      autoComplete="off"
      enterKeyHint="search"
      startIcon={Search}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && value) {
          e.preventDefault()
          onValueChange('')
        }
        onKeyDown?.(e)
      }}
      className="[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
      endSlot={
        value ? (
          <IconButton icon={X} label="Limpar busca" size="sm" onClick={() => onValueChange('')} />
        ) : shortcut ? (
          <ShortcutHint keys={shortcut} className="pr-2 max-sm:hidden" />
        ) : null
      }
      {...props}
    />
  )
}
