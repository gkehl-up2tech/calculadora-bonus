# Perfis de acesso

Três perfis. As regras ficam em `src/app/access/permissions.ts` (uma função `can`) e valem para a interface.
**A regra real precisa ser aplicada também no servidor**: esconder um botão não protege os dados.

| Ação | Master | Gerente de produto | Acesso comum |
|---|---|---|---|
| Ver produtos, todas as abas (inclusive Fiscal e Histórico) e o Início | sim | sim | sim |
| Criar produto | sim | sim | não |
| Editar produto | sim | só os produtos de que é **responsável** | não |
| Trocar o **responsável** de um produto | sim | não | não |
| Conexões e Configurações (inclui o Design System) | sim | não | não |

## Responsável

Todo produto tem um **Responsável** (gerente de produto ou Master), campo obrigatório da aba Principal. É ele quem edita o produto. Quem cria o produto vira o responsável; só o Master escolhe outro no cadastro.
Aparece na faixa-resumo da página do produto e como coluna (e filtro "Meus produtos") na lista. Só o Master altera.

## Como a interface reage

- Sem permissão de edição: o botão **Editar produto** some, a página mostra o selo "Somente leitura" e o motivo.
- Sem permissão de criar: o botão **Novo produto** some (e a opção da busca global também).
- Conexões e Configurações: somem do menu do usuário e da busca global; abrir o endereço mostra o mesmo aviso.

## Demonstração (provisório)

Sem login, o perfil ativo é escolhido no menu do usuário, em **Entrar como (demonstração)**: Usuário UP2Tech (Master),
Marina Costa e Rafael Lima (gerentes de produto) e Carla Souza (acesso comum). O padrão é o Master.
Com autenticação real, `useSession` (`src/app/access/session.ts`) passa a vir do login e a lista de usuários, da API.
