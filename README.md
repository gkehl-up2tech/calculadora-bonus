# Cadastro de Produtos · UP2Tech

Sistema de cadastro de produtos — dados **fiscais** e de **vendas**. Esta é a base do novo sistema (substitui a antiga calculadora de bônus, preservada em [`legacy/`](legacy/index.html)).

**Estado atual:** moldura da aplicação e as páginas abaixo, construídas uma a uma. **Início** (dashboard), **Produtos** (tabela do catálogo) e a **página do produto** (abas, leitura e edição) estão prontas; as demais estão **em branco**. **Configurações › Design System** documenta e demonstra todos os componentes.

## Mapa de páginas

Não há menu lateral. A navegação principal é um **toggle** (Início | Produtos), sem ícones, logo **acima do `PageHeader`** de toda página. O cabeçalho tem só a marca (texto), o botão **Buscar produtos** centralizado, o tema e o usuário.

| Página | Rota | Como se chega |
| --- | --- | --- |
| Início | `/` | Toggle de navegação (com o botão **Novo produto** à direita, na mesma linha) e dashboard de indicadores |
| Produtos | `/produtos` | Toggle de navegação. Tabela do catálogo: foto, SKU, título, NCM, EAN e departamento; clicar numa linha abre o produto |
| Página do produto | `/produtos/:produtoId` | **Somente** pela lista de produtos ou pela busca global (Ctrl/⌘ + K). Sem item de menu. Abas: Principal, Fiscal, Operacional (só Logística), Marketing, Imagens, Especificações, Variações e kits, Histórico (`?aba=`). Botão **Editar produto**. Mapa completo dos campos em [`docs/produto-mapa-de-informacoes.md`](docs/produto-mapa-de-informacoes.md) |
| Novo produto | (modal) | Botão *Novo produto* da linha do toggle, em Início e Produtos, ou pela busca (Ctrl/⌘ + K). Cadastro rápido (um produto, com fotos) ou importação de vários por CSV; sempre cria rascunhos |
| Conexões | `/conexoes` | **Somente** pelo menu do usuário (ícone de perfil) |
| Solicitações | `/solicitacoes` | Gerente: solicita o cadastro (título, departamento, categoria, urgente, arquivo CSV/DOC) e acompanha. Equipe de cadastro e Admin: fila de pendentes, criar produto a partir do pedido ou recusar com motivo |
| Tributação | `/tributacao` | Fila de produtos aguardando análise ou com ajuste pedido (Tributação e Admin) |
| Configurações | `/configuracoes` (abas: Geral, Usuários, Papéis, Design System) | **Somente** pelo menu do usuário (Admin) |

**Papéis:** Admin (tudo, inclusive usuários e papéis), Gerente de produto (**solicita** o cadastro, edita os próprios produtos, envia o fiscal e ativa depois da aprovação), Tributação (equipe terceira: revisa, completa e aprova ou pede ajuste na fila `/tributacao`) e Acesso comum (equipe de cadastro: atende as solicitações, cria e edita produtos). Ao ativar e a cada edição o produto é sincronizado com a API (simulado). Usuários e Papéis ficam em Configurações. Detalhes em [`docs/acessos.md`](docs/acessos.md). Como ainda não há login, o papel é escolhido no menu do usuário (**Entrar como**, provisório).

A busca global encontra produtos por título, SKU, NCM, EAN ou departamento e abre a página do produto. Hoje ela consulta dados de exemplo (`src/app/products/sample-products.ts` e `photos.ts`, **temporários**; as fotos são ilustrações em SVG embutido); ao ligar uma fonte real, troque `searchProducts` em `src/app/products/search.ts`.

## Começando

```bash
npm install
npm run dev          # http://localhost:5173
npm run check        # tipos + lint + contraste de cores (rode antes de abrir PR)
npm run build        # gera dist/ (com 404.html para SPA)
```

| Comando | O que faz |
| --- | --- |
| `npm run typecheck` | TypeScript estrito |
| `npm run lint` | ESLint, inclusive a **regra de hierarquia do Atomic Design** |
| `npm run check:contrast` | Valida os pares de cores dos tokens (WCAG 2.2 AA, tema claro e escuro) |

Para publicar em um subcaminho (ex.: GitHub Pages em `/calculadora-bonus/`): `BASE_PATH=/calculadora-bonus/ npm run build`.

Para gerar um arquivo HTML único (página hospedada, ex.: Artifact do claude.ai): `npm run build:embedded` — usa roteador em memória e acompanha o tema da página hospedeira.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · Radix UI (acessibilidade) · cmdk · Sonner · TanStack Table · Lucide · React Router · fonte Montserrat.

## Estrutura

```
src/
├─ styles/tokens.css     tokens: primitivos → semânticos → utilitários (claro e escuro)
├─ styles/base.css       reset, foco, toque, movimento reduzido
├─ lib/                  cn, tema, máscaras (NCM/CEST/CNPJ…), validadores (GTIN, CNPJ), formatação
├─ design-system/        ATOMIC DESIGN
│  ├─ atoms/             Button, Input, Badge, Thumbnail, Checkbox…          (19)
│  ├─ cells/             IconButton, SwitchField, InputGroup, StatusBadge… (12)
│  ├─ molecules/         FormField, Select, Combobox, FileDropzone, SegmentedNav… (25)
│  ├─ organisms/         DataTable, AppHeader, PageHeader, FormSection…      (7)
│  └─ templates/         AppShell, SettingsLayout                        (2)
├─ app/                  rotas e navegação (navigation.ts), layout, busca de produtos, métricas do dashboard
└─ pages/                páginas (dados e regras de negócio)
```

### Regra de dependência

`tokens/lib → atoms → cells → molecules → organisms → templates → pages`. Cada camada só importa das de baixo; o ESLint bloqueia o contrário.

> **Células** são uma extensão deliberada ao Atomic Design de Brad Frost: composições de 2–3 átomos sem comportamento próprio (ex.: checkbox + rótulo), separadas das moléculas, que têm estado, teclado e ARIA.

## Como construir uma tela

1. Escolha um **template** (`SettingsLayout` para abas de configuração; o `AppShell` já envolve todas as páginas).
2. Monte com componentes existentes. Campos sempre dentro de `FormField`.
3. Use **apenas tokens semânticos** (`bg-surface`, `text-fg-muted`, `border-line-control`…). Nada de hex, `px` soltos ou `z-index` numérico.
4. Trate estados: vazio, carregando, erro, desabilitado e dados extremos.

A documentação viva está em **Configurações › Design System** (`/configuracoes/design-system`).

## Acessibilidade e qualidade

Meta: **WCAG 2.2 AA**. Verificado por `check:contrast` (94 pares de cores nos dois temas) e, na entrega do Design System, por varredura com axe-core em todas as páginas e temas (0 violações), além de teste de interação por teclado. Ferramentas automáticas não substituem teste manual com leitor de tela.

## Dados de exemplo

Os produtos e códigos fiscais (NCM, CEST, CFOP, CSOSN) da documentação são **ilustrativos** — servem para mostrar o formato dos campos, não para emissão de documentos fiscais.
