# Instruções para o projeto

Sistema de cadastro de produtos (fiscal + vendas) da UP2Tech. Interface em **português do Brasil**; código e nomes de componentes em inglês.

## Comandos
- `npm run dev` · `npm run check` (tipos + lint + contraste) · `npm run build`
- Rode `npm run check` antes de concluir qualquer mudança.

## Navegação e páginas
- **Sem menu lateral e sem menu no cabeçalho.** A navegação principal é o toggle `SegmentedNav` (links com aparência de toggle, **sem ícones**) logo **acima do `PageHeader`**, renderizado pelo `AppShell` em toda página. Rotas e menus ficam em `src/app/navigation.ts`.
- O `AppHeader` tem só: marca em texto (sem a imagem do logo), botão **Buscar produtos** centralizado (só texto), tema e usuário.
- Toggle: Início e Produtos. **Conexões** e **Configurações** só pelo menu do usuário (ícone de perfil).
- **Página do produto** (`/produtos/:produtoId`) não tem item de menu: só pela lista de produtos, pela busca global ou ao criar um produto. Nunca a coloque em menus.
- Páginas novas começam em branco (`<h1 className="sr-only">` + `usePageTitle`) e são construídas uma a uma, sob instrução.
- **Produtos** (pronta): `PageHeader` + `DataTable` com foto (`Thumbnail`), SKU, título, NCM, EAN e departamento; busca e filtro por departamento na toolbar; o título é um link e a linha inteira abre `/produtos/:id` (única entrada na página do produto, além da busca global).
- **Página do produto** (pronta, `/produtos/:produtoId`): `PageHeader` (trilha, título, status, SKU, **Editar produto**) + faixa-resumo + alerta de pendências + **abas** (`?aba=` na URL): Principal, Fiscal, Operacional (só Logística), Marketing, Imagens, Especificações, Variações e kits (só tipo variações/kit) e Histórico. Leitura e edição usam o mesmo esquema.
  - **Fonte única: `src/app/products/schema.ts`** (`TABS`, `SECTIONS`, `FIELDS`). Campo novo ou mudança de aba = mexer só ali; a página, os selos de pendência, a validação e `docs/produto-mapa-de-informacoes.md` (`npm run docs:produto`, não edite à mão) seguem sozinhos. `importance`: `required` bloqueia salvar e conta pendência; `recommended` só conta pendência; `departments`/`tipos` mostram o campo só quando se aplica.
  - `derivePendencias(valores)` define as pendências do dashboard e da lista; os dados de exemplo (`detail.ts`) já nascem coerentes com elas. Seções com tabela própria (`custom: true`) são desenhadas em `src/pages/products/product/CustomSections.tsx` e hoje são só leitura.
  - Dados de exemplo e armazenamento em memória em `src/app/products/detail.ts` (**temporários**); trocar por backend = substituir `getProductDetail`/`saveProductValues`.
  - **Preço, custo e estoque não são controlados aqui** (vêm de outro sistema): não crie campos, abas, colunas nem indicadores deles. Por isso não há aba Comercial, e Operacional tem só Logística; Marketing não tem publicação por canal nem vídeo.
  - **Rascunho × ativo:** em rascunho só o essencial bloqueia o salvamento (`DRAFT_REQUIRED` no `schema.ts`: SKU, título, tipo, departamento, unidade, responsável); ativar ou inativar exige todos os `required`. Formatos inválidos e duplicidade de SKU/GTIN sempre bloqueiam.
- **Vocabulário do produto:** use **título** (não "nome") e **departamento** (não "categoria"), em código e interface.
- **Novo produto**: botão **sem ícone**, na mesma linha do toggle de navegação (à direita; slot `navActions` do `AppShell`, montado no `AppLayout`), só em Início e Produtos. Abre o modal `NewProductDialog` (também pela busca global, Ctrl/⌘ + K). **Não existe rota `/produtos/novo`.**
- **Novo produto (modal)**: `src/pages/products/NewProductDialog.tsx`, montado no `AppLayout`. Tem dois modos (seletor no topo): **Um produto** e **Importar vários (CSV)**. Um produto pede só o essencial (título, departamento, unidade, tipo, SKU sugerido, marca, GTIN, responsável, descrição curta, **fotos**, NCM e origem) e cria sempre um **rascunho**; o rodapé mostra ao vivo o que ficará pendente (vem de `pendingFields`). Reusa `FieldControl` e `validate`: campo novo no cadastro rápido = só incluí-lo em `ORDER`/no JSX. **Importação CSV:** `ImportPanel` (tela) + `src/app/products/import.ts` (modelo, colunas `IMPORT_COLUMNS`, `parseImport`); aceita `;`/`,`/tab, UTF-8 ou Windows-1252, até 500 linhas e 2 MB; cada linha passa pelas mesmas regras de `validate`; linhas com problema ficam de fora e dizem o que corrigir; SKU em branco é gerado; a coluna `responsavel` só vale para o Admin. Coluna nova = uma entrada em `IMPORT_COLUMNS` + tratamento em `parseImport`. Em página hospedada (`EMBEDDED`) o modelo é copiado, não baixado. **Fotos:** `ImageManager` (cadastro e aba Imagens em edição); a primeira é a principal (`product.photo`); imagens ficam em memória como data URI, reduzidas a 2000 px (`src/lib/images.ts`). **Nunca preencha dados fiscais por padrão** (CFOP, CST…): ficam para a aba Fiscal. `createProduct` (`detail.ts`) cadastra; o responsável é quem cria (só o Admin escolhe outro).
- **Cabeçalho de página só com o título**: sem texto descritivo abaixo (Produtos, Início).
- **Início** (pronta): só o dashboard (`src/pages/home`, métricas em `src/app/dashboard/metrics.ts`).
- Gráficos: `StatCard` (um `hero` por tela), `BarList` (uma cor para categorias nominais) e `DistributionBar` (parte-do-todo com legenda). Todo valor aparece também em texto; as marcas gráficas usam a cor do tom (`toneMark`), validada a ≥ 3:1 por `check:contrast`.
- A busca global (`CommandPalette`) usa `searchProducts` (`src/app/products/search.ts`) sobre dados de exemplo **temporários**.

## Acessos (papéis) e fluxo fiscal
- Quatro papéis fixos montados por **permissões** (`src/app/access/permissions.ts`): **Admin** (tudo, inclusive Usuários e Papéis), **Gerente de produto** (cria; edita, envia o fiscal e ativa só os *seus*), **Tributação** (equipe terceira: edita o fiscal de qualquer produto, aprova ou pede ajuste, vê a fila) e **Acesso comum** (só leitura). Matriz em `docs/acessos.md`; a regra vive **só** em `can(user, action, product?)` e `canEditField`: nunca compare `role` direto na tela. Papel novo = entrada em `ROLE_PERMISSIONS`.
- Todo produto tem `owner` (**Responsável**, `adminOnly`: só o Admin troca). Usuários (`users.ts`, em memória) são geridos em Configurações › Usuários; Papéis (matriz, leitura) em Configurações › Papéis. Tudo em Configurações/Conexões é só do Admin (`RequireAccess`).
- **Tributação:** estados `none → review → approved | adjust` (`Product.fiscal`, funções em `detail.ts`: `submitForReview`, `approveFiscal`, `requestFiscalAdjust`). Enviar exige NCM e origem; em `review` o fiscal trava para o gerente; aprovar exige os campos fiscais obrigatórios; pedir ajuste exige comentário; ativar exige `approved` (`validate`); editar fiscal de produto aprovado sem ser revisor reabre a análise. Fila em `/tributacao` (`TaxQueuePage`); no toggle só para quem vê a fila e não cria produtos (o Admin vai pela busca).
- **Sincronização com a API** (`Product.sync`: `none|pending|synced|error`): automática ao ativar e a cada edição de produto ativo; hoje **simulada** em `detail.ts` (`scheduleSync`); o Admin tem **Reenviar**. Trocar por backend = substituir essas funções.
- Tela sem permissão **esconde a ação** e mostra o motivo ("Somente leitura"); campo `adminOnly` aparece sem controle para os demais. Sem login ainda: o papel de demonstração vem de `useSession` ("Entrar como"). **Provisório.** A checagem na interface não substitui a do servidor.

## Design System (src/design-system) — Atomic Design
- Camadas: `atoms → cells → molecules → organisms → templates`. **Só importe de camadas abaixo** (o ESLint falha caso contrário).
- Onde fica um componente novo: átomo = elemento único; célula = 2–3 átomos sem estado/lógica própria; molécula = comportamento próprio para uma tarefa; organismo = seção da tela; template = estrutura com slots. Guia completo em Configurações › Design System › Introdução.
- Páginas e regras de negócio ficam em `src/pages`, nunca no design-system.
- Todo componente novo entra no `index.ts` da camada **e** na documentação (`src/pages/design-system/sections`), com demonstração viva e código.

## Estilo
- **Essencial, sem variações extras.** Status tem UMA cor cada: `--success`, `--warning`, `--danger` (um valor por tema; o fundo suave é derivado com `color-mix`). Tons: `neutral | brand | success | warning | danger`, **só aparência soft** (`Badge` não tem `appearance`; nada de solid/outline, `info`, borda de tom ou escala 50–900 de status). Novo status = uma cor em `tokens.css` + um par de linhas em `tones.ts`.
- **Só duas sombras:** `shadow-border` (cards, tabelas, itens ativos) e `shadow-popover` (o que flutua). Não crie outras.
- `Button`: `primary`, `secondary`, `ghost` e `danger` (fundo suave na cor de erro).
- Só **tokens semânticos** do Tailwind (`bg-surface`, `text-fg-muted`, `border-line-control`, `bg-primary`, `bg-tone-success-soft`…). Nunca cores primitivas (`bg-brand-600`), hex, tamanhos arbitrários ou `z-index` numérico (use `z-modal`, `z-popover`…).
- Altere tokens apenas em `src/styles/tokens.css` e rode `npm run check:contrast`.
- Compose classes com `cn()`, `className` por último. Variantes com `cva`.
- Ícones sempre via `<Icon>` (Lucide). Botão só com ícone = `IconButton` (o `label` é obrigatório).
- Campos de formulário sempre dentro de `FormField` (liga label, dica, erro e ARIA).

## Movimento (skill emil-design-eng)
- Só `transform` e `opacity`; ≤ 300 ms; `ease-out` (nunca `ease-in`); nada de `transition: all`; nada nasce de `scale(0)`.
- Pressionar = `active:scale-[0.97]`. Hover sempre atrás de `hover:` do Tailwind (já gated por `(hover: hover)`).
- Ações por teclado (paleta de comandos) não animam. Respeite `prefers-reduced-motion` (variável `--ds-pop-from`).

## Acessibilidade (WCAG 2.2 AA)
- Foco visível, alvos ≥ 24 px (controles 40–44 px), nome acessível em todo controle, cor nunca como único sinal.
- `read-only:` do Tailwind casa com `<button>` — use `[&[readonly]]:`.
- Todo `grid` já tem coluna `minmax(0,1fr)` por padrão (base.css); use `grid-cols-*` para sobrescrever.
- Componentes incorporados em documentação aceitam `headingLevel`/`label` para manter a hierarquia e landmarks únicos.

## Dados fiscais
Códigos de exemplo (NCM, CEST, CFOP, CST/CSOSN) são ilustrativos. Validadores reais ficam em `src/lib/masks.ts` (GTIN, CNPJ); regras fiscais oficiais devem vir da legislação/SEFAZ, não deste repositório.
