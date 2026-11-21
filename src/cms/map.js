// Panel içeriğini şablonun beklediği biçime çevirir; sayfa bileşenleri eski veri yapısıyla çalışmaya devam eder.
const PRIVACY_SLUG = 'aydinlatma-metni'
const BOARD_SLUG = 'yonetim-kurulu'

// Zengin metin → şablonun Prose biçimi ("## başlık", "- madde", boş satırla paragraf)
function inlineText(nodes = []) {
  return nodes.map((node) => (node.type === 'hardBreak' ? '\n' : node.type === 'text' ? node.text : inlineText(node.content))).join('')
}
export function richToText(doc) {
  if (!doc) return ''
  if (typeof doc === 'string') return doc
  return (doc.content ?? [])
    .map((block) => {
      if (block.type === 'heading') return `## ${inlineText(block.content)}`
      if (block.type === 'bulletList' || block.type === 'orderedList') return (block.content ?? []).map((item) => `- ${inlineText(item.content?.flatMap((p) => p.content ?? []))}`).join('\n')
      return inlineText(block.content)
    })
    .filter(Boolean)
    .join('\n\n')
}

const url = (asset) => asset?.url ?? null
const dateTime = (date) => (date ? (date.length === 10 ? `${date} 00:00:00` : date.replace('T', ' ').slice(0, 19)) : null)

function formatPhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('90')) return `0${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`
  return phone ?? ''
}

export function mapContent(raw) {
  const s = raw.settings ?? {}
  const social = Object.fromEntries((s.socialLinks ?? []).map((link) => [link.platform, link.url]))
  const pages = raw.pages ?? []
  const privacy = pages.find((page) => page.slug === PRIVACY_SLUG)

  const members = (raw.yonetim ?? []).map((m) => ({
    id: m.id,
    parentId: m.parent ?? null,
    name: m.fullName,
    role: m.title ?? '',
    officialTitle: m.officialTitle ?? null,
    section: m.section ?? null,
    photo: url(m.photo),
    bio: richToText(m.bio),
  }))

  const associationPages = pages
    .filter((page) => page.slug !== PRIVACY_SLUG)
    .map((page) => ({
      slug: page.slug,
      title: page.title,
      body: richToText(page.body),
      image: url(page.cover),
      members: page.slug === BOARD_SLUG ? members : [],
    }))

  const galleryAlbums = (raw.galeri ?? []).map((album) => ({
    id: album.id,
    slug: album.slug,
    title: album.title,
    description: album.description ?? null,
    featured: Boolean(album.featured),
    cover: url(album.items?.[0]),
    photos: (album.items ?? []).map((item) => ({ id: item.id, title: item.caption ?? null, image: url(item) })),
  }))

  return {
    siteSettings: {
      siteName: s.siteName ?? '',
      heroTitle: s.heroTitle ?? '',
      heroText: s.heroText ?? '',
      aboutShort: s.aboutShort ?? '',
      aboutImage: url(s.aboutImage),
      footerSlogan: s.footerSlogan ?? '',
      footerQuote: s.footerQuote ?? '',
      phone: formatPhone(s.contactPhone),
      email: s.contactEmail ?? '',
      address: s.address ?? '',
      mapEmbed: s.mapEmbed ?? '',
      instagram: social.instagram ?? '',
      facebook: social.facebook ?? '',
      xTwitter: social.x ?? '',
      youtube: social.youtube ?? '',
      membershipText: s.membershipText ?? '',
      privacyText: richToText(privacy?.body),
    },
    associationMenu: associationPages.map((page) => ({ title: page.title, slug: page.slug, isTopLevel: Boolean(pages.find((p) => p.slug === page.slug)?.topLevel) })),
    associationPages,
    heroSlides: (raw.slaytlar ?? []).map((slide) => ({ id: slide.id, image: url(slide.desktopImage), mobileImage: url(slide.mobileImage), title: slide.title ?? null, text: slide.subtitle ?? null })),
    homeGalleryHighlights: galleryAlbums.filter((album) => album.featured && album.cover).map((album) => ({ id: album.id, image: album.cover, title: null, albumTitle: album.title, albumSlug: album.slug })),
    newsItems: (raw.faaliyetler ?? []).map((n) => ({ id: n.id, slug: n.slug, title: n.title, summary: n.summary ?? '', body: richToText(n.body), image: url(n.cover), publishedAt: dateTime(n.publishDate) })),
    eventItems: (raw.etkinlikler ?? []).map((e) => ({ id: e.id, slug: e.slug, title: e.name, summary: e.summary ?? '', body: richToText(e.description), image: url(e.cover), eventDate: dateTime(e.startsAt), location: e.venue ?? '' })),
    galleryAlbums,
  }
}
