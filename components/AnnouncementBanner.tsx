'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

const announcements = {
  en: [
    'Spend SAR 250.00 and get free delivery',
    'Welcome to Kiswa - Premium Islamic Products',
    'All The Way From Makkah',
    'Premium quality at competitive prices',
  ],
  ar: [
    'احصل على توصيل مجاني عند شرائك بمبلغ 250 ريال',
    'أهلاً بك في كسوة - أفضل المنتجات الإسلامية',
    'مباشر من مكة المكرمة',
    'جودة عالية بأسعار تنافسية',
  ],
}

export default function AnnouncementBanner() {
  const { isArabic } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const messages = isArabic ? announcements.ar : announcements.en

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [messages.length])

  return (
    <div className="bg-gray-100 text-gray-600 overflow-hidden border-b border-gray-200">
      <div className="px-4 py-2 flex items-center justify-center">
        {/* Announcement Text */}
        <div className="text-center text-[11px] md:text-xs font-medium tracking-wide h-4 flex items-center justify-center">
          <span className="transition-opacity duration-500 animate-fade-in">
            {messages[currentIndex]}
          </span>
        </div>
      </div>
    </div>
  )
}
