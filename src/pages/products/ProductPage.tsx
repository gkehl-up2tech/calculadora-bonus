import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useBlocker, useParams, useSearchParams } from 'react-router'
import { ArrowLeft, Pencil, Save } from 'lucide-react'
import {
  Alert, Badge, Button, Card, ConfirmDialog, EmptyState, KeyValue, PageHeader, StatusBadge, StickyActionBar,
  Tabs, TabsContent, TabsList, TabsTrigger, Thumbnail, toast,
} from '@/design-system'
import { can, readOnlyReason } from '@/app/access/permissions'
import { useSession } from '@/app/access/session'
import { userName } from '@/app/access/users'
import { routes } from '@/app/navigation'
import { findProduct, saveProductValues, useProductDetail, type ProductImage } from '@/app/products/detail'
import { STATUS_LABEL, STATUS_TONE, type Product } from '@/app/products/sample-products'
import { TABS, pendingFields, sectionsOf, visibleTabs, type FieldValue, type TabId, type Values } from '@/app/products/schema'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { usePageTitle } from '@/lib/usePageTitle'
import { CustomSection } from './product/CustomSections'
import { FieldsSection } from './product/FieldsSection'
import { tabOfField, validate } from '@/app/products/validate'

/**
 * Página do produto — /produtos/:produtoId. Sem item de menu: o acesso é pela lista "Produtos" ou pela busca global.
 * Todas as informações vêm do esquema (src/app/products/schema.ts): trocar um campo de aba é mudar uma linha lá.
 * O cadastro de produto novo é o modal NewProductDialog (botão "Novo produto"), não uma rota.
 */
export function ProductPage() {
  const { produtoId } = useParams()
  const product = findProduct(produtoId)
  return product ? <ProductDetailPage key={product.id} product={product} /> : <NotFound />
}

function NotFound() {
  usePageTitle('Produto não encontrado')
  return (
    <EmptyState
      headingLevel={1}
      title="Produto não encontrado"
      description="O endereço pode estar errado ou o produto foi removido do catálogo."
      actions={<Button asChild variant="secondary"><RouterLink to={routes.products}><ArrowLeft aria-hidden />Voltar para Produtos</RouterLink></Button>}
    />
  )
}

/** Mesmas fotos, na mesma ordem e com os mesmos textos e tipos? */
const sameImages = (a: ProductImage[], b: ProductImage[]) =>
  a.length === b.length && a.every((x, i) => x.id === b[i]!.id && x.alt === b[i]!.alt && x.kind === b[i]!.kind)

const SECTION_TABS = new Map<TabId, ReturnType<typeof sectionsOf>>(TABS.map((t) => [t.id, sectionsOf(t.id)]))

function ProductDetailPage({ product }: { product: Product }) {
  const user = useSession()
  const canEdit = can(user, 'product.edit', product)
  const detail = useProductDetail(product)!
  const saved = detail.values
  const [params, setParams] = useSearchParams()
  // Quem está editando: trocar de perfil (demonstração) sem a permissão encerra a edição, sem efeitos colaterais.
  const [editingBy, setEditingBy] = useState<string | null>(null)
  const editing = editingBy === user.id && canEdit
  const [draft, setDraft] = useState<Values>(saved)
  const [imagesDraft, setImagesDraft] = useState<ProductImage[]>(detail.extras.images)
  const [submitted, setSubmitted] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [focusTarget, setFocusTarget] = useState<string | null>(null)

  const wide = useMediaQuery('(min-width: 40rem)')
  const shown = editing ? draft : saved
  usePageTitle(String(saved.title || 'Produto'))

  const imagesChanged = !sameImages(imagesDraft, detail.extras.images)
  const dirty = editing && (JSON.stringify(draft) !== JSON.stringify(saved) || imagesChanged)
  const errors = useMemo(() => (editing && submitted ? validate(draft, product.id) : {}), [editing, submitted, draft, product.id])

  // Abas visíveis dependem do tipo do produto (variações/kit); a aba vem da URL (?aba=).
  const tabs = visibleTabs(shown)
  const requested = params.get('aba')
  const active: TabId = tabs.find((t) => t.id === requested)?.id ?? 'principal'
  const setTab = useCallback(
    (id: string) => setParams((p) => { const n = new URLSearchParams(p); if (id === 'principal') n.delete('aba'); else n.set('aba', id); return n }, { replace: true }),
    [setParams],
  )

  const pending = useMemo(() => pendingFields(shown), [shown])
  const pendingTabs = tabs.filter((t) => pending[t.id].length > 0)
  const pendingTotal = pendingTabs.reduce((n, t) => n + pending[t.id].length, 0)
  const errorsByTab = useMemo(() => {
    const out: Partial<Record<TabId, number>> = {}
    for (const id of Object.keys(errors)) {
      const tab = tabOfField(id)
      if (tab) out[tab] = (out[tab] ?? 0) + 1
    }
    return out
  }, [errors])

  // Sair da página com alterações não salvas pede confirmação (trocar de aba não conta).
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname)
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  // Foca o primeiro campo inválido assim que a aba dele estiver na tela (o conteúdo da aba monta um instante depois).
  useEffect(() => {
    if (!focusTarget) return
    let frame = 0
    let tries = 0
    const tick = () => {
      const el = document.getElementById(focusTarget)
      if (el) {
        el.focus()
        setFocusTarget(null)
      } else if (tries++ < 30) {
        frame = requestAnimationFrame(tick)
      }
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [focusTarget])

  function startEditing(tab?: TabId) {
    if (!canEdit) return
    setDraft(saved)
    setImagesDraft(detail.extras.images)
    setSubmitted(false)
    setEditingBy(user.id)
    if (tab) setTab(tab)
  }

  function stopEditing() {
    setEditingBy(null)
    setSubmitted(false)
    setDraft(saved)
    setImagesDraft(detail.extras.images)
  }

  function save() {
    const found = validate(draft, product.id)
    setSubmitted(true)
    const first = Object.keys(found)[0]
    if (first) {
      // Vai para a primeira aba com erro e foca o primeiro campo inválido.
      const order = tabs.map((t) => t.id)
      const firstTab = order.find((id) => Object.keys(found).some((k) => tabOfField(k) === id))
      const target = Object.keys(found).find((k) => tabOfField(k) === firstTab) ?? first
      if (firstTab) setTab(firstTab)
      toast.error(`${Object.keys(found).length} ${Object.keys(found).length === 1 ? 'campo precisa' : 'campos precisam'} de atenção`, { description: 'Corrija os campos marcados e salve de novo.' })
      setFocusTarget(`campo-${target}`)
      return
    }
    const changed = saveProductValues(product, draft, user, imagesChanged ? imagesDraft : undefined)
    setEditingBy(null)
    setSubmitted(false)
    toast.success(changed ? 'Produto salvo' : 'Nada foi alterado')
  }

  const onChange = (id: string, value: FieldValue) => setDraft((d) => ({ ...d, [id]: value }))
  const status = String(saved.status) as Product['status']

  return (
    <div className="grid gap-6">
      <PageHeader
        breadcrumb={{
          items: [{ label: 'Produtos', href: routes.products }, { label: String(saved.title) }],
          renderLink: (item, children, className) => <RouterLink to={item.href!} className={className}>{children}</RouterLink>,
        }}
        title={String(saved.title)}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <StatusBadge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</StatusBadge>
            <span>SKU <span className="font-mono text-sm">{String(saved.sku)}</span></span>
            {canEdit ? null : (
              <span className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">Somente leitura</Badge>
                <span>{readOnlyReason(user, product, userName(product.owner))}</span>
              </span>
            )}
          </span>
        }
        actions={
          editing ? (
            // No celular as ações ficam só na barra fixa do rodapé.
            wide ? <>
              <Button variant="secondary" onClick={() => (dirty ? setDiscardOpen(true) : stopEditing())}>Cancelar</Button>
              <Button onClick={save}><Save aria-hidden />Salvar alterações</Button>
            </> : undefined
          ) : canEdit ? (
            <Button onClick={() => startEditing()}><Pencil aria-hidden />Editar produto</Button>
          ) : undefined
        }
      />

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Thumbnail src={product.photo} alt={`Foto de ${saved.title}`} size="xl" className="size-20 sm:size-24" />
          <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
            <KeyValue label="Departamento">{String(saved.departamento)}</KeyValue>
            <KeyValue label="Marca">{String(saved.marca)}</KeyValue>
            <KeyValue label="Responsável">{userName(product.owner)}</KeyValue>
            <KeyValue label="NCM" mono>{String(saved.ncm)}</KeyValue>
            <KeyValue label="EAN" mono>{String(saved.ean)}</KeyValue>
            <KeyValue label="Tipo">{{ simples: 'Simples', variacoes: 'Com variações', kit: 'Kit' }[String(saved.tipo)] ?? ''}</KeyValue>
          </dl>
        </div>
      </Card>

      {pendingTotal > 0 ? (
        <Alert
          tone="warning"
          title={`${pendingTotal} ${pendingTotal === 1 ? 'informação pendente' : 'informações pendentes'}`}
          action={
            editing || !canEdit ? undefined : <Button size="sm" variant="secondary" onClick={() => startEditing(pendingTabs[0]!.id)}>Completar cadastro</Button>
          }
        >
          Faltam dados obrigatórios ou recomendados em:{' '}
          {pendingTabs.map((t, i) => (
            <span key={t.id}>
              {i > 0 ? ', ' : ''}
              <button type="button" className="font-medium text-fg underline underline-offset-4" onClick={() => setTab(t.id)}>
                {t.label} ({pending[t.id].length})
              </button>
            </span>
          ))}
          .
        </Alert>
      ) : null}

      <Tabs value={active} onValueChange={setTab}>
        <TabsList aria-label="Informações do produto">
          {tabs.map((t) => {
            const errs = errorsByTab[t.id]
            const pend = pending[t.id].length
            return (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
                {errs ? (
                  <Badge tone="danger" size="sm">{errs}<span className="sr-only"> {errs === 1 ? 'erro' : 'erros'}</span></Badge>
                ) : pend ? (
                  <Badge tone="warning" size="sm">{pend}<span className="sr-only"> {pend === 1 ? 'pendência' : 'pendências'}</span></Badge>
                ) : null}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.id} value={t.id} className="grid gap-8 pt-6">
            {SECTION_TABS.get(t.id)!.map((s) => {
              if (s.id === 'variacoes-lista' && shown.tipo !== 'variacoes') return null
              if (s.id === 'kit-composicao' && shown.tipo !== 'kit') return null
              return s.custom ? (
                <CustomSection key={s.id} section={s} detail={detail} editing={editing} images={editing ? imagesDraft : detail.extras.images} onImagesChange={setImagesDraft} onAddPhotos={canEdit ? () => startEditing('imagens') : undefined} />
              ) : (
                <FieldsSection key={s.id} section={s} values={shown} editing={editing} errors={errors} onChange={onChange} />
              )
            })}
          </TabsContent>
        ))}
      </Tabs>

      {editing ? (
        <StickyActionBar dirty={dirty}>
          <Button variant="secondary" onClick={() => (dirty ? setDiscardOpen(true) : stopEditing())}>Cancelar</Button>
          <Button onClick={save}><Save aria-hidden />Salvar alterações</Button>
        </StickyActionBar>
      ) : null}

      <ConfirmDialog
        open={discardOpen || blocker.state === 'blocked'}
        onOpenChange={(open) => {
          if (open) return
          setDiscardOpen(false)
          if (blocker.state === 'blocked') blocker.reset()
        }}
        title="Descartar as alterações?"
        description="O que você editou neste produto ainda não foi salvo e será perdido."
        confirmLabel="Descartar"
        cancelLabel="Continuar editando"
        tone="danger"
        onConfirm={() => {
          setDiscardOpen(false)
          if (blocker.state === 'blocked') {
            blocker.proceed()
          } else {
            stopEditing()
          }
        }}
      />
    </div>
  )
}
