import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useMediaQuery } from '../../../../hooks/useMediaQuery'
import './hero_slider.css'

const AUTOPLAY_DELAY_MS = 6500
const AUTOPLAY_START_DELAY_MS = 1500
const SWIPE_THRESHOLD_PX = 50

function HeroImage({ slide, isMobile, isPriority }) {
  const src = isMobile && slide.mobileImage ? slide.mobileImage : slide.image
  return (
    <img
      className="hero_img"
      src={src}
      alt=""
      width="2000"
      height="1126"
      loading={isPriority ? 'eager' : 'lazy'}
      fetchPriority={isPriority ? 'high' : 'auto'}
      decoding="async"
      onError={(event) => {
        if (event.currentTarget.getAttribute('src') !== slide.image) event.currentTarget.src = slide.image
      }}
    />
  )
}

function HeroSlider({ slides, defaultTitle, defaultText }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isStopped, setIsStopped] = useState(false)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isMobile = useMediaQuery('(max-width: 720px)')
  const touchStartRef = useRef(null)
  const count = slides.length
  const hasMultiple = count > 1

  useEffect(() => {
    if (!hasMultiple) return undefined
    const timer = window.setTimeout(() => setIsReady(true), AUTOPLAY_START_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [hasMultiple])

  const goTo = useCallback((index) => setActiveIndex(((index % count) + count) % count), [count])

  useEffect(() => {
    if (!hasMultiple || isPaused || isStopped || prefersReducedMotion || !isReady) return undefined
    const timer = window.setTimeout(() => goTo(activeIndex + 1), AUTOPLAY_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [activeIndex, hasMultiple, isPaused, isStopped, prefersReducedMotion, isReady, goTo])

  const navigate = (index) => {
    setIsReady(true)
    goTo(index)
  }

  const handleTouchStart = (event) => {
    touchStartRef.current =
      event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null
  }

  const handleTouchEnd = (event) => {
    const start = touchStartRef.current
    touchStartRef.current = null
    if (!start || !hasMultiple) return
    const deltaX = event.changedTouches[0].clientX - start.x
    const deltaY = event.changedTouches[0].clientY - start.y
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      navigate(activeIndex + (deltaX < 0 ? 1 : -1))
    }
  }

  const activeSlide = slides[activeIndex] ?? slides[0]
  const title = activeSlide?.title?.trim() || defaultTitle
  const text = activeSlide?.text?.trim() || defaultText
  const copyKey = activeSlide?.title?.trim() || activeSlide?.text?.trim() ? `slide_${activeSlide.id}` : 'default'
  const [titleFirst, ...titleRest] = title.split(',')

  return (
    <section
      className="hero"
      aria-roledescription={hasMultiple ? 'slayt' : undefined}
      aria-label="Öne çıkan görseller"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero_slides" aria-hidden="true">
        {slides.map(
          (slide, index) =>
            (index === 0 || isReady || index === activeIndex) && (
              <div key={slide.id} className={`hero_slide${index === activeIndex ? ' active' : ''}`}>
                <HeroImage slide={slide} isMobile={isMobile} isPriority={index === 0} />
              </div>
            ),
        )}
      </div>
      <div className="hero_shade" aria-hidden="true" />
      <div className="container hero_inner">
        <div key={copyKey} className="hero_copy">
          <h1 className="hero_title">
            <span>
              {titleFirst}
              {titleRest.length ? ',' : ''}
            </span>
            {titleRest.length > 0 && <span className="blue">{titleRest.join(',').trim()}</span>}
          </h1>
          <div className="hero_sub">
            <strong>Kuzey Yıldızı</strong>
            <strong>Trabzonsporlular Derneği</strong>
          </div>
          <i className="rule" />
          <p className="hero_text">{text}</p>
        </div>
        <div className="hero_actions">
          <Link to="/dernegimiz/hakkimizda" className="btn btn_outline_light">
            Derneğimizi Tanıyın <ChevronRight size={16} aria-hidden="true" />
          </Link>
          <Link to="/uyelik" className="btn btn_blue">
            Üye Ol
          </Link>
        </div>
      </div>
      {hasMultiple && (
        <>
          <button type="button" className="hero_arrow prev" aria-label="Önceki görsel" onClick={() => navigate(activeIndex - 1)}>
            <ChevronLeft size={26} aria-hidden="true" />
          </button>
          <button type="button" className="hero_arrow next" aria-label="Sonraki görsel" onClick={() => navigate(activeIndex + 1)}>
            <ChevronRight size={26} aria-hidden="true" />
          </button>
          <div className="hero_dots" role="group" aria-label="Görsel seçici">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`${index + 1}. görsel`}
                aria-current={index === activeIndex ? 'true' : undefined}
                className={index === activeIndex ? 'on' : undefined}
                onClick={() => navigate(index)}
              />
            ))}
            {!prefersReducedMotion && (
              <button
                type="button"
                className="hero_pause"
                aria-label={isStopped ? 'Slaytı başlat' : 'Slaytı duraklat'}
                onClick={() => setIsStopped((current) => !current)}
              >
                {isStopped ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default HeroSlider
