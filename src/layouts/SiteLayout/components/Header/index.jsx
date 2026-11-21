import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { ChevronDown, Menu, X } from 'lucide-react'
import { primaryLinks, secondaryLinks, homeLink } from '../../navigationLinks'
import { useCms } from '../../../../cms/context'

function NavItem({ link }) {
  return (
    <NavLink
      to={link.to}
      end={link.end}
      title={link.isExtra ? link.label : undefined}
      className={({ isActive }) => [isActive ? 'active' : '', link.isExtra ? 'nav_extra' : ''].filter(Boolean).join(' ') || undefined}
    >
      {link.label}
    </NavLink>
  )
}

function Header() {
  const { associationMenu } = useCms()
  const topLevelPages = associationMenu
    .filter((item) => item.isTopLevel)
    .map((item) => ({ to: `/dernegimiz/${item.slug}`, label: item.title, isExtra: true }))
  const dropdownPages = associationMenu.filter((item) => !item.isTopLevel)
  const { pathname } = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const dropdownRef = useRef(null)
  const toggleRef = useRef(null)
  const [previousPathname, setPreviousPathname] = useState(pathname)

  if (previousPathname !== pathname) {
    setPreviousPathname(pathname)
    setIsMenuOpen(false)
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isDropdownOpen) return undefined
    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setIsDropdownOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
        dropdownRef.current?.querySelector('button')?.focus()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDropdownOpen])

  const isDropdownCurrent = dropdownPages.some((item) => pathname === `/dernegimiz/${item.slug}`)

  return (
    <header className={`site_header${isScrolled ? ' scrolled' : ''}`}>
      <div className="container header_inner">
        <Link to="/" className="brand" aria-label="Kuzey Yıldızı Trabzonsporlular Derneği">
          <img src="/images/brand/logo_128.png" alt="" width="64" height="64" fetchPriority="high" />
          <span className="brand_text">
            <strong>Kuzey Yıldızı</strong>
            <em>Trabzonsporlular Derneği</em>
          </span>
        </Link>
        <nav id="main_navigation" className={`nav${isMenuOpen ? ' open' : ''}`} aria-label="Ana menü">
          <NavItem link={homeLink} />
          {topLevelPages.map((link) => (
            <NavItem key={link.to} link={link} />
          ))}
          {dropdownPages.length > 0 && (
            <div
              ref={dropdownRef}
              className={['dropdown', isDropdownOpen ? 'open' : '', isDropdownCurrent ? 'current' : ''].filter(Boolean).join(' ')}
            >
              <button
                type="button"
                className="dropdown_btn"
                aria-expanded={isDropdownOpen}
                aria-controls="association_menu"
                onClick={() => setIsDropdownOpen((current) => !current)}
              >
                Derneğimiz <ChevronDown size={14} aria-hidden="true" />
              </button>
              <div id="association_menu" className="dropdown_menu">
                {dropdownPages.map((item) => (
                  <NavLink key={item.slug} to={`/dernegimiz/${item.slug}`}>
                    {item.title}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
          {[...primaryLinks, ...secondaryLinks].map((link) => (
            <NavItem key={link.to} link={link} />
          ))}
          <Link to="/uyelik" className="btn btn_primary btn_sm nav_cta">
            Üye Ol
          </Link>
        </nav>
        <button
          ref={toggleRef}
          type="button"
          className="nav_toggle"
          aria-expanded={isMenuOpen}
          aria-controls="main_navigation"
          aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}

export default Header
