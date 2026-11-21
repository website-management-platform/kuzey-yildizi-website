import { CMS_API, CMS_SITE_KEY } from './config'

// Formu panelin form sistemine gönderir (wmp 13-forms §3); başvurular panelde "Başvurular" altına düşer.
export async function submitForm(formKey, values, mapValue = (key, value) => value) {
  const base = `${CMS_API}/delivery/sites/${CMS_SITE_KEY}/forms/${formKey}`
  const definitionResponse = await fetch(`${base}?locale=tr`, { headers: { Accept: 'application/json' } })
  if (!definitionResponse.ok) throw new Error('Form şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.')
  const definition = (await definitionResponse.json()).data

  const fieldValues = {}
  for (const field of definition.fields) {
    const value = values[field.key]
    if (value !== undefined && value !== '') fieldValues[field.key] = mapValue(field.key, String(value).trim())
  }

  const response = await fetch(`${base}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Idempotency-Key': crypto.randomUUID() },
    body: JSON.stringify({
      formVersion: definition.version,
      locale: 'tr',
      values: fieldValues,
      consent: { accepted: values.kvkk === true, version: definition.consent.version },
      marketingConsent: false,
      [definition.honeypotField]: values[definition.honeypotField] ?? '',
    }),
  })
  if (!response.ok) {
    const problem = await response.json().catch(() => null)
    throw new Error(problem?.errors?.[0]?.message ?? problem?.detail ?? 'Gönderilemedi. Lütfen tekrar deneyin.')
  }
  return (await response.json()).data
}
