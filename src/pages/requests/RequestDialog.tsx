import { useState } from 'react'
import { Link as RouterLink } from 'react-router'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import {
  Alert, Button, Dialog, DialogContent, FieldMessage, Icon, KeyValue, StatusBadge, Text, Textarea,
} from '@/design-system'
import { can } from '@/app/access/permissions'
import { useSession } from '@/app/access/session'
import { userName } from '@/app/access/users'
import { routes } from '@/app/navigation'
import {
  REQUEST_STATUS_LABEL, REQUEST_STATUS_TONE, formatFileSize, isCsv, rejectRequest, requestFileText, requesterName, type RegistrationRequest,
} from '@/app/requests/requests'
import { EMBEDDED } from '@/lib/embedded'
import { formatDateTime } from '@/lib/format'

const PREVIEW_LINES = 12

export interface RequestDialogProps {
  request: RegistrationRequest | null
  onOpenChange: (open: boolean) => void
  /** Quem atende abre o cadastro do produto a partir do pedido. */
  onCreateProduct: (request: RegistrationRequest) => void
}

/**
 * Uma solicitação: dados, arquivo (prévia do CSV; download fora da página hospedada) e a devolutiva.
 * Quem atende (equipe de cadastro e Admin) cria o produto ou recusa com motivo; o gerente só acompanha.
 */
export function RequestDialog({ request, onOpenChange, onCreateProduct }: RequestDialogProps) {
  const user = useSession()
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [shown, setShown] = useState(request?.id)

  // Cada solicitação aberta começa sem o formulário de recusa.
  if (request?.id !== shown) {
    setShown(request?.id)
    setRejecting(false)
    setReason('')
    setError(null)
  }

  const handler = can(user, 'request.handle')
  const text = request && isCsv(request.file) ? requestFileText(request.file) : ''
  const lines = text.split(/\r?\n/).filter(Boolean)
  const preview = lines.slice(0, PREVIEW_LINES).join('\n')

  function reject() {
    if (!request) return
    const problem = rejectRequest(request.id, reason, user)
    if (problem) setError(problem)
    else onOpenChange(false)
  }

  return (
    <Dialog open={request !== null} onOpenChange={onOpenChange}>
      {request ? (
        <DialogContent
          size="lg"
          title={request.title}
          description={`Solicitação ${request.id.toUpperCase()} de ${requesterName(request)}`}
          footer={
            request.status === 'pending' && handler ? (
              <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                {rejecting ? (
                  <>
                    <Button variant="ghost" onClick={() => { setRejecting(false); setError(null) }}>Voltar</Button>
                    <Button variant="danger" onClick={reject}>Recusar solicitação</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Fechar</Button>
                    <Button variant="danger" onClick={() => setRejecting(true)}>Recusar</Button>
                    <Button onClick={() => onCreateProduct(request)}>Criar produto</Button>
                  </>
                )}
              </div>
            ) : (
              <Button variant="secondary" onClick={() => onOpenChange(false)}>Fechar</Button>
            )
          }
        >
          <div className="grid gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={REQUEST_STATUS_TONE[request.status]}>{REQUEST_STATUS_LABEL[request.status]}</StatusBadge>
              {request.urgent ? <StatusBadge tone="danger">Urgente</StatusBadge> : null}
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              <KeyValue label="Departamento">{request.departamento}</KeyValue>
              <KeyValue label="Categoria">{request.categoria}</KeyValue>
              <KeyValue label="Solicitante">{requesterName(request)}</KeyValue>
              <KeyValue label="Solicitada em">{formatDateTime(request.requestedAt)}</KeyValue>
            </dl>

            {request.status === 'done' && request.productId ? (
              <Alert tone="success" title="Produto criado">
                {userName(request.handledBy ?? '')} atendeu em {request.handledAt ? formatDateTime(request.handledAt) : '—'}.{' '}
                <RouterLink to={routes.product(request.productId)} className="font-semibold underline underline-offset-4">Abrir o produto</RouterLink>
              </Alert>
            ) : null}
            {request.status === 'rejected' ? (
              <Alert tone="danger" title="Solicitação recusada">
                {userName(request.handledBy ?? '')}: {request.reason}
              </Alert>
            ) : null}

            <section className="grid gap-2" aria-labelledby="req-arquivo">
              <Text id="req-arquivo" weight="semibold">Arquivo</Text>
              <div className="flex items-center gap-3 rounded-lg bg-subtle px-3 py-2">
                <Icon icon={isCsv(request.file) ? FileSpreadsheet : FileText} className="text-fg-subtle" />
                <div className="min-w-0 flex-1">
                  <Text className="truncate font-medium">{request.file.name}</Text>
                  <Text variant="small" tone="muted">{formatFileSize(request.file.size)}</Text>
                </div>
                {!EMBEDDED && request.file.src ? (
                  <Button asChild variant="secondary" size="sm" leadingIcon={<Download aria-hidden />}>
                    <a href={request.file.src} download={request.file.name}>Baixar</a>
                  </Button>
                ) : null}
              </div>
              {preview ? (
                <>
                  <Textarea readOnly rows={Math.min(PREVIEW_LINES, lines.length) + 1} value={preview} aria-label="Prévia do arquivo" className="font-mono text-xs" wrap="off" />
                  {lines.length > PREVIEW_LINES ? <FieldMessage>Mostrando as primeiras {PREVIEW_LINES} de {lines.length} linhas.</FieldMessage> : null}
                </>
              ) : EMBEDDED || !request.file.src ? (
                <FieldMessage>{request.file.src ? 'Nesta página hospedada só dá para ver a prévia de arquivos CSV; o download fica disponível no sistema.' : 'Arquivo de exemplo, sem conteúdo.'}</FieldMessage>
              ) : null}
            </section>

            {rejecting ? (
              <div className="grid gap-1.5">
                <label htmlFor="req-motivo" className="text-sm font-medium">Motivo da recusa <span aria-hidden className="text-tone-danger-fg">*</span></label>
                <Textarea
                  id="req-motivo"
                  rows={3}
                  value={reason}
                  maxLength={400}
                  autoFocus
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? 'req-motivo-erro' : undefined}
                  placeholder="O que o gerente precisa corrigir ou enviar de novo?"
                  onChange={(e) => { setReason(e.target.value); setError(null) }}
                />
                {error ? <FieldMessage id="req-motivo-erro" kind="error">{error}</FieldMessage> : null}
              </div>
            ) : null}
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}
