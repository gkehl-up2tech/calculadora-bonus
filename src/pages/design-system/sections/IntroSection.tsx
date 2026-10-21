import { ArrowRight } from 'lucide-react'
import { Alert, Badge, Heading, Icon, Text, Link, Card, CardContent } from '@/design-system'
import { DocSection, SubSection } from '../docs/DocSection'
import { cn } from '@/lib/cn'

const count = (glob: Record<string, unknown>) => Object.keys(glob).length
const counts = {
  atoms: count(import.meta.glob('../../../design-system/atoms/*.tsx', { eager: true })),
  cells: count(import.meta.glob('../../../design-system/cells/*.tsx', { eager: true })),
  molecules: count(import.meta.glob('../../../design-system/molecules/*.tsx', { eager: true })),
  organisms: count(import.meta.glob('../../../design-system/organisms/*.tsx', { eager: true })),
  templates: count(import.meta.glob('../../../design-system/templates/*.tsx', { eager: true })),
}

const levels = [
  {
    key: 'atoms',
    name: 'Átomos',
    stripe: 'bg-brand-300',
    what: 'Elementos indivisíveis: não dá para remover uma parte sem perder a função.',
    examples: 'Button, Input, Label, Badge, Checkbox',
    imports: 'Tokens e utilitários',
  },
  {
    key: 'cells',
    name: 'Células',
    stripe: 'bg-brand-500',
    what: 'Dois ou três átomos ligados por uma única relação visual. Sem estado de negócio nem comportamento próprio.',
    examples: 'IconButton, SwitchField, StatusBadge, InputGroup',
    imports: 'Átomos',
  },
  {
    key: 'molecules',
    name: 'Moléculas',
    stripe: 'bg-brand-600',
    what: 'Unidade funcional que resolve uma tarefa: tem estado, teclado, ARIA coordenada ou validação.',
    examples: 'FormField, Select, Combobox, Dialog, Pagination',
    imports: 'Átomos e células',
  },
  {
    key: 'organisms',
    name: 'Organismos',
    stripe: 'bg-brand-700',
    what: 'Seção reconhecível da interface, que reúne várias tarefas relacionadas.',
    examples: 'DataTable, AppHeader, PageHeader, FormSection',
    imports: 'Átomos, células e moléculas',
  },
  {
    key: 'templates',
    name: 'Templates',
    stripe: 'bg-brand-800',
    what: 'Estrutura de página com slots. Define onde as coisas ficam, não o que dizem.',
    examples: 'AppShell, SettingsLayout',
    imports: 'Todos os níveis abaixo',
  },
] as const

const decisions = [
  ['É um elemento único, só tokens e HTML?', 'Átomo'],
  ['Junta 2–3 átomos, sem estado nem lógica própria?', 'Célula'],
  ['Tem comportamento próprio para UMA tarefa (estado, teclado, validação, ARIA)?', 'Molécula'],
  ['É uma seção da tela, com várias tarefas ou vários componentes?', 'Organismo'],
  ['Só define a estrutura (slots) de um tipo de página?', 'Template'],
  ['É um template preenchido com dados e regras de negócio?', 'Página (em src/pages)'],
] as const

export function IntroSection() {
  return (
    <DocSection
      id="introducao"
      eyebrow="Visão geral"
      title="Um vocabulário único para construir a interface"
      description="O Design System garante que qualquer tela do sistema de cadastro de produtos — fiscal e vendas — seja montada com as mesmas peças, na mesma ordem de decisão, com a mesma qualidade de acessibilidade e movimento."
    >
      <SubSection
        title="Atomic Design"
        description={
          <>
            Metodologia de Brad Frost: a interface é composta de partes pequenas que se combinam em partes maiores, como átomos formam moléculas e moléculas formam organismos. A fonte original define cinco níveis; aqui adicionamos um sexto, as <strong>células</strong> (explicado abaixo).
          </>
        }
      >
        <ol className="grid gap-4 sm:grid-cols-2" aria-label="Níveis do sistema">
          {levels.map((l, i) => (
            <li key={l.key}>
              <Card className="h-full overflow-hidden">
                <div className={cn('h-1.5', l.stripe)} aria-hidden />
                <CardContent className="grid gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <Heading level={5} size="lg">{i + 1}. {l.name}</Heading>
                    <Badge tone="brand">{counts[l.key]} {counts[l.key] === 1 ? 'arquivo' : 'arquivos'}</Badge>
                  </div>
                  <Text tone="muted">{l.what}</Text>
                  <dl className="grid gap-1.5 text-sm">
                    <div className="flex gap-2"><dt className="shrink-0 font-semibold">Exemplos:</dt><dd className="text-fg-muted">{l.examples}</dd></div>
                    <div className="flex gap-2"><dt className="shrink-0 font-semibold">Pode usar:</dt><dd className="text-fg-muted">{l.imports}</dd></div>
                  </dl>
                </CardContent>
              </Card>
            </li>
          ))}
          <li>
            <Card className="h-full overflow-hidden">
              <div className="h-1.5 bg-brand-800" aria-hidden />
              <CardContent className="grid gap-3">
                <div className="flex items-center justify-between gap-2">
                  <Heading level={5} size="lg">6. Páginas</Heading>
                  <Badge tone="neutral">src/pages</Badge>
                </div>
                <Text tone="muted">Templates preenchidos com conteúdo real, dados e regras de negócio. Ficam fora do Design System.</Text>
                <dl className="grid gap-1.5 text-sm">
                  <div className="flex gap-2"><dt className="shrink-0 font-semibold">Exemplos:</dt><dd className="text-fg-muted">Início, Configurações, Cadastro de produto</dd></div>
                  <div className="flex gap-2"><dt className="shrink-0 font-semibold">Pode usar:</dt><dd className="text-fg-muted">Tudo</dd></div>
                </dl>
              </CardContent>
            </Card>
          </li>
        </ol>
      </SubSection>

      <SubSection title="Regra de dependência" description="Cada camada só importa das camadas abaixo dela. Importar “para cima” quebra a hierarquia — o ESLint bloqueia isso (npm run lint).">
        <div className="flex flex-wrap items-center gap-2" aria-label="Ordem das camadas">
          {['Tokens e lib', 'Átomos', 'Células', 'Moléculas', 'Organismos', 'Templates', 'Páginas'].map((name, i, all) => (
            <div key={name} className="flex items-center gap-2">
              <Badge tone={i === 0 ? 'neutral' : 'brand'} size="md">{name}</Badge>
              {i < all.length - 1 ? <Icon icon={ArrowRight} size="sm" className="text-fg-subtle" /> : null}
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Em qual nível fica meu componente?" description="Responda na ordem. A primeira pergunta com “sim” define o nível.">
        <div className="overflow-hidden rounded-lg bg-surface shadow-border">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Guia de decisão do nível do componente</caption>
            <thead className="bg-subtle">
              <tr>
                <th scope="col" className="h-10 w-12 px-3 text-xs font-semibold text-fg-muted">#</th>
                <th scope="col" className="h-10 px-3 text-xs font-semibold text-fg-muted">Pergunta</th>
                <th scope="col" className="h-10 px-3 text-xs font-semibold text-fg-muted">Nível</th>
              </tr>
            </thead>
            <tbody>
              {decisions.map(([q, level], i) => (
                <tr key={q} className="border-t border-line-subtle">
                  <td className="px-3 py-3 text-fg-subtle tabular-nums">{i + 1}</td>
                  <td className="px-3 py-3">{q}</td>
                  <td className="px-3 py-3"><Badge tone="brand">{level}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SubSection>

      <Alert tone="brand" title="Por que existe o nível “Células”?">
        Na metodologia original, qualquer composição simples já é uma molécula. Na prática isso mistura coisas muito diferentes: um <em>checkbox com rótulo</em> (só layout) e um <em>Select</em> (estado, teclado, lista flutuante) não deveriam ter o mesmo peso. As células separam as composições puramente visuais das unidades com comportamento — o que deixa a pergunta “onde isso fica?” respondível. É uma extensão deliberada do Atomic Design, e os demais níveis seguem a definição de{' '}
        <Link href="https://atomicdesign.bradfrost.com/chapter-2/" target="_blank" rel="noreferrer">Brad Frost</Link>.
      </Alert>
    </DocSection>
  )
}
