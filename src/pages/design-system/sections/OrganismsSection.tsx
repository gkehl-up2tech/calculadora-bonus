import { useState } from 'react'
import { BookOpen, Boxes, Home, Package, Plus, Settings, Tags } from 'lucide-react'
import {
  AppHeader, Button, CheckboxField, CommandPalette, ConfirmDialog, DropdownMenuItem, FormField, FormGrid, FormSection, Input, Logo,
  PageHeader, SidebarNav, StickyActionBar, Wizard, toast, type NavGroup,
} from '@/design-system'
import { DocSection, SubSection } from '../docs/DocSection'
import { Frame } from '../docs/Frame'
import { Specimen } from '../docs/Specimen'
import { ProductListExample } from '../docs/examples/ProductListExample'

const demoNav: NavGroup[] = [
  { id: 'a', items: [{ id: 'home', label: 'Início', href: '#organismos', icon: Home, end: true }, { id: 'products', label: 'Produtos', href: '#organismos-produtos', icon: Package }, { id: 'cats', label: 'Categorias', href: '#organismos-cat', icon: Tags }] },
  { id: 'b', label: 'Fiscal', items: [{ id: 'tax', label: 'Tributação', href: '#organismos-trib', icon: BookOpen }, { id: 'ncm', label: 'NCM e CEST', href: '#organismos-ncm', icon: Boxes }] },
  { id: 'c', label: 'Sistema', items: [{ id: 'cfg', label: 'Configurações', href: '#organismos-cfg', icon: Settings }] },
]

function WizardDemo() {
  const [name, setName] = useState('')
  const [fiscal, setFiscal] = useState(false)
  return (
    <div className="w-full">
      <Wizard
        steps={[
          {
            id: 'id', label: 'Identificação', description: 'Nome e SKU', canContinue: name.trim().length > 2,
            content: <FormGrid><FormField label="Nome do produto" required hint="Mínimo de 3 letras para continuar.">{(c) => <Input {...c} value={name} onChange={(e) => setName(e.target.value)} />}</FormField></FormGrid>,
          },
          { id: 'sales', label: 'Vendas', description: 'Preço e estoque', content: <FormGrid><FormField label="Preço de venda">{(c) => <Input {...c} inputMode="decimal" placeholder="0,00" />}</FormField></FormGrid> },
          {
            id: 'tax', label: 'Fiscal', description: 'Confirmação', canContinue: fiscal,
            content: <CheckboxField label="Conferi NCM, origem e tributação" description="Necessário para concluir o cadastro." checked={fiscal} onCheckedChange={(v) => setFiscal(v === true)} />,
          },
        ]}
        finishLabel="Cadastrar produto"
        onFinish={async () => { await new Promise((r) => setTimeout(r, 800)); toast.success('Produto cadastrado') }}
      />
    </div>
  )
}

function ConfirmDemos() {
  const [simple, setSimple] = useState(false)
  const [danger, setDanger] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setSimple(true)}>Confirmação simples</Button>
      <Button variant="danger-ghost" onClick={() => setDanger(true)}>Exclusão com digitação</Button>
      <ConfirmDialog open={simple} onOpenChange={setSimple} title="Publicar alterações?" description="O produto passa a valer imediatamente nas vendas." confirmLabel="Publicar" onConfirm={() => void toast.success('Publicado')} />
      <ConfirmDialog
        open={danger} onOpenChange={setDanger} tone="danger" title="Excluir 'Parafuso sextavado M8'?"
        description="Isso remove o produto e seu histórico. Não pode ser desfeito." confirmText="EXCLUIR" confirmLabel="Excluir definitivamente"
        onConfirm={async () => { await new Promise((r) => setTimeout(r, 700)); toast.success('Produto excluído') }}
      />
    </>
  )
}

function PaletteDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Abrir paleta de comandos</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        shortcut={false}
        groups={[
          { id: 'g', heading: 'Ações', items: [
            { id: 'new', label: 'Novo produto', icon: Plus, shortcut: ['N'], keywords: ['cadastrar', 'criar'], onSelect: () => toast.info('Novo produto') },
            { id: 'prod', label: 'Ir para Produtos', icon: Package, onSelect: () => toast.info('Produtos') },
          ] },
        ]}
      />
    </>
  )
}

export function OrganismsSection() {
  const [dirty, setDirty] = useState(true)
  return (
    <DocSection
      id="organismos"
      eyebrow="Nível 4"
      title="Organismos"
      description="Seções completas da interface, que reúnem várias moléculas para resolver um conjunto de tarefas. É onde a padronização mais rende: toda lista, todo cabeçalho e todo formulário nascem daqui."
    >
      <SubSection title="Estrutura da aplicação">
        <Specimen
          title="AppHeader e SidebarNav"
          composedOf={['Logo', 'ThemeToggle', 'DropdownMenu', 'Persona', 'NavItem']}
          description="Cabeçalho fixo (menu no celular, busca global, tema, usuário) e menu lateral agrupado. A navegação marca a página atual com aria-current e aceita o NavLink do roteador."
          code={`<AppHeader logo={<Logo />} user={{ name, email }} onMenuClick={…} onSearchClick={…} userMenu={<DropdownMenuItem>Sair</DropdownMenuItem>} />

<SidebarNav groups={groups} linkAs={NavLink} hrefProp="to" />`}
          previewClassName="!block !p-0"
        >
          <Frame label="AppHeader + SidebarNav" className="rounded-none border-0">
            <div className="relative">
              <AppHeaderPreview />
              <div className="grid gap-0 sm:grid-cols-[16rem_minmax(0,1fr)]">
                <div className="border-r border-line-subtle bg-surface p-3"><SidebarNav label="Exemplo de menu lateral" groups={demoNav} currentPath="#organismos-produtos" /></div>
                <div className="hidden bg-canvas p-6 text-sm text-fg-muted sm:block">Área de conteúdo</div>
              </div>
            </div>
          </Frame>
        </Specimen>
        <Specimen
          title="PageHeader"
          composedOf={['Breadcrumb', 'Heading', 'Text', 'Button']}
          description="Topo de toda página: trilha, título (o único h1), descrição e ações. No celular as ações descem para baixo do título."
          code={`<PageHeader
  title="Produtos"
  description="Catálogo fiscal e comercial."
  breadcrumb={{ items: [{ label: 'Início', href: '/' }, { label: 'Produtos' }] }}
  actions={<Button leadingIcon={<Plus />}>Novo produto</Button>}
/>`}
          previewClassName="!block"
        >
          <PageHeader
            title="Produtos"
            headingLevel={6}
            description="Catálogo fiscal e comercial. Busque, filtre e edite em lote."
            breadcrumb={{ label: 'Exemplo de trilha da página', items: [{ label: 'Início', href: '#organismos' }, { label: 'Produtos' }] }}
            actions={<><Button variant="secondary">Importar</Button><Button leadingIcon={<Plus aria-hidden />}>Novo produto</Button></>}
          />
        </Specimen>
      </SubSection>

      <SubSection id="organismos-produtos" title="Listas de dados">
        <Specimen
          title="DataTable + FilterBar"
          composedOf={['Checkbox', 'Badge', 'Select', 'SearchField', 'Pagination', 'DropdownMenu', 'ConfirmDialog']}
          description="Ordenação em três estados (clique no cabeçalho), seleção com “selecionar todos” indeterminado, ações em lote, densidade, paginação, carregamento com skeleton e estado vazio. Números à direita e tabulares. No celular, os filtros vão para uma gaveta inferior e a tabela rola na horizontal."
          code={`<FilterBar search={q} onSearchChange={setQ} filters={<Select … />} activeFilters={chips} onClearAll={clear} />

<DataTable
  caption="Produtos"
  data={data}                 // memoizado!
  columns={columns}           // ColumnDef<Product>[] (TanStack Table)
  getRowId={(p) => p.id}
  selectable
  bulkActions={(selected, clear) => <Button>Excluir</Button>}
/>

// meta da coluna: { align: 'right' } → número alinhado e tabular`}
          previewClassName="!block bg-canvas"
        >
          <ProductListExample caption="Produtos — exemplo de DataTable" />
        </Specimen>
      </SubSection>

      <SubSection title="Formulários">
        <Specimen
          title="FormSection e StickyActionBar"
          composedOf={['Heading', 'Text', 'Card', 'FormField', 'Badge']}
          description="Seção de formulário com a explicação ao lado dos campos (empilha no celular) e uma barra de ações presa ao rodapé, com aviso de alterações não salvas. FormGrid organiza os campos em 1–2 colunas."
          code={`<FormSection title="Identificação" description="Como o produto é reconhecido.">
  <FormGrid>
    <FormField label="Nome" required className="sm:col-span-2">{(c) => <Input {...c} />}</FormField>
  </FormGrid>
</FormSection>

<StickyActionBar dirty={dirty}>
  <Button variant="secondary">Cancelar</Button><Button>Salvar</Button>
</StickyActionBar>`}
          previewClassName="!block bg-canvas"
        >
          <div className="grid gap-6">
            <FormSection headingLevel={6} title="Identificação" description="Como o produto é reconhecido no catálogo e na nota fiscal.">
              <FormGrid>
                <FormField label="Nome do produto" required className="sm:col-span-2">{(c) => <Input {...c} placeholder="Ex.: Parafuso sextavado M8" onChange={() => setDirty(true)} />}</FormField>
                <FormField label="SKU" required>{(c) => <Input {...c} placeholder="UP-1000" />}</FormField>
                <FormField label="GTIN" optional>{(c) => <Input {...c} inputMode="numeric" />}</FormField>
              </FormGrid>
            </FormSection>
            <StickyActionBar dirty={dirty} className="!static -mx-5 mt-2 rounded-b-lg">
              <Button variant="secondary" onClick={() => setDirty(false)}>Descartar</Button>
              <Button disabled={!dirty} onClick={() => { setDirty(false); toast.success('Salvo') }}>Salvar</Button>
            </StickyActionBar>
          </div>
        </Specimen>
        <Specimen
          title="Wizard"
          composedOf={['Stepper', 'Card', 'Button']}
          description="Cadastro guiado em etapas. Bloqueie “Continuar” com canContinue enquanto a etapa estiver incompleta; etapas concluídas podem ser revisitadas pelo Stepper."
          code={`<Wizard
  steps={[{ id: 'id', label: 'Identificação', canContinue: valid, content: <…/> }, …]}
  finishLabel="Cadastrar produto"
  onFinish={save}
/>`}
          previewClassName="!block"
        >
          <WizardDemo />
        </Specimen>
      </SubSection>

      <SubSection title="Decisões e atalhos">
        <Specimen
          title="ConfirmDialog"
          composedOf={['Dialog', 'Button', 'FormField', 'Input']}
          description="Foco inicial no Cancelar (evita confirmar por reflexo). Exclusões irreversíveis podem exigir digitar uma palavra. Durante a ação assíncrona, tudo fica travado e o botão mostra carregamento."
          code={`<ConfirmDialog
  open={open} onOpenChange={setOpen}
  tone="danger" title="Excluir produto?" description="Não pode ser desfeito."
  confirmText="EXCLUIR" confirmLabel="Excluir"
  onConfirm={async () => { await remove(id) }}
/>`}
        >
          <ConfirmDemos />
        </Specimen>
        <Specimen
          title="CommandPalette"
          composedOf={['Dialog', 'cmdk', 'ShortcutHint']}
          description="Ctrl/⌘ + K em qualquer tela (tente agora). Abre e fecha sem animação, de propósito: é usada por teclado dezenas de vezes por dia. Ligue o atalho global em apenas uma instância."
          code={`<CommandPalette open={open} onOpenChange={setOpen} groups={[{ id: 'go', heading: 'Ir para', items: [{ id: 'p', label: 'Produtos', icon: Package, onSelect: () => navigate('/produtos') }] }]} />`}
        >
          <PaletteDemo />
        </Specimen>
      </SubSection>
    </DocSection>
  )
}

function AppHeaderPreview() {
  return (
    <div className="[&>header]:static [&_header]:!pt-0">
      <AppHeader
        logo={<Logo />}
        user={{ name: 'Usuário UP2Tech', email: 'usuario@up2tech.com.br' }}
        userMenu={<DropdownMenuItem icon={Settings}>Configurações</DropdownMenuItem>}
        onMenuClick={() => toast.info('Abre o menu lateral no celular')}
        onSearchClick={() => toast.info('Abre a paleta de comandos')}
      />
    </div>
  )
}
