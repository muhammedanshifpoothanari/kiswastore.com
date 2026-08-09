'use client'

import { useContext } from 'react'
import { LanguageContext } from '@/context/LanguageContext'

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === null || context === undefined) {
    // Provide default values if context is not available (helpful during SSR)
    return {
      language: 'en' as const,
      setLanguage: () => {},
      isArabic: false,
      isEnglish: true,
    }
  }
  return context
}
