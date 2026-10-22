# Mapa de informações do produto

> Gerado por `npm run docs:produto` a partir de `src/app/products/schema.ts`. **Não edite à mão**: mude o esquema e gere de novo.

88 campos em 8 abas. **Obrigatório** e *recomendado* ausentes viram pendência (selo na aba e alerta na página). Só obrigatório bloqueia o salvamento.

Os valores fiscais de exemplo (CST, alíquotas, cClassTrib) e as listas de opções são ilustrativos e parciais: confirme nas tabelas oficiais vigentes antes de emitir documentos fiscais.

## Principal

Identificação, códigos de barras, classificação e descrição.

### Identificação

Como o produto é reconhecido no catálogo.

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| SKU | texto | **obrigatório** | Código interno único do produto. · até 30 caracteres |
| Título | texto | **obrigatório** | Título do catálogo. O título de venda de cada canal fica em Marketing. · até 120 caracteres |
| Status | lista | **obrigatório** |  |
| Tipo de produto | lista | **obrigatório** | Define se o produto tem variações ou é um kit. |
| Marca | texto | recomendado | Exigida pela maioria dos marketplaces. · até 60 caracteres |
| Modelo | texto | opcional | até 60 caracteres |
| Fabricante | texto | opcional | até 80 caracteres |
| Responsável | lista | **obrigatório** | Gerente de produto dono do cadastro: só ele (e o Admin) edita. Só o Admin troca. |
| Código do fabricante (MPN) | texto | opcional | até 40 caracteres |

### Códigos de barras

GTIN da unidade e da caixa.

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| EAN / GTIN | GTIN | recomendado | Código de barras da unidade de venda (8, 12, 13 ou 14 dígitos). Deixe vazio se o produto não tem GTIN. |
| GTIN da caixa | GTIN | opcional | Embalagem com várias unidades (ex.: DUN-14). |
| Unidades por caixa | inteiro | opcional |  |

### Classificação

Onde o produto fica no catálogo.

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| Departamento | lista | **obrigatório** |  |
| Categoria | texto | opcional | até 60 caracteres |
| Unidade de venda | lista | **obrigatório** |  |
| Categoria GS1 (GPC) | texto | opcional | Brick do GPC, usado no Cadastro Nacional de Produtos da GS1. · até 80 caracteres |
| Tags | lista (vírgula) | opcional | Separe por vírgula. |

### Descrição

Resumo interno do produto.

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| Descrição curta | texto longo | recomendado | até 255 caracteres |
| Observações internas | texto longo | opcional | Visíveis só para a equipe: não saem em notas fiscais nem em anúncios. |

## Fiscal

Classificação e tributação usadas na emissão da nota fiscal.

### Classificação fiscal

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| NCM | NCM | **obrigatório** | 8 dígitos. Define a tributação. |
| CEST | CEST | opcional | Obrigatório quando o NCM está sujeito a substituição tributária. |
| EX TIPI | texto | opcional | até 3 caracteres |
| NVE | texto | opcional | Nomenclatura de Valor Aduaneiro e Estatística (comércio exterior). · até 6 caracteres |
| Origem da mercadoria | lista | **obrigatório** |  |
| CNPJ do fabricante | CNPJ | opcional | CNPJ de quem fabricou o produto. |

### Unidade tributável

Quando a unidade de tributação difere da de venda.

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| Unidade tributável | lista | opcional |  |
| Fator de conversão | decimal | opcional | Quantas unidades tributáveis há em 1 unidade de venda. |
| GTIN da unidade tributável | GTIN | opcional | Deve ser o GTIN da menor unidade com código de barras. |

### Operação

CFOP padrão e informações adicionais da nota.

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| CFOP padrão (no estado) | lista com busca | **obrigatório** |  |
| CFOP padrão (fora do estado) | lista com busca | opcional |  |
| Informações adicionais do item | texto longo | opcional | Saem na nota fiscal, no campo de informações adicionais do produto. |

### ICMS

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| CST / CSOSN | lista | **obrigatório** | CST para regime normal; CSOSN para Simples Nacional. |
| Modalidade da base de cálculo | lista | opcional |  |
| Alíquota | % | opcional |  |
| Redução da base de cálculo | % | opcional |  |
| MVA (substituição tributária) | % | opcional |  |
| Alíquota da ST | % | opcional |  |
| FCP | % | opcional | Fundo de Combate à Pobreza. |
| Código do benefício fiscal | texto | opcional | até 10 caracteres |

### IPI

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| CST do IPI | lista | opcional |  |
| Enquadramento legal | texto | opcional | até 3 caracteres |
| Alíquota do IPI | % | opcional |  |

### PIS e COFINS

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| CST do PIS | lista | **obrigatório** |  |
| Alíquota do PIS | % | opcional |  |
| CST da COFINS | lista | **obrigatório** |  |
| Alíquota da COFINS | % | opcional |  |

### Reforma tributária (IBS, CBS e IS)

Campos da transição. Confira a tabela vigente do Informe Técnico 2025.002.

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| CST do IBS/CBS | lista | opcional | Lista parcial. Valide com a tabela vigente. |
| Classificação tributária (cClassTrib) | lista | opcional |  |
| Sujeito ao Imposto Seletivo (IS) | sim/não | opcional |  |

### Controles específicos

Só para produtos que exigem (importados, medicamentos, combustíveis).

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| Nº da FCI | texto | opcional | Ficha de Conteúdo de Importação. · até 36 caracteres |
| Registro ANVISA / MS | texto | opcional | até 13 caracteres |
| Código ANP | texto | opcional | Combustíveis e derivados. · até 9 caracteres |

## Operacional

Peso, dimensões e embalagem, que definem o frete.

### Logística

Peso e dimensões COM embalagem (afetam o frete).

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| Peso bruto | decimal | recomendado | unidade: kg |
| Peso líquido | decimal | opcional | unidade: kg |
| Altura da embalagem | decimal | recomendado | unidade: cm |
| Largura da embalagem | decimal | recomendado | unidade: cm |
| Comprimento da embalagem | decimal | recomendado | unidade: cm |
| Cubagem | calculado | opcional | Altura × largura × comprimento. |
| Volumes | inteiro | opcional |  |
| Tipo de embalagem | lista | opcional |  |
| Frágil | sim/não | opcional |  |
| Carga perigosa | sim/não | opcional |  |

## Marketing

Textos de venda, busca e publicação nos canais.

### Texto de venda

O que o cliente lê no anúncio e na loja.

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| Título de venda | texto | recomendado | Até 60 caracteres (limite do Mercado Livre). Ordem sugerida: produto, marca, modelo e principal característica. · até 60 caracteres |
| Subtítulo | texto | opcional | até 120 caracteres |
| Descrição completa | texto longo | recomendado | Estruture com tópicos e inclua as especificações. Sem telefones, e-mails ou promessas que não possa cumprir. |
| Destaques | lista (uma por linha) | opcional | Um por linha, até 5. |
| O que vem na caixa | texto longo | opcional |  |

### Busca e SEO

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| Palavras-chave | lista (vírgula) | opcional | Separe por vírgula. |
| Título para busca (SEO) | texto | opcional | até 70 caracteres |
| Descrição para busca (SEO) | texto longo | opcional | até 160 caracteres |
| Endereço (slug) | texto | opcional | até 80 caracteres |

## Imagens

Fotos do produto e checagem de qualidade.

### Galeria

_Tabela/lista própria (não são campos do esquema)._

### Qualidade das imagens

Requisitos usuais de marketplaces.

_Tabela/lista própria (não são campos do esquema)._

## Especificações

Características técnicas, dimensões, garantia e conformidade.

### Dimensões e peso do produto

SEM embalagem.

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| Altura | decimal | opcional | unidade: cm |
| Largura | decimal | opcional | unidade: cm |
| Comprimento | decimal | opcional | unidade: cm |
| Peso | decimal | opcional | unidade: kg |

### Características

Aparecem conforme o departamento.

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| Cor | texto | opcional | até 40 caracteres |
| Material | texto | opcional | até 60 caracteres |
| Tamanho | texto | opcional | até 20 caracteres · só em: Vestuário, Calçados |
| Voltagem | lista | opcional | só em: Eletrônicos, Elétrica, Informática |
| Potência | texto | opcional | até 20 caracteres · só em: Eletrônicos, Elétrica, Informática |
| Capacidade | texto | opcional | até 40 caracteres · só em: Informática, Eletrônicos, Utilidades |
| País de fabricação | texto | opcional | até 40 caracteres |

### Garantia

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| Prazo de garantia | inteiro | opcional | unidade: meses |
| Tipo de garantia | lista | opcional |  |
| Termos da garantia | texto longo | opcional |  |

### Conformidade

Homologações e certificações exigidas por lei.

| Campo | Tipo | Importância | Observação |
|---|---|---|---|
| Homologação Anatel | texto | opcional | até 20 caracteres · só em: Eletrônicos, Informática |
| Registro INMETRO | texto | opcional | até 20 caracteres · só em: Eletrônicos, Elétrica, Calçados, Utilidades |
| Outras certificações | lista (vírgula) | opcional | Separe por vírgula. |

## Variações e kits

Variações (tamanho, cor…) ou itens que compõem o kit. _(só para produtos do tipo: variacoes, kit)_

### Variações

_Tabela/lista própria (não são campos do esquema)._

### Composição do kit

_Tabela/lista própria (não são campos do esquema)._

## Histórico

Quem mudou o quê, e quando.

### Alterações

_Tabela/lista própria (não são campos do esquema)._
