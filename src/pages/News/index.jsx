import { useParams } from 'react-router'
import ArticleDetail from '../../components/ArticleDetail'
import ContentCard from '../../components/ContentCard'
import EmptyState from '../../components/EmptyState'
import PageHero from '../../components/PageHero'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import NotFound from '../NotFound'
import { useCms } from '../../cms/context'

const PAGE_TITLE = 'Haberler'
const PAGE_INTRO = 'Dernek çalışmalarımız ve duyurularımız.'

function NewsList() {
  const { newsItems } = useCms()
  useDocumentMeta(PAGE_TITLE, PAGE_INTRO)

  return (
    <>
      <PageHero title={PAGE_TITLE} text={PAGE_INTRO} />
      <section className="section">
        <div className="container">
          {newsItems.length === 0 ? (
            <EmptyState text="Henüz içerik eklenmedi." />
          ) : (
            <div className="card_grid">
              {newsItems.map((item) => (
                <ContentCard
                  key={item.id}
                  to={`/haberler/${item.slug}`}
                  title={item.title}
                  summary={item.summary}
                  image={item.image}
                  date={item.publishedAt}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function News() {
  const { newsItems } = useCms()
  const { slug } = useParams()
  if (!slug) return <NewsList />

  const item = newsItems.find((news) => news.slug === slug)
  if (!item) return <NotFound />

  return (
    <ArticleDetail
      backTo="/haberler"
      backLabel={PAGE_TITLE}
      title={item.title}
      summary={item.summary}
      body={item.body}
      image={item.image}
      date={item.publishedAt}
    />
  )
}

export default News
