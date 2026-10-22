# Acessos, papéis e fluxo da tributação

Quatro papéis **fixos**, mas montados por **permissões** (`src/app/access/permissions.ts`): a tela só pergunta `can(user, ação, produto?)`.
Criar papéis personalizados no futuro é ganhar uma tela, sem refazer regras.
**A regra real precisa ser aplicada também no servidor**: esconder um botão não protege os dados.

## Papéis

| Permissão | Admin | Gerente de produto | Tributação | Acesso comum (equipe de cadastro) |
|---|---|---|---|---|
| Ver produtos (todas as abas) e o Início | sim | sim | sim | sim |
| **Solicitar** o cadastro de um produto | — (cria direto) | sim | não | não |
| Ver as solicitações | todas | só as suas | não | todas |
| **Atender** solicitações (criar o produto ou recusar) | sim | não | não | sim |
| Criar produtos do zero | sim | não | não | sim |
| Editar produtos | todos | só os **seus** (responsável) | não | todos |
| Trocar o responsável do produto | sim | não | não | sim |
| Ativar e inativar | todos | só os seus, **com a tributação aprovada** | não | não |
| Editar a parte fiscal | todos | só os seus, **fora da análise** | de qualquer produto | não |
| Enviar o fiscal para a Tributação | sim | só os seus | não | não |
| Aprovar a tributação ou pedir ajuste | sim | não | sim | não |
| Ver a fila da Tributação | sim | não | sim | não |
| Reenviar para a API | sim | não | não | não |
| Usuários, Papéis, Conexões, Configurações e Design System | sim | não | não | não |

A matriz também está em **Configurações › Papéis** (somente leitura). Pessoas e papéis são geridos em **Configurações › Usuários** (criar, trocar o papel, desativar; ninguém altera o próprio papel nem se desativa).

## Solicitação de cadastro

O gerente de produto **não cria** produtos: ele **solicita**. Antes não havia padrão (e-mail, WhatsApp…); agora há um formulário único e uma fila.

1. O gerente usa **Solicitar cadastro** (botão na linha do toggle, em Início, Produtos e Solicitações; também em Ctrl/⌘ + K) e informa **título**, **departamento**, **categoria**, se é **urgente** e anexa um **arquivo CSV ou DOC/DOCX** (até 5 MB) com os dados do produto. Há um **modelo CSV** para manter o mesmo formato.
2. A solicitação entra como **Pendente** na lista da equipe de cadastro (Acesso comum), em **Solicitações**: urgentes primeiro, depois as mais antigas. O toggle mostra quantas estão pendentes.
3. A equipe abre a solicitação (vê os dados e, no CSV, a prévia do arquivo) e **Cria o produto** (o cadastro rápido já vem com título, departamento e categoria, e o **responsável é quem pediu**) ou **Recusa** com um motivo obrigatório.
4. Estados: **Pendente → Atendida** (com link para o produto, que nasce como rascunho e guarda “criado a partir da solicitação” no Histórico) **ou Recusada** (com o motivo). O gerente acompanha a devolutiva na mesma lista.

Hoje as solicitações e os arquivos ficam **em memória** (`src/app/requests/requests.ts`); com backend, o arquivo vai para um armazenamento de objetos.

## Responsável

Todo produto tem um **Responsável** (campo da aba Principal), sempre um gerente de produto ou Admin. Quem pode trocar responsáveis (Admin e equipe de cadastro) escolhe no cadastro; quem cria sendo responsável (Admin) é o padrão. Em produtos vindos de solicitação, é quem pediu.
Aparece na faixa-resumo, como coluna e filtro (“Meus produtos”) na lista.

## Fluxo da tributação

A equipe de Tributação é terceira: o gerente cadastra o produto e **a Tributação aprova** (ou pede ajuste).

```
Não enviada → Aguardando análise → Aprovada
                  ↑        ↓
              Ajuste pedido (comentário obrigatório)
```

1. O gerente (responsável) preenche NCM e origem (mínimo para enviar) e usa **Enviar para a Tributação** na aba Fiscal.
2. Em **Aguardando análise** o fiscal fica travado para o gerente. O produto entra na **fila** (`/tributacao`), mais antigos primeiro.
3. A Tributação completa o que falta (**Editar tributação** — só a parte fiscal) e **Aprova**, ou **Pede ajuste** explicando o que mudar. A aprovação só é aceita com todos os campos fiscais obrigatórios preenchidos.
4. Em **Ajuste pedido** o gerente corrige e reenvia.
5. **Ativar** o produto exige a tributação aprovada (e todos os campos obrigatórios). Rascunhos não precisam dela.
6. Se alguém sem papel de revisão altera um campo fiscal de um produto **aprovado**, ele volta para **Aguardando análise** (continua ativo).

Cada passo entra no **Histórico** do produto.

## Sincronização com a API

Automática: ao **ativar** e a **cada edição** de um produto ativo, o produto fica **Enviando…** e depois **Sincronizado**.
Se falhar, aparece **Erro na sincronização** com a mensagem, e o Admin vê **Reenviar**. Hoje a sincronização é **simulada** (900 ms, em memória).

## Como a interface reage

- Sem permissão de edição: **Editar produto** some e a página mostra “Somente leitura” e o motivo.
- Sem permissão de criar: **Novo produto** some (inclusive na busca global); o gerente vê **Solicitar cadastro** no lugar.
- O toggle mostra **Solicitações (n)** e **Tributação (n)** só para quem os usa, com a contagem do que espera ação. No celular o botão da linha passa para baixo do toggle, alinhado à direita. O Início mostra “Na fila da Tributação”.
- Usuários, Papéis, Conexões e Configurações somem do menu e da busca de quem não tem acesso; abrir o endereço mostra o aviso “Fale com um Admin”.

## Demonstração (provisório)

Sem login, o papel ativo é escolhido no menu do usuário, em **Entrar como**: Usuário UP2Tech (Admin), Marina Costa e Rafael Lima (gerentes),
Beatriz Nunes (Tributação, terceira) e Carla Souza (acesso comum, equipe de cadastro). O padrão é o Admin. Usuários, produtos, solicitações, fila e sincronização vivem **em memória**.
Com autenticação real, `useSession` (`session.ts`) passa a vir do login, e `users.ts`, `detail.ts` (fluxo e sincronização) e a verificação das regras passam a vir da API.
