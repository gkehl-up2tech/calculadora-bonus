import { useState } from 'react'
import { Download, FileSpreadsheet } from 'lucide-react'
import {
  Alert, Button, FileDropzone, SegmentedControl, SimpleTable, StatusBadge, Text, Textarea, toast, type FileRejection,
} from '@/design-system'
import type { AppUser } from '@/app/access/users'
import { MAX_IMPORT_MB, MAX_IMPORT_ROWS, importColumnsFor, templateCsv, type ImportResult, type ImportRow } from '@/app/products/import'
import { EMBEDDED } from '@/lib/embedded'

export interface ImportPanelProps {
  user: AppUser
  fileName: string | null
  result: ImportResult | null
  busy: boolean
  onFiles: (files: File[], rejected: FileRejection[]) => void
  onReset: () => void
  rejection: string | null
}

/**
 * Importar produtos por CSV: baixar o modelo, enviar o arquivo e conferir linha por linha antes de criar.
 * Em página hospedada (iframe isolado) o download é bloqueado: lá o modelo é copiado para a área de transferência.
 */
export function ImportPanel({ user, fileName, result, busy, onFiles, onReset, rejection }: ImportPanelProps) {
  const [filter, setFilter] = useState<'todas' | 'erros'>('todas')
  const [showText, setShowText] = useState(false)
  const template = templateCsv(user).slice(1) /* sem o BOM */

  function downloadTemplate() {
    const url = URL.createObjectURL(new Blob([templateCsv(user)], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'modelo-importacao-produtos.csv'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(template)
      toast.success('Modelo copiado', { description: 'Cole em uma planilha (Excel ou Google Planilhas) e salve como CSV.' })
    } catch {
      setShowText(true)
      toast.info('Não foi possível copiar sozinho', { description: 'Selecione o texto abaixo e copie.' })
    }
  }

  const ready = result?.rows.filter((r) => r.errors.length === 0) ?? []
  const failed = result?.rows.filter((r) => r.errors.length > 0) ?? []
  const shown = filter === 'erros' ? failed : (result?.rows ?? [])

  return (
    <div className="grid gap-5">
      <section className="grid gap-3 rounded-lg bg-subtle p-4">
        <ol className="grid gap-1 text-sm">
          <li><strong className="font-semibold">1.</strong> Baixe o modelo e preencha uma linha por produto. Só <em className="not-italic font-semibold">titulo</em> e <em className="not-italic font-semibold">departamento</em> são obrigatórios.</li>
          <li><strong className="font-semibold">2.</strong> Envie o arquivo CSV (Excel em português ou UTF-8, separado por “;” ou “,”).</li>
          <li><strong className="font-semibold">3.</strong> Confira as linhas: as prontas viram <strong className="font-semibold">rascunhos</strong>; as com problema ficam de fora e dizem o que corrigir.</li>
        </ol>
        <div className="flex flex-wrap items-center gap-2">
          {EMBEDDED ? (
            <Button variant="secondary" size="sm" leadingIcon={<FileSpreadsheet aria-hidden />} onClick={copyTemplate}>Copiar modelo</Button>
          ) : (
            <Button variant="secondary" size="sm" leadingIcon={<Download aria-hidden />} onClick={downloadTemplate}>Baixar modelo (CSV)</Button>
          )}
          <Text variant="small" tone="muted">Fotos não entram no CSV: adicione depois, na aba Imagens de cada produto.</Text>
        </div>
        {showText ? <Textarea readOnly rows={5} value={template} aria-label="Modelo de CSV" className="font-mono text-xs" onFocus={(e) => e.currentTarget.select()} /> : null}
        <details className="text-sm">
          <summary className="cursor-pointer rounded-xs font-medium text-fg underline-offset-4 hover:underline">Colunas aceitas</summary>
          <div className="mt-2">
            <SimpleTable
              caption="Colunas do arquivo de importação"
              rows={importColumnsFor(user)}
              getRowId={(c) => c.key}
              columns={[
                { key: 'h', header: 'Coluna', cell: (c) => <code className="font-mono text-[0.8125rem] font-semibold">{c.header}</code> },
                { key: 'r', header: 'Obrigatória', cell: (c) => (c.required ? 'Sim' : 'Não') },
                { key: 'a', header: 'Como preencher', cell: (c) => <span className="text-fg-muted">{c.help}</span>, className: 'min-w-56' },
              ]}
            />
            <Text variant="small" tone="muted" className="mt-2">Até {MAX_IMPORT_ROWS} linhas e {MAX_IMPORT_MB} MB por arquivo. Os nomes das colunas podem ter acento ou maiúsculas; “nome” vale como “titulo”.</Text>
          </div>
        </details>
      </section>

      {result === null ? (
        <div className="grid gap-2">
          <FileDropzone
            accept={['.csv', 'text/csv', 'text/plain', 'application/vnd.ms-excel']}
            maxSizeMb={MAX_IMPORT_MB}
            disabled={busy}
            onFiles={onFiles}
            title="Arraste o arquivo CSV aqui ou clique para escolher"
            hint={`Um arquivo, até ${MAX_IMPORT_MB} MB.`}
          />
          {rejection ? <Alert tone="danger">{rejection}</Alert> : null}
        </div>
      ) : (
        <section className="grid gap-3" aria-label="Conferência do arquivo">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Text weight="semibold" className="min-w-0 truncate">{fileName} <span className="font-normal text-fg-muted">· {result.rows.length} {result.rows.length === 1 ? 'linha' : 'linhas'} · separador “{result.delimiter === '\t' ? 'tab' : result.delimiter}”</span></Text>
            <Button variant="ghost" size="sm" onClick={onReset}>Trocar arquivo</Button>
          </div>
          {result.fileErrors.map((e) => <Alert key={e} tone="danger">{e}</Alert>)}
          {result.ignored.length > 0 ? <Alert tone="neutral">Colunas que o sistema não usa e foram ignoradas: {result.ignored.join(', ')}.</Alert> : null}
          {result.rows.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p aria-live="polite" className="text-sm">
                  <strong className="font-semibold text-tone-success-fg">{ready.length} {ready.length === 1 ? 'pronta' : 'prontas'}</strong>
                  {failed.length > 0 ? <> · <strong className="font-semibold text-tone-danger-fg">{failed.length} com problema</strong> (ficam de fora)</> : null}
                </p>
                {failed.length > 0 ? (
                  <SegmentedControl size="sm" aria-label="Filtrar linhas" value={filter} onValueChange={setFilter} options={[{ value: 'todas', label: 'Todas' }, { value: 'erros', label: 'Com problema' }]} />
                ) : null}
              </div>
              <div className="max-h-72 overflow-y-auto rounded-md border border-line-subtle px-3">
                <SimpleTable<ImportRow>
                  caption="Linhas do arquivo"
                  rows={shown}
                  getRowId={(r) => String(r.line)}
                  columns={[
                    { key: 'l', header: 'Linha', align: 'right', cell: (r) => r.line },
                    {
                      key: 't',
                      header: 'Produto',
                      className: 'min-w-48',
                      cell: (r) => (
                        <div className="grid gap-0.5">
                          <span className="font-medium">{r.title || '—'}</span>
                          <span className="font-mono text-xs text-fg-muted">{r.sku}{r.departamento ? ` · ${r.departamento}` : ''}</span>
                          {r.errors.length > 0 ? <ul className="mt-1 grid list-disc gap-0.5 pl-4 text-xs text-tone-danger-fg">{r.errors.map((e) => <li key={e}>{e}</li>)}</ul> : null}
                        </div>
                      ),
                    },
                    { key: 's', header: 'Situação', cell: (r) => (r.errors.length === 0 ? <StatusBadge tone="success">Pronta</StatusBadge> : <StatusBadge tone="danger">{r.errors.length} {r.errors.length === 1 ? 'problema' : 'problemas'}</StatusBadge>) },
                  ]}
                />
              </div>
            </>
          ) : null}
        </section>
      )}
    </div>
  )
}
