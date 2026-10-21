import { Link as RouterLink } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, Heading, Link, Text } from '@/design-system'
import { DocSection, SubSection } from '../docs/DocSection'
import { Specimen } from '../docs/Specimen'
import { Wireframe } from '../docs/Wireframe'

export function TemplatesSection() {
  return (
    <DocSection
      id="templates"
      eyebrow="Níveis 5 e 6"
      title="Templates e Páginas"
      description="Templates definem onde cada coisa fica; páginas colocam conteúdo e regras de negócio dentro deles. Uma nova tela quase nunca precisa de CSS: escolhe-se o template e preenchem-se os slots."
    >
      <SubSection title="Templates" description="Duas estruturas cobrem o sistema: a moldura global e o layout de configurações. Eles não conhecem dados — só layout, responsividade e acessibilidade (por exemplo, o link “Pular para o conteúdo” do AppShell).">
        <div className="grid gap-8 lg:grid-cols-2">
          <Specimen title="AppShell" composedOf={['AppHeader', 'SegmentedNav', 'CommandPalette']} description="Moldura global, sem menu lateral: cabeçalho enxuto (marca, busca centralizada, tema, usuário) e, acima do conteúdo de toda página, o toggle de navegação, com a ação da página (`navActions`, ex.: “Novo produto”) à direita na mesma linha. A busca global abre com Ctrl/⌘ + K." code={`<AppShell nav={mainNav} navActions={<Button>Novo produto</Button>} user={user} userMenu={…} search={{ groups, onSearchChange }} linkAs={NavLink} hrefProp="to">
  <Outlet />
</AppShell>`} previewClassName="!justify-center bg-canvas">
            <Wireframe kind="app-shell" />
          </Specimen>
          <Specimen title="SettingsLayout" composedOf={['PageHeader', 'NavItem']} description="Título e abas horizontais de seções (rolam no celular). Sem menu lateral." code={`<SettingsLayout items={settingsItems} linkAs={NavLink} hrefProp="to">
  <Outlet />
</SettingsLayout>`} previewClassName="!justify-center bg-canvas">
            <Wireframe kind="settings" />
          </Specimen>
        </div>
      </SubSection>

      <SubSection title="Páginas reais do sistema" description="O sistema é construído página a página. Início, Produtos e a página do produto estão prontas; Conexões e Novo produto estão em branco.">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { to: '/', title: 'Início', text: 'Dashboard de indicadores do catálogo (o botão “Novo produto” fica na linha do toggle).' },
            { to: '/produtos', title: 'Produtos', text: 'Tabela do catálogo com foto, SKU, título, NCM, EAN e departamento. É daqui, ou da busca, que se chega ao produto.' },
            { to: '/produtos/p1', title: 'Página do produto', text: 'Sem item de menu: acessada pela lista ou pela busca global. Abas por tipo de informação, leitura e edição.' },
            { to: '/conexoes', title: 'Conexões', text: 'Em branco. Acessível pelo menu do usuário (ícone de perfil).' },
            { to: '/configuracoes', title: 'Configurações', text: 'Em branco, com abas (Geral e Design System). Acessível pelo menu do usuário.' },
          ].map((p) => (
            <Card key={p.to}>
              <CardContent className="grid gap-2">
                <Heading level={5} size="md">{p.title}</Heading>
                <Text tone="muted">{p.text}</Text>
                <Link asChild className="inline-flex items-center gap-1.5 justify-self-start"><RouterLink to={p.to}>Abrir página <ArrowRight aria-hidden className="size-4" /></RouterLink></Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </SubSection>
    </DocSection>
  )
}
