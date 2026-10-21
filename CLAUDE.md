# Instruções para o projeto

Sistema de cadastro de produtos (fiscal + vendas) da UP2Tech. Interface em **português do Brasil**; código e nomes de componentes em inglês.

## Comandos
- `npm run dev` · `npm run check` (tipos + lint + contraste) · `npm run build`
- Rode `npm run check` antes de concluir qualquer mudança.

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
