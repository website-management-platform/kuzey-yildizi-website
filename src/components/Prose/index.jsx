import './prose.css'

function Prose({ text }) {
  if (!text) return null

  const blocks = []
  let paragraph = []
  let list = []

  const flush = () => {
    if (paragraph.length) {
      blocks.push(<p key={blocks.length}>{paragraph.join('\n')}</p>)
      paragraph = []
    }
    if (list.length) {
      blocks.push(
        <ul key={blocks.length}>
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>,
      )
      list = []
    }
  }

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line) {
      flush()
    } else if (line.startsWith('## ')) {
      flush()
      blocks.push(<h2 key={blocks.length}>{line.slice(3)}</h2>)
    } else if (line.startsWith('- ')) {
      if (paragraph.length) flush()
      list.push(line.slice(2))
    } else {
      if (list.length) flush()
      paragraph.push(line)
    }
  }
  flush()

  return <div className="prose">{blocks}</div>
}

export default Prose
