import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useDialog } from '../../hooks/useDialog'
import './lightbox.css'

function Lightbox({ image, alt = '', caption, onClose, onPrevious, onNext, onKeyDown, onTouchStart, onTouchEnd }) {
  const dialogRef = useRef(null)
  useDialog(dialogRef, onClose)

  const runWithoutClosing = (handler) => (event) => {
    event.stopPropagation()
    handler()
  }

  return createPortal(
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={caption || alt || 'Görsel'}
      tabIndex={-1}
      onClick={onClose}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button type="button" className="lb_close" aria-label="Kapat" onClick={runWithoutClosing(onClose)}>
        <X size={26} aria-hidden="true" />
      </button>
      {onPrevious && (
        <button type="button" className="lb_nav prev" aria-label="Önceki" onClick={runWithoutClosing(onPrevious)}>
          <ChevronLeft size={32} aria-hidden="true" />
        </button>
      )}
      <figure onClick={(event) => event.stopPropagation()}>
        <img src={image} alt={alt} />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
      {onNext && (
        <button type="button" className="lb_nav next" aria-label="Sonraki" onClick={runWithoutClosing(onNext)}>
          <ChevronRight size={32} aria-hidden="true" />
        </button>
      )}
    </div>,
    document.body,
  )
}

export default Lightbox
