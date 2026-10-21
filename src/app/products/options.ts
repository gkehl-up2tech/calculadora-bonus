/**
 * Listas de opções dos campos de produto. Valores de exemplo e listas PARCIAIS: confirme os códigos fiscais
 * (CST, CSOSN, cClassTrib…) nas tabelas oficiais vigentes antes de usar em documentos fiscais.
 */
export interface Option {
  value: string
  label: string
  /** Texto à direita na busca (ex.: o próprio código). */
  hint?: string
}

const o = (value: string, label: string): Option => ({ value, label })
const code = (value: string, label: string): Option => ({ value, label: `${value} — ${label}` })

export const NCM_OPTIONS: Option[] = [
  { value: '7318.15.00', label: 'Parafusos e pinos', hint: '7318.15.00' },
  { value: '8544.42.00', label: 'Condutores elétricos com conectores', hint: '8544.42.00' },
  { value: '8517.13.00', label: 'Smartphones', hint: '8517.13.00' },
  { value: '3926.90.90', label: 'Outras obras de plástico', hint: '3926.90.90' },
  { value: '9403.30.00', label: 'Móveis de madeira para escritório', hint: '9403.30.00' },
  { value: '8471.30.19', label: 'Computadores portáteis', hint: '8471.30.19' },
  { value: '6109.10.00', label: 'Camisetas de algodão', hint: '6109.10.00' },
  { value: '8504.40.90', label: 'Conversores estáticos (carregadores)', hint: '8504.40.90' },
  { value: '3304.99.90', label: 'Produtos de beleza e cuidados com a pele', hint: '3304.99.90' },
  { value: '8528.72.00', label: 'Televisores em cores', hint: '8528.72.00' },
  { value: '6403.99.90', label: 'Calçados de couro', hint: '6403.99.90' },
]

export const CFOP_OPTIONS: Option[] = [
  { value: '5102', label: 'Venda de mercadoria adquirida de terceiros (no estado)', hint: '5102' },
  { value: '6102', label: 'Venda de mercadoria adquirida de terceiros (fora do estado)', hint: '6102' },
  { value: '5101', label: 'Venda de produção do estabelecimento (no estado)', hint: '5101' },
  { value: '6101', label: 'Venda de produção do estabelecimento (fora do estado)', hint: '6101' },
  { value: '5405', label: 'Venda com substituição tributária', hint: '5405' },
  { value: '6404', label: 'Venda com substituição tributária (fora do estado)', hint: '6404' },
]

export const UNIT_OPTIONS: Option[] = [
  code('UN', 'Unidade'),
  code('CX', 'Caixa'),
  code('KG', 'Quilograma'),
  code('M', 'Metro'),
  code('L', 'Litro'),
  code('PAR', 'Par'),
  code('PCT', 'Pacote'),
]

export const ORIGEM_OPTIONS: Option[] = [
  code('0', 'Nacional'),
  code('1', 'Estrangeira, importação direta'),
  code('2', 'Estrangeira, adquirida no mercado interno'),
  code('3', 'Nacional, conteúdo de importação entre 40% e 70%'),
  code('4', 'Nacional, processos produtivos básicos'),
  code('5', 'Nacional, conteúdo de importação até 40%'),
  code('6', 'Estrangeira, importação direta, sem similar nacional'),
  code('7', 'Estrangeira, mercado interno, sem similar nacional'),
  code('8', 'Nacional, conteúdo de importação acima de 70%'),
]

/** CST (regime normal) e CSOSN (Simples Nacional) na mesma lista; a empresa usa um dos dois conjuntos. */
export const CSOSN_OPTIONS: Option[] = [
  code('101', 'Simples Nacional, com permissão de crédito'),
  code('102', 'Simples Nacional, sem permissão de crédito'),
  code('500', 'ICMS cobrado antes por substituição tributária'),
]

export const ICMS_CST_OPTIONS: Option[] = [
  code('00', 'CST: tributada integralmente'),
  code('10', 'CST: tributada, com ICMS por substituição tributária'),
  code('20', 'CST: com redução de base de cálculo'),
  code('30', 'CST: isenta ou não tributada, com ICMS por ST'),
  code('40', 'CST: isenta'),
  code('41', 'CST: não tributada'),
  code('50', 'CST: suspensão'),
  code('51', 'CST: diferimento'),
  code('60', 'CST: ICMS cobrado antes por substituição tributária'),
  code('70', 'CST: redução de base de cálculo e ICMS por ST'),
  code('90', 'CST: outras'),
  code('101', 'CSOSN: tributada pelo Simples Nacional, com crédito'),
  code('102', 'CSOSN: tributada pelo Simples Nacional, sem crédito'),
  code('103', 'CSOSN: isenção para faixa de receita bruta'),
  code('201', 'CSOSN: com crédito e ICMS por ST'),
  code('202', 'CSOSN: sem crédito e ICMS por ST'),
  code('203', 'CSOSN: isenção e ICMS por ST'),
  code('300', 'CSOSN: imune'),
  code('400', 'CSOSN: não tributada pelo Simples Nacional'),
  code('500', 'CSOSN: ICMS cobrado antes por ST ou antecipação'),
  code('900', 'CSOSN: outros'),
]

export const ICMS_MOD_BC_OPTIONS: Option[] = [
  code('0', 'Margem de valor agregado (%)'),
  code('1', 'Pauta (valor)'),
  code('2', 'Preço tabelado máximo (valor)'),
  code('3', 'Valor da operação'),
]

export const IPI_CST_OPTIONS: Option[] = [
  code('50', 'Saída tributada'),
  code('51', 'Saída tributável com alíquota zero'),
  code('52', 'Saída isenta'),
  code('53', 'Saída não tributada'),
  code('54', 'Saída imune'),
  code('55', 'Saída com suspensão'),
  code('99', 'Outras saídas'),
]

export const PIS_COFINS_CST_OPTIONS: Option[] = [
  code('01', 'Operação tributável, alíquota normal'),
  code('02', 'Operação tributável, alíquota diferenciada'),
  code('04', 'Operação tributável monofásica, alíquota zero'),
  code('05', 'Operação tributável por substituição tributária'),
  code('06', 'Operação tributável a alíquota zero'),
  code('07', 'Operação isenta da contribuição'),
  code('08', 'Operação sem incidência da contribuição'),
  code('09', 'Operação com suspensão da contribuição'),
  code('49', 'Outras operações de saída'),
  code('99', 'Outras operações'),
]

/** Lista PARCIAL: a tabela oficial (Informe Técnico 2025.002) muda de versão. Consulte a vigente. */
export const IBS_CBS_CST_OPTIONS: Option[] = [code('000', 'Tributação integral'), o('outra', 'Outra (consultar a tabela oficial)')]
export const CCLASSTRIB_OPTIONS: Option[] = [code('000001', 'Situações tributadas integralmente pela alíquota padrão'), o('outra', 'Outra (consultar a tabela oficial)')]

export const STATUS_OPTIONS: Option[] = [o('active', 'Ativo'), o('inactive', 'Inativo'), o('draft', 'Rascunho')]
export const TIPO_OPTIONS: Option[] = [o('simples', 'Simples'), o('variacoes', 'Com variações'), o('kit', 'Kit'), o('fabricado', 'Fabricado'), o('materia-prima', 'Matéria-prima')]
export const CONDICAO_OPTIONS: Option[] = [o('novo', 'Novo'), o('usado', 'Usado'), o('recondicionado', 'Recondicionado')]
export const ESCALA_OPTIONS: Option[] = [o('S', 'Sim, escala relevante'), o('N', 'Não, escala não relevante')]
export const RASTREIO_OPTIONS: Option[] = [o('nenhum', 'Sem rastreio'), o('lote', 'Por lote'), o('serie', 'Por número de série'), o('validade', 'Por lote e validade')]
export const EMBALAGEM_OPTIONS: Option[] = [o('caixa', 'Caixa'), o('saco', 'Saco'), o('blister', 'Blister'), o('envelope', 'Envelope'), o('pallet', 'Pallet'), o('granel', 'A granel')]
export const GARANTIA_OPTIONS: Option[] = [o('fabricante', 'Do fabricante'), o('loja', 'Da loja'), o('sem', 'Sem garantia')]
export const VOLTAGEM_OPTIONS: Option[] = [o('127', '127 V'), o('220', '220 V'), o('bivolt', 'Bivolt'), o('bateria', 'Bateria')]

/** Conjuntos por chave. O conjunto "departamento" é fornecido em tempo de execução pela página. */
export const OPTION_SETS = {
  status: STATUS_OPTIONS,
  tipo: TIPO_OPTIONS,
  condicao: CONDICAO_OPTIONS,
  unidade: UNIT_OPTIONS,
  ncm: NCM_OPTIONS,
  cfop: CFOP_OPTIONS,
  origem: ORIGEM_OPTIONS,
  escala: ESCALA_OPTIONS,
  icmsCst: ICMS_CST_OPTIONS,
  icmsModBc: ICMS_MOD_BC_OPTIONS,
  ipiCst: IPI_CST_OPTIONS,
  pisCofinsCst: PIS_COFINS_CST_OPTIONS,
  ibsCbsCst: IBS_CBS_CST_OPTIONS,
  cClassTrib: CCLASSTRIB_OPTIONS,
  rastreio: RASTREIO_OPTIONS,
  embalagem: EMBALAGEM_OPTIONS,
  garantia: GARANTIA_OPTIONS,
  voltagem: VOLTAGEM_OPTIONS,
} as const

export type OptionSetKey = keyof typeof OPTION_SETS | 'departamento'
