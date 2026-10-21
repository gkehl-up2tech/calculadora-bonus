/**
 * true no build "embedded" (npm run build:embedded): o app roda dentro de uma página hospedada,
 * onde a URL não muda (roteador em memória) e o tema pode ser definido pela página que o contém.
 */
export const EMBEDDED = import.meta.env.VITE_EMBEDDED === 'true'
