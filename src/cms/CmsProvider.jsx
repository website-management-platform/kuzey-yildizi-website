import { useEffect, useState } from 'react'
import { CMS_API, CMS_SITE_KEY } from './config'
import { CmsContext } from './context'
import { loadRaw } from './load'
import { mapContent } from './map'
import snapshot from './snapshot.json'

const initial = mapContent(snapshot)

// İçerik derleme anındaki kopyayla anında çizilir; açılışta panelden güncel hâli çekilip yerine konur.
function CmsProvider({ children }) {
  const [content, setContent] = useState(initial)

  useEffect(() => {
    let active = true
    loadRaw(CMS_API, CMS_SITE_KEY)
      .then((raw) => active && setContent(mapContent(raw)))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return <CmsContext.Provider value={content}>{children}</CmsContext.Provider>
}

export default CmsProvider
