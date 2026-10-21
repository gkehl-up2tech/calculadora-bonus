import { useState } from 'react'
import { CircleCheck, Copy, FilePlus2, Info, MoreHorizontal, Package, PackageX, Pencil, Printer, Trash2, TriangleAlert } from 'lucide-react'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Alert, BarList, Badge, Breadcrumb, Button, Card, CardContent,
  CardDescription, CardFooter, CardHeader, CardTitle, Combobox, CurrencyInput, Dialog, DialogClose, DialogContent, DialogTrigger,
  DistributionBar, SegmentedNav, StatCard,
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger, EmptyState, FormField, IconButton, Input, MaskedInput, Pagination, Popover, PopoverContent, PopoverTrigger,
  SearchField, SegmentedControl, Select, Sheet, SheetContent, SheetTrigger, Stepper, Tabs, TabsContent, TabsList, TabsTrigger,
  Text, ThemeToggle, Tooltip, toast,
} from '@/design-system'
import { isValidCnpj, isValidGtin } from '@/lib/masks'
import { DocSection, SubSection } from '../docs/DocSection'
import { Specimen } from '../docs/Specimen'
import { PropsTable } from '../docs/PropsTable'
import { NCM_OPTIONS, ORIGEM_OPTIONS, UNIT_OPTIONS } from '../docs/sample-data'

function FormFieldDemo() {
  const [name, setName] = useState('')
  const [touched, setTouched] = useState(false)
  const error = touched && !name.trim() ? 'Informe o nome do produto.' : undefined
  return (
    <div className="grid w-full max-w-sm gap-4">
      <FormField label="Nome do produto" required hint="Como aparece na nota fiscal." error={error}>
        {(control) => <Input {...control} value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)} placeholder="Ex.: Parafuso sextavado M8" />}
      </FormField>
      <FormField label="Observações" optional>
        {(control) => <Input {...control} />}
      </FormField>
    </div>
  )
}

function MaskedDemo() {
  const [ncm, setNcm] = useState('')
  const [cest, setCest] = useState('')
  const [cnpj, setCnpj] = useState('11.222.333/0001-81')
  const [gtin, setGtin] = useState('7891000100103')
  const gtinError = gtin && ![8, 12, 13, 14].includes(gtin.length) ? 'GTIN tem 8, 12, 13 ou 14 dígitos.' : gtin && !isValidGtin(gtin) ? 'Dígito verificador inválido.' : undefined
  const cnpjError = cnpj.length === 18 && !isValidCnpj(cnpj) ? 'CNPJ inválido.' : undefined
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <FormField label="NCM" hint="8 dígitos: 0000.00.00">
        {(c) => <MaskedInput {...c} mask="ncm" value={ncm} onValueChange={setNcm} placeholder="0000.00.00" />}
      </FormField>
      <FormField label="CEST" optional hint="7 dígitos: 00.000.00">
        {(c) => <MaskedInput {...c} mask="cest" value={cest} onValueChange={setCest} placeholder="00.000.00" />}
      </FormField>
      <FormField label="GTIN / EAN" error={gtinError} hint={!gtinError && gtin ? 'GTIN válido.' : 'Código de barras (valida o dígito verificador).'}>
        {(c) => <MaskedInput {...c} mask="99999999999999" value={gtin} onValueChange={setGtin} placeholder="7891000100103" />}
      </FormField>
      <FormField label="CNPJ do fornecedor" error={cnpjError}>
        {(c) => <MaskedInput {...c} mask="cnpj" value={cnpj} onValueChange={setCnpj} />}
      </FormField>
    </div>
  )
}

function CurrencyDemo() {
  const [price, setPrice] = useState<number | null>(1234.5)
  return (
    <div className="grid w-full max-w-xs gap-3">
      <FormField label="Preço de venda">{(c) => <CurrencyInput {...c} value={price} onValueChange={setPrice} />}</FormField>
      <Text variant="small" tone="muted">Valor numérico: <code className="font-mono">{price === null ? 'null' : price}</code></Text>
    </div>
  )
}

function SelectDemos() {
  const [unit, setUnit] = useState<string>('UN')
  const [ncm, setNcm] = useState<string | null>(null)
  const [origem, setOrigem] = useState<string>('')
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <FormField label="Unidade">{(c) => <Select {...c} options={UNIT_OPTIONS} value={unit} onValueChange={setUnit} />}</FormField>
      <FormField label="Origem" error={!origem ? 'Selecione a origem.' : undefined}>{(c) => <Select {...c} options={ORIGEM_OPTIONS} value={origem} onValueChange={setOrigem} placeholder="Selecione…" />}</FormField>
      <FormField label="NCM (com busca)">
        {(c) => <Combobox {...c} options={NCM_OPTIONS} value={ncm} onValueChange={setNcm} placeholder="Buscar NCM…" searchPlaceholder="Digite o código ou a descrição" clearable />}
      </FormField>
    </div>
  )
}

function SearchDemo() {
  const [q, setQ] = useState('')
  return (
    <div className="w-full max-w-sm">
      <SearchField value={q} onValueChange={setQ} placeholder="Buscar produto…" shortcut={['Ctrl', 'K']} />
    </div>
  )
}

function SegmentedDemo() {
  const [v, setV] = useState<'lista' | 'grade' | 'mapa'>('lista')
  return <SegmentedControl aria-label="Visualização" value={v} onValueChange={setV} options={[{ value: 'lista', label: 'Lista' }, { value: 'grade', label: 'Grade' }, { value: 'mapa', label: 'Mapa' }]} />
}

function PaginationDemo() {
  const [page, setPage] = useState(6)
  return <Pagination label="Exemplo de paginação" page={page} pageCount={24} onPageChange={setPage} />
}

function StepperDemo() {
  const [i, setI] = useState(1)
  const steps = [
    { id: 'id', label: 'Identificação', description: 'Nome, SKU e GTIN' },
    { id: 'sales', label: 'Vendas', description: 'Preço e estoque' },
    { id: 'tax', label: 'Fiscal', description: 'NCM, CFOP e CST' },
    { id: 'review', label: 'Revisão' },
  ]
  return (
    <div className="grid w-full gap-4">
      <Stepper label="Etapas do exemplo" steps={steps} current={i} onStepClick={setI} />
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" disabled={i === 0} onClick={() => setI((n) => n - 1)}>Voltar</Button>
        <Button size="sm" disabled={i === steps.length - 1} onClick={() => setI((n) => n + 1)}>Avançar</Button>
      </div>
    </div>
  )
}

function AlertDemo() {
  const [open, setOpen] = useState(true)
  return (
    <div className="grid w-full gap-3">
      <Alert tone="info" title="Importação em andamento">Você pode continuar usando o sistema. Avisaremos quando terminar.</Alert>
      <Alert tone="success" title="Produto salvo">As alterações já estão disponíveis nas vendas.</Alert>
      <Alert tone="warning" title="NCM sem CEST">Este NCM exige CEST quando há substituição tributária.</Alert>
      <Alert tone="danger" title="Não foi possível salvar" action={<Button size="sm" variant="danger">Tentar novamente</Button>}>Verifique sua conexão e tente de novo.</Alert>
      {open ? <Alert tone="neutral" title="Dica" icon={Info} onDismiss={() => setOpen(false)}>Use Ctrl+K para buscar qualquer página.</Alert> : <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>Mostrar dica de novo</Button>}
    </div>
  )
}

function DialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="secondary">Abrir diálogo</Button></DialogTrigger>
      <DialogContent
        title="Duplicar produto"
        description="Cria uma cópia com os mesmos dados fiscais. O SKU precisa ser novo."
        footer={
          <>
            <DialogClose asChild><Button variant="secondary">Cancelar</Button></DialogClose>
            <Button onClick={() => { setOpen(false); toast.success('Produto duplicado') }}>Duplicar</Button>
          </>
        }
      >
        <FormField label="Novo SKU" required>{(c) => <Input {...c} placeholder="UP-1001" autoFocus />}</FormField>
      </DialogContent>
    </Dialog>
  )
}

export function MoleculesSection() {
  return (
    <DocSection
      id="moleculas"
      eyebrow="Nível 3"
      title="Moléculas"
      description="Unidades funcionais: cada uma resolve uma tarefa completa, com estado, teclado e acessibilidade coordenados. Aqui ficam os componentes interativos construídos sobre Radix UI e cmdk."
    >
      <SubSection title="Formulários">
        <Specimen
          title="FormField"
          composedOf={['FieldLabel', 'controle', 'FieldMessage']}
          description="O ponto de entrada de todo campo. Gera os ids e conecta label, dica e erro ao controle (aria-describedby, aria-invalid) — funciona com Input, Select, Combobox, MaskedInput… Clique no campo e saia sem preencher."
          code={`<FormField label="Nome do produto" required hint="Como aparece na nota." error={errors.name}>
  {(control) => <Input {...control} value={name} onChange={...} />}
</FormField>`}
        >
          <FormFieldDemo />
        </Specimen>
        <Specimen
          title="Select e Combobox"
          composedOf={['Radix Select', 'Radix Popover + cmdk']}
          description="Select para listas curtas; Combobox (com busca) para listas longas como NCM e CFOP — aceita filtro local ou busca no servidor (onSearchChange). Teclado: setas, Enter, Esc, digitar para buscar."
          code={`<Select options={UNITS} value={unit} onValueChange={setUnit} />

<Combobox
  options={NCM_OPTIONS}
  value={ncm}
  onValueChange={setNcm}
  searchPlaceholder="Digite o código ou a descrição"
  clearable
/>`}
          previewClassName="!block"
        >
          <SelectDemos />
        </Specimen>
        <Specimen
          title="MaskedInput"
          composedOf={['Input', 'máscara']}
          description="Máscara que preserva o cursor ao editar no meio do texto, com teclado numérico no celular. Os validadores (GTIN, CNPJ) ficam em lib/masks e são independentes do campo."
          code={`<MaskedInput mask="ncm" value={ncm} onValueChange={(masked, raw) => setNcm(masked)} />
<MaskedInput mask="99999999999999" ... />   // padrão livre: 9 = dígito, A = letra, * = alfanumérico`}
          previewClassName="!block"
        >
          <MaskedDemo />
        </Specimen>
        <Specimen
          title="CurrencyInput"
          composedOf={['InputGroup', 'formatação BRL']}
          description="Digita-se apenas números; os dois últimos são centavos (1 → 0,01 · 12345 → 123,45). O valor devolvido é numérico, nunca texto."
          code={`<CurrencyInput value={price} onValueChange={setPrice} />   // number | null`}
        >
          <CurrencyDemo />
        </Specimen>
        <Specimen title="SearchField" composedOf={['InputGroup', 'IconButton', 'ShortcutHint']} description="Esc limpa o campo; o botão de limpar aparece quando há texto." code={`<SearchField value={q} onValueChange={setQ} shortcut={['Ctrl', 'K']} />`}>
          <SearchDemo />
        </Specimen>
      </SubSection>

      <SubSection title="Feedback">
        <Specimen
          title="Alert"
          composedOf={['Icon', 'Text', 'Button', 'IconButton']}
          description="Mensagem persistente na página. Erro e atenção usam role=alert (anunciados na hora); os demais, role=status."
          code={`<Alert tone="danger" title="Não foi possível salvar" action={<Button size="sm">Tentar novamente</Button>}>
  Verifique sua conexão.
</Alert>`}
          previewClassName="!block"
        >
          <AlertDemo />
        </Specimen>
        <Specimen
          title="Toast"
          composedOf={['Sonner']}
          description="Confirmações rápidas que somem sozinhas. Monte <Toaster /> uma vez na raiz e chame toast() de qualquer lugar. Use para resultado de ações — nunca para erros que exigem decisão (use Alert)."
          code={`toast.success('Produto salvo')
toast.error('Falha ao salvar')
toast.promise(save(), { loading: 'Salvando…', success: 'Salvo!', error: 'Erro' })
toast('Produto excluído', { action: { label: 'Desfazer', onClick: undo } })`}
        >
          <Button variant="secondary" onClick={() => toast.success('Produto salvo')}>Sucesso</Button>
          <Button variant="secondary" onClick={() => toast.error('Não foi possível salvar o produto')}>Erro</Button>
          <Button variant="secondary" onClick={() => toast.info('Importação iniciada')}>Info</Button>
          <Button variant="secondary" onClick={() => toast('Produto excluído', { action: { label: 'Desfazer', onClick: () => toast.success('Restaurado') } })}>Com ação</Button>
          <Button variant="secondary" onClick={() => toast.promise(new Promise((r) => setTimeout(r, 1600)), { loading: 'Salvando…', success: 'Salvo!', error: 'Erro' })}>Promise</Button>
        </Specimen>
        <Specimen
          title="Tooltip"
          composedOf={['Radix Tooltip', 'ShortcutHint']}
          description="Texto de apoio ao passar o mouse ou focar. Passe de um botão para o vizinho: depois do primeiro, os outros abrem na hora e sem animação. Nunca coloque informação essencial aqui — não existe no toque."
          code={`// Monte <TooltipProvider> uma vez na raiz.
<Tooltip content="Duplicar" shortcut={['Ctrl', 'D']}>
  <IconButton icon={Copy} label="Duplicar" />
</Tooltip>`}
        >
          <Tooltip content="Editar" shortcut={['E']}><IconButton icon={Pencil} label="Editar" variant="secondary" /></Tooltip>
          <Tooltip content="Duplicar" shortcut={['Ctrl', 'D']}><IconButton icon={Copy} label="Duplicar" variant="secondary" /></Tooltip>
          <Tooltip content="Imprimir etiqueta"><IconButton icon={Printer} label="Imprimir etiqueta" variant="secondary" /></Tooltip>
          <Tooltip content="Excluir"><IconButton icon={Trash2} label="Excluir" variant="danger-ghost" /></Tooltip>
        </Specimen>
      </SubSection>

      <SubSection title="Sobreposições">
        <Specimen
          title="DropdownMenu e Popover"
          composedOf={['Radix DropdownMenu', 'Radix Popover']}
          description="Menu de ações (setas, digitação e Esc) e painel livre ancorado ao gatilho. Ambos escalam a partir do gatilho, não do centro."
          code={`<DropdownMenu>
  <DropdownMenuTrigger asChild><IconButton icon={MoreHorizontal} label="Mais ações" /></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem icon={Pencil}>Editar</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem icon={Trash2} destructive>Excluir</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild><IconButton icon={MoreHorizontal} label="Mais ações" variant="secondary" /></DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Produto</DropdownMenuLabel>
              <DropdownMenuItem icon={Pencil} shortcut={['E']}>Editar</DropdownMenuItem>
              <DropdownMenuItem icon={Copy} shortcut={['Ctrl', 'D']}>Duplicar</DropdownMenuItem>
              <DropdownMenuItem icon={Printer}>Imprimir etiqueta</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem defaultChecked>Exibir no catálogo</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={Trash2} destructive>Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild><Button variant="secondary">Dica fiscal</Button></PopoverTrigger>
            <PopoverContent>
              <div className="grid gap-1.5">
                <Text weight="semibold">NCM e CEST</Text>
                <Text variant="small" tone="muted">O CEST é obrigatório quando o NCM está sujeito à substituição tributária de ICMS.</Text>
              </div>
            </PopoverContent>
          </Popover>
          <ThemeToggle />
        </Specimen>
        <Specimen
          title="Dialog e Sheet"
          composedOf={['Radix Dialog']}
          description="Dialog para decisões e formulários curtos (foco preso, Esc fecha, origem no centro). Sheet para filtros, detalhes e menu no celular, entrando por um dos lados com a curva de gaveta."
          code={`<Dialog>
  <DialogTrigger asChild><Button>Abrir</Button></DialogTrigger>
  <DialogContent title="Duplicar produto" description="…" footer={<>…botões…</>}>
    …conteúdo…
  </DialogContent>
</Dialog>

<Sheet><SheetTrigger asChild>…</SheetTrigger>
  <SheetContent title="Filtros" side="right">…</SheetContent>
</Sheet>`}
        >
          <DialogDemo />
          <Sheet>
            <SheetTrigger asChild><Button variant="secondary">Gaveta lateral</Button></SheetTrigger>
            <SheetContent title="Detalhes do produto" description="Visualização rápida sem sair da lista." footer={<Button>Abrir cadastro</Button>}>
              <div className="grid gap-3 p-4"><Text>Parafuso sextavado M8</Text><Badge tone="success">Ativo</Badge></div>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild><Button variant="secondary">Gaveta inferior</Button></SheetTrigger>
            <SheetContent title="Filtros" side="bottom" footer={<Button className="w-full">Ver resultados</Button>}>
              <div className="grid gap-4 p-4"><FormField label="Departamento">{(c) => <Input {...c} />}</FormField></div>
            </SheetContent>
          </Sheet>
        </Specimen>
      </SubSection>

      <SubSection title="Navegação e organização">
        <Specimen title="Tabs, SegmentedControl e Accordion" composedOf={['Radix Tabs', 'Radix ToggleGroup', 'Radix Accordion']} description="Tabs trocam de painel; SegmentedControl troca o modo de visualização; Accordion esconde seções longas (ex.: dados fiscais avançados)." code={`<Tabs defaultValue="dados"><TabsList><TabsTrigger value="dados">Dados</TabsTrigger>…</TabsList><TabsContent value="dados">…</TabsContent></Tabs>
<SegmentedControl aria-label="Visualização" value={v} onValueChange={setV} options={[…]} />
<Accordion type="single" collapsible><AccordionItem value="a"><AccordionTrigger>…</AccordionTrigger><AccordionContent>…</AccordionContent></AccordionItem></Accordion>`} previewClassName="!grid gap-6 lg:grid-cols-2">
          <Tabs defaultValue="dados">
            <TabsList aria-label="Seções do produto">
              <TabsTrigger value="dados">Dados gerais</TabsTrigger>
              <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
              <TabsTrigger value="estoque">Estoque</TabsTrigger>
            </TabsList>
            <TabsContent value="dados"><Text tone="muted">Nome, SKU, GTIN e descrição.</Text></TabsContent>
            <TabsContent value="fiscal"><Text tone="muted">NCM, CEST, CFOP e tributação.</Text></TabsContent>
            <TabsContent value="estoque"><Text tone="muted">Saldos, mínimo e depósitos.</Text></TabsContent>
          </Tabs>
          <div className="grid content-start gap-4">
            <SegmentedDemo />
            <Accordion type="single" collapsible defaultValue="a">
              <AccordionItem value="a"><AccordionTrigger headingLevel={6}>Tributação ICMS</AccordionTrigger><AccordionContent>CST/CSOSN, alíquota e redução de base de cálculo.</AccordionContent></AccordionItem>
              <AccordionItem value="b"><AccordionTrigger headingLevel={6}>PIS e COFINS</AccordionTrigger><AccordionContent>CST e alíquotas das contribuições.</AccordionContent></AccordionItem>
              <AccordionItem value="c"><AccordionTrigger headingLevel={6}>IPI</AccordionTrigger><AccordionContent>Enquadramento e alíquota.</AccordionContent></AccordionItem>
            </Accordion>
          </div>
        </Specimen>
        <Specimen title="Breadcrumb e Pagination" composedOf={['Link', 'Icon', 'IconButton', 'Button']} description="No celular, a trilha mostra só a página atual e a paginação vira “Página X de Y”." code={`<Breadcrumb items={[{ label: 'Produtos', href: '/produtos' }, { label: 'Parafuso M8' }]} />
<Pagination page={page} pageCount={24} onPageChange={setPage} />`} previewClassName="!grid gap-5">
          <Breadcrumb label="Exemplo de trilha" items={[{ label: 'Início', href: '#moleculas' }, { label: 'Produtos', href: '#moleculas' }, { label: 'Parafuso sextavado M8' }]} />
          <PaginationDemo />
        </Specimen>
        <Specimen title="Stepper" composedOf={['Icon', 'Text', 'ProgressBar']} description="Indicador de etapas — usado dentro do organismo Wizard. Etapas concluídas voltam ao clicar. No celular vira “Etapa 2 de 4” com barra de progresso (redimensione a janela)." code={`<Stepper steps={steps} current={1} onStepClick={setCurrent} />`} previewClassName="!block">
          <StepperDemo />
        </Specimen>
      </SubSection>

      <SubSection title="Navegação principal">
        <Specimen
          title="SegmentedNav"
          composedOf={['Link', 'estilo de toggle']}
          description="A navegação principal do sistema: parece um toggle, mas é feita de links — cada opção leva a uma página. Fica logo acima do PageHeader. O item atual usa aria-current=page; em páginas fora do menu (Conexões, Configurações, produto) nenhuma opção fica marcada. Sem ícones."
          code={`<SegmentedNav
  items={[{ id: 'home', label: 'Início', href: '/', end: true }, { id: 'products', label: 'Produtos', href: '/produtos', end: true }]}
  linkAs={NavLink} hrefProp="to"
/>`}
          previewClassName="!grid gap-4"
        >
          <SegmentedNav label="Exemplo: Início selecionado" currentPath="#moleculas" items={[{ id: 'a', label: 'Início', href: '#moleculas', end: true }, { id: 'b', label: 'Produtos', href: '#moleculas-b', end: true }]} />
          <SegmentedNav label="Exemplo: segundo item selecionado" currentPath="#moleculas-b" items={[{ id: 'a', label: 'Início', href: '#moleculas', end: true }, { id: 'b', label: 'Produtos', href: '#moleculas-b', end: true }]} />
          <SegmentedNav label="Exemplo: fora do menu" items={[{ id: 'a', label: 'Início', href: '#moleculas', end: true }, { id: 'b', label: 'Produtos', href: '#moleculas-b', end: true }]} />
        </Specimen>
      </SubSection>

      <SubSection title="Indicadores e gráficos" description="Regras de visualização: um número que é a resposta vira indicador (não gráfico); categorias sem ordem usam uma cor só; parte-do-todo é uma barra empilhada com legenda; todo gráfico traz os valores em texto (gêmeo em tabela) e nada depende só da cor.">
        <Specimen
          title="StatCard"
          composedOf={['Card', 'Text', 'Icon']}
          description="Rótulo + número + contexto. A cor fica só no ícone (o significado); o número nunca é colorido. Use um único hero por visão (número ≥ 48 px) e agrupe os cartões num <dl>. Números grandes aparecem compactos (R$ 2,4 mi)."
          code={`<dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
  <StatCard hero label="Produtos cadastrados" value="57" helper="Total do catálogo" className="col-span-2" />
  <StatCard label="Produtos ativos" value="40" helper="70% do cadastro" icon={CircleCheck} tone="success" />
  <StatCard label="Produtos incompletos" value="12" helper="21% com pendências" icon={TriangleAlert} tone="warning" />
</dl>`}
          previewClassName="!block bg-canvas"
        >
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard hero label="Produtos cadastrados" value="57" helper="Total do catálogo" className="col-span-2" />
            <StatCard label="Produtos ativos" value="40" helper="70% do cadastro" icon={CircleCheck} tone="success" />
            <StatCard label="Produtos incompletos" value="12" helper="21% com pendências" icon={TriangleAlert} tone="warning" />
            <StatCard label="Sem estoque" value="3" helper="Saldo zerado" icon={PackageX} tone="danger" className="col-span-2 lg:col-span-1" />
          </dl>
        </Specimen>
        <Specimen
          title="BarList"
          composedOf={['Text', 'barra fina']}
          description="Ranking em barras horizontais. A lista de texto (rótulo, valor e %) é a leitura principal; as barras só reforçam (aria-hidden). Categorias nominais usam UMA cor, sem rampa de valor. Barra de 8 px, ponta arredondada e base reta."
          code={`<BarList aria-label="Produtos por departamento" total={57} items={[{ id: 'e', label: 'Eletrônicos', value: 17 }, …]} />
<BarList tone="warning" aria-label="Pendências" items={…} />`}
          previewClassName="!grid gap-8 md:grid-cols-2"
        >
          <BarList aria-label="Exemplo: produtos por departamento" items={[{ id: 'a', label: 'Eletrônicos', value: 17 }, { id: 'b', label: 'Ferragens', value: 9 }, { id: 'c', label: 'Informática', value: 6 }, { id: 'd', label: 'Vestuário', value: 4 }, { id: 'e', label: 'Cosméticos', value: 0 }]} />
          <BarList aria-label="Exemplo: pendências" tone="warning" items={[{ id: 'a', label: 'Sem dados fiscais', value: 8 }, { id: 'b', label: 'Sem GTIN', value: 5 }, { id: 'c', label: 'Sem descrição', value: 2 }]} />
        </Specimen>
        <Specimen
          title="DistributionBar"
          composedOf={['Text', 'barra empilhada']}
          description="Parte-do-todo em uma barra empilhada (até ~4 partes), com 2 px de respiro entre os segmentos e legenda sempre presente com valor e %. As cores têm significado de status (sucesso, atenção, erro) e vêm sempre com o nome."
          code={`<DistributionBar segments={[
  { id: 'a', label: 'Ativos', value: 40, tone: 'success' },
  { id: 'i', label: 'Inativos', value: 9, tone: 'neutral' },
  { id: 'r', label: 'Rascunhos', value: 8, tone: 'warning' },
]} />`}
          previewClassName="!grid gap-8 md:grid-cols-2"
        >
          <DistributionBar segments={[{ id: 'a', label: 'Ativos', value: 40, tone: 'success' }, { id: 'i', label: 'Inativos', value: 9, tone: 'neutral' }, { id: 'r', label: 'Rascunhos', value: 8, tone: 'warning' }]} />
          <DistributionBar segments={[{ id: 'a', label: 'Estoque saudável', value: 44, tone: 'success' }, { id: 'b', label: 'Estoque baixo', value: 10, tone: 'warning' }, { id: 'c', label: 'Sem estoque', value: 3, tone: 'danger' }]} />
        </Specimen>
      </SubSection>

      <SubSection title="Contêineres">
        <Specimen title="Card e EmptyState" composedOf={['Heading', 'Text', 'Button', 'Icon']} code={`<Card>
  <CardHeader><div><CardTitle level={6}>Estoque</CardTitle><CardDescription>Saldo por depósito.</CardDescription></div></CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button>Ajustar</Button></CardFooter>
</Card>
<EmptyState headingLevel={6} icon={Package} title="Nenhum produto ainda" description="…" actions={<Button>Cadastrar produto</Button>} />`} previewClassName="!grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div><CardTitle level={6}>Estoque</CardTitle><CardDescription>Saldo consolidado de todos os depósitos.</CardDescription></div>
              <Badge tone="success">Saudável</Badge>
            </CardHeader>
            <CardContent><Text className="text-3xl font-bold tracking-tight" tabular>1.240 un</Text></CardContent>
            <CardFooter><Button variant="secondary" size="sm">Ver movimentações</Button><Button size="sm">Ajustar</Button></CardFooter>
          </Card>
          <Card><EmptyState headingLevel={6} icon={Package} title="Nenhum produto ainda" description="Cadastre o primeiro produto ou importe uma planilha para começar." actions={<><Button leadingIcon={<FilePlus2 aria-hidden />}>Cadastrar produto</Button><Button variant="secondary">Importar</Button></>} /></Card>
        </Specimen>
        <PropsTable
          of="moléculas de formulário"
          rows={[
            { name: 'FormField.children', type: '(control) => ReactNode', description: 'Função que recebe { id, aria-describedby, aria-invalid, aria-required } para espalhar no controle.' },
            { name: 'Select.options', type: '{ value, label, description?, disabled? }[]', description: 'Valores não podem ser string vazia (limitação do Radix).' },
            { name: 'Combobox.onSearchChange', type: '(q: string) => void', description: 'Ativa busca no servidor: desliga o filtro local. Combine com loading.' },
            { name: 'MaskedInput.mask', type: "MaskName | string", description: 'ncm, cest, cnpj, cpf, cep ou padrão livre (9, A, *).' },
            { name: 'CurrencyInput.value', type: 'number | null', description: 'Em reais (1234.56). null = vazio.' },
          ]}
        />
      </SubSection>
    </DocSection>
  )
}
