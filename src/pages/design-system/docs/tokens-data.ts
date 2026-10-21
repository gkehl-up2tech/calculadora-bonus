import tokensCss from '@/styles/tokens.css?raw'

export interface ColorStep {
  step: string
  hex: string
  /** Nome do token: --color-brand-500 */
  token: string
}

/**
 * Escalas primitivas lidas do próprio tokens.css (?raw): a documentação nunca fica
 * desatualizada em relação ao código.
 */
export const colorScales: Record<string, ColorStep[]> = (() => {
  const scales: Record<string, ColorStep[]> = {}
  for (const m of tokensCss.matchAll(/--color-([a-z]+)-(\d+):\s*(#[0-9a-fA-F]{6});/g)) {
    const [, family, step, hex] = m as unknown as [string, string, string, string]
    ;(scales[family] ??= []).push({ step, hex, token: `--color-${family}-${step}` })
  }
  return scales
})()

export const scaleLabels: Record<string, string> = {
  brand: 'Brand — azul UP2Tech',
  neutral: 'Neutral — cinza-azulado',
  success: 'Success',
  warning: 'Warning',
  danger: 'Danger',
  info: 'Info',
}

export interface SemanticToken {
  token: string
  util: string
  usage: string
  /** Par de contraste: o token de fundo contra o qual medir. */
  against?: string
  min?: number
}

export const semanticGroups: { title: string; description: string; tokens: SemanticToken[] }[] = [
  {
    title: 'Superfícies',
    description: 'Fundos. Do mais recuado (canvas) ao mais elevado (raised).',
    tokens: [
      { token: '--bg-canvas', util: 'bg-canvas', usage: 'Fundo da página.' },
      { token: '--bg-surface', util: 'bg-surface', usage: 'Cards, tabelas, campos.' },
      { token: '--bg-raised', util: 'bg-raised', usage: 'Popovers, menus, diálogos (flutuam sobre a página).' },
      { token: '--bg-subtle', util: 'bg-subtle', usage: 'Hover de linhas, cabeçalho de tabela, adornos.' },
      { token: '--bg-muted', util: 'bg-muted', usage: 'Skeleton, trilha de progresso, estados pressionados.' },
      { token: '--bg-inverse', util: 'bg-inverse', usage: 'Tooltips.' },
    ],
  },
  {
    title: 'Texto',
    description: 'Hierarquia de leitura. Contraste medido contra a superfície.',
    tokens: [
      { token: '--fg', util: 'text-fg', usage: 'Texto principal.', against: '--bg-surface', min: 4.5 },
      { token: '--fg-muted', util: 'text-fg-muted', usage: 'Apoio, descrições.', against: '--bg-surface', min: 4.5 },
      { token: '--fg-subtle', util: 'text-fg-subtle', usage: 'Placeholder, metadados.', against: '--bg-surface', min: 4.5 },
      { token: '--fg-disabled', util: 'text-fg-disabled', usage: 'Desabilitado (isento de contraste).' },
      { token: '--fg-link', util: 'text-link', usage: 'Links.', against: '--bg-surface', min: 4.5 },
    ],
  },
  {
    title: 'Linhas e foco',
    description: 'Bordas decorativas e bordas de controles (precisam de 3:1).',
    tokens: [
      { token: '--line-subtle', util: 'border-line-subtle', usage: 'Divisores internos.' },
      { token: '--line', util: 'border-line', usage: 'Bordas decorativas.' },
      { token: '--line-control', util: 'border-line-control', usage: 'Borda de inputs, checkbox, switch.', against: '--bg-surface', min: 3 },
      { token: '--focus', util: 'ring-focus / border-focus', usage: 'Anel de foco do teclado.', against: '--bg-surface', min: 3 },
    ],
  },
  {
    title: 'Ação',
    description: 'Botões e elementos interativos de destaque.',
    tokens: [
      { token: '--primary', util: 'bg-primary', usage: 'Ação principal.', against: '--bg-surface', min: 3 },
      { token: '--primary-hover', util: 'bg-primary-hover', usage: 'Hover do primário.' },
      { token: '--primary-soft', util: 'bg-primary-soft', usage: 'Fundo suave: item ativo, botão soft.' },
      { token: '--primary-soft-fg', util: 'text-primary-soft-fg', usage: 'Texto sobre o fundo suave.', against: '--primary-soft', min: 4.5 },
      { token: '--danger', util: 'bg-danger', usage: 'Ação destrutiva.', against: '--bg-surface', min: 3 },
    ],
  },
]

export const toneNames = ['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const
