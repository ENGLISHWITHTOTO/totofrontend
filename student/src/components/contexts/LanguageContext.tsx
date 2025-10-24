import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = {
  code: string
  name: string
  flag: string
  direction: 'ltr' | 'rtl'
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', direction: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', direction: 'ltr' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', direction: 'ltr' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', direction: 'ltr' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', direction: 'ltr' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', direction: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', direction: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳', direction: 'ltr' }
]

type LanguageContextType = {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load saved language from localStorage on mount
    const savedLanguageCode = localStorage.getItem('preferred_language')
    if (savedLanguageCode) {
      const savedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguageCode)
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage)
      }
    }
    setIsLoading(false)
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem('preferred_language', language.code)
    
    // Update document direction for RTL languages
    document.documentElement.dir = language.direction
    document.documentElement.lang = language.code
  }

  const value = {
    currentLanguage,
    setLanguage,
    isLoading
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}