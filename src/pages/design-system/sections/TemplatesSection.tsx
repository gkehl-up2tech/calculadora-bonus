import { Link as RouterLink } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, Heading, Link, Text } from '@/design-system'
import { DocSection, SubSection } from '../docs/DocSection'
import { Frame } from '../docs/Frame'
import { Specimen } from '../docs/Specimen'
import { Wireframe } from '../docs/Wireframe'
import { ProductFormExample } from '../docs/examples/ProductFormExample'
import { ProductListExample } from '../docs/examples/ProductListExample'

const pad = 'px-4 py-6 sm:px-6 lg:px-8'

export function TemplatesSection() {
  return (
    <DocSection
      id="templates"
      eyebrow="Níveis 5 e 6"
      title="Templates e Páginas"
      description="Templates definem onde cada coisa fica; páginas colocam conteúdo e regras de negócio dentro deles. Uma nova tela quase nunca precisa de CSS: escolhe-se o template e preenchem-se os slots."
    >
      <SubSection title="Templates" description="Quatro estruturas cobrem as telas previstas do sistema. Eles não conhecem dados — só layout, responsividade e acessibilidade (por exemplo, o link “Pular para o conteúdo” do AppShell).">
        <div className="grid gap-8 lg:grid-cols-2">
          <Specimen title="AppShell" composedOf={['AppHeader', 'SegmentedNav', 'CommandPalette']} description="Moldura global, sem menu lateral: cabeçalho enxuto (marca, busca centralizada, tema, usuário) e, acima do conteúdo de toda página, o toggle de navegação. A busca global abre com Ctrl/⌘ + K." code={`<AppShell nav={mainNav} user={user} userMenu={…} search={{ groups, onSearchChange }} linkAs={NavLink} hrefProp="to">
  <Outlet />
</AppShell>`} previewClassName="!justify-center bg-canvas">
            <Wireframe kind="app-shell" />
          </Specimen>
          <Specimen title="SettingsLayout" composedOf={['PageHeader', 'NavItem']} description="Título e abas horizontais de seções (rolam no celular). Sem menu lateral." code={`<SettingsLayout items={settingsItems} linkAs={NavLink} hrefProp="to">
  <Outlet />
</SettingsLayout>`} previewClassName="!justify-center bg-canvas">
            <Wireframe kind="settings" />
          </Specimen>
          <Specimen title="ListPage" composedOf={['PageHeader', 'FilterBar', 'DataTable']} description="Toda listagem: cabeçalho, filtros e tabela." code={`<ListPage header={{ title: 'Produtos', actions }} filters={<FilterBar … />}>
  <DataTable … />
</ListPage>`} previewClassName="!justify-center bg-canvas">
            <Wireframe kind="list" />
          </Specimen>
          <Specimen title="FormPage" composedOf={['PageHeader', 'FormSection', 'StickyActionBar']} description="Todo cadastro e edição: seções e barra de ações fixa." code={`<FormPage header={{ title: 'Novo produto' }} dirty={dirty} actions={<>…</>}>
  <FormSection title="Identificação">…</FormSection>
</FormPage>`} previewClassName="!justify-center bg-canvas">
            <Wireframe kind="form" />
          </Specimen>
        </div>
      </SubSection>

      <SubSection
        title="Páginas de exemplo"
        description="O mesmo sistema montando as duas telas centrais do cadastro de produtos — com dados fictícios. Interaja: filtre, ordene, selecione, exclua, preencha o formulário e salve (os campos obrigatórios mostram erros)."
      >
        <Frame label="Produtos — ListPage" bodyClassName={pad} maxHeight="44rem">
          <ProductListExample page caption="Produtos — exemplo de página de lista" />
        </Frame>
        <Frame label="Novo produto — FormPage" bodyClassName={pad} maxHeight="44rem">
          <ProductFormExample />
        </Frame>
      </SubSection>

      <SubSection title="Páginas reais do sistema" description="O sistema é construído página a página. Início já está pronta; as demais existem em branco.">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { to: '/', title: 'Início', text: 'Botão “Novo produto” e o dashboard de indicadores do catálogo.' },
            { to: '/produtos', title: 'Todos os produtos', text: 'Lista de produtos, em branco. É daqui, ou da busca, que se chega ao produto.' },
            { to: '/produtos/p1', title: 'Página do produto', text: 'Sem item de menu: acessada pela lista ou pela busca global. Em branco.' },
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
