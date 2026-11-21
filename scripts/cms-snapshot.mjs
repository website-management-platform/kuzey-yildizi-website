// Derlemeden önce yayındaki içeriğin kopyasını alır: site API uyurken bile anında açılır, tarayıcı sonra güncel içeriği çeker.
// API'ye ulaşılamazsa mevcut kopya korunur ve derleme sürer.
import { writeFileSync } from 'node:fs'
import { loadRaw } from '../src/cms/load.js'

const api = (process.env.VITE_WMP_API ?? 'https://wmp-panel-api.onrender.com/api/v1').replace(/\/$/, '')
const key = process.env.VITE_WMP_SITE_KEY ?? 'pk_OwX14GFLS_aHzOiN'
const target = new URL('../src/cms/snapshot.json', import.meta.url)

for (let attempt = 1; attempt <= 3; attempt += 1) {
  try {
    const raw = await loadRaw(api, key)
    writeFileSync(target, JSON.stringify(raw))
    console.log(`cms-snapshot: ${raw.pages.length} sayfa, ${raw.yonetim.length} üye, ${raw.galeri.length} albüm`)
    process.exit(0)
  } catch (error) {
    console.warn(`cms-snapshot: deneme ${attempt} başarısız (${error.message})`)
    await new Promise((resolve) => setTimeout(resolve, 20000))
  }
}
console.warn('cms-snapshot: mevcut kopya kullanılıyor')
