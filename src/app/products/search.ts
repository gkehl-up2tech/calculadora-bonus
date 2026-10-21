import { PRODUCTS, type Product } from './sample-products'

/** Sem acento, minúsculo e sem pontuação de códigos: "7318.15.00" casa com "73181500". */
const normalize = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[.\-/]/g, '')

/**
 * Busca de produtos por título, SKU, NCM, EAN ou departamento (todos os termos digitados precisam aparecer).
 * Hoje consulta os dados de exemplo; quando houver fonte real, troque o corpo mantendo a assinatura
 * (pode virar assíncrona sem mudar quem chama, que só precisa aguardar o resultado).
 */
export function searchProducts(query: string, limit = 8): Product[] {
  if (!query.trim()) return []
  return filterProducts(PRODUCTS, query).slice(0, limit)
}

/** Filtra uma lista de produtos por título, SKU, NCM, EAN ou departamento (todos os termos precisam aparecer). */
export function filterProducts(products: Product[], query: string): Product[] {
  const terms = query.split(/\s+/).map(normalize).filter(Boolean)
  if (terms.length === 0) return products
  return products.filter((p) => {
    const haystack = normalize(`${p.title} ${p.sku} ${p.ncm} ${p.ean} ${p.department}`)
    return terms.every((t) => haystack.includes(t))
  })
}
