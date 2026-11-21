import { useEffect, useState } from 'react'
import { Download, Share } from 'lucide-react'

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true

const isIosSafari = () => {
  const userAgent = navigator.userAgent
  return /iPhone|iPad|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS/.test(userAgent)
}

function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(isStandalone)
  const [showIosHint] = useState(isIosSafari)

  useEffect(() => {
    if (isInstalled) return undefined
    const handleBeforeInstall = (event) => {
      event.preventDefault()
      setInstallPrompt(event)
    }
    const handleInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [isInstalled])

  if (isInstalled) return null

  if (installPrompt) {
    return (
      <button
        type="button"
        className="install_btn"
        onClick={async () => {
          await installPrompt.prompt()
          await installPrompt.userChoice
          setInstallPrompt(null)
        }}
      >
        <Download size={16} aria-hidden="true" /> Uygulamayı yükle
      </button>
    )
  }

  if (showIosHint) {
    return (
      <p className="install_hint">
        iPhone’a eklemek için <Share size={14} aria-label="Paylaş simgesi" /> Paylaş’a dokunup <b>Ana Ekrana Ekle</b>’yi seçin.
      </p>
    )
  }

  return null
}

export default InstallButton
