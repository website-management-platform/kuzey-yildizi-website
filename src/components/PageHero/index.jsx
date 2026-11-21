import './page_hero.css'

function PageHero({ title, text }) {
  return (
    <section className="page_hero">
      <div className="container">
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  )
}

export default PageHero
