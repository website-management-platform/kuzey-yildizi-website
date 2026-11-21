import { useCallback, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Images } from 'lucide-react'
import EmptyState from '../../components/EmptyState'
import ImagePlaceholder from '../../components/ImagePlaceholder'
import Lightbox from '../../components/Lightbox'
import PageHero from '../../components/PageHero'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { toSmallImage } from '../../utils/imageVariant'
import NotFound from '../NotFound'
import './gallery.css'
import { useCms } from '../../cms/context'

const SWIPE_THRESHOLD_PX = 50

function AlbumList() {
  const { galleryAlbums } = useCms()
  useDocumentMeta('Galeri', 'Dernek etkinliklerimizden ve tribün anlarımızdan fotoğraf albümleri.')

  return (
    <>
      <PageHero title="Galeri" text="Dernek etkinliklerimizden ve tribün anlarımızdan kareler." />
      <section className="section">
        <div className="container">
          {galleryAlbums.length === 0 ? (
            <EmptyState text="Galeriye henüz fotoğraf eklenmedi." />
          ) : (
            <div className="album_grid">
              {galleryAlbums.map((album) => (
                <Link key={album.id} to={`/galeri/${album.slug}`} className="album_card">
                  <div className="album_cover">
                    {album.cover ? (
                      <img src={toSmallImage(album.cover)} alt="" width="640" height="480" loading="lazy" decoding="async" />
                    ) : (
                      <ImagePlaceholder />
                    )}
                    <span className="album_count">
                      <Images size={14} aria-hidden="true" /> {album.photos.length}
                      <span className="sr_only"> fotoğraf</span>
                    </span>
                  </div>
                  <div className="album_info">
                    <h2>{album.title}</h2>
                    {album.description && <p>{album.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function AlbumDetail({ album }) {
  const photos = album.photos
  const [activeIndex, setActiveIndex] = useState(null)
  const touchStartRef = useRef(null)
  useDocumentMeta(album.title, album.description ?? undefined)

  const close = useCallback(() => setActiveIndex(null), [])
  const step = useCallback(
    (offset) => setActiveIndex((current) => (current === null ? current : (current + offset + photos.length) % photos.length)),
    [photos.length],
  )
  const showPrevious = useCallback(() => step(-1), [step])
  const showNext = useCallback(() => step(1), [step])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') showNext()
    if (event.key === 'ArrowLeft') showPrevious()
  }

  const handleTouchEnd = (event) => {
    const start = touchStartRef.current
    touchStartRef.current = null
    if (start === null) return
    const delta = event.changedTouches[0].clientX - start
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) step(delta < 0 ? 1 : -1)
  }

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null
  const hasMultiple = photos.length > 1

  return (
    <>
      <PageHero title={album.title} text={album.description ?? undefined} />
      <section className="section">
        <div className="container">
          <Link to="/galeri" className="back_link">
            <ArrowLeft size={16} aria-hidden="true" /> Tüm albümler
          </Link>
          {photos.length === 0 ? (
            <EmptyState text="Bu albümde henüz fotoğraf yok." />
          ) : (
            <div className="masonry">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  className="masonry_item"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${photo.title ?? `${album.title} ${index + 1}. fotoğraf`} — büyüt`}
                >
                  <img src={toSmallImage(photo.image)} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      {activePhoto && (
        <Lightbox
          image={activePhoto.image}
          alt={activePhoto.title ?? `${album.title} ${activeIndex + 1}. fotoğraf`}
          caption={activePhoto.title ?? undefined}
          onClose={close}
          onKeyDown={handleKeyDown}
          onPrevious={hasMultiple ? showPrevious : undefined}
          onNext={hasMultiple ? showNext : undefined}
          onTouchStart={(event) => {
            touchStartRef.current = event.touches.length === 1 ? event.touches[0].clientX : null
          }}
          onTouchEnd={handleTouchEnd}
        />
      )}
    </>
  )
}

function Gallery() {
  const { galleryAlbums } = useCms()
  const { slug } = useParams()
  if (!slug) return <AlbumList />

  const album = galleryAlbums.find((item) => item.slug === slug)
  if (!album) return <NotFound />

  return <AlbumDetail key={album.slug} album={album} />
}

export default Gallery
