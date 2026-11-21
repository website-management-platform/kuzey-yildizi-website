export function parseDate(value) {
  if (!value) return null
  const date = new Date(value.replace(' ', 'T'))
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value, withTime = false) {
  const date = parseDate(value)
  if (!date) return value ?? ''
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  })
}
