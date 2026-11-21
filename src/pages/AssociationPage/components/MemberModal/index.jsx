import { useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, X } from 'lucide-react'
import ImagePlaceholder from '../../../../components/ImagePlaceholder'
import Prose from '../../../../components/Prose'
import ZoomableImage from '../../../../components/ZoomableImage'
import { useDialog } from '../../../../hooks/useDialog'
import { toSmallImage } from '../../../../utils/imageVariant'
import { splitName } from '../../orgTree'
import './member_modal.css'

function MemberModal({ member, onClose }) {
  const dialogRef = useRef(null)
  const bioRef = useRef(null)
  const titleId = useId()
  const [isBioExpanded, setIsBioExpanded] = useState(false)
  const [isBioOverflowing, setIsBioOverflowing] = useState(false)
  useDialog(dialogRef, onClose)

  const title = member.officialTitle?.trim() || member.role
  const [firstNames, surname] = splitName(member.name)
  const hasBio = Boolean(member.bio?.trim())

  useLayoutEffect(() => {
    const bio = bioRef.current
    if (bio) setIsBioOverflowing(bio.scrollHeight > bio.clientHeight + 4 || isBioExpanded)
  }, [member.bio, isBioExpanded])

  return createPortal(
    <div className="member_modal" onClick={onClose}>
      <div
        ref={dialogRef}
        className="member_card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="member_head">
          <span className="member_brand" aria-hidden="true">
            KUZEY YILDIZI
            <i />
          </span>
          <button type="button" className="member_close" aria-label="Kapat" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="member_body">
          <div className="member_photo">
            {member.photo ? (
              <ZoomableImage
                src={toSmallImage(member.photo)}
                full={member.photo}
                alt={member.name}
                caption={title ? `${member.name} — ${title}` : member.name}
                width={150}
                height={150}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
          <h2 id={titleId} className="member_name">
            {firstNames}
            {surname && (
              <>
                {' '}
                <span className="sur">{surname.toLocaleUpperCase('tr-TR')}</span>
              </>
            )}
          </h2>
          {title && <p className="member_title">{title}</p>}
          <p className="member_org">Kuzey Yıldızı Trabzonsporlular Derneği</p>
          <div className="member_sep" aria-hidden="true">
            <i />
          </div>
          <h3 className="member_bio_head">Özgeçmiş</h3>
          <div
            ref={bioRef}
            className={['member_bio', isBioExpanded ? '' : 'clamped', isBioOverflowing && !isBioExpanded ? 'fade' : '']
              .filter(Boolean)
              .join(' ')}
          >
            {hasBio ? <Prose text={member.bio} /> : <p className="member_bio_empty">Özgeçmiş bilgileri bu alanda yer alacaktır.</p>}
          </div>
          {isBioOverflowing && (
            <button
              type="button"
              className="member_more"
              aria-expanded={isBioExpanded}
              onClick={() => setIsBioExpanded((current) => !current)}
            >
              {isBioExpanded ? 'Daha az göster' : 'Devamını oku'} <ChevronDown size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default MemberModal
