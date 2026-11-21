import PageHero from '../../components/PageHero'
import Prose from '../../components/Prose'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { useCms } from '../../cms/context'

function Privacy() {
  const { siteSettings } = useCms()
  useDocumentMeta('Aydınlatma Metni', 'Kişisel verilerin korunması kanunu kapsamında aydınlatma metni.')

  return (
    <>
      <PageHero title="Aydınlatma Metni" text="Kişisel verilerinizin korunması bizim için önemlidir." />
      <section className="section">
        <div className="container narrow">
          <Prose text={siteSettings.privacyText} />
        </div>
      </section>
    </>
  )
}

export default Privacy
