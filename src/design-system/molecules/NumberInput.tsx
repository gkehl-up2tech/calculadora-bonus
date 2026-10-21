import { useEffect, useRef, useState } from 'react'
import { InputGroup, type InputGroupProps } from '../cells'

export interface NumberInputProps
  extends Omit<InputGroupProps, 'value' | 'onChange' | 'defaultValue' | 'type' | 'inputMode' | 'addonEnd'> {
  /** Número ou null quando vazio. */
  value: number | null
  onValueChange: (value: number | null) => void
  /** Casas decimais aceitas (0 = só inteiros). */
  decimals?: number
  /** Unidade fixa depois do valor (kg, cm, %, dias…). */
  unit?: string
  min?: number
  max?: number
}

const fmt = (n: number, decimals: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: decimals, useGrouping: false })

/** Texto digitado → número. Aceita vírgula ou ponto como separador decimal. */
function parse(text: string, decimals: number): number | null {
  const clean = text.replace(/[^\d,.]/g, '').replace('.', ',')
  const [int = '', ...rest] = clean.split(',')
  if (!int && rest.length === 0) return null
  const frac = decimals > 0 ? rest.join('').slice(0, decimals) : ''
  const n = Number(`${int || '0'}.${frac || '0'}`)
  return Number.isFinite(n) ? n : null
}

/**
 * Campo numérico em pt-BR (vírgula decimal). Guarda o texto enquanto se digita ("1," continua "1,"),
 * então formata ao sair do campo. Teclado numérico no celular.
 */
export function NumberInput({ value, onValueChange, decimals = 0, unit, min, max, onBlur, ...props }: NumberInputProps) {
  const [text, setText] = useState(() => (value === null ? '' : fmt(value, decimals)))
  const focused = useRef(false)

  // Valor mudou de fora (cancelar edição, recálculo): atualiza o texto, sem atropelar a digitação.
  useEffect(() => {
    if (!focused.current) setText(value === null ? '' : fmt(value, decimals))
  }, [value, decimals])

  return (
    <InputGroup
      inputMode={decimals > 0 ? 'decimal' : 'numeric'}
      autoComplete="off"
      value={text}
      addonEnd={unit}
      className="text-right tabular-nums"
      onFocus={() => {
        focused.current = true
      }}
      onBlur={(e) => {
        focused.current = false
        setText(value === null ? '' : fmt(value, decimals))
        onBlur?.(e)
      }}
      onChange={(e) => {
        const raw = e.target.value.replace(decimals > 0 ? /[^\d,.]/g : /\D/g, '')
        setText(raw)
        let next = parse(raw, decimals)
        if (next !== null) {
          if (max !== undefined) next = Math.min(next, max)
          if (min !== undefined) next = Math.max(next, min)
        }
        onValueChange(next)
      }}
      {...props}
    />
  )
}
