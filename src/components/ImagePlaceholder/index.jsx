import './image_placeholder.css'

function ImagePlaceholder({ label }) {
  return (
    <div className="img_placeholder" aria-hidden="true">
      <img src="/images/brand/logo_192.png" alt="" />
      {label && <span>{label}</span>}
    </div>
  )
}

export default ImagePlaceholder
