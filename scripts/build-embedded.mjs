#!/usr/bin/env node
/**
 * Gera um ÚNICO arquivo HTML (fragmento) com tudo embutido, para publicar como página hospedada
 * (ex.: Artifact do claude.ai), onde só há um arquivo e a URL não muda.
 *
 *   npm run build:embedded            → dist-embedded/index.html
 *   EMBED_OUT=/caminho/pagina.html npm run build:embedded
 *
 * O resultado é um fragmento (sem <html>/<head>/<body>): <title>, <style>, #root e <script type="module">.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const outDir = resolve('dist-embedded')
execFileSync('npx', ['vite', 'build', '--outDir', outDir, '--emptyOutDir'], {
  stdio: 'inherit',
  env: { ...process.env, VITE_EMBEDDED: 'true' },
})

const assets = join(outDir, 'assets')
const files = readdirSync(assets)
const css = files.filter((f) => f.endsWith('.css'))
const js = files.filter((f) => f.endsWith('.js'))
if (css.length !== 1 || js.length !== 1) throw new Error(`Esperava 1 CSS e 1 JS, veio ${css.length} CSS e ${js.length} JS`)
const leftovers = files.filter((f) => !f.endsWith('.css') && !f.endsWith('.js'))
if (leftovers.length) throw new Error(`Arquivos que não foram embutidos: ${leftovers.join(', ')}`)

const style = readFileSync(join(assets, css[0]), 'utf8')
// </script e <!-- dentro de um <script> inline precisam ser escapados.
const script = readFileSync(join(assets, js[0]), 'utf8').replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--')

// A página hospedeira aplica o próprio reset (:root, body não layered) por cima do @layer base: reafirmamos o essencial.
const html = `<title>Cadastro de Produtos</title>
<style>${style}</style>
<style>
  html, body { min-height: 100%; }
  body { margin: 0; background: var(--bg-canvas); color: var(--fg); font-family: var(--font-sans); font-size: 0.875rem; line-height: 1.25rem; }
</style>
<div id="root"></div>
<script type="module">${script}</script>
`

const target = resolve(process.env.EMBED_OUT ?? join(outDir, 'index.html'))
mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, html)
console.log(`✓ ${target} (${(html.length / 1024).toFixed(0)} KB)`)
