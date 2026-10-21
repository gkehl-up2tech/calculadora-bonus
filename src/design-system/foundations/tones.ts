/**
 * Mapa de TONS → classes. Fonte única para Badge, Alert, StatusBadge etc.
 * As classes aparecem por extenso de propósito: o Tailwind só gera o que encontra literal no código.
 */
export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

export const TONES: Tone[] = ['neutral', 'brand', 'success', 'warning', 'danger', 'info']

export const toneSoft: Record<Tone, string> = {
  neutral: 'bg-tone-neutral-soft text-tone-neutral-fg',
  brand: 'bg-tone-brand-soft text-tone-brand-fg',
  success: 'bg-tone-success-soft text-tone-success-fg',
  warning: 'bg-tone-warning-soft text-tone-warning-fg',
  danger: 'bg-tone-danger-soft text-tone-danger-fg',
  info: 'bg-tone-info-soft text-tone-info-fg',
}

export const toneSolid: Record<Tone, string> = {
  neutral: 'bg-tone-neutral-solid text-tone-neutral-on',
  brand: 'bg-tone-brand-solid text-tone-brand-on',
  success: 'bg-tone-success-solid text-tone-success-on',
  warning: 'bg-tone-warning-solid text-tone-warning-on',
  danger: 'bg-tone-danger-solid text-tone-danger-on',
  info: 'bg-tone-info-solid text-tone-info-on',
}

export const toneOutline: Record<Tone, string> = {
  neutral: 'border border-tone-neutral-line text-tone-neutral-fg',
  brand: 'border border-tone-brand-line text-tone-brand-fg',
  success: 'border border-tone-success-line text-tone-success-fg',
  warning: 'border border-tone-warning-line text-tone-warning-fg',
  danger: 'border border-tone-danger-line text-tone-danger-fg',
  info: 'border border-tone-info-line text-tone-info-fg',
}

export const toneBorder: Record<Tone, string> = {
  neutral: 'border-tone-neutral-line',
  brand: 'border-tone-brand-line',
  success: 'border-tone-success-line',
  warning: 'border-tone-warning-line',
  danger: 'border-tone-danger-line',
  info: 'border-tone-info-line',
}

export const toneText: Record<Tone, string> = {
  neutral: 'text-tone-neutral-fg',
  brand: 'text-tone-brand-fg',
  success: 'text-tone-success-fg',
  warning: 'text-tone-warning-fg',
  danger: 'text-tone-danger-fg',
  info: 'text-tone-info-fg',
}

export const toneDot: Record<Tone, string> = {
  neutral: 'bg-tone-neutral-solid',
  brand: 'bg-tone-brand-solid',
  success: 'bg-tone-success-solid',
  warning: 'bg-tone-warning-solid',
  danger: 'bg-tone-danger-solid',
  info: 'bg-tone-info-solid',
}

export const toneLabel: Record<Tone, string> = {
  neutral: 'Neutro',
  brand: 'Marca',
  success: 'Sucesso',
  warning: 'Atenção',
  danger: 'Erro',
  info: 'Informação',
}
