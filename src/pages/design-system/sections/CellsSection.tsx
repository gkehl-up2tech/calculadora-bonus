import { useState } from 'react'
import { Home, Package, Pencil, Percent, Search, Settings, Trash2, Weight, X } from 'lucide-react'
import { Badge, Button, Text } from '@/design-system'
import {
  Chip, FieldLabel, FieldMessage, IconButton, InputGroup, KeyValue, NavItem, Persona,
  ProgressField, ShortcutHint, StatusBadge, SwitchField, Tooltip,
} from '@/design-system'
import { DocSection, SubSection } from '../docs/DocSection'
import { Specimen } from '../docs/Specimen'

function ChipsDemo() {
  const [chips, setChips] = useState(['Eletrônicos', 'Ativo', 'Estoque baixo', 'Importado'])
  return (
    <>
      {chips.map((c) => <Chip key={c} onRemove={() => setChips((l) => l.filter((x) => x !== c))}>{c}</Chip>)}
      <Chip>Somente leitura</Chip>
      {chips.length < 4 ? <Button size="sm" variant="ghost" onClick={() => setChips(['Eletrônicos', 'Ativo', 'Estoque baixo', 'Importado'])}>Restaurar</Button> : null}
    </>
  )
}

export function CellsSection() {
  const [cleared, setCleared] = useState('Parafuso')
  return (
    <DocSection
      id="celulas"
      eyebrow="Nível 2"
      title="Células"
      description="Dois ou três átomos ligados por uma relação visual fixa. Não guardam estado de negócio, não têm lógica própria: só apresentam. Se precisar de estado, teclado ou validação, é molécula."
    >
      <SubSection title="Botões e rótulos">
        <Specimen
          title="IconButton"
          composedOf={['Button', 'Icon']}
          description="Botão quadrado só com ícone. O nome acessível (label) é obrigatório no tipo — não há como esquecê-lo. Combine com Tooltip para mostrar o nome ao passar o mouse."
          code={`<IconButton icon={Pencil} label="Editar produto" />

<Tooltip content="Excluir" shortcut={['Del']}>
  <IconButton icon={Trash2} label="Excluir produto" variant="danger" />
</Tooltip>`}
        >
          <IconButton icon={Pencil} label="Editar produto" />
          <IconButton icon={Settings} label="Configurações" variant="secondary" />
          <IconButton icon={Search} label="Buscar" variant="primary" size="sm" />
          <IconButton icon={Search} label="Buscar" variant="primary" size="lg" />
          <Tooltip content="Excluir" shortcut={['Del']}><IconButton icon={Trash2} label="Excluir produto" variant="danger" /></Tooltip>
        </Specimen>
        <Specimen
          title="FieldLabel e FieldMessage"
          composedOf={['Label', 'Text', 'Icon']}
          description="Rótulo com marcador de obrigatório (lido como “obrigatório” por leitores de tela) e mensagens de apoio. Erros usam role=alert para serem anunciados."
          code={`<FieldLabel required>Nome do produto</FieldLabel>
<FieldLabel optional>Observações</FieldLabel>
<FieldMessage>Use o nome que aparece na nota fiscal.</FieldMessage>
<FieldMessage kind="error">Informe o nome do produto.</FieldMessage>`}
          previewClassName="!grid sm:grid-cols-2"
        >
          <div className="grid gap-2">
            <FieldLabel required>Nome do produto</FieldLabel>
            <FieldLabel optional>Observações</FieldLabel>
            <FieldLabel>Sem marcador</FieldLabel>
          </div>
          <div className="grid gap-2">
            <FieldMessage>Use o nome que aparece na nota fiscal.</FieldMessage>
            <FieldMessage kind="error">Informe o nome do produto.</FieldMessage>
            <FieldMessage kind="success">GTIN válido.</FieldMessage>
            <FieldMessage kind="warning">NCM sem CEST correspondente.</FieldMessage>
          </div>
        </Specimen>
      </SubSection>

      <SubSection title="Opções">
        <Specimen
          title="SwitchField"
          composedOf={['Switch', 'Label', 'Text']}
          description="O texto inteiro é clicável e a descrição é ligada ao controle (aria-describedby). O Switch fica à direita, no padrão de linhas de configuração."
          code={`<SwitchField label="Produto ativo" description="Aparece nas vendas." defaultChecked />`}
          previewClassName="!grid gap-6 md:grid-cols-2"
        >
          <SwitchField label="Produto ativo" description="Aparece nas vendas." defaultChecked />
          <SwitchField label="Exibir no catálogo" />
        </Specimen>
      </SubSection>

      <SubSection title="Status e filtros">
        <Specimen
          title="StatusBadge"
          composedOf={['Badge', 'ponto de cor']}
          description="O status é sempre dito em texto; o ponto só reforça. Nunca use apenas a cor para comunicar estado."
          code={`<StatusBadge tone="success">Ativo</StatusBadge>
<StatusBadge tone="warning">Rascunho</StatusBadge>
<StatusBadge tone="neutral">Inativo</StatusBadge>`}
        >
          <StatusBadge tone="success">Ativo</StatusBadge>
          <StatusBadge tone="warning">Rascunho</StatusBadge>
          <StatusBadge tone="neutral">Inativo</StatusBadge>
          <StatusBadge tone="danger">Bloqueado fiscalmente</StatusBadge>
          <StatusBadge tone="brand">Em revisão</StatusBadge>
        </Specimen>
        <Specimen title="Chip" composedOf={['texto', 'botão remover']} description="Filtros ativos, tags, destinatários. O botão de remover tem alvo de toque ampliado e nome acessível “Remover: …”." code={`<Chip onRemove={() => remove('Ativo')}>Ativo</Chip>`}>
          <ChipsDemo />
        </Specimen>
      </SubSection>

      <SubSection title="Campos compostos">
        <Specimen
          title="InputGroup"
          composedOf={['Input', 'Text', 'Icon', 'IconButton']}
          description="Campo com adornos: prefixos e sufixos em bloco (unidade, moeda), ícone interno e slot à direita. O grupo inteiro reage a foco, erro e desabilitado como um campo só."
          code={`<InputGroup addonStart="R$" placeholder="0,00" />
<InputGroup addonEnd="kg" inputMode="decimal" />
<InputGroup addonEnd="%" />
<InputGroup startIcon={Search} placeholder="Buscar" />`}
          previewClassName="!grid sm:grid-cols-2"
        >
          <InputGroup addonStart="R$" placeholder="0,00" aria-label="Valor" inputMode="decimal" />
          <InputGroup addonEnd="kg" placeholder="0,000" aria-label="Peso" inputMode="decimal" />
          <InputGroup addonEnd={<Percent aria-hidden className="size-4" />} placeholder="18" aria-label="Alíquota" inputMode="decimal" />
          <InputGroup startIcon={Search} placeholder="Buscar produto" aria-label="Buscar produto" />
          <InputGroup startIcon={Weight} addonEnd="g" placeholder="Peso líquido" aria-label="Peso líquido" />
          <InputGroup
            value={cleared}
            onChange={(e) => setCleared(e.target.value)}
            aria-label="Com botão de limpar"
            endSlot={cleared ? <IconButton icon={X} label="Limpar" size="sm" onClick={() => setCleared('')} /> : null}
          />
          <InputGroup addonStart="R$" invalid defaultValue="-10,00" aria-label="Valor inválido" />
          <InputGroup addonStart="R$" disabled defaultValue="100,00" aria-label="Valor desabilitado" />
        </Specimen>
      </SubSection>

      <SubSection title="Identidade e detalhes">
        <Specimen
          title="Persona e KeyValue"
          composedOf={['Avatar', 'Text', 'Icon']}
          code={`<Persona name="Maria da Silva" description="Fiscal" />
<dl><KeyValue label="NCM" mono>7318.15.00</KeyValue></dl>`}
          previewClassName="!grid gap-6 md:grid-cols-2"
        >
          <div className="grid content-start gap-3">
            <Persona name="Maria da Silva" description="Analista fiscal" />
            <Persona name="Carlos Eduardo Nogueira de Albuquerque" description="carlos.albuquerque@exemplo.com.br" size="sm" />
          </div>
          <dl className="grid content-start gap-3">
            <KeyValue label="NCM" mono>7318.15.00</KeyValue>
            <KeyValue label="Origem">0 — Nacional</KeyValue>
            <KeyValue label="CEST">{''}</KeyValue>
            <KeyValue label="Unidade" orientation="horizontal" className="border-t border-line-subtle pt-3">UN — Unidade</KeyValue>
          </dl>
        </Specimen>
        <Specimen
          title="ProgressField e ShortcutHint"
          composedOf={['ProgressBar', 'Text', 'Kbd']}
          code={`<ProgressField label="Cadastro completo" value={72} />
<ShortcutHint keys={['Ctrl', 'K']} />`}
          previewClassName="!grid gap-6 sm:grid-cols-2"
        >
          <div className="grid gap-4">
            <ProgressField label="Dados do produto" value={72} />
            <ProgressField label="Importação de produtos" value={340} max={500} valueLabel="340 de 500" tone="success" />
          </div>
          <div className="grid content-start gap-3">
            <div className="flex items-center gap-3"><Text>Buscar</Text><ShortcutHint keys={['Ctrl', 'K']} /></div>
            <div className="flex items-center gap-3"><Text>Salvar</Text><ShortcutHint keys={['Ctrl', 'S']} /></div>
            <div className="flex items-center gap-3"><Text>Fechar</Text><ShortcutHint keys={['Esc']} /></div>
          </div>
        </Specimen>
        <Specimen
          title="NavItem"
          composedOf={['Icon', 'Text', 'Badge']}
          description="Item de navegação em formato de pílula (usado nas abas de Configurações). A navegação principal usa o SegmentedNav. O estado ativo vem de aria-current=page — com o NavLink do React Router isso é automático. Aceita qualquer componente de link via as."
          code={`<NavItem as={NavLink} to="/" icon={Home} end>Início</NavItem>
<NavItem href="#" icon={Package} trailing={<Badge size="sm">12</Badge>}>Produtos</NavItem>`}
          previewClassName="!block"
        >
          <ul className="flex flex-wrap gap-1">
            <li><NavItem href="#celulas" icon={Home} active>Início</NavItem></li>
            <li><NavItem href="#celulas" icon={Package} trailing={<Badge tone="brand" size="sm">12</Badge>}>Produtos</NavItem></li>
            <li><NavItem href="#celulas" icon={Settings}>Configurações</NavItem></li>
          </ul>
        </Specimen>
      </SubSection>
    </DocSection>
  )
}
