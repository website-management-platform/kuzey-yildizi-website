// Liste ve kart görünümlerinde küçük görsel. Panelden gelen görsellerde sistemin ürettiği 640 px boyut kullanılır.
const DELIVERY_VARIANT = /\/assets\/([^/]+)\/(original|w1920|w1280)$/

export function toSmallImage(src) {
  if (!src) return src
  if (DELIVERY_VARIANT.test(src)) return src.replace(DELIVERY_VARIANT, '/assets/$1/w640')
  if (!src.startsWith('/images/') || src.startsWith('/images/brand/')) return src
  return src.replace(/\.(\w+)$/, '_small.$1')
}
