import { useLayoutEffect, useRef } from 'react'
import { Input, type InputProps } from '../atoms'
import { MASKS, applyMask, unmask, type MaskName } from '@/lib/masks'

export interface MaskedInputProps extends Omit<InputProps, 'value' | 'onChange' | 'defaultValue'> {
  /** Nome de uma máscara pronta (ncm, cest, cnpj, cpf, cep) ou um padrão: 9 = dígito, A = letra, * = alfanumérico. */
  mask: MaskName | (string & {})
  /** Valor já mascarado. */
  value: string
  /** Recebe o valor mascarado e o valor "cru" (só dados). */
  onValueChange: (masked: string, raw: string) => void
}

/** Input com máscara que preserva a posição do cursor ao editar no meio do texto. */
export function MaskedInput({ mask, value, onValueChange, ...props }: MaskedInputProps) {
  const pattern = mask in MASKS ? MASKS[mask as MaskName] : mask
  const digitsOnly = !/[A*]/.test(pattern)
  const ref = useRef<HTMLInputElement>(null)
  const caret = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (caret.current !== null && ref.current) {
      ref.current.setSelectionRange(caret.current, caret.current)
      caret.current = null
    }
  })

  return (
    <Input
      ref={ref}
      value={value}
      inputMode={digitsOnly ? 'numeric' : 'text'}
      autoComplete="off"
      maxLength={pattern.length}
      onChange={(e) => {
        const el = e.target
        const dataChar = digitsOnly ? /\d/ : /[a-zA-Z0-9]/
        const before = unmask(el.value.slice(0, el.selectionStart ?? el.value.length), pattern).length
        const masked = applyMask(el.value, pattern)
        // Posição do cursor = logo após o N-ésimo caractere de dado.
        let pos = 0
        let seen = 0
        while (pos < masked.length && seen < before) {
          if (dataChar.test(masked[pos]!)) seen++
          pos++
        }
        caret.current = pos
        onValueChange(masked, unmask(masked, pattern))
      }}
      {...props}
    />
  )
}
