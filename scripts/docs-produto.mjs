// Gera docs/produto-mapa-de-informacoes.md a partir do esquema (src/app/products/schema.ts).
// Uso: npm run docs:produto
import { writeFileSync } from 'node:fs'
import { TABS, SECTIONS, FIELDS } from '../src/app/products/schema.ts'

const KIND = {
  text: 'texto', url: 'link', textarea: 'texto longo', lines: 'lista (uma por linha)', tags: 'lista (vírgula)', select: 'lista', combobox: 'lista com busca',
  ncm: 'NCM', cest: 'CEST', gtin: 'GTIN', cnpj: 'CNPJ', money: 'R$', integer: 'inteiro', decimal: 'decimal', percent: '%', boolean: 'sim/não', date: 'data', computed: 'calculado',
}
const IMP = { required: '**obrigatório**', recommended: 'recomendado' }

const lines = [
  '# Mapa de informações do produto',
  '',
  '> Gerado por `npm run docs:produto` a partir de `src/app/products/schema.ts`. **Não edite à mão**: mude o esquema e gere de novo.',
  '',
  `${FIELDS.length} campos em ${TABS.length} abas. **Obrigatório** e *recomendado* ausentes viram pendência (selo na aba e alerta na página). Só obrigatório bloqueia o salvamento.`,
  '',
  'Os valores fiscais de exemplo (CST, alíquotas, cClassTrib) e as listas de opções são ilustrativos e parciais: confirme nas tabelas oficiais vigentes antes de emitir documentos fiscais.',
  '',
]
for (const tab of TABS) {
  lines.push(`## ${tab.label}`, '', tab.description + (tab.tipos ? ` _(só para produtos do tipo: ${tab.tipos.join(', ')})_` : ''), '')
  for (const s of SECTIONS.filter((x) => x.tab === tab.id)) {
    lines.push(`### ${s.title}`, '')
    if (s.description) lines.push(s.description, '')
    if (s.custom) { lines.push('_Tabela/lista própria (não são campos do esquema)._', ''); continue }
    lines.push('| Campo | Tipo | Importância | Observação |', '|---|---|---|---|')
    for (const f of FIELDS.filter((x) => x.section === s.id)) {
      const notes = [f.hint, f.unit && `unidade: ${f.unit}`, f.maxLength && `até ${f.maxLength} caracteres`, f.departments && `só em: ${f.departments.join(', ')}`, f.readOnly && 'somente leitura', f.masterOnly && 'só o Master altera']
        .filter(Boolean).join(' · ')
      lines.push(`| ${f.label} | ${KIND[f.kind]} | ${IMP[f.importance] ?? 'opcional'} | ${notes.replaceAll('|', '/')} |`)
    }
    lines.push('')
  }
}
writeFileSync(new URL('../docs/produto-mapa-de-informacoes.md', import.meta.url), lines.join('\n'))
console.log(`docs/produto-mapa-de-informacoes.md: ${FIELDS.length} campos, ${TABS.length} abas`)
