const SPLASH_SESSION_KEY = 'kytd_splash'
const MIN_VISIBLE_MS = 900
const FONT_WAIT_MS = 1500
const MAX_VISIBLE_MS = 4000

function rememberSplashShown() {
  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, '1')
    return true
  } catch {
    return false
  }
}

export function dismissSplashScreen() {
  const splash = document.getElementById('splash')
  if (!splash) return

  if (document.documentElement.classList.contains('no_splash')) {
    splash.remove()
    return
  }

  const hide = () => {
    if (splash.classList.contains('is_hidden')) return
    splash.classList.add('is_hidden')
    rememberSplashShown()
    window.setTimeout(() => splash.remove(), 800)
  }

  const minDelay = new Promise((resolve) => window.setTimeout(resolve, Math.max(0, MIN_VISIBLE_MS - performance.now())))
  const fontsReady = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((resolve) => window.setTimeout(resolve, FONT_WAIT_MS)),
  ])
  Promise.all([minDelay, fontsReady]).then(hide)
  window.setTimeout(hide, MAX_VISIBLE_MS)
}
