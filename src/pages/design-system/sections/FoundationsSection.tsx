import { useState } from 'react'
import {
  Barcode, Building2, Check, DollarSign, Download, Ellipsis, FileText, Filter, Home, Info, Package, Pencil, Percent,
  Plus, RotateCcw, Search, Settings, Tag, Trash2, Upload, Users, X, AlertCircle, ChevronDown, ArrowRight,
} from 'lucide-react'
import { Badge, Button, Heading, Icon, Text, Alert, TONES, toneLabel } from '@/design-system'
import { DocSection, SubSection } from '../docs/DocSection'
import { Specimen } from '../docs/Specimen'
import { colorScales, scaleLabels, semanticGroups } from '../docs/tokens-data'
import { contrastRatio } from '../docs/contrast'
import { useCssVar } from '../docs/useCssVar'
import { cn } from '@/lib/cn'
import { ScrollRegion } from '../docs/ScrollRegion'

function Swatch({ token, step, hex }: { token: string; step: string; hex: string }) {
  const light = (contrastRatio(hex, '#000000') ?? 0) > (contrastRatio(hex, '#ffffff') ?? 0)
  return (
    <li className="min-w-0">
      <div
        className={cn('flex h-16 items-end rounded-md p-1.5 shadow-border', light ? 'text-black' : 'text-white')}
        style={{ background: `var(${token})` }}
      >
        <span className="text-xs font-semibold tabular-nums">{step}</span>
      </div>
      <p className="mt-1 truncate font-mono text-[0.6875rem] text-fg-muted uppercase">{hex}</p>
    </li>
  )
}

function SemanticRow({ token, util, usage, against, min }: { token: string; util: string; usage: string; against?: string; min?: number }) {
  const value = useCssVar(token)
  const bg = useCssVar(against ?? '--bg-surface')
  const ratio = against ? contrastRatio(value, bg) : null
  const ok = ratio !== null && min !== undefined && ratio >= min
  return (
    <tr className="border-t border-line-subtle align-middle">
      <td className="px-3 py-2.5">
        <span aria-hidden className="inline-block size-7 rounded-md shadow-border" style={{ background: `var(${token})` }} />
      </td>
      <td className="px-3 py-2.5">
        <code className="font-mono text-[0.8125rem] font-semibold whitespace-nowrap">{token}</code>
        <p className="font-mono text-xs whitespace-nowrap text-fg-muted">{util}</p>
      </td>
      <td className="px-3 py-2.5 text-fg-muted">{usage}</td>
      <td className="px-3 py-2.5 font-mono text-xs text-fg-muted uppercase">{value || '—'}</td>
      <td className="px-3 py-2.5">
        {ratio !== null ? (
          <Badge tone={ok ? 'success' : 'danger'} size="sm">{ratio.toFixed(1)}:1 {ok ? '✓' : '✗'}</Badge>
        ) : (
          <span className="text-fg-subtle">—</span>
        )}
      </td>
    </tr>
  )
}

const spacing = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16]
const radii = [
  ['rounded-xs', '4px', 'Checkbox, kbd'],
  ['rounded-sm', '6px', 'Itens de menu'],
  ['rounded-md', '8px', 'Botões, campos'],
  ['rounded-lg', '12px', 'Cards, popovers'],
  ['rounded-xl', '16px', 'Diálogos'],
  ['rounded-full', '9999px', 'Badges, avatares'],
] as const
const shadows = [
  ['shadow-border', 'Anel translúcido de 1px'],
  ['shadow-xs', 'Elevação mínima'],
  ['shadow-sm', 'Thumb do switch'],
  ['shadow-card', 'Cards, tabelas'],
  ['shadow-md', 'Elevação média'],
  ['shadow-popover', 'Menus, diálogos'],
] as const

const icons = [
  [Home, 'Home'], [Settings, 'Settings'], [Search, 'Search'], [Plus, 'Plus'], [Pencil, 'Pencil'], [Trash2, 'Trash2'],
  [Download, 'Download'], [Upload, 'Upload'], [Filter, 'Filter'], [Ellipsis, 'Ellipsis'], [Check, 'Check'], [X, 'X'],
  [AlertCircle, 'AlertCircle'], [Info, 'Info'], [ChevronDown, 'ChevronDown'], [ArrowRight, 'ArrowRight'], [Package, 'Package'],
  [Tag, 'Tag'], [Barcode, 'Barcode'], [FileText, 'FileText'], [Percent, 'Percent'], [DollarSign, 'DollarSign'],
  [Building2, 'Building2'], [Users, 'Users'],
] as const

const curves = [
  { name: 'ease-out', value: 'cubic-bezier(0.23, 1, 0.32, 1)', css: 'var(--ease-out)', note: 'Padrão. Entradas, saídas e feedback: começa rápido e responde na hora.', good: true },
  { name: 'ease-in-out', value: 'cubic-bezier(0.77, 0, 0.175, 1)', css: 'var(--ease-in-out)', note: 'Elementos que já estão na tela e se movem ou se transformam.', good: true },
  { name: 'ease-drawer', value: 'cubic-bezier(0.32, 0.72, 0, 1)', css: 'var(--ease-drawer)', note: 'Gavetas e painéis laterais (Sheet).', good: true },
  { name: 'ease-in (evite)', value: 'cubic-bezier(0.42, 0, 1, 1)', css: 'cubic-bezier(0.42, 0, 1, 1)', note: 'Começa devagar: a interface parece travada justamente quando o usuário está olhando.', good: false },
]

function EasingDemo() {
  const [run, setRun] = useState(false)
  const [key, setKey] = useState(0)
  return (
    <div className="grid w-full gap-4">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="secondary"
          leadingIcon={<RotateCcw aria-hidden />}
          onClick={() => {
            setRun(false)
            setKey((k) => k + 1)
            // Dois frames para o navegador registrar a posição inicial antes de animar.
            requestAnimationFrame(() => requestAnimationFrame(() => setRun(true)))
          }}
        >
          Reproduzir
        </Button>
        <Text variant="small" tone="muted">Duração de 600 ms só para a demonstração — na interface, use ≤ 300 ms.</Text>
      </div>
      <ul key={key} className="grid gap-3">
        {curves.map((c) => (
          <li key={c.name} className="grid gap-1.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center">
            <div>
              <code className="font-mono text-[0.8125rem] font-semibold">{c.name}</code>
              <p className="font-mono text-[0.6875rem] text-fg-subtle">{c.value}</p>
            </div>
            <div className="@container relative h-8 rounded-full bg-subtle">
              <span
                aria-hidden
                className={cn('absolute top-1 left-1 size-6 rounded-full motion-reduce:transition-none', c.good ? 'bg-primary' : 'bg-tone-danger-solid')}
                style={{
                  // 100cqw = largura da trilha; só `transform` anima (compositor, sem layout).
                  transform: run ? 'translateX(calc(100cqw - 2rem))' : 'translateX(0)',
                  transition: 'transform 600ms',
                  transitionTimingFunction: c.css,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      <ul className="grid gap-1 text-sm text-fg-muted">
        {curves.map((c) => <li key={c.name}><strong className="font-semibold text-fg">{c.name}:</strong> {c.note}</li>)}
      </ul>
    </div>
  )
}

export function FoundationsSection() {
  return (
    <DocSection
      id="fundamentos"
      eyebrow="Fundamentos"
      title="Tokens: o DNA visual"
      description="Cores, tipografia, espaçamento, raios, sombras e movimento vivem em src/styles/tokens.css, em três camadas. Mudar um token muda o sistema inteiro — inclusive o tema escuro."
    >
      <SubSection
        title="Como os tokens se organizam"
        description="Primitivos guardam valores brutos; semânticos dão papéis; utilitários expõem os papéis ao Tailwind. Componentes só usam a terceira camada."
      >
        <Specimen
          title="Três camadas"
          code={`/* 1. Primitivo  (valor bruto)   */ --color-brand-600: #2568a8;
/* 2. Semântico  (papel)         */ --primary: var(--color-brand-600);      /* e no escuro, outro valor */
/* 3. Utilitário (Tailwind)      */ --color-primary: var(--primary);        /* → bg-primary, text-primary */

<button className="bg-primary text-on-primary" />   // ✓ semântico
<button className="bg-brand-600 text-white" />      // ✗ primitivo em componente`}
          previewClassName="!block"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['1 · Primitivo', 'brand-600', 'Valor bruto. Só existe em tokens.css e na documentação de cores.'],
              ['2 · Semântico', 'primary', 'Papel na interface. Troca de valor entre claro e escuro.'],
              ['3 · Utilitário', 'bg-primary', 'Classe usada nos componentes. Nunca bg-brand-600.'],
            ].map(([t, n, d]) => (
              <div key={t} className="rounded-lg bg-subtle p-4">
                <Text variant="overline">{t}</Text>
                <Text as="code" variant="code" weight="semibold" className="mt-1 block">{n}</Text>
                <Text variant="small" tone="muted" className="mt-1">{d}</Text>
              </div>
            ))}
          </div>
        </Specimen>
      </SubSection>

      <SubSection id="cores" title="Cores primitivas" description="Escalas lidas diretamente de tokens.css. O 800 do brand é o azul-marinho do logotipo; o 500 foi ajustado em um tom para o texto branco atingir 4,5:1.">
        <div className="grid gap-6">
          {Object.entries(colorScales).map(([family, steps]) => (
            <div key={family} className="grid gap-2">
              <Heading level={5} size="md">{scaleLabels[family] ?? family}</Heading>
              <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-[repeat(auto-fill,minmax(5rem,1fr))]">
                {steps.map((s) => <Swatch key={s.token} {...s} />)}
              </ul>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Cores semânticas" description="O que os componentes realmente usam. A coluna de contraste é calculada ao vivo para o tema atual — alterne o tema no cabeçalho e veja os valores mudarem.">
        <div className="grid gap-6">
          {semanticGroups.map((g) => (
            <div key={g.title} className="grid gap-2">
              <div>
                <Heading level={5} size="md">{g.title}</Heading>
                <Text variant="small" tone="muted">{g.description}</Text>
              </div>
              <ScrollRegion label={`Tokens de ${g.title.toLowerCase()}`}>
                <table className="w-full min-w-2xl border-collapse text-left text-sm">
                  <thead className="bg-subtle">
                    <tr>
                      <th scope="col" className="h-10 w-14 px-3 text-xs font-semibold text-fg-muted"><span className="sr-only">Amostra</span></th>
                      {['Token', 'Uso', 'Valor atual', 'Contraste'].map((h) => <th key={h} scope="col" className="h-10 px-3 text-xs font-semibold whitespace-nowrap text-fg-muted">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>{g.tokens.map((t) => <SemanticRow key={t.token} {...t} />)}</tbody>
                </table>
              </ScrollRegion>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Tons de feedback" description="Seis tons × três aparências. Cada tom tem cinco papéis (soft, line, fg, solid, on). A cor nunca é o único sinal: sempre há texto ou ícone junto.">
        <Specimen
          title="Tom × aparência"
          code={`<Badge tone="success">Ativo</Badge>
<Badge tone="danger" appearance="solid">Bloqueado</Badge>
<Badge tone="warning" appearance="outline">Pendente</Badge>`}
          previewClassName="!block overflow-x-auto"
        >
          <table className="w-full min-w-md border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs text-fg-muted">
                <th scope="col" className="pb-2 font-semibold">Tom</th>
                {['soft', 'solid', 'outline'].map((a) => <th key={a} scope="col" className="pb-2 font-semibold">{a}</th>)}
              </tr>
            </thead>
            <tbody>
              {TONES.map((t) => (
                <tr key={t} className="border-t border-line-subtle">
                  <th scope="row" className="py-2.5 pr-3 text-left font-medium">{toneLabel[t]}</th>
                  {(['soft', 'solid', 'outline'] as const).map((a) => (
                    <td key={a} className="py-2.5 pr-3"><Badge tone={t} appearance={a}>{toneLabel[t]}</Badge></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Specimen>
      </SubSection>

      <SubSection id="tipografia" title="Tipografia" description="Montserrat Variable (a fonte da marca), escala de 12 a 36 px. Texto de interface em 14 px; campos sobem para 16 px em telas de toque para o iOS não dar zoom.">
        <Specimen
          title="Títulos — Heading"
          description="O nível semântico (h1–h6) é independente do tamanho visual: escolha o nível pela estrutura do documento e o tamanho pelo peso visual."
          code={`<Heading level={1} size="2xl">Produtos</Heading>
<Heading level={2} size="md">Dados fiscais</Heading>`}
          previewClassName="!grid"
        >
          {(['display', '3xl', '2xl', 'xl', 'lg', 'md', 'sm'] as const).map((s) => (
            <div key={s} className="grid items-baseline gap-1 border-b border-line-subtle pb-3 last:border-0 last:pb-0 sm:grid-cols-[6rem_minmax(0,1fr)]">
              <code className="font-mono text-xs text-fg-muted">size="{s}"</code>
              <Heading size={s} level={6}>Cadastro de produtos</Heading>
            </div>
          ))}
        </Specimen>
        <Specimen
          title="Texto — Text"
          code={`<Text>Corpo (14 px)</Text>
<Text variant="lead">Introdução (16 px)</Text>
<Text variant="caption">Legenda</Text>
<Text variant="code">7318.15.00</Text>
<Text tabular>R$ 1.234,56</Text>`}
          previewClassName="!grid"
        >
          <Text variant="lead">Lead — introdução de página ou seção, 16 px.</Text>
          <Text>Body — texto padrão da interface, 14 px com entrelinha de 20 px.</Text>
          <Text variant="small" tone="muted">Small — apoio e descrições, 12 px.</Text>
          <Text variant="caption">Caption — metadados discretos.</Text>
          <Text variant="overline">Overline — rótulo de grupo</Text>
          <Text variant="code">Code — 7318.15.00 · 7891000100103</Text>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <Text weight="regular">Regular 400</Text>
            <Text weight="medium">Medium 500</Text>
            <Text weight="semibold">Semibold 600</Text>
            <Text className="font-bold">Bold 700</Text>
          </div>
          <div className="grid gap-1 rounded-md bg-subtle p-3 text-sm sm:grid-cols-2">
            <div><Text variant="small" tone="muted">Sem tabular</Text><Text className="font-sans">R$ 1.111,11 · R$ 8.888,88</Text></div>
            <div><Text variant="small" tone="muted">Com tabular (use em valores e colunas)</Text><Text tabular>R$ 1.111,11 · R$ 8.888,88</Text></div>
          </div>
        </Specimen>
      </SubSection>

      <SubSection id="espacamento" title="Espaçamento e dimensões" description="Grade de 4 px (1 unidade = 0,25 rem). Preferimos passos pares (8, 12, 16, 24…) e deixamos 4 px para ajustes finos em ícones e texto.">
        <Specimen title="Escala" code={`<div className="p-4 gap-6" />   // 16 px de padding, 24 px de espaço entre filhos`} previewClassName="!grid">
          {spacing.map((n) => (
            <div key={n} className="grid grid-cols-[3rem_3.5rem_minmax(0,1fr)] items-center gap-3 text-sm">
              <code className="font-mono text-xs font-semibold">{n}</code>
              <span className="text-xs text-fg-muted tabular-nums">{n * 4}px</span>
              <span aria-hidden className="h-3 rounded-xs bg-brand-400" style={{ width: `calc(var(--spacing) * ${n})` }} />
            </div>
          ))}
        </Specimen>
        <Specimen
          title="Altura dos controles"
          description="Botões, campos e selects usam a mesma altura por tamanho — alinham lado a lado sem ajuste. Em telas de toque (pointer: coarse) crescem automaticamente para alvos de 44 px."
          code={`<Button size="sm" />  // h-control-sm
<Button size="md" />  // h-control-md (padrão)
<Input size="lg" />   // h-control-lg`}
          previewClassName="!items-end"
        >
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <div key={s} className="grid gap-1.5">
              <Button size={s}>Tamanho {s}</Button>
              <Text variant="caption">{s === 'sm' ? '32 · toque 40' : s === 'md' ? '40 · toque 44' : '48 · toque 52'} px</Text>
            </div>
          ))}
        </Specimen>
      </SubSection>

      <SubSection title="Raios e sombras" description="Bordas de superfícies são anéis translúcidos (shadow-border / shadow-card), que se misturam a qualquer fundo. Bordas sólidas ficam para campos de formulário, onde precisam de 3:1 de contraste.">
        <Specimen title="Raios" code={`<div className="rounded-lg" />`} previewClassName="!grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {radii.map(([c, px, use]) => (
            <div key={c} className="grid gap-2">
              <div className={cn('h-16 bg-primary-soft shadow-border', c)} />
              <div><code className="font-mono text-xs font-semibold">{c}</code><p className="text-xs text-fg-muted">{px} · {use}</p></div>
            </div>
          ))}
        </Specimen>
        <Specimen title="Sombras" code={`<div className="rounded-lg bg-surface shadow-card" />`} previewClassName="!grid grid-cols-2 gap-5 bg-canvas sm:grid-cols-3">
          {shadows.map(([c, use]) => (
            <div key={c} className="grid gap-2">
              <div className={cn('h-16 rounded-lg bg-surface', c)} />
              <div><code className="font-mono text-xs font-semibold">{c}</code><p className="text-xs text-fg-muted">{use}</p></div>
            </div>
          ))}
        </Specimen>
      </SubSection>

      <SubSection id="movimento" title="Movimento" description="Movimento serve a um propósito: dar feedback, manter a continuidade espacial ou evitar mudanças bruscas. O que o usuário vê dezenas de vezes por dia não anima.">
        <Specimen title="Curvas de easing" description="As curvas nativas do CSS são fracas. Usamos três curvas customizadas e banimos ease-in em interface.">
          <EasingDemo />
        </Specimen>
        <Specimen
          title="Durações e regras"
          code={`/* Transições: só propriedades específicas, nunca "all" */
className="transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]"`}
          previewClassName="!grid"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-md border-collapse text-left text-sm">
              <thead className="text-xs text-fg-muted"><tr><th className="pb-2 font-semibold">Elemento</th><th className="pb-2 font-semibold">Duração</th><th className="pb-2 font-semibold">Observação</th></tr></thead>
              <tbody className="[&_td]:border-t [&_td]:border-line-subtle [&_td]:py-2 [&_td]:pr-3">
                <tr><td>Feedback de botão (:active)</td><td className="tabular-nums">100–160 ms</td><td className="text-fg-muted">scale(0.97)</td></tr>
                <tr><td>Tooltip</td><td className="tabular-nums">125–180 ms</td><td className="text-fg-muted">Vizinhos abrem na hora, sem animar</td></tr>
                <tr><td>Menu, select, popover</td><td className="tabular-nums">150–200 ms</td><td className="text-fg-muted">Escala a partir do gatilho (nunca de 0)</td></tr>
                <tr><td>Diálogo, gaveta</td><td className="tabular-nums">200–300 ms</td><td className="text-fg-muted">Saída mais rápida que a entrada</td></tr>
                <tr><td>Paleta de comandos, atalhos</td><td className="tabular-nums">0 ms</td><td className="text-fg-muted">Usada por teclado, dezenas de vezes ao dia</td></tr>
              </tbody>
            </table>
          </div>
          <Alert tone="neutral" title="Reduzir movimento">
            Com <code className="font-mono text-[0.8125rem]">prefers-reduced-motion</code>, escalas e deslocamentos desaparecem e ficam só as mudanças de opacidade e cor. Isso é feito nas variáveis <code className="font-mono text-[0.8125rem]">--ds-pop-from</code> e <code className="font-mono text-[0.8125rem]">--ds-slide</code>, sem código por componente.
          </Alert>
        </Specimen>
      </SubSection>

      <SubSection id="icones" title="Ícones" description="Lucide, sempre pelo átomo Icon: tamanhos do sistema, traço de 1,75 e oculto de leitores de tela, a menos que o ícone sozinho carregue significado.">
        <Specimen
          title="Tamanhos e uso"
          code={`<Icon icon={Package} size="md" />
<Icon icon={AlertCircle} label="Erro" />   // ícone com significado próprio`}
          previewClassName="!grid"
        >
          <div className="flex flex-wrap items-end gap-6">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
              <div key={s} className="grid justify-items-center gap-1.5">
                <Icon icon={Package} size={s} />
                <Text variant="caption">{s} · {{ xs: 14, sm: 16, md: 20, lg: 24, xl: 32 }[s]}px</Text>
              </div>
            ))}
          </div>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {icons.map(([I, name]) => (
              <li key={name} className="grid justify-items-center gap-1.5 rounded-md bg-subtle px-1 py-3">
                <Icon icon={I} size="md" />
                <span className="max-w-full truncate font-mono text-[0.625rem] text-fg-muted">{name}</span>
              </li>
            ))}
          </ul>
        </Specimen>
      </SubSection>

      <SubSection title="Camadas e breakpoints" description="Empilhamento e pontos de quebra seguem escalas fixas — nunca use z-index ou larguras soltas.">
        <Specimen title="Camadas (z-index)" code={`<div className="z-popover" />`} previewClassName="!grid sm:grid-cols-2">
          <ul className="grid gap-1.5 text-sm">
            {[['z-sticky', 20, 'Cabeçalho de tabela, barra de ações'], ['z-header', 30, 'Cabeçalho da aplicação'], ['z-overlay', 60, 'Fundo escurecido'], ['z-modal', 70, 'Diálogos e gavetas'], ['z-popover', 80, 'Menus, selects'], ['z-toast', 90, 'Notificações'], ['z-tooltip', 100, 'Tooltips']].map(([n, v, d]) => (
              <li key={n} className="flex items-baseline gap-3"><code className="w-24 shrink-0 font-mono text-[0.8125rem] font-semibold">{n}</code><span className="w-8 text-fg-muted tabular-nums">{v}</span><span className="text-fg-muted">{d}</span></li>
            ))}
          </ul>
          <ul className="grid gap-1.5 text-sm">
            {[['sm', 640, 'Celular grande'], ['md', 768, 'Tablet'], ['lg', 1024, 'Menu lateral fixo'], ['xl', 1280, 'Desktop'], ['2xl', 1536, 'Telas largas']].map(([n, v, d]) => (
              <li key={n} className="flex items-baseline gap-3"><code className="w-12 shrink-0 font-mono text-[0.8125rem] font-semibold">{n}:</code><span className="w-12 text-fg-muted tabular-nums">{v}px</span><span className="text-fg-muted">{d}</span></li>
            ))}
            <li className="pt-2 text-xs text-fg-muted">Capacidades, não aparelhos: <code className="font-mono">pointer-coarse:</code>, <code className="font-mono">pointer-fine:</code> e <code className="font-mono">hover:</code> (que só vale onde há mouse).</li>
          </ul>
        </Specimen>
      </SubSection>
    </DocSection>
  )
}
