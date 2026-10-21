/**
 * FOTOS DE EXEMPLO — TEMPORÁRIAS. Ilustrações simples em SVG embutido (data URI), uma por produto-base,
 * para as telas de produto mostrarem como as fotos aparecem. Embutir é necessário porque a página hospedada
 * só carrega imagens embutidas. Com dados reais, o campo `photo` recebe a imagem do produto.
 */
const svg = (bg: string, shapes: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="${bg}"/>${shapes}</svg>`)}`

interface Art {
  bg: string
  shapes: string
}

/** Mesma ordem de `bases` em sample-products.ts. */
const ART: Art[] = [
  { bg: '#EEF2F7', shapes: `<polygon points="36,16 60,16 67,27 60,38 36,38 29,27" fill="#64748B"/><rect x="42" y="38" width="12" height="44" rx="2" fill="#7C8BA1"/><g stroke="#EEF2F7" stroke-width="2.5" stroke-linecap="round"><line x1="42" y1="48" x2="54" y2="52"/><line x1="42" y1="57" x2="54" y2="61"/><line x1="42" y1="66" x2="54" y2="70"/><line x1="42" y1="75" x2="54" y2="79"/></g>` },
  { bg: '#FFF6E0', shapes: `<path d="M22 72 C 22 40, 74 62, 74 28" fill="none" stroke="#334155" stroke-width="5" stroke-linecap="round"/><rect x="12" y="66" width="20" height="16" rx="3" fill="#B97D00"/><rect x="64" y="14" width="20" height="16" rx="3" fill="#B97D00"/><g fill="#334155"><rect x="16" y="82" width="3" height="6"/><rect x="25" y="82" width="3" height="6"/></g>` },
  { bg: '#E7F7FB', shapes: `<rect x="31" y="11" width="34" height="74" rx="8" fill="#0F172A"/><rect x="35" y="19" width="26" height="54" rx="2" fill="#6FCBE6"/><circle cx="48" cy="79" r="2.5" fill="#6FCBE6"/>` },
  { bg: '#E8F6EE', shapes: `<rect x="14" y="32" width="68" height="46" rx="6" fill="#178044"/><rect x="20" y="38" width="26" height="34" rx="3" fill="#C9EBD7"/><rect x="50" y="38" width="26" height="15" rx="3" fill="#C9EBD7"/><rect x="50" y="57" width="26" height="15" rx="3" fill="#C9EBD7"/>` },
  { bg: '#F7EFE5', shapes: `<rect x="12" y="34" width="72" height="9" rx="2" fill="#A0662B"/><rect x="18" y="43" width="6" height="36" fill="#7A4A1A"/><rect x="72" y="43" width="6" height="36" fill="#7A4A1A"/><rect x="28" y="43" width="24" height="18" rx="2" fill="#C4894A"/><circle cx="40" cy="52" r="2" fill="#7A4A1A"/>` },
  { bg: '#EBF4FC', shapes: `<rect x="20" y="20" width="56" height="40" rx="3" fill="#1B3A6B"/><rect x="24" y="24" width="48" height="32" rx="1.5" fill="#7AB8E8"/><path d="M10 64 H86 L81 74 H15 Z" fill="#334155"/>` },
  { bg: '#FEECEC', shapes: `<path d="M33 16 L16 28 L25 43 L35 38 L35 80 L61 80 L61 38 L71 43 L80 28 L63 16 Q48 30 33 16 Z" fill="#C93A39"/>` },
  { bg: '#F1ECFE', shapes: `<rect x="31" y="26" width="34" height="42" rx="6" fill="#5B4BC4"/><rect x="39" y="13" width="4" height="13" fill="#334155"/><rect x="53" y="13" width="4" height="13" fill="#334155"/><rect x="42" y="38" width="12" height="6" rx="3" fill="#CFC8F6"/><path d="M48 68 V76 Q48 84 58 84" fill="none" stroke="#334155" stroke-width="4" stroke-linecap="round"/>` },
  { bg: '#FDEBF3', shapes: `<rect x="26" y="42" width="44" height="34" rx="6" fill="#D6559A"/><rect x="23" y="28" width="50" height="15" rx="4" fill="#8A2F63"/><rect x="34" y="52" width="28" height="14" rx="3" fill="#FDEBF3"/>` },
  { bg: '#EEF2F7', shapes: `<rect x="10" y="20" width="76" height="48" rx="3" fill="#0F172A"/><rect x="14" y="24" width="68" height="40" rx="1.5" fill="#6FCBE6"/><rect x="40" y="68" width="16" height="7" fill="#334155"/><rect x="30" y="75" width="36" height="4" rx="2" fill="#334155"/>` },
  { bg: '#FCE9DC', shapes: `<path d="M13 64 L13 48 Q13 44 17 44 L30 44 Q34 44 38 40 L44 33 Q47 30 51 32 L58 40 Q62 44 68 46 L80 50 Q87 52 87 60 L87 66 L13 66 Z" fill="#D9622B"/><rect x="13" y="62" width="74" height="9" rx="3" fill="#7A2E0B"/><g stroke="#FCE9DC" stroke-width="2.5" stroke-linecap="round"><line x1="40" y1="46" x2="46" y2="40"/><line x1="47" y1="48" x2="53" y2="42"/><line x1="54" y1="50" x2="60" y2="44"/></g>` },
  { bg: '#E9EBF7', shapes: `<rect x="9" y="36" width="24" height="17" rx="3" fill="#334155"/><path d="M13 53 h16 l-2 5 h-12 z" fill="#334155"/><path d="M33 45 C 52 45, 50 70, 68 70" fill="none" stroke="#1B3A6B" stroke-width="5" stroke-linecap="round"/><rect x="66" y="62" width="21" height="16" rx="3" fill="#334155"/>` },
]

/** Foto principal de cada produto-base. */
export const PRODUCT_PHOTOS: string[] = ART.map((a) => svg(a.bg, a.shapes))

/** Galeria de exemplo: principal (fundo da marca), fundo branco, detalhe ampliado e em escala reduzida. */
export function galleryFor(baseIndex: number): string[] {
  const a = ART[baseIndex % ART.length]!
  return [
    svg(a.bg, a.shapes),
    svg('#FFFFFF', a.shapes),
    svg(a.bg, `<g transform="translate(-24 -24) scale(1.5)">${a.shapes}</g>`),
    svg('#EEF2F7', `<g transform="translate(16 16) scale(.66)">${a.shapes}</g>`),
  ]
}
