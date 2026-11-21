import { Link } from 'react-router'
import { ArrowRight, ChevronRight } from 'lucide-react'
import ContentCard from '../../components/ContentCard'
import EmptyState from '../../components/EmptyState'
import Eyebrow from '../../components/Eyebrow'
import Reveal from '../../components/Reveal'
import SplitTitle from '../../components/SplitTitle'
import ZoomableImage from '../../components/ZoomableImage'
import { eventItems } from '../../content/events'
import { heroSlides, homeGalleryHighlights } from '../../content/homeContent'
import { newsItems } from '../../content/news'
import { siteSettings } from '../../content/siteSettings'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { parseDate } from '../../utils/formatDate'
import { toSmallImage } from '../../utils/imageVariant'
import HeroSlider from './components/HeroSlider'
import './home.css'

const HOME_LIST_LIMIT = 3

function getUpcomingEvents() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventItems
    .map((event) => ({ event, date: parseDate(event.eventDate) }))
    .filter(({ date }) => date && date >= today)
    .sort((a, b) => a.date - b.date)
    .slice(0, HOME_LIST_LIMIT)
    .map(({ event }) => event)
}

const latestNews = [...newsItems].sort((a, b) => (parseDate(b.publishedAt) ?? 0) - (parseDate(a.publishedAt) ?? 0)).slice(0, HOME_LIST_LIMIT)

function Home() {
  useDocumentMeta()
  const upcomingEvents = getUpcomingEvents()

  return (
    <>
      <HeroSlider slides={heroSlides} defaultTitle={siteSettings.heroTitle} defaultText={siteSettings.heroText} />

      <section className="section">
        <div className="container about_grid">
          <Reveal>
            <Eyebrow>DERNEĞİMİZ</Eyebrow>
            <SplitTitle first="Derneğimizi " second="Tanıyın" />
            <p className="lead">{siteSettings.aboutShort}</p>
            <Link to="/dernegimiz/hakkimizda" className="btn btn_primary">
              Derneğimiz Hakkında <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="about_img">
              <ZoomableImage src={siteSettings.aboutImage} alt="Dernek tanıtım görseli" width={1000} height={562} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section_tint">
        <div className="container">
          <div className="section_head">
            <Reveal>
              <Eyebrow>ETKİNLİKLER</Eyebrow>
              <SplitTitle first="Etkinlik" second="lerimiz" />
              <p className="muted">
                Trabzonspor sevgisini yaşatmak, üyelerimizi bir araya getirmek ve toplumsal dayanışmayı güçlendirmek amacıyla
                çeşitli etkinlikler düzenliyoruz.
              </p>
            </Reveal>
            <Link to="/etkinlikler" className="btn btn_outline">
              Tüm Etkinlikler <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <EmptyState text="Yakında yeni etkinlikler paylaşılacak." />
          ) : (
            <div className="card_grid">
              {upcomingEvents.map((event, index) => (
                <Reveal key={event.id} delay={index * 0.08}>
                  <ContentCard
                    to={`/etkinlikler/${event.slug}`}
                    title={event.title}
                    summary={event.summary}
                    image={event.image}
                    date={event.eventDate}
                    location={event.location}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {latestNews.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section_head">
              <Reveal>
                <Eyebrow>HABERLER</Eyebrow>
                <SplitTitle first="Son " second="Haberler" />
              </Reveal>
              <Link to="/haberler" className="btn btn_outline">
                Tüm Haberler <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="card_grid">
              {latestNews.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.08}>
                  <ContentCard
                    to={`/haberler/${item.slug}`}
                    title={item.title}
                    summary={item.summary}
                    image={item.image}
                    date={item.publishedAt}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {homeGalleryHighlights.length > 0 && (
        <section className="section section_tint">
          <div className="container">
            <div className="section_head">
              <Reveal>
                <Eyebrow>GALERİ</Eyebrow>
                <SplitTitle first="Kareler" second="imizden" />
              </Reveal>
              <Link to="/galeri" className="btn btn_outline">
                Tüm Galeri <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="gallery_strip">
              {homeGalleryHighlights.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  to={item.albumSlug ? `/galeri/${item.albumSlug}` : '/galeri'}
                  title={item.albumTitle}
                >
                  <img
                    src={toSmallImage(item.image)}
                    alt={item.albumTitle ?? item.title ?? ''}
                    width="400"
                    height="400"
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta">
        <div className="container cta_inner">
          <div>
            <h2>Bu sevdanın bir parçası olun</h2>
            <p>{siteSettings.membershipText}</p>
          </div>
          <Link to="/uyelik" className="btn btn_blue btn_lg">
            Üyelik Başvurusu <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}

export default Home
