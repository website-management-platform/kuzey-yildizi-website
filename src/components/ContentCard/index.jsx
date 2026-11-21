import { Link } from 'react-router'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import ImagePlaceholder from '../ImagePlaceholder'
import { formatDate } from '../../utils/formatDate'
import { toSmallImage } from '../../utils/imageVariant'
import './content_card.css'

function ContentCard({ to, title, summary, image, date, location, withTime = false }) {
  return (
    <Link to={to} className="card">
      <div className="card_img">
        {image ? (
          <img src={toSmallImage(image)} alt="" width="640" height="400" loading="lazy" decoding="async" />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className="card_body">
        {(date || location) && (
          <div className="card_meta">
            {date && (
              <span>
                <CalendarDays size={14} aria-hidden="true" /> {formatDate(date, withTime)}
              </span>
            )}
            {location && (
              <span>
                <MapPin size={14} aria-hidden="true" /> {location}
              </span>
            )}
          </div>
        )}
        <h3>{title}</h3>
        {summary && <p>{summary}</p>}
        <span className="card_more">
          Devamını oku <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

export default ContentCard
