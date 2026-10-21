import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

/**
 * Regra de dependência do Atomic Design: cada camada só importa das camadas abaixo.
 *   tokens/lib → atoms → cells → molecules → organisms → templates → pages
 * Importar "para cima" quebra a hierarquia e é bloqueado aqui.
 */
const layers = ['atoms', 'cells', 'molecules', 'organisms', 'templates']
const forbidden = {
  atoms: ['cells', 'molecules', 'organisms', 'templates'],
  cells: ['molecules', 'organisms', 'templates'],
  molecules: ['organisms', 'templates'],
  organisms: ['templates'],
  templates: [],
}
const upwardRules = layers.map((layer) => ({
  files: [`src/design-system/${layer}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          ...forbidden[layer].map((up) => ({
            group: [`@/design-system/${up}`, `@/design-system/${up}/*`, `../${up}`, `../${up}/*`],
            message: `Hierarquia Atomic Design: ${layer} não pode importar de ${up}.`,
          })),
          { group: ['@/pages/*', '@/app/*'], message: 'O Design System não depende de páginas nem do app.' },
        ],
      },
    ],
  },
}))

export default tseslint.config(
  { ignores: ['dist', 'legacy', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  ...upwardRules,
  { files: ['scripts/**/*.mjs'], languageOptions: { globals: globals.node } },
)
