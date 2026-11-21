import { Link } from 'react-router'
import Eyebrow from '../../components/Eyebrow'
import { CheckField, ChoiceField, FormField, SubmitForm } from '../../components/Form'
import PageHero from '../../components/PageHero'
import SplitTitle from '../../components/SplitTitle'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { useCms } from '../../cms/context'
import { submitForm } from '../../cms/forms'

const CONGRESS_MEMBER_OPTIONS = [
  ['yes', 'Evet'],
  ['no', 'Hayır'],
]

// Panel formundaki seçenek değerleri
const CONGRESS_VALUES = { yes: 'evet', no: 'hayir' }

function Membership() {
  const { siteSettings } = useCms()
  useDocumentMeta('Üyelik')

  return (
    <>
      <PageHero title="Üyelik" text={siteSettings.membershipText} />
      <section className="section">
        <div className="container narrow">
          <Eyebrow>BAŞVURU</Eyebrow>
          <SplitTitle first="Üyelik " second="Formu" />
          <SubmitForm
            submitLabel="Başvuruyu Gönder"
            successTitle="Başvurunuz alındı"
            successText="Teşekkür ederiz. Yönetim kurulumuz başvurunuzu inceleyip sizinle iletişime geçecek."
            onSubmit={(values) => submitForm('uyelik', values, (key, value) => (key === 'congress_member' ? CONGRESS_VALUES[value] ?? value : value))}
          >
            <div className="form_row">
              <FormField label="Ad Soyad" name="full_name" isRequired autoComplete="name" />
              <FormField label="Doğum Yılı" name="birth_year" type="number" inputMode="numeric" autoComplete="bday-year" />
            </div>
            <div className="form_row">
              <FormField label="E-posta" name="email" type="email" isRequired autoComplete="email" inputMode="email" />
              <FormField label="Telefon" name="phone" type="tel" isRequired autoComplete="tel" inputMode="tel" />
            </div>
            <ChoiceField
              legend="Trabzonspor Kongre Üyesi misiniz?"
              name="congress_member"
              isRequired
              options={CONGRESS_MEMBER_OPTIONS}
            />
            <FormField label="Yaşadığınız Şehir" name="city" autoComplete="address-level2" />
            <FormField label="Eklemek istedikleriniz" name="note" isTextarea rows={4} />
            <CheckField name="kvkk" isRequired>
              <Link to="/aydinlatma-metni" target="_blank" rel="noopener">
                Aydınlatma Metni
                <span className="sr_only"> (yeni sekmede açılır)</span>
              </Link>
              'ni okudum ve anladım.
            </CheckField>
          </SubmitForm>
        </div>
      </section>
    </>
  )
}

export default Membership
