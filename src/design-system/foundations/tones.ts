/**
 * Mapa de TONS → classes. Fonte única para Badge, Alert, StatusBadge, gráficos etc.
 * Só existe a aparência "soft" (fundo suave + texto/ícone na cor do tom). Sucesso, atenção e erro têm UMA cor cada.
 * As classes aparecem por extenso de propósito: o Tailwind só gera o que encontra literal no código.
 */
export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'

export const TONES: Tone[] = ['neutral', 'brand', 'success', 'warning', 'danger']

/** Fundo suave + texto na cor do tom (Badge, ícone de StatCard, Alert). */
export const toneSoft: Record<Tone, string> = {
  neutral: 'bg-tone-neutral-soft text-tone-neutral-fg',
  brand: 'bg-tone-brand-soft text-tone-brand-fg',
  success: 'bg-tone-success-soft text-tone-success-fg',
  warning: 'bg-tone-warning-soft text-tone-warning-fg',
  danger: 'bg-tone-danger-soft text-tone-danger-fg',
}

/** Só a cor do texto/ícone. */
export const toneText: Record<Tone, string> = {
  neutral: 'text-tone-neutral-fg',
  brand: 'text-tone-brand-fg',
  success: 'text-tone-success-fg',
  warning: 'text-tone-warning-fg',
  danger: 'text-tone-danger-fg',
}

/** Marca preenchida na cor do tom (ponto, barra, segmento de gráfico). A cor do texto tem ≥ 3:1 sobre a superfície. */
export const toneMark: Record<Tone, string> = {
  neutral: 'bg-fg-subtle',
  brand: 'bg-primary',
  success: 'bg-tone-success-fg',
  warning: 'bg-tone-warning-fg',
  danger: 'bg-tone-danger-fg',
}

export const toneLabel: Record<Tone, string> = {
  neutral: 'Neutro',
  brand: 'Marca',
  success: 'Sucesso',
  warning: 'Atenção',
  danger: 'Erro',
}
