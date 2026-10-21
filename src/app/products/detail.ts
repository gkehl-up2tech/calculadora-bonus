/**
 * DETALHE DO PRODUTO — DADOS DE EXEMPLO E ARMAZENAMENTO EM MEMÓRIA. TEMPORÁRIOS.
 *
 * Gera, de forma determinística, todos os campos do esquema (src/app/products/schema.ts) para cada produto
 * de exemplo e guarda as edições feitas na página do produto enquanto a aba do navegador estiver aberta.
 * Quando houver backend, troque `getProductDetail` / `saveProductValues` pelo acesso real mantendo as assinaturas.
 * Valores fiscais (NCM, CST, alíquotas, CEST…) são ILUSTRATIVOS — não use para emitir documentos fiscais.
 */
import { useSyncExternalStore } from 'react'
import { galleryFor } from './photos'
import { PRODUCTS, type Product } from './sample-products'
import { FIELDS, derivePendencias, isEmpty, type FieldDef, type Values } from './schema'

// ───────────────────────── Tipos dos blocos em tabela

export interface Deposit { id: string; name: string; balance: number; reserved: number }
export interface Supplier { id: string; name: string; code: string; lastCost: number; leadTime: number }
export interface PriceTable { id: string; name: string; price: number; validity: string }
export type ChannelStatus = 'published' | 'paused' | 'error'
export interface Channel { id: string; name: string; status: ChannelStatus; adId: string; price: number; stock: number; syncedAt: string; note?: string }
export type ImageKind = 'principal' | 'fundo-branco' | 'detalhe' | 'escala'
export interface ProductImage { id: string; src: string; kind: ImageKind; alt: string; width: number; height: number; sizeKb: number }
export interface Variation { id: string; label: string; sku: string; ean: string; price: number; stock: number }
export interface KitItem { id: string; title: string; sku: string; qty: number }
export interface HistoryEntry { id: string; at: string; user: string; field: string; from: string; to: string }

export interface ProductExtras {
  deposits: Deposit[]
  suppliers: Supplier[]
  priceTables: PriceTable[]
  channels: Channel[]
  images: ProductImage[]
  variations: Variation[]
  kitItems: KitItem[]
  history: HistoryEntry[]
}

export interface ProductDetail {
  values: Values
  extras: ProductExtras
}

// ───────────────────────── Especificações por produto-base (mesma ordem de sample-products.ts)

interface Spec {
  brand: string
  model: string
  gpc: string
  cest?: string
  origem?: string
  ipi?: number
  unidade?: string
  boxQty: number
  prod: { h: number; w: number; l: number; kg: number }
  emb: { h: number; w: number; l: number; kg: number }
  material: string
  cor: string
  tam?: string
  volt?: string
  potencia?: string
  capacidade?: string
  garantia: number
  anatel?: string
  inmetro?: string
  validade?: number
  anvisa?: string
  curta: string
  destaques: string[]
  caixa: string
  chaves: string[]
  fornecedor: string
  tipo?: 'variacoes' | 'kit'
}

const SPECS: Spec[] = [
  { brand: 'Fixa Forte', model: 'SX-M8', gpc: 'Parafusos e fixadores', boxQty: 100, prod: { h: 0.5, w: 1.3, l: 3, kg: 0.012 }, emb: { h: 3, w: 6, l: 9, kg: 0.02 }, material: 'Aço carbono zincado', cor: 'Prata', garantia: 0, curta: 'Parafuso sextavado M8 em aço carbono zincado, para fixação em estruturas e máquinas.', destaques: ['Aço carbono zincado', 'Cabeça sextavada', 'Resistente à corrosão'], caixa: '1 parafuso', chaves: ['parafuso', 'sextavado', 'm8', 'fixação'], fornecedor: 'Distribuidora Aço Brasil' },
  { brand: 'CondutorMax', model: 'PP-3x2,5', gpc: 'Cabos e fios elétricos', unidade: 'M', boxQty: 1, prod: { h: 0.9, w: 0.9, l: 100, kg: 0.12 }, emb: { h: 8, w: 8, l: 30, kg: 0.14 }, material: 'Cobre com isolação em PVC', cor: 'Preto', volt: 'bivolt', potencia: '15 A', garantia: 12, inmetro: '004567/2024', curta: 'Cabo de energia flexível de 3 condutores de 2,5 mm², para instalações e extensões.', destaques: ['3 condutores de 2,5 mm²', 'Isolação em PVC antichama', 'Vendido por metro'], caixa: 'Cabo cortado sob medida', chaves: ['cabo', 'energia', 'elétrico', '2,5 mm'], fornecedor: 'Condutores do Sul' },
  { brand: 'Nova Tech', model: 'NT-S5', gpc: 'Telefones celulares', cest: '21.063.00', origem: '2', ipi: 15, boxQty: 10, prod: { h: 15.1, w: 7.2, l: 0.8, kg: 0.19 }, emb: { h: 6, w: 10, l: 18, kg: 0.45 }, material: 'Alumínio e vidro', cor: 'Grafite', volt: 'bivolt', potencia: '20 W', capacidade: '128 GB', garantia: 12, anatel: '12345-24-1234', inmetro: '009876/2024', curta: 'Smartphone com 128 GB, tela de 6,1 polegadas e câmera dupla.', destaques: ['128 GB de armazenamento', 'Tela de 6,1 polegadas', 'Câmera dupla de 48 MP', 'Carregamento rápido de 20 W'], caixa: 'Smartphone, cabo USB-C, carregador de 20 W, ferramenta para o chip e manual', chaves: ['smartphone', 'celular', '128 gb', 'android'], fornecedor: 'Importadora Pacífico' },
  { brand: 'Casa Útil', model: 'OR-03', gpc: 'Organizadores domésticos', tipo: 'kit', boxQty: 6, prod: { h: 12, w: 30, l: 40, kg: 0.8 }, emb: { h: 14, w: 32, l: 42, kg: 0.95 }, material: 'Polipropileno', cor: 'Transparente', capacidade: '3 peças', garantia: 3, curta: 'Kit com 3 organizadores plásticos empilháveis para armários e gavetas.', destaques: ['3 tamanhos empilháveis', 'Plástico resistente', 'Tampa transparente'], caixa: '3 organizadores (P, M e G)', chaves: ['organizador', 'caixa plástica', 'kit', 'armário'], fornecedor: 'Plásticos Casa Útil' },
  { brand: 'Móveis Prime', model: 'MP-120', gpc: 'Mesas de escritório', boxQty: 1, prod: { h: 75, w: 60, l: 120, kg: 22 }, emb: { h: 10, w: 65, l: 125, kg: 25 }, material: 'MDP com acabamento em melamina', cor: 'Carvalho', garantia: 12, curta: 'Mesa de escritório de 120 cm com gaveta, estrutura reforçada e montagem simples.', destaques: ['120 cm de largura', 'Gaveta com corrediça metálica', 'Montagem sem ferramentas especiais'], caixa: 'Tampo, pés, gaveta, ferragens e manual de montagem', chaves: ['mesa', 'escritório', 'home office', 'gaveta'], fornecedor: 'Móveis Prime Indústria' },
  { brand: 'Nova Tech', model: 'NT-Book 14', gpc: 'Computadores portáteis', ipi: 0, boxQty: 5, prod: { h: 1.8, w: 22.5, l: 32, kg: 1.4 }, emb: { h: 6, w: 28, l: 40, kg: 2.3 }, material: 'Alumínio', cor: 'Prata', volt: 'bivolt', potencia: '65 W', capacidade: '512 GB SSD · 16 GB de RAM', garantia: 12, anatel: '23456-24-2345', inmetro: '008765/2024', curta: 'Notebook de 14 polegadas com 16 GB de RAM e SSD de 512 GB.', destaques: ['Tela de 14 polegadas Full HD', '16 GB de RAM e SSD de 512 GB', 'Bateria de até 10 horas', '1,4 kg'], caixa: 'Notebook, carregador de 65 W e manual', chaves: ['notebook', 'laptop', '14 polegadas', 'ssd'], fornecedor: 'Importadora Pacífico' },
  { brand: 'Linha Básica', model: 'LB-ALG', gpc: 'Camisetas', tipo: 'variacoes', boxQty: 10, prod: { h: 70, w: 50, l: 0.5, kg: 0.18 }, emb: { h: 2, w: 25, l: 32, kg: 0.2 }, material: '100% algodão', cor: 'Branca', tam: 'M', garantia: 3, curta: 'Camiseta básica de algodão, gola redonda e modelagem regular.', destaques: ['100% algodão', 'Gola redonda reforçada', 'Modelagem regular'], caixa: '1 camiseta', chaves: ['camiseta', 'algodão', 'básica', 'unissex'], fornecedor: 'Confecções Linha Básica' },
  { brand: 'Nova Tech', model: 'NT-C20', gpc: 'Carregadores de dispositivos', cest: '21.040.00', boxQty: 20, prod: { h: 3, w: 4.5, l: 6, kg: 0.08 }, emb: { h: 4, w: 7, l: 10, kg: 0.12 }, material: 'Policarbonato', cor: 'Branco', volt: 'bivolt', potencia: '20 W', garantia: 12, inmetro: '001122/2024', curta: 'Carregador USB-C de 20 W com carregamento rápido para celulares e tablets.', destaques: ['20 W de potência', 'Entrada bivolt', 'Proteção contra sobrecarga'], caixa: 'Carregador e manual', chaves: ['carregador', 'usb-c', '20w', 'carga rápida'], fornecedor: 'Importadora Pacífico' },
  { brand: 'Pele Viva', model: 'PV-200', gpc: 'Hidratantes corporais', boxQty: 24, prod: { h: 9, w: 7, l: 7, kg: 0.2 }, emb: { h: 10, w: 8, l: 8, kg: 0.26 }, material: 'Frasco de polietileno', cor: 'Branco', capacidade: '200 ml', garantia: 0, validade: 730, anvisa: '25351.123456/2024-11', curta: 'Creme hidratante corporal de 200 ml com manteiga de karité.', destaques: ['Hidratação de 24 horas', 'Com manteiga de karité', 'Dermatologicamente testado'], caixa: '1 frasco de 200 ml', chaves: ['creme', 'hidratante', 'corporal', 'karité'], fornecedor: 'Cosméticos Pele Viva' },
  { brand: 'Nova Tech', model: 'NT-TV50', gpc: 'Televisores', origem: '2', ipi: 15, boxQty: 2, prod: { h: 64, w: 112, l: 6, kg: 9.4 }, emb: { h: 14, w: 125, l: 76, kg: 12.8 }, material: 'Plástico e vidro', cor: 'Preto', volt: 'bivolt', potencia: '110 W', capacidade: '50 polegadas', garantia: 12, anatel: '34567-24-3456', inmetro: '007654/2024', curta: 'Smart TV de 50 polegadas 4K com aplicativos de streaming.', destaques: ['Resolução 4K', 'Wi-Fi integrado', '3 entradas HDMI'], caixa: 'TV, controle remoto, pilhas, base e manual', chaves: ['tv', 'smart tv', '50 polegadas', '4k'], fornecedor: 'Importadora Pacífico' },
  { brand: 'Passo Firme', model: 'PF-RUN', gpc: 'Calçados esportivos', tipo: 'variacoes', boxQty: 12, unidade: 'PAR', prod: { h: 12, w: 11, l: 30, kg: 0.6 }, emb: { h: 12, w: 20, l: 34, kg: 0.9 }, material: 'Malha e borracha', cor: 'Azul', tam: '42', garantia: 3, inmetro: '003344/2024', curta: 'Tênis esportivo leve para corrida, com amortecimento e solado de borracha.', destaques: ['Cabedal em malha respirável', 'Amortecimento responsivo', 'Solado antiderrapante'], caixa: '1 par de tênis e caixa', chaves: ['tênis', 'corrida', 'esportivo', 'running'], fornecedor: 'Calçados Passo Firme' },
  { brand: 'Conecta+', model: 'HD-2M', gpc: 'Cabos de vídeo', boxQty: 20, prod: { h: 1, w: 1, l: 200, kg: 0.1 }, emb: { h: 3, w: 12, l: 16, kg: 0.13 }, material: 'Cobre com malha de proteção', cor: 'Preto', garantia: 6, curta: 'Cabo HDMI de 2 metros com suporte a 4K e conectores banhados a ouro.', destaques: ['Suporte a 4K', '2 metros', 'Conectores banhados a ouro'], caixa: '1 cabo HDMI', chaves: ['cabo hdmi', '4k', '2 metros', 'vídeo'], fornecedor: 'Conecta+ Acessórios' },
]

const USERS = ['Marina Costa', 'Rafael Lima', 'Importação do catálogo']

// ───────────────────────── Geração

const round2 = (n: number) => Math.round(n * 100) / 100

function blankValue(f: FieldDef) {
  if (f.kind === 'boolean') return false
  if (f.kind === 'tags' || f.kind === 'lines') return [] as string[]
  if (['money', 'integer', 'decimal', 'percent'].includes(f.kind)) return null
  return ''
}

/** Corta em limite de palavra (títulos de marketplace têm limite de caracteres). */
function fit(text: string, max: number) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), 1)).trim()
}

const slugify = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function ean13(seq: number) {
  const body = `7891000${String(10000 + seq).padStart(5, '0')}`
  const sum = [...body].reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 1 : 3), 0)
  return body + ((10 - (sum % 10)) % 10)
}

export function buildDetail(p: Product): ProductDetail {
  const i = Number(p.id.slice(1)) - 1
  const b = i % SPECS.length
  const s = SPECS[b]!
  const v: Values = Object.fromEntries(FIELDS.map((f) => [f.id, blankValue(f)]))
  const taxedIpi = s.ipi !== undefined && s.ipi > 0
  const custo = round2(p.price * 0.55)

  Object.assign(v, {
    // Principal
    sku: p.sku, title: p.title, status: p.status, tipo: s.tipo ?? 'simples', condicao: 'novo',
    marca: s.brand, modelo: `${s.model}${p.title.includes('·') ? '-' + p.title.split('· ')[1]!.slice(0, 3).toUpperCase() : ''}`,
    fabricante: s.brand, mpn: `${s.model}`.replace(/\s+/g, '-').toUpperCase(),
    ean: p.ean, gtinCaixa: p.ean ? ean13(i + 500) : '', unidadesCaixa: s.boxQty,
    departamento: p.department, categoria: s.gpc.split(' ')[0], unidade: s.unidade ?? 'UN', gpc: s.gpc,
    tags: [p.department.toLowerCase(), s.brand.toLowerCase()],
    descricaoCurta: s.curta,
    observacoes: i % 4 === 0 ? 'Conferir a embalagem no recebimento do lote.' : '',
    // Fiscal
    ncm: p.ncm, cest: s.cest ?? '', extipi: '', nve: '', origem: s.origem ?? '0', indEscala: 'S', cnpjFab: '',
    unidadeTrib: s.unidade ?? 'UN', fatorTrib: 1, eanTrib: p.ean,
    cfopDentro: s.cest ? '5405' : '5102', cfopFora: s.cest ? '6404' : '6102',
    infAdicionais: i % 5 === 0 ? 'Produto sujeito às condições da legislação vigente.' : '',
    icmsCst: '00', icmsModBc: '3', icmsAliq: 18, icmsRedBc: null, icmsStMva: s.cest ? 40 : null, icmsStAliq: s.cest ? 18 : null, fcpAliq: i % 3 === 0 ? 2 : null, cBenef: '',
    ipiCst: taxedIpi ? '50' : '53', ipiEnq: '999', ipiAliq: taxedIpi ? s.ipi! : null,
    pisCst: '01', pisAliq: 1.65, cofinsCst: '01', cofinsAliq: 7.6,
    ibsCbsCst: '000', cClassTrib: '000001', sujeitoIs: false,
    fci: s.origem === '2' ? `FCI-${p.sku}` : '', anvisa: s.anvisa ?? '', anp: '',
    // Comercial
    custo, custoAdicional: round2(custo * 0.03), custoMedio: round2(custo * 1.02),
    preco: p.price, precoPromo: i % 6 === 0 ? round2(p.price * 0.9) : null,
    promoInicio: i % 6 === 0 ? '2026-10-01' : '', promoFim: i % 6 === 0 ? '2026-10-31' : '',
    precoMinimo: round2(p.price * 0.8), descontoMax: 10, comissao: 3,
    qtdMinima: 1, multiplo: s.unidade === 'M' ? 1 : s.boxQty >= 50 ? 10 : 1, vendeSemEstoque: false, fraciona: s.unidade === 'M',
    // Operacional
    controlaEstoque: true, saldoTotal: p.stock, estoqueMin: 20 + (i % 3) * 10, estoqueMax: 400 + (i % 4) * 100, pontoReposicao: 40 + (i % 3) * 10,
    localizacao: `Corredor ${'ABCD'[i % 4]}, prateleira ${1 + (i % 5)}`, estoqueNegativo: false, rastreio: s.validade ? 'validade' : s.anatel ? 'serie' : 'nenhum', diasValidade: s.validade ?? null,
    fornecedorPadrao: s.fornecedor, codFornecedor: `${s.model}-F${1 + (i % 9)}`, leadTime: 7 + (i % 4) * 7, loteCompra: s.boxQty,
    pesoBruto: s.emb.kg, pesoLiquido: s.prod.kg, alturaEmb: s.emb.h, larguraEmb: s.emb.w, comprimentoEmb: s.emb.l, volumes: 1,
    tipoEmbalagem: s.prod.l > 100 ? 'caixa' : 'caixa', fragil: ['Eletrônicos', 'Informática'].includes(p.department), perigoso: false,
    // Marketing
    tituloVenda: fit(`${p.title} ${s.brand}`, 60), subtitulo: s.destaques[0] ?? '',
    descricaoVenda: `${s.curta}\n\nEspecificações\n• Marca: ${s.brand}\n• Material: ${s.material}\n• Cor: ${s.cor}\n\nO que vem na caixa: ${s.caixa}.`,
    destaques: s.destaques, conteudoEmbalagem: s.caixa,
    palavrasChave: s.chaves, seoTitulo: fit(`${p.title} | ${s.brand}`, 70), seoDescricao: fit(s.curta, 160), slug: slugify(p.title), videoUrl: '',
    // Especificações
    alturaProd: s.prod.h, larguraProd: s.prod.w, comprimentoProd: s.prod.l, pesoProd: s.prod.kg,
    cor: s.cor, material: s.material, tamanho: s.tam ?? '', voltagem: s.volt ?? '', potencia: s.potencia ?? '', capacidade: s.capacidade ?? '', paisOrigem: s.origem === '2' ? 'China' : 'Brasil',
    garantiaMeses: s.garantia || null, garantiaTipo: s.garantia ? 'fabricante' : 'sem', garantiaTermos: s.garantia ? `Garantia de ${s.garantia} meses contra defeitos de fabricação, a contar da data da compra.` : '',
    anatel: s.anatel ?? '', inmetro: s.inmetro ?? '', certificacoes: [],
  })

  // Pendências do exemplo viram campos realmente vazios, para a página concordar com o dashboard e a lista.
  if (p.pendencias.includes('fiscal')) Object.assign(v, { origem: '', icmsCst: '', cfopDentro: '', pisCst: '', cofinsCst: '' })
  if (p.pendencias.includes('preco')) Object.assign(v, { preco: null, precoPromo: null, promoInicio: '', promoFim: '' })
  if (p.pendencias.includes('gtin')) Object.assign(v, { ean: '', eanTrib: '', gtinCaixa: '' })
  if (p.pendencias.includes('descricao')) Object.assign(v, { descricaoCurta: '' })

  return { values: v, extras: buildExtras(p, v, s, i, b) }
}

function buildExtras(p: Product, v: Values, s: Spec, i: number, b: number): ProductExtras {
  const price = typeof v.preco === 'number' ? v.preco : null
  const stock = p.stock
  const central = Math.round(stock * 0.6)
  const lojaA = Math.round(stock * 0.25)
  const deposits: Deposit[] = [
    { id: 'd1', name: 'Depósito central', balance: central, reserved: Math.min(central, 3 + (i % 5)) },
    { id: 'd2', name: 'Loja Centro', balance: lojaA, reserved: Math.min(lojaA, i % 3) },
    { id: 'd3', name: 'Loja Shopping', balance: stock - central - lojaA, reserved: 0 },
  ]
  const suppliers: Supplier[] = [
    { id: 's1', name: s.fornecedor, code: String(v.codFornecedor), lastCost: Number(v.custo ?? 0), leadTime: Number(v.leadTime) },
    { id: 's2', name: 'Atacado Nacional', code: `AN-${1000 + b * 13}`, lastCost: round2(Number(v.custo ?? 0) * 1.06), leadTime: Number(v.leadTime) + 7 },
  ]
  const priceTables: PriceTable[] = price === null ? [] : [
    { id: 't1', name: 'Varejo', price, validity: 'Vigente' },
    { id: 't2', name: 'Atacado (a partir de 10 un)', price: round2(price * 0.9), validity: 'Vigente' },
    { id: 't3', name: 'Marketplace', price: round2(price * 1.1), validity: 'Vigente' },
  ]
  const channels: Channel[] =
    p.status === 'draft'
      ? []
      : [
          { id: 'c1', name: 'Mercado Livre', status: p.status === 'inactive' ? 'paused' : 'published', adId: `MLB${3_100_000_000 + i * 977}`, price: price === null ? 0 : round2(price * 1.1), stock: Math.min(stock, 50), syncedAt: '2026-10-21T08:40:00-03:00' },
          { id: 'c2', name: 'Loja própria', status: p.status === 'inactive' ? 'paused' : 'published', adId: p.sku.toLowerCase(), price: price ?? 0, stock, syncedAt: '2026-10-21T08:40:00-03:00' },
          ...(i % 7 === 0 ? [{ id: 'c3', name: 'Amazon', status: 'error' as const, adId: '—', price: price === null ? 0 : round2(price * 1.08), stock: 0, syncedAt: '2026-10-20T17:05:00-03:00', note: 'GTIN não encontrado no catálogo do canal.' }] : []),
        ]
  const kinds: [ImageKind, string][] = [['principal', 'Vista frontal'], ['fundo-branco', 'Fundo branco'], ['detalhe', 'Detalhe ampliado'], ['escala', 'Em escala reduzida']]
  const images: ProductImage[] = galleryFor(b).map((src, n) => ({
    id: `img${n + 1}`, src, kind: kinds[n]![0], alt: n === 3 ? '' : `${p.title}: ${kinds[n]![1].toLowerCase()}`, width: 2000, height: 2000, sizeKb: 310 + n * 47,
  }))
  const sizes = s.tipo === 'variacoes' ? (s.model.startsWith('PF') ? ['38', '39', '40', '41', '42', '43'] : ['P', 'M', 'G', 'GG']) : []
  const variations: Variation[] = sizes.map((size, n) => ({
    id: `v${n + 1}`, label: `${s.model.startsWith('PF') ? 'Tamanho' : 'Tamanho'} ${size}`, sku: `${p.sku}-${size}`, ean: p.ean ? ean13(i * 10 + n + 600) : '', price: price ?? 0, stock: Math.max(0, Math.round(stock / sizes.length) + (n % 2 ? -2 : 2)),
  }))
  const kitItems: KitItem[] = s.tipo === 'kit' ? [
    { id: 'k1', title: 'Organizador pequeno', sku: `${p.sku}-P`, qty: 1 },
    { id: 'k2', title: 'Organizador médio', sku: `${p.sku}-M`, qty: 1 },
    { id: 'k3', title: 'Organizador grande', sku: `${p.sku}-G`, qty: 1 },
  ] : []
  const history: HistoryEntry[] = [
    { id: 'h1', at: '2026-10-19T14:22:00-03:00', user: USERS[0]!, field: 'Preço de venda', from: price === null ? '—' : formatBRL(round2(price * 0.95)), to: price === null ? '—' : formatBRL(price) },
    { id: 'h2', at: '2026-10-12T10:05:00-03:00', user: USERS[1]!, field: 'Estoque mínimo', from: '10', to: String(v.estoqueMin) },
    { id: 'h3', at: '2026-09-30T16:48:00-03:00', user: USERS[0]!, field: 'Foto principal', from: 'Sem foto', to: 'Vista frontal' },
    { id: 'h4', at: '2026-09-02T09:30:00-03:00', user: USERS[2]!, field: 'Cadastro', from: '—', to: 'Produto criado' },
  ]
  return { deposits, suppliers, priceTables, channels, images, variations, kitItems, history }
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const formatBRL = (n: number) => brl.format(n)

// ───────────────────────── Armazenamento em memória

const built = new Map<string, ProductDetail>()
const edited = new Map<string, ProductDetail>()
const listeners = new Set<() => void>()
let version = 0

export function getProductDetail(product: Product): ProductDetail {
  const saved = edited.get(product.id)
  if (saved) return saved
  let d = built.get(product.id)
  if (!d) {
    d = buildDetail(product)
    built.set(product.id, d)
  }
  return d
}

/** Texto curto de um valor, para o histórico. */
export function plainValue(value: Values[string]): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—'
  return String(value)
}

/**
 * Salva os valores, registra no histórico o que mudou e devolve os campos principais ao registro da lista
 * (título, SKU, NCM, EAN, status, preço e pendências) — assim Produtos e Início refletem a edição.
 */
export function saveProductValues(product: Product, values: Values) {
  const current = getProductDetail(product)
  const changes = FIELDS.filter((f) => !f.readOnly && f.kind !== 'computed' && JSON.stringify(current.values[f.id]) !== JSON.stringify(values[f.id]))
  const at = new Date().toISOString()
  const entries: HistoryEntry[] = changes.slice(0, 12).map((f, n) => ({
    id: `h-${at}-${n}`, at, user: 'Você', field: f.label, from: plainValue(current.values[f.id]), to: plainValue(values[f.id]),
  }))
  edited.set(product.id, { values, extras: { ...current.extras, history: [...entries, ...current.extras.history] } })

  Object.assign(product, {
    sku: String(values.sku ?? ''),
    title: String(values.title ?? ''),
    department: String(values.departamento ?? ''),
    ncm: String(values.ncm ?? ''),
    ean: String(values.ean ?? ''),
    status: values.status as Product['status'],
    price: typeof values.preco === 'number' ? values.preco : 0,
    pendencias: derivePendencias(values),
  })
  version++
  listeners.forEach((l) => l())
  return changes.length
}

export function useProductDetail(product: Product | undefined): ProductDetail | undefined {
  useSyncExternalStore((cb) => (listeners.add(cb), () => void listeners.delete(cb)), () => version)
  return product ? getProductDetail(product) : undefined
}

export function findProduct(id: string | undefined): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export { isEmpty }
