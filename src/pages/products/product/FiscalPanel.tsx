import { useState } from 'react'
import { CircleAlert, CircleCheck, Hourglass, Send } from 'lucide-react'
import {
  Alert, Button, Dialog, DialogContent, FormField, StatusBadge, Text, Textarea, toast,
} from '@/design-system'
import { can } from '@/app/access/permissions'
import type { AppUser } from '@/app/access/users'
import { approveFiscal, requestFiscalAdjust, submitForReview, type Workflow } from '@/app/products/detail'
import { FISCAL_LABEL, FISCAL_TONE, type Product } from '@/app/products/sample-products'
import { formatDateTime } from '@/lib/format'

export interface FiscalPanelProps {
  product: Product
  workflow: Workflow
  user: AppUser
  /** Há alterações não salvas: o fluxo só anda com o produto salvo. */
  editing: boolean
  /** Entra na edição da parte fiscal (para quem pode editar). */
  onEditFiscal: () => void
}

/**
 * Topo da aba Fiscal: em que ponto está a aprovação da Tributação e o que cada pessoa pode fazer agora.
 * Fluxo: não enviada → aguardando análise → aprovada (ou ajuste pedido, que volta ao responsável).
 */
export function FiscalPanel({ product, workflow, user, editing, onEditFiscal }: FiscalPanelProps) {
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState<string>()
  const status = product.fiscal
  const canSubmit = can(user, 'fiscal.submit', product)
  const canReview = can(user, 'fiscal.review')
  const canEditFiscal = can(user, 'fiscal.edit', product)

  function submit() {
    const r = submitForReview(product, user)
    if (r.ok) toast.success('Enviado para a Tributação', { description: 'Você será avisado aqui quando houver retorno.' })
    else toast.error('Falta informar antes de enviar', { description: `${r.missing.join(' e ')} ${r.missing.length > 1 ? 'são necessários' : 'é necessário'} para a análise.` })
  }

  function approve() {
    const r = approveFiscal(product, user)
    if (r.ok) toast.success('Tributação aprovada')
    else toast.error('Não dá para aprovar ainda', { description: `Faltam dados fiscais obrigatórios: ${r.missing.join(', ')}.` })
  }

  function sendAdjust() {
    if (note.trim().length < 5) {
      setNoteError('Explique o que precisa mudar (ao menos 5 letras).')
      return
    }
    requestFiscalAdjust(product, user, note)
    setAdjustOpen(false)
    setNote('')
    toast.success('Ajuste pedido', { description: 'O produto voltou para o responsável.' })
  }

  const when = (iso?: string) => (iso ? formatDateTime(iso) : '')
  const icon = { none: Send, review: Hourglass, adjust: CircleAlert, approved: CircleCheck }[status]
  const Icon = icon

  return (
    <section aria-labelledby="fiscal-status" className="grid gap-3 rounded-lg bg-subtle p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Icon aria-hidden className="size-5 text-fg-muted" />
        <Text id="fiscal-status" weight="semibold">Aprovação da Tributação</Text>
        <StatusBadge tone={FISCAL_TONE[status]}>{FISCAL_LABEL[status]}</StatusBadge>
      </div>

      {status === 'none' ? (
        <Text tone="muted">
          {canSubmit
            ? 'Ainda não enviada. Informe NCM e origem (e o que mais souber da parte fiscal) e envie para a equipe de Tributação aprovar. O produto só pode ser ativado depois da aprovação.'
            : 'Ainda não foi enviada para a Tributação.'}
        </Text>
      ) : null}
      {status === 'review' ? (
        <Text tone="muted">
          {workflow.submittedAt ? `Enviada em ${when(workflow.submittedAt)}. ` : ''}
          {canReview ? 'Confira os dados fiscais abaixo (você pode corrigi-los) e aprove ou peça ajuste ao responsável.' : 'Aguardando a análise. Enquanto isso o responsável não altera a parte fiscal.'}
        </Text>
      ) : null}
      {status === 'adjust' ? (
        <Alert tone="danger" title={`${workflow.reviewedBy ?? 'A Tributação'} pediu ajuste${workflow.reviewedAt ? ` em ${when(workflow.reviewedAt)}` : ''}`}>
          {workflow.note ? <>“{workflow.note}”</> : null}
          {canSubmit ? ' Corrija a parte fiscal e envie de novo.' : null}
        </Alert>
      ) : null}
      {status === 'approved' ? (
        <Text tone="muted">
          Aprovada{workflow.reviewedBy ? ` por ${workflow.reviewedBy}` : ''}{workflow.reviewedAt ? ` em ${when(workflow.reviewedAt)}` : ''}. Mudar um dado fiscal depois disso devolve o produto à fila da Tributação.
        </Text>
      ) : null}

      {editing ? (
        <Text variant="small" tone="muted">Salve ou cancele a edição para enviar, aprovar ou pedir ajuste.</Text>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(status === 'none' || status === 'adjust') && canSubmit ? (
            <Button leadingIcon={<Send aria-hidden />} onClick={submit}>{status === 'adjust' ? 'Enviar novamente' : 'Enviar para a Tributação'}</Button>
          ) : null}
          {status === 'review' && canReview ? (
            <>
              <Button onClick={approve}>Aprovar tributação</Button>
              <Button variant="secondary" onClick={() => setAdjustOpen(true)}>Pedir ajuste</Button>
            </>
          ) : null}
          {canEditFiscal && status !== 'none' ? <Button variant="ghost" onClick={onEditFiscal}>Editar dados fiscais</Button> : null}
        </div>
      )}

      <Dialog open={adjustOpen} onOpenChange={(o) => { setAdjustOpen(o); if (!o) setNoteError(undefined) }}>
        <DialogContent
          title="Pedir ajuste"
          description="O produto volta para o responsável com o seu comentário. Seja específico: ele vai corrigir e enviar de novo."
          footer={<><Button variant="ghost" onClick={() => setAdjustOpen(false)}>Cancelar</Button><Button onClick={sendAdjust}>Pedir ajuste</Button></>}
        >
          <FormField label="O que precisa mudar?" required error={noteError}>
            {(c) => <Textarea {...c} rows={4} value={note} maxLength={500} placeholder="Ex.: O NCM não confere com a descrição do produto." onChange={(e) => { setNote(e.target.value); setNoteError(undefined) }} />}
          </FormField>
        </DialogContent>
      </Dialog>
    </section>
  )
}
