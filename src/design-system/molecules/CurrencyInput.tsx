import { InputGroup, type InputGroupProps } from '../cells'
import { parseBRL } from '@/lib/format'

export interface CurrencyInputProps
  extends Omit<InputGroupProps, 'value' | 'onChange' | 'defaultValue' | 'type' | 'addonStart' | 'inputMode'> {
  /** Valor em reais (ex.: 1234.56) ou null quando vazio. */
  value: number | null
  onValueChange: (value: number | null) => void
  max?: number
}

const fmt = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Campo de valor em R$. Digita-se apenas números: os dois últimos dígitos são os centavos. */
export function CurrencyInput({ value, onValueChange, max = 999_999_999.99, className, ...props }: CurrencyInputProps) {
  return (
    <InputGroup
      addonStart="R$"
      inputMode="numeric"
      autoComplete="off"
      value={value === null ? '' : fmt.format(value)}
      placeholder="0,00"
      onChange={(e) => {
        const next = parseBRL(e.target.value)
        onValueChange(next === null ? null : Math.min(next, max))
      }}
      className={`text-right tabular-nums ${className ?? ''}`}
      {...props}
    />
  )
}
