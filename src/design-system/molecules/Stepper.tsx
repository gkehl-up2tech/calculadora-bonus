import { Check } from 'lucide-react'
import { ProgressBar, Text } from '../atoms'
import { cn } from '@/lib/cn'

export interface Step {
  id: string
  label: string
  description?: string
}

export interface StepperProps {
  steps: Step[]
  /** Índice (a partir de 0) da etapa atual. */
  current: number
  /** Permite voltar a etapas já concluídas. */
  onStepClick?: (index: number) => void
  /** Nome do landmark (padrão "Etapas"). */
  label?: string
  className?: string
}

/** Indicador de etapas. No celular vira "Etapa 2 de 4" + barra de progresso. */
export function Stepper({ steps, current, onStepClick, label = 'Etapas', className }: StepperProps) {
  const active = steps[current]
  return (
    <nav aria-label={label} className={className}>
      <div className="grid gap-2 md:hidden">
        <Text variant="small" tone="muted" tabular>Etapa {current + 1} de {steps.length}</Text>
        <Text weight="semibold">{active?.label}</Text>
        <ProgressBar value={current + 1} max={steps.length} aria-label="Progresso do cadastro" />
      </div>
      <ol className="hidden items-start md:flex">
        {steps.map((step, i) => {
          const state = i < current ? 'complete' : i === current ? 'current' : 'upcoming'
          const clickable = state === 'complete' && onStepClick
          const body = (
            <>
              <span
                className={cn(
                  'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-[background-color,color,box-shadow] duration-200 ease-out',
                  state === 'complete' && 'bg-primary text-on-primary',
                  state === 'current' && 'bg-primary-soft text-primary-soft-fg ring-2 ring-primary',
                  state === 'upcoming' && 'bg-subtle text-fg-muted',
                )}
              >
                {state === 'complete' ? <Check aria-hidden className="size-4" strokeWidth={2.5} /> : i + 1}
              </span>
              <span className="grid min-w-0 gap-0.5 text-left">
                <span className={cn('truncate text-sm font-semibold', state === 'upcoming' ? 'text-fg-muted' : 'text-fg')}>{step.label}</span>
                {step.description ? <span className="truncate text-xs text-fg-muted">{step.description}</span> : null}
              </span>
            </>
          )
          return (
            <li key={step.id} aria-current={state === 'current' ? 'step' : undefined} className={cn('flex min-w-0 items-start', i < steps.length - 1 && 'flex-1')}>
              {clickable ? (
                <button type="button" onClick={() => onStepClick(i)} className="flex items-center gap-3 rounded-md pr-3 active:scale-[0.98] transition-transform duration-150 ease-out">
                  {body}
                </button>
              ) : (
                <div className="flex items-center gap-3 pr-3">{body}</div>
              )}
              {i < steps.length - 1 ? <span aria-hidden className={cn('mt-4 h-px min-w-6 flex-1 transition-colors duration-200', i < current ? 'bg-primary' : 'bg-line')} /> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
