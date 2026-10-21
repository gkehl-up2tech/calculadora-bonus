import type { ReactNode } from 'react'
import { CheckCircle2, TriangleAlert } from 'lucide-react'
import { Badge, FormSection, Icon, SimpleTable, StatusBadge, Text, Thumbnail } from '@/design-system'
import type { Channel, ChannelStatus, ImageKind, ProductDetail, ProductImage } from '@/app/products/detail'
import type { SectionDef } from '@/app/products/schema'
import { formatBRL, formatNumber } from '@/lib/format'

const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' })
const when = (iso: string) => dateTime.format(new Date(iso))
const money = (n: number) => (n > 0 ? formatBRL(n) : '—')

const CHANNEL: Record<ChannelStatus, { label: string; tone: 'success' | 'neutral' | 'danger' }> = {
  published: { label: 'Publicado', tone: 'success' },
  paused: { label: 'Pausado', tone: 'neutral' },
  error: { label: 'Com erro', tone: 'danger' },
}

const IMAGE_KIND: Record<ImageKind, string> = {
  principal: 'Principal',
  'fundo-branco': 'Fundo branco',
  detalhe: 'Detalhe',
  escala: 'Em uso / escala',
}

/** Requisitos usuais de marketplaces (Mercado Livre, Amazon): checados em cima das imagens cadastradas. */
export function imageChecks(images: ProductImage[]) {
  return [
    { id: 'qtd', label: 'Pelo menos 4 imagens', ok: images.length >= 4 },
    { id: 'principal', label: 'Imagem principal definida', ok: images.some((i) => i.kind === 'principal') },
    { id: 'fundo', label: 'Foto com fundo branco (exigida por vários marketplaces)', ok: images.some((i) => i.kind === 'fundo-branco') },
    { id: 'res', label: 'Resolução mínima de 1000 × 1000 px em todas', ok: images.length > 0 && images.every((i) => i.width >= 1000 && i.height >= 1000) },
    { id: 'alt', label: 'Texto alternativo em todas as imagens', ok: images.length > 0 && images.every((i) => i.alt.trim() !== '') },
  ]
}

function Block({ section, editing, children }: { section: SectionDef; editing: boolean; children: ReactNode }) {
  return (
    <FormSection title={section.title} description={section.description} headingLevel={2} id={`secao-${section.id}`}>
      {children}
      {editing ? <Text variant="small" tone="muted" className="mt-4">Esta seção é só de leitura por enquanto: a edição chega em uma próxima etapa.</Text> : null}
    </FormSection>
  )
}

export interface CustomSectionProps {
  section: SectionDef
  detail: ProductDetail
  editing: boolean
  /** Preço de venda atual (rascunho ou salvo): as tabelas de preço derivam dele. */
  price: number | null
}

/** Seções cujo conteúdo não são campos do esquema: tabelas e galeria. */
export function CustomSection({ section, detail, editing, price }: CustomSectionProps) {
  const { extras } = detail
  const block = (children: ReactNode) => <Block section={section} editing={editing}>{children}</Block>
  switch (section.id) {
    case 'tabelas-preco':
      return block(
        <SimpleTable
          caption="Tabelas de preço"
          rows={price === null ? [] : extras.priceTables.map((t) => ({ ...t, price: t.id === 't1' ? price : Math.round(price * (t.id === 't2' ? 0.9 : 1.1) * 100) / 100 }))}
          getRowId={(r) => r.id}
          empty="Defina o preço de venda para gerar as tabelas de preço."
          columns={[
            { key: 'n', header: 'Tabela', cell: (r) => r.name },
            { key: 'p', header: 'Preço', align: 'right', cell: (r) => formatBRL(r.price) },
            { key: 'v', header: 'Vigência', cell: (r) => r.validity },
          ]}
        />,
      )
    case 'depositos': {
      const total = extras.deposits.reduce((a, d) => a + d.balance, 0)
      const reserved = extras.deposits.reduce((a, d) => a + d.reserved, 0)
      return block(
        <SimpleTable
          caption="Saldo por depósito"
          rows={extras.deposits}
          getRowId={(r) => r.id}
          columns={[
            { key: 'n', header: 'Depósito', cell: (r) => r.name, footer: 'Total' },
            { key: 's', header: 'Saldo', align: 'right', cell: (r) => formatNumber(r.balance), footer: formatNumber(total) },
            { key: 'r', header: 'Reservado', align: 'right', cell: (r) => formatNumber(r.reserved), footer: formatNumber(reserved) },
            { key: 'd', header: 'Disponível', align: 'right', cell: (r) => formatNumber(r.balance - r.reserved), footer: formatNumber(total - reserved) },
          ]}
        />,
      )
    }
    case 'fornecedores':
      return block(
        <SimpleTable
          caption="Fornecedores"
          rows={extras.suppliers}
          getRowId={(r) => r.id}
          columns={[
            { key: 'n', header: 'Fornecedor', cell: (r) => r.name },
            { key: 'c', header: 'Código', cell: (r) => <span className="font-mono text-sm">{r.code}</span> },
            { key: 'u', header: 'Último custo', align: 'right', cell: (r) => money(r.lastCost) },
            { key: 'l', header: 'Prazo', align: 'right', cell: (r) => `${r.leadTime} dias` },
          ]}
        />,
      )
    case 'canais':
      return block(
        <SimpleTable<Channel>
          caption="Publicação nos canais"
          rows={extras.channels}
          getRowId={(r) => r.id}
          empty="O produto ainda não está publicado em nenhum canal. Ative o produto e conecte um canal em Conexões."
          columns={[
            { key: 'n', header: 'Canal', cell: (r) => r.name },
            {
              key: 's',
              header: 'Situação',
              cell: (r) => (
                <div className="grid justify-items-start gap-1">
                  <StatusBadge tone={CHANNEL[r.status].tone}>{CHANNEL[r.status].label}</StatusBadge>
                  {r.note ? <span className="max-w-56 text-xs text-fg-muted">{r.note}</span> : null}
                </div>
              ),
            },
            { key: 'a', header: 'Anúncio', cell: (r) => <span className="font-mono text-sm">{r.adId}</span> },
            { key: 'p', header: 'Preço', align: 'right', cell: (r) => money(r.price) },
            { key: 'e', header: 'Estoque', align: 'right', cell: (r) => formatNumber(r.stock) },
            { key: 'u', header: 'Sincronizado', cell: (r) => when(r.syncedAt) },
          ]}
        />,
      )
    case 'galeria':
      return block(
        extras.images.length === 0 ? (
          <Text tone="muted">Nenhuma imagem cadastrada.</Text>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {extras.images.map((img, n) => (
              <li key={img.id} className="grid content-start gap-1.5">
                <Thumbnail src={img.src} alt={img.alt || `Imagem ${n + 1} do produto`} size="fill" className="rounded-lg" />
                <div className="flex flex-wrap items-center gap-1">
                  <Badge size="sm" tone={img.kind === 'principal' ? 'brand' : 'neutral'}>{IMAGE_KIND[img.kind]}</Badge>
                  {img.alt ? null : <Badge size="sm" tone="warning">Sem texto alternativo</Badge>}
                </div>
                <Text variant="small" tone="muted" className="tabular-nums">{img.width} × {img.height} px · {img.sizeKb} KB</Text>
              </li>
            ))}
          </ul>
        ),
      )
    case 'qualidade-imagens':
      return block(
        <ul className="grid gap-2.5">
          {imageChecks(extras.images).map((c) => (
            <li key={c.id} className="flex items-start gap-2.5 text-sm">
              <Icon icon={c.ok ? CheckCircle2 : TriangleAlert} size="md" className={c.ok ? 'text-tone-success-fg' : 'text-tone-warning-fg'} />
              <span>
                {c.label}
                <span className="sr-only">{c.ok ? ': atendido' : ': não atendido'}</span>
              </span>
            </li>
          ))}
        </ul>,
      )
    case 'variacoes-lista':
      return block(
        <SimpleTable
          caption="Variações"
          rows={extras.variations}
          getRowId={(r) => r.id}
          empty="Nenhuma variação cadastrada."
          columns={[
            { key: 'n', header: 'Variação', cell: (r) => r.label },
            { key: 's', header: 'SKU', cell: (r) => <span className="font-mono text-sm">{r.sku}</span> },
            { key: 'e', header: 'EAN', cell: (r) => (r.ean ? <span className="font-mono text-sm">{r.ean}</span> : '—') },
            { key: 'p', header: 'Preço', align: 'right', cell: (r) => money(r.price) },
            { key: 'q', header: 'Estoque', align: 'right', cell: (r) => formatNumber(r.stock) },
          ]}
        />,
      )
    case 'kit-composicao':
      return block(
        <SimpleTable
          caption="Composição do kit"
          rows={extras.kitItems}
          getRowId={(r) => r.id}
          empty="Nenhum item no kit."
          columns={[
            { key: 'n', header: 'Item', cell: (r) => r.title },
            { key: 's', header: 'SKU', cell: (r) => <span className="font-mono text-sm">{r.sku}</span> },
            { key: 'q', header: 'Quantidade', align: 'right', cell: (r) => r.qty },
          ]}
        />,
      )
    case 'historico-lista':
      return block(
        <SimpleTable
          caption="Histórico de alterações"
          rows={extras.history}
          getRowId={(r) => r.id}
          empty="Sem alterações registradas."
          columns={[
            { key: 'q', header: 'Quando', cell: (r) => <span className="whitespace-nowrap tabular-nums">{when(r.at)}</span> },
            { key: 'u', header: 'Quem', cell: (r) => r.user },
            { key: 'c', header: 'Campo', cell: (r) => r.field },
            { key: 'd', header: 'De', cell: (r) => <span className="text-fg-muted">{r.from}</span> },
            { key: 'p', header: 'Para', cell: (r) => r.to },
          ]}
        />,
      )
    default:
      return null
  }
}
