import { useEffect } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const openDialogs = []

export function useDialog(dialogRef, onClose) {
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined

    const previouslyFocused = document.activeElement
    const entry = { dialog }
    openDialogs.push(entry)
    document.body.style.overflow = 'hidden'

    const firstFocusable = dialog.querySelector(FOCUSABLE_SELECTOR)
    ;(firstFocusable ?? dialog).focus({ preventScroll: true })

    const handleKeyDown = (event) => {
      if (openDialogs[openDialogs.length - 1] !== entry) return
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)].filter((element) => element.offsetParent !== null)
      if (focusable.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      openDialogs.splice(openDialogs.indexOf(entry), 1)
      if (openDialogs.length === 0) document.body.style.overflow = ''
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
  }, [dialogRef, onClose])
}
