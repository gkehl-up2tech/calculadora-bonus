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
          <Specimen title="AppShell" composedOf={['AppHeader', 'SidebarNav', 'Sheet', 'CommandPalette']} description="Moldura global. Menu lateral fixo a partir de 1024 px; abaixo disso, vira gaveta." code={`<AppShell navGroups={groups} user={user} linkAs={NavLink} hrefProp="to" commands={cmds}>
  <Outlet />
</AppShell>`} previewClassName="!justify-center bg-canvas">
            <Wireframe kind="app-shell" />
          </Specimen>
          <Specimen title="SettingsLayout" composedOf={['PageHeader', 'NavItem']} description="Navegação secundária à esquerda; no celular rola na horizontal." code={`<SettingsLayout items={settingsItems} linkAs={NavLink} hrefProp="to">
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

      <SubSection title="Páginas reais do sistema" description="Por enquanto o sistema tem apenas a moldura. As páginas abaixo existem e estão intencionalmente vazias — o próximo passo é preenchê-las com os módulos.">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { to: '/', title: 'Início', text: 'Página inicial, dentro do AppShell. Sem conteúdo.' },
            { to: '/configuracoes', title: 'Configurações', text: 'SettingsLayout com a navegação secundária (Geral e Design System).' },
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
