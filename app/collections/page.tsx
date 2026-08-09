'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/hooks/useLanguage'

const collections = [
  {
    id: 'prayer-mat',
    name: { en: 'Prayer Mats', ar: 'سجادات الصلاة' },
    description: { en: '11 products · 20 – 690 SAR', ar: '11 منتج · 20 – 690 ر.س' },
    image: '/products/4mm2.png',
    bg: 'from-amber-50 to-orange-100',
  },
  {
    id: 'metal-art',
    name: { en: 'Islamic Wall Art', ar: 'الفن الجداري الإسلامي' },
    description: { en: '22 products · 110 – 3,485 SAR', ar: '22 منتج · 110 – 3,485 ر.س' },
    image: '/products/MID9001.webp',
    bg: 'from-yellow-50 to-amber-100',
  },
  {
    id: 'table-decor',
    name: { en: 'Table Decor', ar: 'ديكور الطاولة' },
    description: { en: '10 products · 110 SAR each', ar: '10 منتجات · 110 ر.س' },
    image: '/products/MID9009_Bismillah.webp',
    bg: 'from-stone-50 to-amber-50',
  },
  {
    id: 'clocks',
    name: { en: 'Islamic Clocks', ar: 'الساعات الإسلامية' },
    description: { en: '6 products · 285 – 495 SAR', ar: '6 منتجات · 285 – 495 ر.س' },
    image: '/products/MID9042.webp',
    bg: 'from-zinc-50 to-stone-100',
  },
  {
    id: 'accessories',
    name: { en: 'Prayer Accessories', ar: 'إكسسوارات الصلاة' },
    description: { en: '2 products · 100 – 600 SAR', ar: '2 منتجات · 100 – 600 ر.س' },
    image: '/products/meditationstool (1).webp',
    bg: 'from-amber-50 to-yellow-100',
  },
  {
    id: 'gifts',
    name: { en: 'Gift Boxes', ar: 'صناديق الهدايا' },
    description: { en: '2 products · 184 – 218 SAR', ar: '2 منتجات · 184 – 218 ر.س' },
    image: '/products/GiftBoxQuranBlack.png',
    bg: 'from-orange-50 to-amber-100',
  },
]

export default function CollectionsPage() {
  const { language, isArabic } = useLanguage()

  return (
    <div className="w-full bg-[#fbfbfa] min-h-screen">
      <Header />

      {/* Page Header */}
      <div className="bg-[#3d2e1e] text-white py-12 md:py-16 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
          {isArabic ? 'جميع الأقسام' : 'All Collections'}
        </h1>
        <p className="text-amber-200 text-sm md:text-base">
          {isArabic ? 'تصفح منتجاتنا الإسلامية الفاخرة' : 'Browse our premium Islamic product range'}
        </p>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {collections.map((col) => (
            <a
              key={col.id}
              href={`/collections/${col.id}`}
              className={`group relative rounded-2xl overflow-hidden bg-gradient-to-br ${col.bg} border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Product image */}
              <div className="h-52 md:h-64 overflow-hidden flex items-center justify-center bg-white/60">
                <img
                  src={col.image}
                  alt={col.name.en}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-5 border-t border-amber-100">
                <h2 className="text-lg font-extrabold text-[#3d2e1e] mb-1">
                  {col.name[language as 'en' | 'ar']}
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  {col.description[language as 'en' | 'ar']}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#3d2e1e] uppercase tracking-wide group-hover:gap-2 transition-all">
                  {isArabic ? 'تسوق الآن' : 'Shop Now'}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
