import { useState } from 'react'
import { ArrowRight, Download, Package, Plus, Trash2 } from 'lucide-react'
import {
  Avatar, Badge, Button, Checkbox, Divider, Heading, Icon, Input, Kbd, Label, Link, Logo, NativeSelect, ProgressBar,
  Radio, RadioGroup, Skeleton, Spinner, Switch, Text, Textarea, TONES, toneLabel, type CheckedState,
} from '@/design-system'
import { DocSection, SubSection } from '../docs/DocSection'
import { Specimen } from '../docs/Specimen'
import { PropsTable } from '../docs/PropsTable'

function CheckboxDemo() {
  const [checked, setChecked] = useState<CheckedState>('indeterminate')
  return (
    <>
      <div className="flex items-center gap-2"><Checkbox id="d-cb1" /><Label htmlFor="d-cb1">Desmarcado</Label></div>
      <div className="flex items-center gap-2"><Checkbox id="d-cb2" defaultChecked /><Label htmlFor="d-cb2">Marcado</Label></div>
      <div className="flex items-center gap-2">
        <Checkbox id="d-cb3" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="d-cb3">Indeterminado (clique)</Label>
      </div>
      <div className="flex items-center gap-2"><Checkbox id="d-cb4" disabled /><Label htmlFor="d-cb4">Desabilitado</Label></div>
      <div className="flex items-center gap-2"><Checkbox id="d-cb5" aria-invalid /><Label htmlFor="d-cb5">Inválido</Label></div>
    </>
  )
}

export function AtomsSection() {
  const [progress, setProgress] = useState(64)
  return (
    <DocSection
      id="atomos"
      eyebrow="Nível 1"
      title="Átomos"
      description="Os menores elementos: cada um faz uma coisa e não se divide. Só dependem de tokens. Toda a aparência dos níveis acima nasce daqui."
    >
      <SubSection title="Ações">
        <Specimen
          title="Button"
          description="Seis variantes por intenção — uma ação primária por tela. Pressionar escala para 97% (feedback imediato, 150 ms). Em carregamento, a largura é preservada e o clique fica bloqueado."
          code={`<Button>Salvar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="soft">Duplicar</Button>
<Button variant="ghost">Ver detalhes</Button>
<Button variant="danger">Excluir</Button>
<Button variant="danger-ghost">Remover</Button>

<Button leadingIcon={<Plus />}>Novo produto</Button>
<Button loading>Salvando…</Button>
<Button asChild><a href="/produtos">Ir para produtos</a></Button>`}
        >
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="soft">Suave</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="danger">Perigo</Button>
          <Button variant="danger-ghost">Perigo suave</Button>
        </Specimen>
        <Specimen
          title="Button — tamanhos e estados"
          code={`<Button size="sm">Pequeno</Button>
<Button size="md">Médio</Button>
<Button size="lg">Grande</Button>
<Button loading>Salvando…</Button>
<Button disabled>Desabilitado</Button>`}
        >
          <Button size="sm">Pequeno</Button>
          <Button size="md">Médio</Button>
          <Button size="lg">Grande</Button>
          <Button leadingIcon={<Plus aria-hidden />}>Com ícone</Button>
          <Button variant="secondary" trailingIcon={<ArrowRight aria-hidden />}>Continuar</Button>
          <Button loading>Salvando…</Button>
          <Button disabled>Desabilitado</Button>
          <Button asChild variant="soft"><a href="#atomos"><Download aria-hidden />Como link</a></Button>
        </Specimen>
        <PropsTable
          of="Button"
          rows={[
            { name: 'variant', type: "'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'danger-ghost'", default: "'primary'", description: 'Intenção visual da ação.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Altura 32/40/48 px (40/44/52 em telas de toque).' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Spinner, desabilita o clique e define aria-busy.' },
            { name: 'leadingIcon / trailingIcon', type: 'ReactNode', description: 'Ícone antes/depois do texto. Passe <Icon aria-hidden />.' },
            { name: 'asChild', type: 'boolean', default: 'false', description: 'Aplica o visual ao elemento filho (ex.: Link do roteador).' },
          ]}
        />
      </SubSection>

      <SubSection title="Campos de formulário">
        <Specimen
          title="Input"
          description="Borda com contraste ≥ 3:1. Foco mostra borda e anel. Em telas de toque o texto é de 16 px. Sempre associe a um Label (use FormField, no nível das moléculas)."
          code={`<Input placeholder="Nome do produto" />
<Input invalid defaultValue="valor inválido" />
<Input disabled defaultValue="Desabilitado" />
<Input size="lg" />`}
          previewClassName="!grid sm:grid-cols-2"
        >
          <Input placeholder="Padrão" aria-label="Padrão" />
          <Input defaultValue="Preenchido" aria-label="Preenchido" />
          <Input invalid defaultValue="Inválido" aria-label="Inválido" />
          <Input disabled defaultValue="Desabilitado" aria-label="Desabilitado" />
          <Input readOnly defaultValue="Somente leitura" aria-label="Somente leitura" />
          <Input size="sm" placeholder="Pequeno (32 px)" aria-label="Pequeno" />
          <Input size="lg" placeholder="Grande (48 px)" aria-label="Grande" />
        </Specimen>
        <Specimen title="Textarea e NativeSelect" description="NativeSelect usa o seletor do sistema operacional — a melhor escolha em celulares e para listas curtas." code={`<Textarea rows={4} />
<NativeSelect><option>UN</option><option>CX</option></NativeSelect>`} previewClassName="!grid sm:grid-cols-2">
          <Textarea placeholder="Descrição do produto" aria-label="Descrição" />
          <NativeSelect aria-label="Unidade" defaultValue="UN">
            <option value="UN">UN — Unidade</option>
            <option value="CX">CX — Caixa</option>
            <option value="KG">KG — Quilograma</option>
          </NativeSelect>
        </Specimen>
        <Specimen title="Label" description="Sempre ligado ao campo por htmlFor. Clicar no texto foca ou ativa o controle." code={`<Label htmlFor="sku">SKU</Label>
<Input id="sku" />`} previewClassName="!grid">
          <div className="grid max-w-xs gap-1.5"><Label htmlFor="d-sku">SKU</Label><Input id="d-sku" placeholder="UP-1000" /></div>
        </Specimen>
        <Specimen
          title="Checkbox, Radio e Switch"
          description="Alvo de toque ampliado além do tamanho visual. Checkbox tem estado indeterminado (usado em “selecionar todos”). Switch é para efeito imediato; checkbox, para enviar com o formulário."
          code={`<Checkbox id="a" /> <Label htmlFor="a">Aceito</Label>
<Checkbox checked="indeterminate" />
<RadioGroup defaultValue="a"><Radio value="a" /><Radio value="b" /></RadioGroup>
<Switch aria-label="Ativo" />`}
          previewClassName="gap-x-8 gap-y-3"
        >
          <CheckboxDemo />
          <RadioGroup defaultValue="b" className="flex gap-4" aria-label="Exemplo de radio">
            <div className="flex items-center gap-2"><Radio value="a" id="d-r1" /><Label htmlFor="d-r1">Opção A</Label></div>
            <div className="flex items-center gap-2"><Radio value="b" id="d-r2" /><Label htmlFor="d-r2">Opção B</Label></div>
            <div className="flex items-center gap-2"><Radio value="c" id="d-r3" disabled /><Label htmlFor="d-r3">Desabilitada</Label></div>
          </RadioGroup>
          <div className="flex items-center gap-2"><Switch id="d-sw1" /><Label htmlFor="d-sw1">Desligado</Label></div>
          <div className="flex items-center gap-2"><Switch id="d-sw2" defaultChecked /><Label htmlFor="d-sw2">Ligado</Label></div>
          <div className="flex items-center gap-2"><Switch id="d-sw3" disabled /><Label htmlFor="d-sw3">Desabilitado</Label></div>
        </Specimen>
      </SubSection>

      <SubSection title="Indicadores">
        <Specimen
          title="Badge"
          description="Rótulos curtos de estado ou categoria. Seis tons × três aparências. O texto sempre diz o significado."
          code={`<Badge tone="success">Ativo</Badge>
<Badge tone="danger" appearance="solid">Bloqueado</Badge>
<Badge tone="info" appearance="outline" size="sm">Novo</Badge>`}
          previewClassName="!grid"
        >
          {(['soft', 'solid', 'outline'] as const).map((a) => (
            <div key={a} className="flex flex-wrap items-center gap-2">
              <span className="w-16 text-xs text-fg-muted">{a}</span>
              {TONES.map((t) => <Badge key={t} tone={t} appearance={a}>{toneLabel[t]}</Badge>)}
            </div>
          ))}
        </Specimen>
        <Specimen title="Avatar" description="Foto ou iniciais (primeira e última palavra do nome). O nome vira texto alternativo." code={`<Avatar name="Maria da Silva" size="md" />
<Avatar name="Carlos" src="/foto.jpg" />`}>
          <Avatar name="Maria da Silva" size="xs" />
          <Avatar name="Maria da Silva" size="sm" />
          <Avatar name="Maria da Silva" size="md" />
          <Avatar name="Maria da Silva" size="lg" />
          <Avatar name="Carlos" />
          <Avatar name="João Pedro de Albuquerque Santos" />
        </Specimen>
        <Specimen
          title="Spinner, Skeleton e ProgressBar"
          description="Skeleton para carregamentos de conteúdo com forma conhecida (tabelas, cards); Spinner para ações curtas; ProgressBar quando se sabe o andamento."
          code={`<Spinner size="md" label="Salvando" />
<Skeleton className="h-4 w-40" />
<ProgressBar value={64} tone="brand" aria-label="Importação" />`}
          previewClassName="!grid sm:grid-cols-3"
        >
          <div className="flex items-center gap-4"><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" /></div>
          <div className="grid gap-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-9 w-full" /></div>
          <div className="grid gap-3">
            <ProgressBar value={progress} aria-label="Importação" />
            <ProgressBar value={progress} tone="success" aria-label="Importação concluída" />
            <Button size="sm" variant="secondary" onClick={() => setProgress((p) => (p >= 100 ? 0 : p + 18))}>Avançar</Button>
          </div>
        </Specimen>
      </SubSection>

      <SubSection title="Tipografia e utilitários">
        <Specimen
          title="Heading, Text, Link e Kbd"
          code={`<Heading level={1} size="2xl">Produtos</Heading>
<Text tone="muted">Gerencie o catálogo.</Text>
<Link href="/ajuda">Saiba mais</Link>
<Kbd>Ctrl</Kbd>`}
          previewClassName="!grid"
        >
          <Heading level={6} size="xl">Produtos</Heading>
          <Text tone="muted">Gerencie o catálogo fiscal e comercial. <Link href="#atomos">Saiba mais</Link> sobre os campos obrigatórios.</Text>
          <div className="flex flex-wrap items-center gap-2"><Text as="span" variant="small" tone="muted">Atalho para buscar:</Text><Kbd>Ctrl</Kbd><Kbd>K</Kbd></div>
        </Specimen>
        <Specimen title="Icon, Divider e Logo" code={`<Icon icon={Package} size="md" />
<Divider />
<Divider orientation="vertical" />
<Logo />            // símbolo + texto
<Logo wordmarkOnly /> // só o texto (usado no cabeçalho)
<Logo markOnly />    // só o símbolo`} previewClassName="!grid">
          <div className="flex flex-wrap items-center gap-4">
            <Icon icon={Package} size="md" />
            <Icon icon={Trash2} size="md" className="text-tone-danger-fg" />
            <Divider orientation="vertical" className="h-6" />
            <Logo />
            <Divider orientation="vertical" className="h-6" />
            <Logo wordmarkOnly />
            <Divider orientation="vertical" className="h-6" />
            <Logo markOnly />
          </div>
          <Divider />
          <Text variant="small" tone="muted">A marca é provisória: substitua o SVG em <code className="font-mono">atoms/Logo.tsx</code> pelo logotipo oficial.</Text>
        </Specimen>
      </SubSection>
    </DocSection>
  )
}
