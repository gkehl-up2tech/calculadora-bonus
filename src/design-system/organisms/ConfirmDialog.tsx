import { useState, type ReactNode } from 'react'
import { Button, Input } from '../atoms'
import { Dialog, DialogContent, FormField } from '../molecules'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** danger = ação destrutiva (botão vermelho). */
  tone?: 'default' | 'danger'
  /** Exige digitar este texto para habilitar a confirmação (exclusões irreversíveis). */
  confirmText?: string
  /** Pode ser assíncrona: o botão mostra carregamento e o diálogo fecha ao terminar. */
  onConfirm: () => void | Promise<void>
}

/** Pede confirmação antes de uma ação. Foco inicial no Cancelar para evitar confirmações por reflexo. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'default',
  confirmText,
  onConfirm,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState('')
  const [loading, setLoading] = useState(false)
  const blocked = confirmText ? typed.trim() !== confirmText : false

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!loading) {
          onOpenChange(next)
          if (!next) setTyped('')
        }
      }}
    >
      <DialogContent
        size="sm"
        title={title}
        description={description}
        hideClose
        onOpenAutoFocus={(e) => {
          // Foco no botão Cancelar (primeiro do rodapé), não no destrutivo.
          e.preventDefault()
          ;(e.currentTarget as HTMLElement).querySelector<HTMLElement>('[data-cancel]')?.focus()
        }}
        footer={
          <>
            <Button variant="secondary" data-cancel disabled={loading} onClick={() => onOpenChange(false)}>{cancelLabel}</Button>
            <Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={loading} disabled={blocked} onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </>
        }
      >
        {confirmText ? (
          <FormField label={<>Digite <strong className="font-semibold">{confirmText}</strong> para confirmar</>}>
            {(control) => <Input {...control} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />}
          </FormField>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
