import { Badge, Heading, Text } from '@/design-system'
import { usePageTitle } from '@/lib/usePageTitle'
import { DocNav, type DocNavItem } from './docs/DocNav'
import { AtomsSection } from './sections/AtomsSection'
import { CellsSection } from './sections/CellsSection'
import { FoundationsSection } from './sections/FoundationsSection'
import { GuidelinesSection } from './sections/GuidelinesSection'
import { IntroSection } from './sections/IntroSection'
import { MoleculesSection } from './sections/MoleculesSection'
import { OrganismsSection } from './sections/OrganismsSection'
import { TemplatesSection } from './sections/TemplatesSection'

const nav: DocNavItem[] = [
  { id: 'introducao', label: 'Introdução' },
  { id: 'fundamentos', label: 'Fundamentos' },
  { id: 'atomos', label: 'Átomos' },
  { id: 'celulas', label: 'Células' },
  { id: 'moleculas', label: 'Moléculas' },
  { id: 'organismos', label: 'Organismos' },
  { id: 'templates', label: 'Templates e páginas' },
  { id: 'diretrizes', label: 'Diretrizes' },
]

/** Documentação viva do Design System: tudo aqui é renderizado com os próprios componentes. */
export function DesignSystemPage() {
  usePageTitle('Design System')
  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <Heading level={2} size="2xl">Design System</Heading>
        <Text tone="muted" className="max-w-prose text-pretty">
          Biblioteca de componentes do sistema de cadastro de produtos, organizada em Atomic Design. Tudo nesta página é interativo: use o tema, o teclado e a janela do navegador para testar cada peça.
        </Text>
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">Atomic Design</Badge>
          <Badge tone="success">WCAG 2.2 AA</Badge>
          <Badge tone="neutral">Claro e escuro</Badge>
          <Badge tone="neutral">pt-BR</Badge>
        </div>
      </div>
      <DocNav items={nav} />
      <div className="grid gap-20">
        <IntroSection />
        <FoundationsSection />
        <AtomsSection />
        <CellsSection />
        <MoleculesSection />
        <OrganismsSection />
        <TemplatesSection />
        <GuidelinesSection />
      </div>
    </div>
  )
}
