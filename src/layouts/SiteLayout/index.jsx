import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Phone } from 'lucide-react'
import LogoLoader from '../../components/LogoLoader'
import { siteSettings } from '../../content/siteSettings'
import Footer from './components/Footer'
import Header from './components/Header'
import './site_layout.css'

function scrollToTopInstantly() {
  const root = document.documentElement
  const previousBehavior = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  root.style.scrollBehavior = previousBehavior
}

function SiteLayout() {
  const { pathname } = useLocation()
  const [routeChangeCount, setRouteChangeCount] = useState(0)
  const [previousPathname, setPreviousPathname] = useState(pathname)

  if (previousPathname !== pathname) {
    setPreviousPathname(pathname)
    setRouteChangeCount((count) => count + 1)
  }

  useEffect(() => {
    scrollToTopInstantly()
  }, [pathname])

  return (
    <>
      <a className="skip_link" href="#main_content">
        İçeriğe geç
      </a>
      <Header />
      {routeChangeCount > 0 && <div key={routeChangeCount} className="route_bar" aria-hidden="true" />}
      <main id="main_content" tabIndex={-1}>
        <div key={pathname} className="page_enter">
          <Suspense fallback={<LogoLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      {siteSettings.phone && (
        <a className="fab_call" href={`tel:${siteSettings.phone.replace(/\s/g, '')}`} aria-label="Derneği ara">
          <Phone size={24} aria-hidden="true" />
        </a>
      )}
      <Footer />
    </>
  )
}

export default SiteLayout
