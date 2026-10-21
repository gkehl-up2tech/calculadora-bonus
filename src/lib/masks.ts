/**
 * Máscaras e validadores de documentos/códigos usados no cadastro de produtos.
 * Padrão: '9' = dígito, 'A' = letra, '*' = alfanumérico; demais caracteres são literais.
 */
export const MASKS = {
  ncm: '9999.99.99',
  cest: '99.999.99',
  cnpj: '99.999.999/9999-99',
  cpf: '999.999.999-99',
  cep: '99999-999',
} as const

export type MaskName = keyof typeof MASKS

const accepts = (token: string, ch: string) =>
  token === '9' ? /\d/.test(ch) : token === 'A' ? /[a-zA-Z]/.test(ch) : /[a-zA-Z0-9]/.test(ch)
const isToken = (c: string) => c === '9' || c === 'A' || c === '*'

/** Remove tudo que não é dado (mantém só os caracteres que a máscara aceitaria). */
export function unmask(value: string, pattern: string) {
  const hasLetters = pattern.includes('A') || pattern.includes('*')
  return value.replace(hasLetters ? /[^a-zA-Z0-9]/g : /\D/g, '')
}

export function applyMask(value: string, pattern: string) {
  const raw = unmask(value, pattern)
  let out = ''
  let ri = 0
  for (const token of pattern) {
    if (ri >= raw.length) break
    if (isToken(token)) {
      // Descarta caracteres que a posição não aceita e segue para o próximo.
      while (ri < raw.length && !accepts(token, raw[ri]!)) ri++
      if (ri >= raw.length) break
      out += raw[ri++]
    } else out += token
  }
  return out
}

/** GTIN-8/12/13/14: dígito verificador módulo 10 (GS1). */
export function isValidGtin(code: string) {
  if (!/^\d+$/.test(code) || ![8, 12, 13, 14].includes(code.length)) return false
  const digits = code.split('').map(Number)
  const check = digits.pop()!
  const sum = digits.reverse().reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 3 : 1), 0)
  return (10 - (sum % 10)) % 10 === check
}

export function isValidCnpj(value: string) {
  const c = value.replace(/\D/g, '')
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false
  const calc = (len: number) => {
    const w = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const sum = w.reduce((acc, wi, i) => acc + wi * Number(c[i]), 0)
    const r = sum % 11
    return r < 2 ? 0 : 11 - r
  }
  return calc(12) === Number(c[12]) && calc(13) === Number(c[13])
}
