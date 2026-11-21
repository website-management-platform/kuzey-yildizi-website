import { lazy, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import SiteLayout from './layouts/SiteLayout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { dismissSplashScreen } from './utils/splashScreen'

const AssociationPage = lazy(() => import('./pages/AssociationPage'))
const Events = lazy(() => import('./pages/Events'))
const News = lazy(() => import('./pages/News'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const Membership = lazy(() => import('./pages/Membership'))
const Privacy = lazy(() => import('./pages/Privacy'))

function App() {
  useEffect(() => {
    dismissSplashScreen()
  }, [])

  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="dernegimiz" element={<Navigate to="/dernegimiz/hakkimizda" replace />} />
        <Route path="dernegimiz/:slug" element={<AssociationPage />} />
        <Route path="etkinlikler" element={<Events />} />
        <Route path="etkinlikler/:slug" element={<Events />} />
        <Route path="haberler" element={<News />} />
        <Route path="haberler/:slug" element={<News />} />
        <Route path="galeri" element={<Gallery />} />
        <Route path="galeri/:slug" element={<Gallery />} />
        <Route path="uyelik" element={<Membership />} />
        <Route path="iletisim" element={<Contact />} />
        <Route path="aydinlatma-metni" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
