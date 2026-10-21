// Hospedagens estáticas (ex.: GitHub Pages) devolvem 404.html para rotas desconhecidas.
// Servir o mesmo index.html faz links diretos (/configuracoes/design-system) funcionarem no SPA.
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
console.log('✓ dist/404.html criado (fallback de SPA)')
