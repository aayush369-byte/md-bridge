import { useTranslation } from '../i18n'
import './LanguageSwitcher.css'

export function LanguageSwitcher() {
  const { locale, setLocale, locales, t } = useTranslation()
  return (
    <div className="lang-switcher" role="group" aria-label={t.languageSwitcher.label}>
      {locales.map((l) => (
        <button
          key={l.code}
          type="button"
          className={`lang-switcher__btn ${l.code === locale ? 'is-active' : ''}`.trim()}
          aria-pressed={l.code === locale}
          onClick={() => setLocale(l.code)}
        >
          {l.code.toUpperCase()}
          <span className="lang-switcher__full">{l.label}</span>
        </button>
      ))}
    </div>
  )
}
