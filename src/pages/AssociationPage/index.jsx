import { useParams } from 'react-router'
import PageHero from '../../components/PageHero'
import Prose from '../../components/Prose'
import Reveal from '../../components/Reveal'
import ZoomableImage from '../../components/ZoomableImage'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import NotFound from '../NotFound'
import OrgChart from './components/OrgChart'
import './association_page.css'
import { useCms } from '../../cms/context'

function groupMembersBySection(members) {
  const groups = []
  for (const member of members) {
    const name = member.section || ''
    let group = groups.find((item) => item.name === name)
    if (!group) {
      group = { name, items: [] }
      groups.push(group)
    }
    group.items.push(member)
  }
  return groups
}

function AssociationPage() {
  const { associationPages } = useCms()
  const { slug } = useParams()
  const page = associationPages.find((item) => item.slug === slug)
  useDocumentMeta(page?.title, page?.body?.slice(0, 200) || undefined)

  if (!page) return <NotFound />

  const memberGroups = groupMembersBySection(page.members)
  const hasBody = Boolean(page.body?.trim())
  const hasIntro = hasBody || Boolean(page.image)

  return (
    <>
      <PageHero title={page.title} />
      {hasIntro && (
        <section className="section">
          <div className={`container${page.image ? ' about_grid' : ' narrow'}`}>
            <Reveal>
              <Prose text={page.body} />
            </Reveal>
            {page.image && (
              <Reveal delay={0.1}>
                <div className="about_img">
                  <ZoomableImage src={page.image} alt={page.title} width={800} height={500} />
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}
      {memberGroups.length > 0 && (
        <section className={`section${hasIntro ? ' section_tint' : ''}`}>
          <div className="container">
            {memberGroups.map((group) => (
              <div key={group.name} className="team_group">
                {group.name && memberGroups.length > 1 && <h2 className="team_title">{group.name}</h2>}
                <OrgChart members={group.items} />
              </div>
            ))}
          </div>
        </section>
      )}
      {!hasIntro && memberGroups.length === 0 && (
        <section className="section">
          <div className="container narrow">
            <div className="empty">Bu sayfanın içeriği yakında eklenecek.</div>
          </div>
        </section>
      )}
    </>
  )
}

export default AssociationPage
