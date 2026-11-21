import { useCallback, useState } from 'react'
import Lightbox from '../Lightbox'
import './zoomable_image.css'

function ZoomableImage({ src, full, alt = '', caption, width, height, loading = 'lazy', className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <button
        type="button"
        className={`zoomable ${className}`.trim()}
        onClick={() => setIsOpen(true)}
        aria-label={`${alt || caption || 'Görseli'} büyüt`}
      >
        <img src={src} alt={alt} width={width} height={height} loading={loading} decoding="async" />
      </button>
      {isOpen && <Lightbox image={full ?? src} alt={alt} caption={caption} onClose={close} />}
    </>
  )
}

export default ZoomableImage
