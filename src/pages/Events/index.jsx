import { useParams } from 'react-router'
import ArticleDetail from '../../components/ArticleDetail'
import PageHero from '../../components/PageHero'
import { eventItems } from '../../content/events'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import NotFound from '../NotFound'
import EventCalendar from './components/EventCalendar'

const PAGE_TITLE = 'Etkinlikler'
const PAGE_INTRO = 'Üyelerimizi ve Trabzonspor sevdalılarını bir araya getiren etkinliklerimiz.'

function EventList() {
  useDocumentMeta(PAGE_TITLE, PAGE_INTRO)

  return (
    <>
      <PageHero title={PAGE_TITLE} text={PAGE_INTRO} />
      <EventCalendar events={eventItems} />
    </>
  )
}

function Events() {
  const { slug } = useParams()
  if (!slug) return <EventList />

  const event = eventItems.find((item) => item.slug === slug)
  if (!event) return <NotFound />

  return (
    <ArticleDetail
      backTo="/etkinlikler"
      backLabel={PAGE_TITLE}
      title={event.title}
      summary={event.summary}
      body={event.body}
      image={event.image}
      date={event.eventDate}
      location={event.location}
      withTime
    />
  )
}

export default Events
