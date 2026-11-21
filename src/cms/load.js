// Yayın API'sinden ham içeriği okur. Tarayıcıda ve derleme betiğinde (Node) aynı kod çalışır.
const MODULES = ['slaytlar', 'faaliyetler', 'etkinlikler', 'galeri', 'yonetim']

async function getJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  return (await response.json()).data
}

export async function loadRaw(api, siteKey) {
  const base = `${api}/delivery/sites/${siteKey}`
  const [info, sitemap, ...lists] = await Promise.all([
    getJson(`${base}/info`),
    getJson(`${base}/sitemap`),
    ...MODULES.map((key) => getJson(`${base}/content/${key}?limit=100`)),
  ])
  const pagePaths = sitemap.filter((item) => item.type === 'page').map((item) => Object.values(item.alternates)[0])
  const pages = await Promise.all(pagePaths.map((path) => getJson(`${base}/pages/resolve?path=${encodeURIComponent(path)}`)))
  return {
    settings: info.settings ?? {},
    pages: pages.filter((route) => route.type === 'page').map((route) => route.page),
    ...Object.fromEntries(MODULES.map((key, index) => [key, lists[index]])),
  }
}
