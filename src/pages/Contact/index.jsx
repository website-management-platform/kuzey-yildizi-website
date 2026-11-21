import { Link } from 'react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import Eyebrow from '../../components/Eyebrow'
import { FormField, SubmitForm } from '../../components/Form'
import PageHero from '../../components/PageHero'
import SplitTitle from '../../components/SplitTitle'
import { siteSettings } from '../../content/siteSettings'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import './contact.css'

const MAP_EMBED_PREFIX = 'https://www.google.com/maps/embed'

const contactRows = [
  siteSettings.phone && {
    icon: <Phone size={20} aria-hidden="true" />,
    label: 'Telefon',
    value: siteSettings.phone,
    href: `tel:${siteSettings.phone.replace(/\s/g, '')}`,
  },
  siteSettings.email && {
    icon: <Mail size={20} aria-hidden="true" />,
    label: 'E-posta',
    value: siteSettings.email,
    href: `mailto:${siteSettings.email}`,
  },
  siteSettings.address && {
    icon: <MapPin size={20} aria-hidden="true" />,
    label: 'Adres',
    value: siteSettings.address,
  },
].filter(Boolean)

function Contact() {
  useDocumentMeta('İletişim')
  const hasMap = siteSettings.mapEmbed?.startsWith(MAP_EMBED_PREFIX)

  return (
    <>
      <PageHero title="İletişim" text="Soru, öneri ve görüşleriniz için bize ulaşın." />
      <section className="section">
        <div className="container contact_grid">
          <div>
            <Eyebrow>MESAJ GÖNDERİN</Eyebrow>
            <SplitTitle first="Bize " second="Yazın" />
            <SubmitForm
              submitLabel="Gönder"
              successTitle="Mesajınız iletildi"
              successText="Teşekkür ederiz, en kısa sürede dönüş yapacağız."
            >
              <div className="form_row">
                <FormField label="Ad Soyad" name="name" isRequired autoComplete="name" />
                <FormField label="Telefon" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
              </div>
              <FormField label="E-posta" name="email" type="email" isRequired autoComplete="email" inputMode="email" />
              <FormField label="Konu" name="subject" />
              <FormField label="Mesajınız" name="message" isTextarea isRequired />
              <p className="form_note">
                Gönderdiğiniz bilgiler <Link to="/aydinlatma-metni">Aydınlatma Metni</Link> kapsamında işlenir.
              </p>
            </SubmitForm>
          </div>
          <aside className="contact_info" aria-labelledby="contact_info_title">
            <h2 id="contact_info_title">Dernek Bilgileri</h2>
            {contactRows.length === 0 && <p className="muted">İletişim bilgileri yakında eklenecek.</p>}
            {contactRows.map((row) => (
              <div key={row.label} className="info_row">
                <span className="info_icon">{row.icon}</span>
                <div>
                  <small>{row.label}</small>
                  {row.href ? <a href={row.href}>{row.value}</a> : <p>{row.value}</p>}
                </div>
              </div>
            ))}
            {hasMap && (
              <iframe
                className="map"
                src={siteSettings.mapEmbed}
                title="Dernek konumu haritası"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </aside>
        </div>
      </section>
    </>
  )
}

export default Contact
