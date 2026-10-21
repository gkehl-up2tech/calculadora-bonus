# Cadastro de Produtos · UP2Tech

Sistema de cadastro de produtos — dados **fiscais** e de **vendas**. Esta é a base do novo sistema (substitui a antiga calculadora de bônus, preservada em [`legacy/`](legacy/index.html)).

**Estado atual:** moldura da aplicação (cabeçalho com navegação e busca global) e as páginas abaixo, todas **em branco** — serão construídas uma a uma. A exceção é **Configurações › Design System**, que documenta e demonstra todos os componentes.

## Mapa de páginas

Não há menu lateral: a navegação principal fica no **cabeçalho** (no celular desce para uma segunda linha).

| Página | Rota | Como se chega |
| --- | --- | --- |
| Início | `/` | Navegação principal |
| Todos os produtos | `/produtos` | Navegação principal |
| Página do produto | `/produtos/:produtoId` | **Somente** pela lista de produtos ou pela busca global (Ctrl/⌘ + K). Sem item de menu |
| Conexões | `/conexoes` | **Somente** pelo menu do usuário (ícone de perfil) |
| Configurações | `/configuracoes` (abas: Geral, Design System) | **Somente** pelo menu do usuário |

A busca global encontra produtos por nome, SKU, NCM ou categoria e abre a página do produto. Hoje ela consulta dados de exemplo (`src/app/products/sample-products.ts`, **temporários**); ao ligar uma fonte real, troque `searchProducts` em `src/app/products/search.ts`.

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
│  ├─ atoms/             Button, Input, Badge, Checkbox…                     (20)
│  ├─ cells/             IconButton, CheckboxField, InputGroup, StatusBadge… (15)
│  ├─ molecules/         FormField, Select, Combobox, Dialog, Pagination…    (22)
│  ├─ organisms/         DataTable, AppHeader, FilterBar, FormSection…       (9)
│  └─ templates/         AppShell, ListPage, FormPage, SettingsLayout        (4)
├─ app/                  rotas e navegação (navigation.ts), layout, busca de produtos
└─ pages/                páginas (dados e regras de negócio)
```

### Regra de dependência

`tokens/lib → atoms → cells → molecules → organisms → templates → pages`. Cada camada só importa das de baixo; o ESLint bloqueia o contrário.

> **Células** são uma extensão deliberada ao Atomic Design de Brad Frost: composições de 2–3 átomos sem comportamento próprio (ex.: checkbox + rótulo), separadas das moléculas, que têm estado, teclado e ARIA.

## Como construir uma tela

1. Escolha um **template** (`ListPage`, `FormPage`, `SettingsLayout`; o `AppShell` já envolve todas as páginas).
2. Monte com componentes existentes. Campos sempre dentro de `FormField`.
3. Use **apenas tokens semânticos** (`bg-surface`, `text-fg-muted`, `border-line-control`…). Nada de hex, `px` soltos ou `z-index` numérico.
4. Trate estados: vazio, carregando, erro, desabilitado e dados extremos.

A documentação viva está em **Configurações › Design System** (`/configuracoes/design-system`).

## Acessibilidade e qualidade

Meta: **WCAG 2.2 AA**. Verificado por `check:contrast` (82 pares de cores nos dois temas) e, na entrega do Design System, por varredura com axe-core em todas as páginas e temas (0 violações), além de teste de interação por teclado. Ferramentas automáticas não substituem teste manual com leitor de tela.

## Dados de exemplo

Os produtos e códigos fiscais (NCM, CEST, CFOP, CSOSN) da documentação são **ilustrativos** — servem para mostrar o formato dos campos, não para emissão de documentos fiscais.
