export function toSmallImage(src) {
  if (!src || !src.startsWith('/images/') || src.startsWith('/images/brand/')) return src
  return src.replace(/\.(\w+)$/, '_small.$1')
}
