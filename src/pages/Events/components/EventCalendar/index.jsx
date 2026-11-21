import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import ContentCard from '../../../../components/ContentCard'
import EmptyState from '../../../../components/EmptyState'
import ImagePlaceholder from '../../../../components/ImagePlaceholder'
import SplitTitle from '../../../../components/SplitTitle'
import { parseDate } from '../../../../utils/formatDate'
import { toSmallImage } from '../../../../utils/imageVariant'
import './event_calendar.css'

const MONTH_NAMES = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
const WEEKDAY_NAMES = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const WEEKDAY_FULL_NAMES = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

const pad = (value) => String(value).padStart(2, '0')
const toDayKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const formatLongDate = (date) => `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
const formatTime = (date) => (date.getHours() === 0 && date.getMinutes() === 0 ? '' : `${pad(date.getHours())}.${pad(date.getMinutes())}`)

function UpcomingEventItem({ event, date }) {
  const time = formatTime(date)
  const detailPath = `/etkinlikler/${event.slug}`

  return (
    <article className="up_item">
      <Link to={detailPath} className="up_img" tabIndex={-1} aria-hidden="true">
        {event.image ? (
          <img src={toSmallImage(event.image)} alt="" width="344" height="240" loading="lazy" decoding="async" />
        ) : (
          <ImagePlaceholder />
        )}
      </Link>
      <div className="up_body">
        <h3>
          <Link to={detailPath}>{event.title}</Link>
        </h3>
        <div className="up_meta">
          <span>
            <CalendarDays size={15} aria-hidden="true" /> {formatLongDate(date)}
            {time && ` · ${time}`}
          </span>
          {event.location && (
            <span>
              <MapPin size={15} aria-hidden="true" /> {event.location}
            </span>
          )}
        </div>
        {event.summary && <p>{event.summary}</p>}
      </div>
      <Link to={detailPath} className="btn btn_primary btn_sm up_btn" aria-label={`${event.title} — detayı gör`}>
        Detayı Gör <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </article>
  )
}

function EventCalendar({ events }) {
  const today = useMemo(() => new Date(), [])
  const todayKey = toDayKey(today)
  const startOfToday = useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()), [today])
  const [visibleMonth, setVisibleMonth] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selectedDay, setSelectedDay] = useState(null)

  const { eventsByDay, upcomingEvents, pastEvents } = useMemo(() => {
    const dated = []
    const undated = []
    for (const event of events) {
      const date = parseDate(event.eventDate)
      if (date) dated.push({ event, date })
      else undated.push(event)
    }
    dated.sort((a, b) => a.date - b.date)
    const byDay = new Map()
    for (const item of dated) {
      const key = toDayKey(item.date)
      byDay.set(key, [...(byDay.get(key) ?? []), item])
    }
    return {
      eventsByDay: byDay,
      upcomingEvents: dated.filter((item) => item.date >= startOfToday),
      pastEvents: [
        ...dated
          .filter((item) => item.date < startOfToday)
          .reverse()
          .map((item) => item.event),
        ...undated,
      ],
    }
  }, [events, startOfToday])

  const leadingBlanks = (new Date(visibleMonth.year, visibleMonth.month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(visibleMonth.year, visibleMonth.month + 1, 0).getDate()
  const cells = [...Array(leadingBlanks).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)]
  while (cells.length % 7) cells.push(null)

  const shiftMonth = (offset) =>
    setVisibleMonth((current) => {
      const date = new Date(current.year, current.month + offset, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })

  const goToToday = () => {
    setVisibleMonth({ year: today.getFullYear(), month: today.getMonth() })
    setSelectedDay(null)
  }

  const listedEvents = selectedDay ? eventsByDay.get(selectedDay) ?? [] : upcomingEvents
  const selectedDate = selectedDay ? parseDate(`${selectedDay} 00:00`) : null
  const monthLabel = `${MONTH_NAMES[visibleMonth.month]} ${visibleMonth.year}`

  return (
    <>
      <section className="section">
        <div className="container events_layout">
          <div className="cal_card">
            <div className="cal_head">
              <h2>Etkinlik Takvimi</h2>
              <button type="button" className="cal_today_btn" onClick={goToToday}>
                Bugün
              </button>
              <button type="button" className="cal_nav" onClick={() => shiftMonth(-1)} aria-label="Önceki ay">
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" className="cal_nav" onClick={() => shiftMonth(1)} aria-label="Sonraki ay">
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="cal_month" aria-live="polite">
              {monthLabel}
            </div>
            <div className="cal_grid" role="group" aria-label={`${monthLabel} takvimi`}>
              {WEEKDAY_NAMES.map((name, index) => (
                <div key={name} className="cal_dow">
                  <abbr title={WEEKDAY_FULL_NAMES[index]}>{name}</abbr>
                </div>
              ))}
              {cells.map((day, index) => {
                if (day === null) return <div key={`blank_${index}`} className="cal_cell blank" aria-hidden="true" />
                const key = `${visibleMonth.year}-${pad(visibleMonth.month + 1)}-${pad(day)}`
                const dayEvents = eventsByDay.get(key)
                const className = ['cal_cell', key === todayKey ? 'today' : '', dayEvents ? 'has' : '', selectedDay === key ? 'selected' : '']
                  .filter(Boolean)
                  .join(' ')
                if (!dayEvents) {
                  return (
                    <div key={key} className={className}>
                      <span className="num">{day}</span>
                    </div>
                  )
                }
                return (
                  <button
                    key={key}
                    type="button"
                    className={className}
                    aria-pressed={selectedDay === key}
                    aria-label={`${day} ${MONTH_NAMES[visibleMonth.month]}, ${dayEvents.length} etkinlik`}
                    onClick={() => setSelectedDay((current) => (current === key ? null : key))}
                  >
                    <span className="num">{day}</span>
                  </button>
                )
              })}
            </div>
            <p className="cal_foot">Bugün: {formatLongDate(today)}</p>
          </div>
          <div className="up_card">
            <div className="up_head">
              <h2>{selectedDate ? `${formatLongDate(selectedDate)} Etkinlikleri` : 'Yaklaşan Etkinlikler'}</h2>
              {selectedDay && (
                <button type="button" className="cal_today_btn" onClick={() => setSelectedDay(null)}>
                  Tümü
                </button>
              )}
            </div>
            {listedEvents.length === 0 ? (
              <EmptyState
                text={
                  selectedDay
                    ? 'Bu günde etkinlik yok.'
                    : 'Yaklaşan etkinlik bulunmuyor. Yeni etkinlikler eklendiğinde burada görünecek.'
                }
              />
            ) : (
              <div className="up_list">
                {listedEvents.map((item) => (
                  <UpcomingEventItem key={item.event.id} event={item.event} date={item.date} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      {pastEvents.length > 0 && (
        <section className="section section_tint">
          <div className="container">
            <SplitTitle first="Önceki " second="Etkinlikler" />
            <div className="card_grid">
              {pastEvents.map((event) => (
                <ContentCard
                  key={event.id}
                  to={`/etkinlikler/${event.slug}`}
                  title={event.title}
                  summary={event.summary}
                  image={event.image}
                  date={event.eventDate}
                  location={event.location}
                  withTime
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default EventCalendar
