import { useEffect, useState } from 'react'
import { listThemes, type Theme } from '../lib/api'
import { useTranslation } from '../i18n'
import './ThemePicker.css'

interface ThemePickerProps {
  value: string
  onChange: (id: string) => void
}

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  const { t } = useTranslation()
  const [themes, setThemes] = useState<Theme[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    listThemes(ctrl.signal)
      .then((data) => setThemes(data))
      .catch((err) => {
        if (ctrl.signal.aborted) return
        setError((err as Error).message)
      })
    return () => ctrl.abort()
  }, [])

  if (error) {
    return (
      <p className="theme-picker__error" role="alert">
        {t.theme.errorPrefix} {error}
      </p>
    )
  }

  if (!themes) {
    return <p className="theme-picker__loading">{t.theme.loading}</p>
  }

  if (themes.length === 0) {
    return <p className="theme-picker__loading">{t.theme.none}</p>
  }

  return (
    <fieldset className="theme-picker" role="radiogroup" aria-label={t.theme.legend}>
      <legend className="theme-picker__legend">{t.theme.legend}</legend>
      <div className="theme-picker__list">
        {themes.map((theme) => (
          <label
            key={theme.id}
            className={`theme-picker__item ${value === theme.id ? 'is-active' : ''}`.trim()}
          >
            <input
              type="radio"
              name="theme"
              value={theme.id}
              checked={value === theme.id}
              onChange={() => onChange(theme.id)}
            />
            <span>{theme.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
