import { useEffect } from 'react'

const SITE_NAME = 'Kuzey Yıldızı Trabzonsporlular Derneği'
const DEFAULT_DESCRIPTION =
  "Kuzey Yıldızı Trabzonsporlular Derneği resmi web sitesi. 1999'dan bu yana Trabzonspor sevgisini dayanışmaya dönüştüren topluluk."

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function useDocumentMeta(title, description, isNoIndex = false) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    const metaDescription = (description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim().slice(0, 160)

    document.title = fullTitle
    setMeta('name', 'description', metaDescription)
    setMeta('name', 'robots', isNoIndex ? 'noindex, nofollow' : 'index, follow')
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', metaDescription)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = window.location.origin + window.location.pathname
    setMeta('property', 'og:url', canonical.href)
  }, [title, description, isNoIndex])
}
