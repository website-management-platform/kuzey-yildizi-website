import './logo_loader.css'

function LogoLoader({ isFullscreen = false }) {
  return (
    <div className={`logo_loader${isFullscreen ? ' full' : ''}`} role="status" aria-live="polite">
      <div className="logo_loader_box">
        <img src="/images/brand/logo_192.png" alt="" width="84" height="84" />
        <i aria-hidden="true" />
      </div>
      <span className="sr_only">Yükleniyor…</span>
    </div>
  )
}

export default LogoLoader
