#!/usr/bin/env node
/**
 * Valida contraste (WCAG 2.2 AA) dos pares semânticos de tokens.css nos temas claro e escuro.
 * Texto: ≥ 4.5:1 · Componentes de UI e foco: ≥ 3:1.
 * Uso: npm run check:contrast
 */
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

function block(selector) {
  const start = css.indexOf(selector)
  if (start < 0) throw new Error(`Bloco não encontrado: ${selector}`)
  let i = css.indexOf('{', start)
  const begin = i + 1
  for (let depth = 1; depth > 0; ) {
    i++
    if (css[i] === '{') depth++
    else if (css[i] === '}') depth--
  }
  return css.slice(begin, i)
}

const decls = (text) => Object.fromEntries([...text.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))

const primitives = decls(block('@theme static {'))
const light = { ...primitives, ...decls(block(':root {')) }
const darkOverrides = decls(block(":root[data-theme='dark'] {"))
const dark = { ...light, ...darkOverrides }

// O tema escuro existe em dois blocos (atributo e prefers-color-scheme). Se divergirem, o app muda de cara
// conforme o modo em que o tema é escolhido.
const mediaOverrides = decls(block(":root:not([data-theme='light']) {"))
const same = JSON.stringify(Object.entries(darkOverrides).sort()) === JSON.stringify(Object.entries(mediaOverrides).sort())
if (!same) {
  const diff = [...new Set([...Object.keys(darkOverrides), ...Object.keys(mediaOverrides)])].filter((k) => darkOverrides[k] !== mediaOverrides[k])
  console.error(`✗ Os blocos escuros de tokens.css divergem em: ${diff.join(', ')}`)
  process.exit(1)
}

/** Resolve um valor de token para [r, g, b]: #hex, var(--x) e color-mix(in srgb, A p%, B). */
function color(vars, value, depth = 0) {
  if (depth > 10) throw new Error(`Referência circular: ${value}`)
  const v = value.trim()
  const ref = v.match(/^var\((--[\w-]+)\)$/)
  if (ref) return color(vars, vars[ref[1]] ?? (() => { throw new Error(`Token ausente: ${ref[1]}`) })(), depth + 1)
  const hex = v.match(/^#([0-9a-f]{6})$/i)
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16))
  const mix = v.match(/^color-mix\(in srgb,\s*(.+?)\s+(\d+(?:\.\d+)?)%\s*,\s*(.+)\)$/)
  if (mix) {
    const [a, b, p] = [color(vars, mix[1], depth + 1), color(vars, mix[3], depth + 1), Number(mix[2]) / 100]
    return a.map((c, i) => c * p + b[i] * (1 - p))
  }
  throw new Error(`Valor de cor não suportado: ${value}`)
}

const lum = (rgb) => {
  const [r, g, b] = rgb.map((c) => c / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const TEXT = 4.5
const UI = 3
const pairs = []
const add = (fg, bg, min, label) => pairs.push({ fg, bg, min, label: label ?? `${fg} sobre ${bg}` })

for (const bg of ['--bg-canvas', '--bg-surface', '--bg-raised']) {
  for (const fg of ['--fg', '--fg-muted', '--fg-subtle', '--fg-link']) add(fg, bg, TEXT)
}
for (const fg of ['--fg', '--fg-muted']) add(fg, '--bg-subtle', TEXT)
add('--fg-subtle', '--bg-subtle', TEXT)
add('--fg-inverse', '--bg-inverse', TEXT)
for (const bg of ['--primary', '--primary-hover', '--primary-active']) add('--on-primary', bg, TEXT)
for (const bg of ['--primary-soft', '--primary-soft-hover']) add('--primary-soft-fg', bg, TEXT)
// Tons: cada status tem UMA cor; ela precisa servir de texto sobre o próprio fundo suave e de marca sobre a superfície.
for (const t of ['success', 'warning', 'danger']) {
  add(`--${t}`, `--tone-${t}-soft`, TEXT, `${t}: texto/ícone sobre o fundo suave`)
  add('--fg', `--tone-${t}-soft`, TEXT, `texto principal sobre o fundo suave de ${t}`)
  add('--fg-muted', `--tone-${t}-soft`, TEXT, `texto de apoio sobre o fundo suave de ${t}`)
  for (const bg of ['--bg-surface', '--bg-canvas']) add(`--${t}`, bg, UI, `${t}: marca de gráfico e borda de erro sobre ${bg} (1.4.11)`)
}
add('--danger', '--tone-danger-soft-hover', TEXT, 'danger: texto do botão sobre o fundo no hover')
add('--fg-muted', '--bg-subtle', TEXT, 'neutral: texto sobre o fundo suave')
add('--fg-subtle', '--bg-surface', UI, 'neutral: marca de gráfico sobre surface (1.4.11)')
add('--line-control', '--bg-surface', UI, 'borda de controle sobre surface (1.4.11)')
add('--line-control', '--bg-canvas', UI, 'borda de controle sobre canvas (1.4.11)')
add('--focus', '--bg-surface', UI, 'anel de foco sobre surface (2.4.13)')
add('--focus', '--bg-canvas', UI, 'anel de foco sobre canvas (2.4.13)')
add('--primary', '--bg-surface', UI, 'botão primário sobre surface (1.4.11)')

let failures = 0
for (const [name, vars] of [['claro', light], ['escuro', dark]]) {
  console.log(`\nTema ${name}`)
  for (const p of pairs) {
    const r = ratio(color(vars, vars[p.fg]), color(vars, vars[p.bg]))
    const ok = r >= p.min
    if (!ok) failures++
    if (!ok || process.argv.includes('--verbose')) console.log(`  ${ok ? '✓' : '✗'} ${r.toFixed(2).padStart(5)}:1 (mín ${p.min})  ${p.label}`)
  }
}
console.log(failures ? `\n${failures} par(es) abaixo do mínimo.` : `\n✓ ${pairs.length * 2} pares aprovados (AA) nos dois temas.`)
process.exit(failures ? 1 : 0)
