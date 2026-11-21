import { createContext, useContext, useId, useState } from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react'
import './form.css'

const FieldErrorsContext = createContext({})
const HONEYPOT_NAME = 'website'
const SUBMISSION_UNAVAILABLE_MESSAGE =
  'Form gönderimi şu anda aktif değil. Bize telefon veya e-posta ile ulaşabilirsiniz.'

function getValidationMessage(element) {
  const { validity } = element
  if (validity.valueMissing) {
    if (element.type === 'checkbox') return 'Devam etmek için bu kutuyu işaretlemeniz gerekiyor.'
    if (element.type === 'radio') return 'Lütfen bir seçim yapın.'
    return 'Bu alan boş bırakılamaz.'
  }
  if (validity.typeMismatch && element.type === 'email') return 'Geçerli bir e-posta adresi yazın. Örn: ad@ornek.com'
  return 'Lütfen bu alanı kontrol edin.'
}

function useFieldError(name) {
  return useContext(FieldErrorsContext)[name]
}

function FieldError({ id, name }) {
  const error = useFieldError(name)
  if (!error) return null
  return (
    <em id={id} className="field_error" role="alert">
      <CircleAlert size={15} aria-hidden="true" /> {error}
    </em>
  )
}

export function SubmitForm({ submitLabel, successTitle, successText, onSubmit, children }) {
  const [status, setStatus] = useState('idle')
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const invalidElements = [...form.elements].filter(
      (element) => element.name && element.name !== HONEYPOT_NAME && element.willValidate && !element.validity.valid,
    )

    if (invalidElements.length > 0) {
      const errors = {}
      for (const element of invalidElements) errors[element.name] ??= getValidationMessage(element)
      setFieldErrors(errors)
      setFormError('')
      invalidElements[0].focus({ preventScroll: true })
      invalidElements[0].scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }

    setFieldErrors({})
    if (!onSubmit) {
      setFormError(SUBMISSION_UNAVAILABLE_MESSAGE)
      return
    }

    const values = Object.fromEntries(new FormData(form))
    form.querySelectorAll('input[type=checkbox]').forEach((checkbox) => {
      values[checkbox.name] = checkbox.checked
    })

    setStatus('sending')
    setFormError('')
    try {
      await onSubmit(values)
      setStatus('done')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Bir hata oluştu.')
      setStatus('idle')
    }
  }

  const handleChange = (event) => {
    const { name } = event.target
    if (!name) return
    setFieldErrors((current) => {
      if (!(name in current)) return current
      const rest = { ...current }
      delete rest[name]
      return rest
    })
  }

  if (status === 'done') {
    return (
      <div className="form_success" role="status">
        <CircleCheck size={44} aria-hidden="true" />
        <h3>{successTitle}</h3>
        <p>{successText}</p>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={handleSubmit} onChange={handleChange} noValidate>
      <FieldErrorsContext.Provider value={fieldErrors}>{children}</FieldErrorsContext.Provider>
      <input type="text" name={HONEYPOT_NAME} tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      {formError && (
        <div className="form_error" role="alert">
          {formError}
        </div>
      )}
      <button type="submit" className="btn btn_primary btn_lg" disabled={status === 'sending'}>
        {status === 'sending' ? 'Gönderiliyor…' : submitLabel}
      </button>
    </form>
  )
}

export function FormField({ label, name, type = 'text', isRequired = false, isTextarea = false, rows = 5, autoComplete, inputMode }) {
  const errorId = useId()
  const hasError = Boolean(useFieldError(name))
  const controlProps = {
    name,
    required: isRequired,
    'aria-invalid': hasError,
    'aria-describedby': hasError ? errorId : undefined,
  }

  return (
    <label className={`field${hasError ? ' invalid' : ''}`}>
      <span>
        {label}
        {isRequired && <b aria-hidden="true"> *</b>}
      </span>
      {isTextarea ? (
        <textarea {...controlProps} rows={rows} />
      ) : (
        <input {...controlProps} type={type} autoComplete={autoComplete} inputMode={inputMode} />
      )}
      <FieldError id={errorId} name={name} />
    </label>
  )
}

export function CheckField({ name, isRequired = false, children }) {
  const errorId = useId()
  const hasError = Boolean(useFieldError(name))

  return (
    <div className={`check_wrap${hasError ? ' invalid' : ''}`}>
      <label className="check">
        <input
          type="checkbox"
          name={name}
          required={isRequired}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
        />
        <span>{children}</span>
      </label>
      <FieldError id={errorId} name={name} />
    </div>
  )
}

export function ChoiceField({ legend, name, options, isRequired = false }) {
  const errorId = useId()
  const hasError = Boolean(useFieldError(name))

  return (
    <div className={`choice_wrap${hasError ? ' invalid' : ''}`}>
      <fieldset className="choice" aria-describedby={hasError ? errorId : undefined}>
        <legend>
          {legend}
          {isRequired && <b aria-hidden="true"> *</b>}
        </legend>
        {options.map(([value, optionLabel]) => (
          <label key={value}>
            <input type="radio" name={name} value={value} required={isRequired} aria-invalid={hasError} /> {optionLabel}
          </label>
        ))}
      </fieldset>
      <FieldError id={errorId} name={name} />
    </div>
  )
}
