import { useEffect, useRef } from 'react'
import './reveal.css'

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    if (!('IntersectionObserver' in window)) {
      element.classList.add('in')
      return undefined
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('in')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -60px 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="reveal" style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  )
}

export default Reveal
