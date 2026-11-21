import { Link } from 'react-router'
import { homeLink, primaryLinks, secondaryLinks } from '../../navigationLinks'
import InstallButton from '../InstallButton'
import SocialIcon from '../SocialIcon'
import { useCms } from '../../../../cms/context'

function Footer() {
  const { siteSettings, associationMenu } = useCms()
  const phoneHref = `tel:${siteSettings.phone.replace(/\s/g, '')}`
  const SOCIAL_LINKS = [
    { key: 'instagram', href: siteSettings.instagram, label: 'Instagram' },
    { key: 'facebook', href: siteSettings.facebook, label: 'Facebook' },
    { key: 'x', href: siteSettings.xTwitter, label: 'X' },
    { key: 'youtube', href: siteSettings.youtube, label: 'YouTube' },
  ].filter((item) => item.href)
  const { phone, email, address } = siteSettings

  return (
    <footer className="site_footer">
      <div className="container footer_grid">
        <div className="footer_brand">
          <img src="/images/brand/logo_192.png" alt="" width="96" height="96" loading="lazy" />
          <div>
            <strong>Kuzey Yıldızı</strong>
            <span>Trabzonsporlular Derneği</span>
            <i className="rule" />
            <em>{siteSettings.footerSlogan}</em>
          </div>
        </div>
        <nav className="footer_links" aria-labelledby="footer_links_title">
          <h2 id="footer_links_title">Hızlı Erişim</h2>
          {[homeLink, ...primaryLinks, ...secondaryLinks].map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
          {associationMenu.map((item) => (
            <Link key={item.slug} to={`/dernegimiz/${item.slug}`}>
              {item.title}
            </Link>
          ))}
          <Link to="/uyelik">Üyelik</Link>
        </nav>
        <div className="footer_quote">
          <p>{siteSettings.footerQuote}</p>
          <i className="rule" />
          {(phone || email || address) && (
            <ul className="footer_contact">
              {phone && (
                <li>
                  <a href={phoneHref}>{phone}</a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              )}
              {address && <li>{address}</li>}
            </ul>
          )}
          {SOCIAL_LINKS.length > 0 && (
            <div className="socials">
              {SOCIAL_LINKS.map((item) => (
                <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`${item.label} (yeni sekmede açılır)`}>
                  <SocialIcon name={item.key} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="footer_bottom container">
        © {new Date().getFullYear()} Kuzey Yıldızı Trabzonsporlular Derneği. Tüm hakları saklıdır. ·{' '}
        <Link to="/aydinlatma-metni">Aydınlatma Metni</Link>
        <InstallButton />
      </div>
    </footer>
  )
}

export default Footer
