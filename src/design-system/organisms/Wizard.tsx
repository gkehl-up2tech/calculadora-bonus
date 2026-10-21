import { useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '../atoms'
import { Card, Stepper, type Step } from '../molecules'

export interface WizardStep extends Step {
  content: ReactNode
  /** Impede avançar enquanto for false (ex.: campos obrigatórios vazios). */
  canContinue?: boolean
}

export interface WizardProps {
  steps: WizardStep[]
  onFinish: () => void | Promise<void>
  onCancel?: () => void
  finishLabel?: string
  /** Controle externo da etapa (opcional). */
  current?: number
  onCurrentChange?: (index: number) => void
}

/** Fluxo em etapas: Stepper + conteúdo da etapa + Voltar/Continuar/Concluir. */
export function Wizard({ steps, onFinish, onCancel, finishLabel = 'Concluir', current: controlled, onCurrentChange }: WizardProps) {
  const [internal, setInternal] = useState(0)
  const [busy, setBusy] = useState(false)
  const current = controlled ?? internal
  const go = (i: number) => (onCurrentChange ? onCurrentChange(i) : setInternal(i))
  const step = steps[current]!
  const last = current === steps.length - 1

  return (
    <div className="grid gap-6">
      <Stepper steps={steps} current={current} onStepClick={go} />
      <Card className="p-5">
        <div key={step.id} aria-live="polite">{step.content}</div>
      </Card>
      <div className="flex items-center justify-between gap-2">
        <div>
          {current > 0 ? (
            <Button variant="secondary" leadingIcon={<ArrowLeft aria-hidden />} onClick={() => go(current - 1)}>Voltar</Button>
          ) : onCancel ? (
            <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          ) : null}
        </div>
        {last ? (
          <Button
            leadingIcon={<Check aria-hidden />}
            loading={busy}
            disabled={step.canContinue === false}
            onClick={async () => {
              setBusy(true)
              try {
                await onFinish()
              } finally {
                setBusy(false)
              }
            }}
          >
            {finishLabel}
          </Button>
        ) : (
          <Button trailingIcon={<ArrowRight aria-hidden />} disabled={step.canContinue === false} onClick={() => go(current + 1)}>
            Continuar
          </Button>
        )}
      </div>
    </div>
  )
}
