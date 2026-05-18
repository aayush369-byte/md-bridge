import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DICTIONARIES, LOCALES, type Dictionary, type Locale } from './dictionaries'

const STORAGE_KEY = 'md-bridge:locale'

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null
  if (stored && (stored === 'en' || stored === 'pt')) return stored
  const nav = window.navigator?.language?.toLowerCase() ?? ''
  if (nav.startsWith('pt')) return 'pt'
  return 'en'
}

interface I18nContextValue {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
  locales: typeof LOCALES
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? detectInitialLocale)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, locale)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', locale === 'pt' ? 'pt-BR' : 'en')
    }
  }, [locale])

  const setLocale = useCallback((next: Locale) => setLocaleState(next), [])

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: DICTIONARIES[locale], setLocale, locales: LOCALES }),
    [locale, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useTranslation must be used within an I18nProvider')
  }
  return ctx
}

export type { Locale, Dictionary }
