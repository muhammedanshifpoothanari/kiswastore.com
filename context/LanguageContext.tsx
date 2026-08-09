'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isArabic: boolean
  isEnglish: boolean
}

export const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Load saved language preference
    const saved = localStorage.getItem('language') as Language | null
    const initialLang = (saved === 'ar' || saved === 'en') ? saved : 'en' // Default to English
    setLanguageState(initialLang)
    document.documentElement.lang = initialLang
    document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr'
    if (document.body) document.body.dir = initialLang === 'ar' ? 'rtl' : 'ltr'
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    // Update HTML attributes for proper RTL/LTR
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    if (document.body) document.body.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    isArabic: language === 'ar',
    isEnglish: language === 'en',
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
