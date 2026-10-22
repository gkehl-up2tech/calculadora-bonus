/** Fotos de produto: validação do arquivo e leitura com redução de tamanho (a imagem fica em memória como data URI). */

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_MB = 8
/** Maior lado, em pixels, depois da redução (marketplaces pedem ao menos 1000). */
export const MAX_IMAGE_SIDE = 2000

export interface LoadedImage {
  name: string
  src: string
  width: number
  height: number
  sizeKb: number
}

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'))
    reader.readAsDataURL(file)
  })

const decode = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('O arquivo não é uma imagem válida.'))
    img.src = src
  })

/** Lê a imagem, reduz se passar de MAX_IMAGE_SIDE e devolve um data URI (PNG continua PNG; o resto vira JPEG). */
export async function loadImage(file: File): Promise<LoadedImage> {
  const original = await readAsDataUrl(file)
  const img = await decode(original)
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
  let src = original
  let [width, height] = [img.naturalWidth, img.naturalHeight]
  if (scale < 1) {
    width = Math.round(width * scale)
    height = Math.round(height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
    src = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88)
  }
  return { name: file.name, src, width, height, sizeKb: Math.max(1, Math.round((src.length * 0.75) / 1024)) }
}
