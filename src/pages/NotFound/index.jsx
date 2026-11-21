import { Link } from 'react-router'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import './not_found.css'

function NotFound() {
  useDocumentMeta('Sayfa bulunamadı', undefined, true)

  return (
    <section className="section not_found">
      <div className="container narrow">
        <h1>404</h1>
        <p className="lead">Aradığınız sayfa bulunamadı.</p>
        <Link to="/" className="btn btn_primary">
          Ana Sayfaya Dön
        </Link>
      </div>
    </section>
  )
}

export default NotFound
