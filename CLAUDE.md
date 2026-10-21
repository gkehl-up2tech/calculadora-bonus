# Instruções para o projeto

Sistema de cadastro de produtos (fiscal + vendas) da UP2Tech. Interface em **português do Brasil**; código e nomes de componentes em inglês.

## Comandos
- `npm run dev` · `npm run check` (tipos + lint + contraste) · `npm run build`
- Rode `npm run check` antes de concluir qualquer mudança.

## Navegação e páginas
- **Sem menu lateral e sem menu no cabeçalho.** A navegação principal é o toggle `SegmentedNav` (links com aparência de toggle, **sem ícones**) logo **acima do `PageHeader`**, renderizado pelo `AppShell` em toda página. Rotas e menus ficam em `src/app/navigation.ts`.
- O `AppHeader` tem só: marca em texto (sem a imagem do logo), botão **Buscar produtos** centralizado (só texto), tema e usuário.
- Toggle: Início e Todos os produtos. **Conexões** e **Configurações** só pelo menu do usuário (ícone de perfil).
- **Página do produto** (`/produtos/:produtoId`) não tem item de menu: só pela lista de produtos, pela busca global ou pelo botão *Novo produto* (`/produtos/novo`). Nunca a coloque em menus.
- Páginas novas começam em branco (`<h1 className="sr-only">` + `usePageTitle`) e são construídas uma a uma, sob instrução.
- **Início** (pronta): `PageHeader` com `hideTitle` só com o botão *Novo produto* (leva a `/produtos/novo`) + dashboard (`src/pages/home`, métricas em `src/app/dashboard/metrics.ts`).
- Gráficos: `StatCard` (um `hero` por tela), `BarList` (uma cor para categorias nominais) e `DistributionBar` (parte-do-todo com legenda). Todo valor aparece também em texto; cores de marcas gráficas vêm dos tons `solid` (validados a ≥ 3:1 por `check:contrast`).
- A busca global (`CommandPalette`) usa `searchProducts` (`src/app/products/search.ts`) sobre dados de exemplo **temporários**.

## Design System (src/design-system) — Atomic Design
- Camadas: `atoms → cells → molecules → organisms → templates`. **Só importe de camadas abaixo** (o ESLint falha caso contrário).
- Onde fica um componente novo: átomo = elemento único; célula = 2–3 átomos sem estado/lógica própria; molécula = comportamento próprio para uma tarefa; organismo = seção da tela; template = estrutura com slots. Guia completo em Configurações › Design System › Introdução.
- Páginas e regras de negócio ficam em `src/pages`, nunca no design-system.
- Todo componente novo entra no `index.ts` da camada **e** na documentação (`src/pages/design-system/sections`), com demonstração viva e código.

## Estilo
- Só **tokens semânticos** do Tailwind (`bg-surface`, `text-fg-muted`, `border-line-control`, `bg-primary`, `bg-tone-success-soft`…). Nunca cores primitivas (`bg-brand-600`), hex, tamanhos arbitrários ou `z-index` numérico (use `z-modal`, `z-popover`…).
- Altere tokens apenas em `src/styles/tokens.css` e rode `npm run check:contrast`.
- Compose classes com `cn()`, `className` por último. Variantes com `cva`.
- Ícones sempre via `<Icon>` (Lucide). Botão só com ícone = `IconButton` (o `label` é obrigatório).
- Campos de formulário sempre dentro de `FormField` (liga label, dica, erro e ARIA).

## Movimento (skill emil-design-eng)
- Só `transform` e `opacity`; ≤ 300 ms; `ease-out` (nunca `ease-in`); nada de `transition: all`; nada nasce de `scale(0)`.
- Pressionar = `active:scale-[0.97]`. Hover sempre atrás de `hover:` do Tailwind (já gated por `(hover: hover)`).
- Ações por teclado (paleta de comandos) não animam. Respeite `prefers-reduced-motion` (variáveis `--ds-pop-from` e `--ds-slide`).

## Acessibilidade (WCAG 2.2 AA)
- Foco visível, alvos ≥ 24 px (controles 40–44 px), nome acessível em todo controle, cor nunca como único sinal.
- `read-only:` do Tailwind casa com `<button>` — use `[&[readonly]]:`.
- Todo `grid` já tem coluna `minmax(0,1fr)` por padrão (base.css); use `grid-cols-*` para sobrescrever.
- Componentes incorporados em documentação aceitam `headingLevel`/`label` para manter a hierarquia e landmarks únicos.

## Dados fiscais
Códigos de exemplo (NCM, CEST, CFOP, CST/CSOSN) são ilustrativos. Validadores reais ficam em `src/lib/masks.ts` (GTIN, CNPJ); regras fiscais oficiais devem vir da legislação/SEFAZ, não deste repositório.
