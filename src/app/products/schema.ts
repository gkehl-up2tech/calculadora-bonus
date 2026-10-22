/**
 * ESQUEMA DE INFORMAÇÕES DO PRODUTO — fonte única de verdade.
 *
 * A mesma definição alimenta: a página do produto (leitura e edição), os indicadores de pendência por aba,
 * a validação e o documento `docs/produto-mapa-de-informacoes.md` (gerado por `npm run docs:produto`).
 * Mudar um campo de aba é mudar uma linha aqui.
 *
 * Este arquivo não importa nada em tempo de execução (só tipos), para poder ser lido também por scripts.
 */
import type { OptionSetKey } from './options'

export type TabId = 'principal' | 'fiscal' | 'operacional' | 'marketing' | 'imagens' | 'especificacoes' | 'variacoes' | 'historico'

export type FieldKind =
  | 'text'
  | 'url'
  | 'textarea'
  | 'lines' // um item por linha
  | 'tags' // separados por vírgula
  | 'select'
  | 'combobox'
  | 'ncm'
  | 'cest'
  | 'gtin'
  | 'cnpj'
  | 'money'
  | 'integer'
  | 'decimal'
  | 'percent'
  | 'boolean'
  | 'date'
  | 'computed'

/**
 * required    = sem isso o produto não pode ser vendido/faturado: falta = pendência.
 * recommended = melhora venda, integração e qualidade: falta = pendência (menos grave).
 * optional    = só quando se aplica.
 */
export type Importance = 'required' | 'recommended' | 'optional'

export type FieldValue = string | number | boolean | string[] | null
export type Values = Record<string, FieldValue>

export interface FieldDef {
  id: string
  section: string
  label: string
  kind: FieldKind
  importance?: Importance
  hint?: string
  /** Conjunto de opções (select/combobox). */
  options?: OptionSetKey
  /** Unidade exibida ao lado do valor (kg, cm, dias…). */
  unit?: string
  maxLength?: number
  /** Ocupa a linha inteira da grade. */
  wide?: boolean
  /** Calculado e somente leitura. */
  readOnly?: boolean
  /** Só o Admin altera (os demais veem o valor, sem controle de edição). */
  adminOnly?: boolean
  /** Mostra o campo só para estes departamentos (ex.: voltagem só para eletrônicos). */
  departments?: string[]
  /** Mostra o campo só para estes tipos de produto. */
  tipos?: string[]
  /** Para `computed`: fórmula a partir dos demais valores. */
  compute?: (v: Values) => string
  placeholder?: string
}

export interface SectionDef {
  id: string
  tab: TabId
  title: string
  description?: string
  /** Seção cujo conteúdo é uma tabela/lista própria (não são campos do esquema). */
  custom?: boolean
}

export interface TabDef {
  id: TabId
  label: string
  description: string
  /** Só aparece quando o tipo do produto pede (ex.: variações e kits). */
  tipos?: string[]
}

export const TABS: TabDef[] = [
  { id: 'principal', label: 'Principal', description: 'Identificação, códigos de barras, classificação e descrição.' },
  { id: 'fiscal', label: 'Fiscal', description: 'Classificação e tributação usadas na emissão da nota fiscal.' },
  { id: 'operacional', label: 'Operacional', description: 'Peso, dimensões e embalagem, que definem o frete.' },
  { id: 'marketing', label: 'Marketing', description: 'Textos de venda, busca e publicação nos canais.' },
  { id: 'imagens', label: 'Imagens', description: 'Fotos do produto e checagem de qualidade.' },
  { id: 'especificacoes', label: 'Especificações', description: 'Características técnicas, dimensões, garantia e conformidade.' },
  { id: 'variacoes', label: 'Variações e kits', description: 'Variações (tamanho, cor…) ou itens que compõem o kit.', tipos: ['variacoes', 'kit'] },
  { id: 'historico', label: 'Histórico', description: 'Quem mudou o quê, e quando.' },
]

export const SECTIONS: SectionDef[] = [
  // Principal
  { id: 'identificacao', tab: 'principal', title: 'Identificação', description: 'Como o produto é reconhecido no catálogo.' },
  { id: 'codigos', tab: 'principal', title: 'Códigos de barras', description: 'GTIN da unidade e da caixa.' },
  { id: 'classificacao', tab: 'principal', title: 'Classificação', description: 'Onde o produto fica no catálogo.' },
  { id: 'descricao', tab: 'principal', title: 'Descrição', description: 'Resumo interno do produto.' },
  // Fiscal
  { id: 'fiscal-class', tab: 'fiscal', title: 'Classificação fiscal' },
  { id: 'fiscal-unid', tab: 'fiscal', title: 'Unidade tributável', description: 'Quando a unidade de tributação difere da de venda.' },
  { id: 'fiscal-op', tab: 'fiscal', title: 'Operação', description: 'CFOP padrão e informações adicionais da nota.' },
  { id: 'icms', tab: 'fiscal', title: 'ICMS' },
  { id: 'ipi', tab: 'fiscal', title: 'IPI' },
  { id: 'pis-cofins', tab: 'fiscal', title: 'PIS e COFINS' },
  { id: 'reforma', tab: 'fiscal', title: 'Reforma tributária (IBS, CBS e IS)', description: 'Campos da transição. Confira a tabela vigente do Informe Técnico 2025.002.' },
  { id: 'fiscal-ctrl', tab: 'fiscal', title: 'Controles específicos', description: 'Só para produtos que exigem (importados, medicamentos, combustíveis).' },
  // Comercial
  // Operacional
  { id: 'logistica', tab: 'operacional', title: 'Logística', description: 'Peso e dimensões COM embalagem (afetam o frete).' },
  // Marketing
  { id: 'texto-venda', tab: 'marketing', title: 'Texto de venda', description: 'O que o cliente lê no anúncio e na loja.' },
  { id: 'busca-seo', tab: 'marketing', title: 'Busca e SEO' },
  // Imagens
  { id: 'galeria', tab: 'imagens', title: 'Galeria', custom: true },
  { id: 'qualidade-imagens', tab: 'imagens', title: 'Qualidade das imagens', description: 'Requisitos usuais de marketplaces.', custom: true },
  // Especificações
  { id: 'dim-produto', tab: 'especificacoes', title: 'Dimensões e peso do produto', description: 'SEM embalagem.' },
  { id: 'caracteristicas', tab: 'especificacoes', title: 'Características', description: 'Aparecem conforme o departamento.' },
  { id: 'garantia', tab: 'especificacoes', title: 'Garantia' },
  { id: 'conformidade', tab: 'especificacoes', title: 'Conformidade', description: 'Homologações e certificações exigidas por lei.' },
  // Variações e kits
  { id: 'variacoes-lista', tab: 'variacoes', title: 'Variações', custom: true },
  { id: 'kit-composicao', tab: 'variacoes', title: 'Composição do kit', custom: true },
  // Histórico
  { id: 'historico-lista', tab: 'historico', title: 'Alterações', custom: true },
]

const ELETRO = ['Eletrônicos', 'Elétrica', 'Informática']

export const FIELDS: FieldDef[] = [
  // ───────────────────────── Principal › Identificação
  { id: 'sku', section: 'identificacao', label: 'SKU', kind: 'text', importance: 'required', maxLength: 30, hint: 'Código interno único do produto.' },
  { id: 'title', section: 'identificacao', label: 'Título', kind: 'text', importance: 'required', maxLength: 120, wide: true, hint: 'Título do catálogo. O título de venda de cada canal fica em Marketing.' },
  { id: 'status', section: 'identificacao', label: 'Status', kind: 'select', options: 'status', importance: 'required' },
  { id: 'tipo', section: 'identificacao', label: 'Tipo de produto', kind: 'select', options: 'tipo', importance: 'required', hint: 'Define se o produto tem variações ou é um kit.' },
  { id: 'marca', section: 'identificacao', label: 'Marca', kind: 'text', importance: 'recommended', maxLength: 60, hint: 'Exigida pela maioria dos marketplaces.' },
  { id: 'modelo', section: 'identificacao', label: 'Modelo', kind: 'text', maxLength: 60 },
  { id: 'fabricante', section: 'identificacao', label: 'Fabricante', kind: 'text', maxLength: 80 },
  { id: 'responsavel', section: 'identificacao', label: 'Responsável', kind: 'select', options: 'responsavel', importance: 'required', adminOnly: true, hint: 'Gerente de produto dono do cadastro: só ele (e o Admin) edita. Só o Admin troca.' },
  { id: 'mpn', section: 'identificacao', label: 'Código do fabricante (MPN)', kind: 'text', maxLength: 40 },
  // Principal › Códigos de barras
  { id: 'ean', section: 'codigos', label: 'EAN / GTIN', kind: 'gtin', importance: 'recommended', hint: 'Código de barras da unidade de venda (8, 12, 13 ou 14 dígitos). Deixe vazio se o produto não tem GTIN.' },
  { id: 'gtinCaixa', section: 'codigos', label: 'GTIN da caixa', kind: 'gtin', hint: 'Embalagem com várias unidades (ex.: DUN-14).' },
  { id: 'unidadesCaixa', section: 'codigos', label: 'Unidades por caixa', kind: 'integer' },
  // Principal › Classificação
  { id: 'departamento', section: 'classificacao', label: 'Departamento', kind: 'select', options: 'departamento', importance: 'required' },
  { id: 'categoria', section: 'classificacao', label: 'Categoria', kind: 'text', maxLength: 60 },
  { id: 'unidade', section: 'classificacao', label: 'Unidade de venda', kind: 'select', options: 'unidade', importance: 'required' },
  { id: 'gpc', section: 'classificacao', label: 'Categoria GS1 (GPC)', kind: 'text', maxLength: 80, hint: 'Brick do GPC, usado no Cadastro Nacional de Produtos da GS1.' },
  { id: 'tags', section: 'classificacao', label: 'Tags', kind: 'tags', wide: true, hint: 'Separe por vírgula.' },
  // Principal › Descrição
  { id: 'descricaoCurta', section: 'descricao', label: 'Descrição curta', kind: 'textarea', importance: 'recommended', maxLength: 255, wide: true },
  { id: 'observacoes', section: 'descricao', label: 'Observações internas', kind: 'textarea', wide: true, hint: 'Visíveis só para a equipe: não saem em notas fiscais nem em anúncios.' },

  // ───────────────────────── Fiscal › Classificação fiscal
  { id: 'ncm', section: 'fiscal-class', label: 'NCM', kind: 'ncm', importance: 'required', hint: '8 dígitos. Define a tributação.' },
  { id: 'cest', section: 'fiscal-class', label: 'CEST', kind: 'cest', hint: 'Obrigatório quando o NCM está sujeito a substituição tributária.' },
  { id: 'extipi', section: 'fiscal-class', label: 'EX TIPI', kind: 'text', maxLength: 3 },
  { id: 'nve', section: 'fiscal-class', label: 'NVE', kind: 'text', maxLength: 6, hint: 'Nomenclatura de Valor Aduaneiro e Estatística (comércio exterior).' },
  { id: 'origem', section: 'fiscal-class', label: 'Origem da mercadoria', kind: 'select', options: 'origem', importance: 'required', wide: true },
  { id: 'cnpjFab', section: 'fiscal-class', label: 'CNPJ do fabricante', kind: 'cnpj', hint: 'CNPJ de quem fabricou o produto.' },
  // Fiscal › Unidade tributável
  { id: 'unidadeTrib', section: 'fiscal-unid', label: 'Unidade tributável', kind: 'select', options: 'unidade' },
  { id: 'fatorTrib', section: 'fiscal-unid', label: 'Fator de conversão', kind: 'decimal', hint: 'Quantas unidades tributáveis há em 1 unidade de venda.' },
  { id: 'eanTrib', section: 'fiscal-unid', label: 'GTIN da unidade tributável', kind: 'gtin', hint: 'Deve ser o GTIN da menor unidade com código de barras.' },
  // Fiscal › Operação
  { id: 'cfopDentro', section: 'fiscal-op', label: 'CFOP padrão (no estado)', kind: 'combobox', options: 'cfop', importance: 'required' },
  { id: 'cfopFora', section: 'fiscal-op', label: 'CFOP padrão (fora do estado)', kind: 'combobox', options: 'cfop' },
  { id: 'infAdicionais', section: 'fiscal-op', label: 'Informações adicionais do item', kind: 'textarea', wide: true, hint: 'Saem na nota fiscal, no campo de informações adicionais do produto.' },
  // Fiscal › ICMS
  { id: 'icmsCst', section: 'icms', label: 'CST / CSOSN', kind: 'select', options: 'icmsCst', importance: 'required', wide: true, hint: 'CST para regime normal; CSOSN para Simples Nacional.' },
  { id: 'icmsModBc', section: 'icms', label: 'Modalidade da base de cálculo', kind: 'select', options: 'icmsModBc' },
  { id: 'icmsAliq', section: 'icms', label: 'Alíquota', kind: 'percent' },
  { id: 'icmsRedBc', section: 'icms', label: 'Redução da base de cálculo', kind: 'percent' },
  { id: 'icmsStMva', section: 'icms', label: 'MVA (substituição tributária)', kind: 'percent' },
  { id: 'icmsStAliq', section: 'icms', label: 'Alíquota da ST', kind: 'percent' },
  { id: 'fcpAliq', section: 'icms', label: 'FCP', kind: 'percent', hint: 'Fundo de Combate à Pobreza.' },
  { id: 'cBenef', section: 'icms', label: 'Código do benefício fiscal', kind: 'text', maxLength: 10 },
  // Fiscal › IPI
  { id: 'ipiCst', section: 'ipi', label: 'CST do IPI', kind: 'select', options: 'ipiCst', wide: true },
  { id: 'ipiEnq', section: 'ipi', label: 'Enquadramento legal', kind: 'text', maxLength: 3 },
  { id: 'ipiAliq', section: 'ipi', label: 'Alíquota do IPI', kind: 'percent' },
  // Fiscal › PIS e COFINS
  { id: 'pisCst', section: 'pis-cofins', label: 'CST do PIS', kind: 'select', options: 'pisCofinsCst', importance: 'required', wide: true },
  { id: 'pisAliq', section: 'pis-cofins', label: 'Alíquota do PIS', kind: 'percent' },
  { id: 'cofinsCst', section: 'pis-cofins', label: 'CST da COFINS', kind: 'select', options: 'pisCofinsCst', importance: 'required', wide: true },
  { id: 'cofinsAliq', section: 'pis-cofins', label: 'Alíquota da COFINS', kind: 'percent' },
  // Fiscal › Reforma tributária
  { id: 'ibsCbsCst', section: 'reforma', label: 'CST do IBS/CBS', kind: 'select', options: 'ibsCbsCst', wide: true, hint: 'Lista parcial. Valide com a tabela vigente.' },
  { id: 'cClassTrib', section: 'reforma', label: 'Classificação tributária (cClassTrib)', kind: 'select', options: 'cClassTrib', wide: true },
  { id: 'sujeitoIs', section: 'reforma', label: 'Sujeito ao Imposto Seletivo (IS)', kind: 'boolean' },
  // Fiscal › Controles específicos
  { id: 'fci', section: 'fiscal-ctrl', label: 'Nº da FCI', kind: 'text', maxLength: 36, hint: 'Ficha de Conteúdo de Importação.' },
  { id: 'anvisa', section: 'fiscal-ctrl', label: 'Registro ANVISA / MS', kind: 'text', maxLength: 13 },
  { id: 'anp', section: 'fiscal-ctrl', label: 'Código ANP', kind: 'text', maxLength: 9, hint: 'Combustíveis e derivados.' },


  // ───────────────────────── Operacional › Logística
  { id: 'pesoBruto', section: 'logistica', label: 'Peso bruto', kind: 'decimal', unit: 'kg', importance: 'recommended' },
  { id: 'pesoLiquido', section: 'logistica', label: 'Peso líquido', kind: 'decimal', unit: 'kg' },
  { id: 'alturaEmb', section: 'logistica', label: 'Altura da embalagem', kind: 'decimal', unit: 'cm', importance: 'recommended' },
  { id: 'larguraEmb', section: 'logistica', label: 'Largura da embalagem', kind: 'decimal', unit: 'cm', importance: 'recommended' },
  { id: 'comprimentoEmb', section: 'logistica', label: 'Comprimento da embalagem', kind: 'decimal', unit: 'cm', importance: 'recommended' },
  { id: 'cubagem', section: 'logistica', label: 'Cubagem', kind: 'computed', hint: 'Altura × largura × comprimento.', compute: (v) => cubagem(v) },
  { id: 'volumes', section: 'logistica', label: 'Volumes', kind: 'integer' },
  { id: 'tipoEmbalagem', section: 'logistica', label: 'Tipo de embalagem', kind: 'select', options: 'embalagem' },
  { id: 'fragil', section: 'logistica', label: 'Frágil', kind: 'boolean' },
  { id: 'perigoso', section: 'logistica', label: 'Carga perigosa', kind: 'boolean' },

  // ───────────────────────── Marketing
  { id: 'tituloVenda', section: 'texto-venda', label: 'Título de venda', kind: 'text', importance: 'recommended', maxLength: 60, wide: true, hint: 'Até 60 caracteres (limite do Mercado Livre). Ordem sugerida: produto, marca, modelo e principal característica.' },
  { id: 'subtitulo', section: 'texto-venda', label: 'Subtítulo', kind: 'text', maxLength: 120, wide: true },
  { id: 'descricaoVenda', section: 'texto-venda', label: 'Descrição completa', kind: 'textarea', importance: 'recommended', wide: true, hint: 'Estruture com tópicos e inclua as especificações. Sem telefones, e-mails ou promessas que não possa cumprir.' },
  { id: 'destaques', section: 'texto-venda', label: 'Destaques', kind: 'lines', wide: true, hint: 'Um por linha, até 5.' },
  { id: 'conteudoEmbalagem', section: 'texto-venda', label: 'O que vem na caixa', kind: 'textarea', wide: true },
  { id: 'palavrasChave', section: 'busca-seo', label: 'Palavras-chave', kind: 'tags', wide: true, hint: 'Separe por vírgula.' },
  { id: 'seoTitulo', section: 'busca-seo', label: 'Título para busca (SEO)', kind: 'text', maxLength: 70, wide: true },
  { id: 'seoDescricao', section: 'busca-seo', label: 'Descrição para busca (SEO)', kind: 'textarea', maxLength: 160, wide: true },
  { id: 'slug', section: 'busca-seo', label: 'Endereço (slug)', kind: 'text', maxLength: 80, wide: true },

  // ───────────────────────── Especificações
  { id: 'alturaProd', section: 'dim-produto', label: 'Altura', kind: 'decimal', unit: 'cm' },
  { id: 'larguraProd', section: 'dim-produto', label: 'Largura', kind: 'decimal', unit: 'cm' },
  { id: 'comprimentoProd', section: 'dim-produto', label: 'Comprimento', kind: 'decimal', unit: 'cm' },
  { id: 'pesoProd', section: 'dim-produto', label: 'Peso', kind: 'decimal', unit: 'kg' },
  { id: 'cor', section: 'caracteristicas', label: 'Cor', kind: 'text', maxLength: 40 },
  { id: 'material', section: 'caracteristicas', label: 'Material', kind: 'text', maxLength: 60 },
  { id: 'tamanho', section: 'caracteristicas', label: 'Tamanho', kind: 'text', maxLength: 20, departments: ['Vestuário', 'Calçados'] },
  { id: 'voltagem', section: 'caracteristicas', label: 'Voltagem', kind: 'select', options: 'voltagem', departments: ELETRO },
  { id: 'potencia', section: 'caracteristicas', label: 'Potência', kind: 'text', maxLength: 20, departments: ELETRO },
  { id: 'capacidade', section: 'caracteristicas', label: 'Capacidade', kind: 'text', maxLength: 40, departments: ['Informática', 'Eletrônicos', 'Utilidades'] },
  { id: 'paisOrigem', section: 'caracteristicas', label: 'País de fabricação', kind: 'text', maxLength: 40 },
  { id: 'garantiaMeses', section: 'garantia', label: 'Prazo de garantia', kind: 'integer', unit: 'meses' },
  { id: 'garantiaTipo', section: 'garantia', label: 'Tipo de garantia', kind: 'select', options: 'garantia' },
  { id: 'garantiaTermos', section: 'garantia', label: 'Termos da garantia', kind: 'textarea', wide: true },
  { id: 'anatel', section: 'conformidade', label: 'Homologação Anatel', kind: 'text', maxLength: 20, departments: ['Eletrônicos', 'Informática'] },
  { id: 'inmetro', section: 'conformidade', label: 'Registro INMETRO', kind: 'text', maxLength: 20, departments: ['Eletrônicos', 'Elétrica', 'Calçados', 'Utilidades'] },
  { id: 'certificacoes', section: 'conformidade', label: 'Outras certificações', kind: 'tags', wide: true, hint: 'Separe por vírgula.' },
]

/**
 * O que um RASCUNHO precisa para ser salvo. Os demais campos obrigatórios só passam a bloquear quando o produto
 * deixa de ser rascunho (ativar ou inativar): assim dá para cadastrar aos poucos sem perder o que já foi digitado.
 */
export const DRAFT_REQUIRED = ['sku', 'title', 'status', 'tipo', 'departamento', 'unidade', 'responsavel']

// ───────────────────────── Cálculos

const num = (v: FieldValue | undefined) => (typeof v === 'number' ? v : null)

function cubagem(v: Values) {
  const [h, w, l] = [num(v.alturaEmb), num(v.larguraEmb), num(v.comprimentoEmb)]
  if (!h || !w || !l) return '—'
  return `${((h * w * l) / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 4 })} m³`
}

// ───────────────────────── Consultas

/** O campo pertence à aba Fiscal (o que a Tributação aprova)? */
export const isFiscalField = (field: FieldDef) => SECTIONS.find((s) => s.id === field.section)?.tab === 'fiscal'

export const sectionsOf = (tab: TabId) => SECTIONS.filter((s) => s.tab === tab)
export const fieldsOf = (section: string) => FIELDS.filter((f) => f.section === section)

export function isEmpty(value: FieldValue | undefined): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

/** O campo se aplica a este produto? (departamento e tipo). */
export function applies(field: FieldDef, values: Values): boolean {
  if (field.departments && !field.departments.includes(String(values.departamento ?? ''))) return false
  if (field.tipos && !field.tipos.includes(String(values.tipo ?? ''))) return false
  return true
}

export function visibleTabs(values: Values): TabDef[] {
  return TABS.filter((t) => !t.tipos || t.tipos.includes(String(values.tipo ?? '')))
}

/** Campos obrigatórios/recomendados sem valor, por aba. */
export function pendingFields(values: Values): Record<TabId, FieldDef[]> {
  const out = Object.fromEntries(TABS.map((t) => [t.id, [] as FieldDef[]])) as Record<TabId, FieldDef[]>
  const tabOf = new Map(SECTIONS.map((s) => [s.id, s.tab]))
  for (const f of FIELDS) {
    if (f.importance !== 'required' && f.importance !== 'recommended') continue
    if (!applies(f, values) || !isEmpty(values[f.id])) continue
    const tab = tabOf.get(f.section)
    if (tab) out[tab].push(f)
  }
  return out
}

export type Pendencia = 'fiscal' | 'gtin' | 'descricao'

/**
 * Pendências no vocabulário do dashboard, derivadas do esquema. Garante que a lista de produtos e o
 * dashboard concordem com o que a página do produto mostra.
 */
export function derivePendencias(values: Values): Pendencia[] {
  const missing = pendingFields(values)
  const out: Pendencia[] = []
  if (missing.fiscal.length) out.push('fiscal')
  if (missing.principal.some((f) => f.id === 'ean')) out.push('gtin')
  if (missing.principal.some((f) => f.id === 'descricaoCurta')) out.push('descricao')
  return out
}
