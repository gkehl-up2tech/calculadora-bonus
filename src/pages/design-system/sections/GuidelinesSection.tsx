import { Alert, Badge, Card, CardContent, Heading, Link, Text } from '@/design-system'
import { DocSection, SubSection } from '../docs/DocSection'
import { ScrollRegion } from '../docs/ScrollRegion'

const wcag = [
  ['1.4.3 · 1.4.11', 'Contraste', 'Texto ≥ 4,5:1; bordas de controles e foco ≥ 3:1. Os pares de tokens são validados por script em ambos os temas.', 'npm run check:contrast'],
  ['1.4.1', 'Uso de cor', 'Status e erros sempre trazem texto ou ícone junto (StatusBadge, FieldMessage, Alert).', ''],
  ['1.4.10', 'Reflow', 'Layouts responsivos até 320 px; tabelas rolam na horizontal em vez de quebrar a página.', ''],
  ['2.1.1 · 2.1.2', 'Teclado', 'Todos os controles funcionam por teclado; foco preso em diálogos e liberado com Esc (Radix).', ''],
  ['2.4.1', 'Pular blocos', 'Link “Pular para o conteúdo” é o primeiro item focável do AppShell.', ''],
  ['2.4.7 · 2.4.13', 'Foco visível', 'Contorno de 2 px com afastamento de 2 px, cor com ≥ 3:1, em todo elemento focável.', ''],
  ['2.4.11', 'Foco não obscurecido', 'scroll-padding reserva espaço para o cabeçalho fixo, para o foco nunca ficar escondido.', ''],
  ['2.5.7', 'Arrastar', 'Nenhuma função depende de arrastar; tudo tem alternativa por clique.', ''],
  ['2.5.8', 'Tamanho do alvo', 'Controles ≥ 32 px (44 px em telas de toque). Checkbox, radio e switch ampliam a área de toque.', ''],
  ['3.3.1 · 3.3.3', 'Erros', 'FormField liga a mensagem ao campo (aria-describedby, aria-invalid); erros são anunciados (role=alert).', ''],
  ['3.3.7', 'Entrada redundante', 'Regra para as páginas: não peça de novo o que já foi informado no mesmo fluxo.', ''],
  ['4.1.2', 'Nome, função e valor', 'IconButton exige label no tipo; primitivos Radix expõem os papéis e estados ARIA corretos.', ''],
] as const

const refs = [
  ['Atomic Design — Brad Frost', 'https://atomicdesign.bradfrost.com/chapter-2/', 'Definição dos níveis: átomos, moléculas, organismos, templates e páginas.'],
  ['WCAG 2.2: o que há de novo (W3C)', 'https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/', 'Alvo mínimo de 24 px, foco não obscurecido, arrastar, entrada redundante.'],
  ['Data table — Carbon Design System', 'https://carbondesignsystem.com/components/data-table/usage/', 'Densidades de linha, seleção, ordenação em três estados, barra de ações em lote.'],
  ['Espaço, grids e layout — designsystems.com', 'https://www.designsystems.com/space-grids-and-layouts/', 'Escala de 4/8 pt e abordagens de layout.'],
  ['Nomes de design tokens — Netguru', 'https://www.netguru.com/blog/design-token-naming-best-practices', 'Três camadas e nomes por função, não por aparência.'],
  ['Validação de GTIN — Nota Técnica 2017.001 (GS1 Brasil)', 'https://www.gs1br.org/EM2018/sefaz/nt12/NT_2017_001_v1%2020_Valida%c3%a7%c3%b5es_do_GTIN.pdf', 'Regras de GTIN usadas nos campos cEAN/cEANTrib da NF-e.'],
  ['Skills de design e animação — Emil Kowalski', 'https://github.com/emilkowalski/skills', 'Curvas, durações e detalhes de interação aplicados ao sistema.'],
  ['Radix UI · cmdk · Sonner · TanStack Table', 'https://www.radix-ui.com/', 'Primitivos acessíveis usados nas moléculas e organismos.'],
] as const

const tree = `src/
├─ styles/
│  ├─ tokens.css          ← primitivos, semânticos e utilitários
│  └─ base.css            ← reset, foco, toque, movimento reduzido
├─ lib/                   ← cn, tema, máscaras, formatação (sem UI)
├─ design-system/
│  ├─ foundations/        ← mapas de tons e classes de overlays
│  ├─ atoms/              ← Button, Input, Badge…
│  ├─ cells/              ← IconButton, SwitchField, InputGroup…
│  ├─ molecules/          ← FormField, Select, Dialog…
│  ├─ organisms/          ← DataTable, AppHeader, PageHeader…
│  └─ templates/          ← AppShell, SettingsLayout
├─ app/                   ← rotas, navegação, layout da aplicação
└─ pages/                 ← páginas (regras de negócio e dados)`

export function GuidelinesSection() {
  return (
    <DocSection
      id="diretrizes"
      eyebrow="Governança"
      title="Diretrizes"
      description="Regras curtas que mantêm o sistema consistente conforme ele cresce."
    >
      <SubSection title="Acessibilidade — WCAG 2.2 AA" description="Meta do sistema inteiro. Acessibilidade é comportamento dos componentes: quem usa o componente certo herda tudo isso.">
        <ScrollRegion label="Critérios WCAG 2.2">
          <table className="w-full min-w-2xl border-collapse text-left text-sm">
            <caption className="sr-only">Critérios WCAG 2.2 e como o sistema os atende</caption>
            <thead className="bg-subtle">
              <tr>{['Critério', 'Tema', 'Como o sistema atende'].map((h) => <th key={h} scope="col" className="h-10 px-3 text-xs font-semibold text-fg-muted">{h}</th>)}</tr>
            </thead>
            <tbody>
              {wcag.map(([c, t, d, cmd]) => (
                <tr key={c} className="border-t border-line-subtle align-top">
                  <td className="px-3 py-2.5 font-mono text-[0.8125rem] whitespace-nowrap">{c}</td>
                  <td className="px-3 py-2.5 font-medium whitespace-nowrap">{t}</td>
                  <td className="px-3 py-2.5 text-fg-muted">{d} {cmd ? <code className="ml-1 rounded-xs bg-subtle px-1.5 py-0.5 font-mono text-xs text-fg">{cmd}</code> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
        <Alert tone="warning" title="Automação não basta">
          Ferramentas automáticas detectam só uma fração dos problemas de acessibilidade. Antes de publicar uma tela nova, navegue só pelo teclado, aumente o zoom para 200% e teste com um leitor de tela.
        </Alert>
      </SubSection>

      <SubSection title="Como construir uma tela">
        <ol className="grid gap-3 text-sm">
          {[
            ['Escolha o template', 'AppShell (toda página) e SettingsLayout (abas de configuração). Se nenhum serve, converse antes de criar outro.'],
            ['Monte com o que existe', 'Procure no catálogo acima. Campos sempre dentro de FormField; ações em lote na DataTable; mensagens em Alert ou toast.'],
            ['Use só tokens', 'Cores semânticas (bg-surface, text-fg-muted), espaçamentos da escala, raios e sombras do sistema. Nada de hex, px soltos ou z-index numérico.'],
            ['Cuide dos estados', 'Vazio, carregando, erro, desabilitado e “dados extremos” (nome muito longo, zero itens, milhares de itens).'],
            ['Texto em português, sem jargão', 'Frases com inicial maiúscula só no começo, verbo no infinitivo nos botões (“Salvar”, “Excluir”), mensagens de erro que dizem como resolver.'],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-3">
              <Badge tone="brand" className="mt-0.5 size-6 shrink-0 justify-center !px-0">{i + 1}</Badge>
              <div><p className="font-semibold">{t}</p><p className="text-fg-muted">{d}</p></div>
            </li>
          ))}
        </ol>
      </SubSection>

      <SubSection title="Como criar ou alterar um componente">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="grid gap-3">
              <Heading level={5} size="md">Checklist de um componente novo</Heading>
              <ol className="grid list-decimal gap-1.5 pl-5 text-sm text-fg-muted marker:font-semibold marker:text-fg">
                <li>Defina o nível pelo guia de decisão (Introdução).</li>
                <li>Crie <code className="font-mono text-xs">NomeDoComponente.tsx</code> na pasta do nível e exporte no <code className="font-mono text-xs">index.ts</code>.</li>
                <li>Aceite as props nativas do elemento (ComponentProps) e junte classes com <code className="font-mono text-xs">cn()</code>, deixando <code className="font-mono text-xs">className</code> por último.</li>
                <li>Use só tokens semânticos e variantes com <code className="font-mono text-xs">cva</code>.</li>
                <li>Cubra: foco visível, teclado, nome acessível, estados (hover, active, disabled, invalid, loading).</li>
                <li>Animações: só <code className="font-mono text-xs">transform</code> e <code className="font-mono text-xs">opacity</code>, ≤ 300 ms, <code className="font-mono text-xs">ease-out</code>.</li>
                <li>Documente nesta página: demonstração viva, código e a linha “composto por”.</li>
              </ol>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-3">
              <Heading level={5} size="md">Estrutura de pastas</Heading>
              <pre tabIndex={0} aria-label="Estrutura de pastas" className="overflow-x-auto rounded-md bg-subtle p-3 font-mono text-xs leading-5 text-fg">{tree}</pre>
            </CardContent>
          </Card>
        </div>
      </SubSection>

      <SubSection title="Como alterar tokens">
        <Text tone="muted" className="max-w-prose">
          Edite <code className="font-mono text-[0.8125rem]">src/styles/tokens.css</code>. Para mudar um papel (ex.: a cor da ação primária), altere o token semântico nos dois temas; para mudar a identidade, altere a escala primitiva. Depois rode <code className="font-mono text-[0.8125rem]">npm run check:contrast</code> — ele falha se algum par de cores deixar de atender ao AA.
        </Text>
      </SubSection>

      <SubSection title="Fora do escopo desta versão" description="Ficam para quando o primeiro módulo pedir — criar antes disso é adivinhar requisitos.">
        <ul className="flex flex-wrap gap-2">
          {['DatePicker e intervalo de datas', 'Upload de arquivos e galeria de imagens', 'Editor de texto rico', 'Gráficos', 'Árvore de categorias', 'Storybook e testes visuais automatizados', 'Internacionalização (hoje apenas pt-BR)'].map((x) => (
            <li key={x}><Badge tone="neutral">{x}</Badge></li>
          ))}
        </ul>
      </SubSection>

      <SubSection title="Referências">
        <ul className="grid gap-3 md:grid-cols-2">
          {refs.map(([t, href, d]) => (
            <li key={href} className="rounded-lg bg-surface p-4 shadow-border">
              <Link href={href} target="_blank" rel="noreferrer">{t}</Link>
              <Text variant="small" tone="muted" className="mt-1">{d}</Text>
            </li>
          ))}
        </ul>
      </SubSection>
    </DocSection>
  )
}
