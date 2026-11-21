import { Link } from 'react-router'
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import PageHero from '../PageHero'
import Prose from '../Prose'
import ZoomableImage from '../ZoomableImage'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { formatDate } from '../../utils/formatDate'

function ArticleDetail({ backTo, backLabel, title, summary, body, image, date, location, withTime = false }) {
  useDocumentMeta(title, summary ?? undefined)

  return (
    <>
      <PageHero title={title} />
      <article className="section">
        <div className="container narrow">
          <Link to={backTo} className="back_link">
            <ArrowLeft size={16} aria-hidden="true" /> {backLabel}
          </Link>
          <div className="card_meta big">
            {date && (
              <span>
                <CalendarDays size={16} aria-hidden="true" /> {formatDate(date, withTime)}
              </span>
            )}
            {location && (
              <span>
                <MapPin size={16} aria-hidden="true" /> {location}
              </span>
            )}
          </div>
          {image && <ZoomableImage className="detail" src={image} alt={title} />}
          {summary && <p className="lead">{summary}</p>}
          <Prose text={body} />
        </div>
      </article>
    </>
  )
}

export default ArticleDetail
