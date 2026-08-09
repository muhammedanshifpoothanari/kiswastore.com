'use client'

import { useEffect, useState } from 'react'
import Confetti from '@/components/Confetti'
import Header from '@/components/Header'
import Slider from '@/components/Slider'
import InstaStoryBar from '@/components/InstaStoryBar'
import CategoryCarousel from '@/components/CategoryCarousel'
import ProductGrid from '@/components/ProductGrid'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import VideoSection from '@/components/VideoSection'
import { useLanguage } from '@/hooks/useLanguage'
import { getProductsByCategoryId } from '@/data/products'

export default function Home() {
  const { isArabic, language } = useLanguage()
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [showWelcomeConfetti, setShowWelcomeConfetti] = useState(false)

  // Subtle confetti on first visit only
  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('kiswa_welcomed')) {
      sessionStorage.setItem('kiswa_welcomed', '1')
      setShowWelcomeConfetti(true)
      setTimeout(() => setShowWelcomeConfetti(false), 3000)
    }
  }, [])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setDbProducts(data.data)
        }
      })
      .catch(() => {})
  }, [])

  const getSectionProducts = (catId: string, limit = 8) => {
    if (dbProducts.length > 0) {
      const filtered = dbProducts.filter(p => p.categoryId === catId || p.categoryId === `CAT-${catId}`)
      if (filtered.length > 0) {
        return filtered.slice(0, limit).map(p => ({
          ...p,
          id: p._id || p.id,
          name: p.name?.[language as 'en' | 'ar'] || p.name?.en || p.name
        }))
      }
    }
    // Fallback to static catalog
    return getProductsByCategoryId(catId).slice(0, limit).map(p => ({
      ...p,
      name: p.name[language as 'en' | 'ar'] || p.name.en
    }))
  }

  const prayerMats  = getSectionProducts('CAT-prayer-mat')
  const metalArt    = getSectionProducts('CAT-metal-art')
  const tableDecor  = getSectionProducts('CAT-table-decor')
  const clocks      = getSectionProducts('CAT-clocks')
  const accessories = getSectionProducts('CAT-accessories')
  const giftBoxes   = getSectionProducts('CAT-gifts')

  return (
    <div className="w-full bg-[#fbfbfa] min-h-screen">
      <Confetti active={showWelcomeConfetti} duration={2500} particleCount={50} intensity="subtle" />
      <Header />
      <Slider />

      <main className="pb-16">
        <InstaStoryBar />

        {/* Section 1: Prayer Mats */}
        <ProductGrid
          title={isArabic ? 'سجادات الصلاة' : 'Prayer Mats'}
          products={prayerMats}
          buttonText={isArabic ? 'عرض كل سجادات الصلاة' : 'View All Prayer Mats'}
          categoryId="prayer-mat"
        />

        {/* ── Banner Strip 1: Wall Art + Gift Boxes ── */}
        <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

            {/* Wide banner — Wall Art */}
            <a href="/collections/metal-art" className="md:col-span-2 relative rounded-2xl overflow-hidden group h-52 md:h-64 flex items-end cursor-pointer shadow-md">
              <img src="/products/MID9001.webp" alt="Islamic Wall Art" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#3d2e1e]/80 via-[#3d2e1e]/40 to-transparent" />
              <div className="relative z-10 p-6">
                <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-1">
                  {isArabic ? 'مجموعة حصرية' : 'Exclusive Collection'}
                </p>
                <h3 className="text-white text-xl md:text-2xl font-extrabold leading-tight mb-2">
                  {isArabic ? 'الفن الجداري الإسلامي' : 'Islamic Wall Art'}
                </h3>
                <span className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm transition">
                  {isArabic ? 'تسوق الآن' : 'Shop Now'} →
                </span>
              </div>
            </a>

            {/* Narrow banner — Gift Boxes */}
            <a href="/collections/gifts" className="relative rounded-2xl overflow-hidden group h-52 md:h-64 flex items-end cursor-pointer shadow-md">
              <img src="/products/GiftBoxQuranBlack.png" alt="Gift Boxes" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f07]/90 via-[#1a0f07]/40 to-transparent" />
              <div className="relative z-10 p-5">
                <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-1">
                  {isArabic ? 'هدايا فاخرة' : 'Premium Gifts'}
                </p>
                <h3 className="text-white text-lg font-extrabold leading-tight mb-2">
                  {isArabic ? 'صناديق الهدايا' : 'Gift Boxes'}
                </h3>
                <span className="inline-flex items-center gap-1 bg-amber-500/90 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition">
                  {isArabic ? 'اختر هديتك' : 'Choose a Gift'} →
                </span>
              </div>
            </a>
          </div>
        </section>

        {/* Section 2: Islamic Wall Art */}
        <ProductGrid
          title={isArabic ? 'الفن الجداري الإسلامي' : 'Islamic Wall Art'}
          products={metalArt}
          buttonText={isArabic ? 'عرض كل الفن الجداري' : 'View All Wall Art'}
          categoryId="metal-art"
        />

        {/* Section 3: Table Decor */}
        <ProductGrid
          title={isArabic ? 'ديكور الطاولة' : 'Table Decor'}
          products={tableDecor}
          buttonText={isArabic ? 'عرض كل ديكور الطاولة' : 'View All Table Decor'}
          categoryId="table-decor"
        />

        {/* ── Banner Strip 2: Clocks + Prayer Mats + Accessories ── */}
        <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">

            {/* Clock banner */}
            <a href="/collections/clocks" className="relative rounded-2xl overflow-hidden group h-48 md:h-56 flex items-end cursor-pointer shadow-md">
              <img src="/products/MID9042.webp" alt="Islamic Clocks" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10 p-5">
                <p className="text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-0.5">285 – 495 SAR</p>
                <h3 className="text-white text-base font-extrabold leading-tight">
                  {isArabic ? 'الساعات الإسلامية' : 'Islamic Clocks'}
                </h3>
                <span className="mt-2 inline-block text-white/80 text-xs font-semibold">
                  {isArabic ? 'تسوق →' : 'Shop →'}
                </span>
              </div>
            </a>

            {/* Prayer Mat — full width feel */}
            <a href="/collections/prayer-mat" className="relative rounded-2xl overflow-hidden group h-48 md:h-56 flex items-end cursor-pointer shadow-md">
              <img src="/products/bamboo silk red 2.webp" alt="Prayer Mats" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3d2e1e]/85 via-[#3d2e1e]/30 to-transparent" />
              <div className="relative z-10 p-5">
                <p className="text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-0.5">20 – 690 SAR</p>
                <h3 className="text-white text-base font-extrabold leading-tight">
                  {isArabic ? 'سجادات الصلاة' : 'Prayer Mats'}
                </h3>
                <span className="mt-2 inline-block text-white/80 text-xs font-semibold">
                  {isArabic ? 'اكتشف المجموعة →' : 'Explore Collection →'}
                </span>
              </div>
            </a>

            {/* Accessories banner */}
            <a href="/collections/accessories" className="relative rounded-2xl overflow-hidden group h-48 md:h-56 flex items-end cursor-pointer shadow-md">
              <img src="/products/MetalArtWhitePrayerStand.png" alt="Accessories" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f07]/85 via-[#1a0f07]/20 to-transparent" />
              <div className="relative z-10 p-5">
                <p className="text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-0.5">100 – 600 SAR</p>
                <h3 className="text-white text-base font-extrabold leading-tight">
                  {isArabic ? 'إكسسوارات الصلاة' : 'Prayer Accessories'}
                </h3>
                <span className="mt-2 inline-block text-white/80 text-xs font-semibold">
                  {isArabic ? 'تسوق →' : 'Shop →'}
                </span>
              </div>
            </a>
          </div>
        </section>

        {/* Video Section */}
        <VideoSection />

        {/* Section 4: Islamic Clocks */}
        <ProductGrid
          title={isArabic ? 'الساعات الإسلامية' : 'Islamic Clocks'}
          products={clocks}
          buttonText={isArabic ? 'عرض كل الساعات' : 'View All Clocks'}
          categoryId="clocks"
        />

        {/* Section 5: Prayer Accessories */}
        {accessories.length > 0 && (
          <ProductGrid
            title={isArabic ? 'إكسسوارات الصلاة' : 'Prayer Accessories'}
            products={accessories}
            buttonText={isArabic ? 'عرض كل الإكسسوارات' : 'View All Accessories'}
            categoryId="accessories"
          />
        )}

        {/* Section 6: Gift Boxes */}
        {giftBoxes.length > 0 && (
          <ProductGrid
            title={isArabic ? 'صناديق الهدايا' : 'Gift Boxes'}
            products={giftBoxes}
            buttonText={isArabic ? 'عرض كل الهدايا' : 'View All Gift Boxes'}
            categoryId="gifts"
          />
        )}

        {/* Testimonials */}
        <Testimonials />
      </main>


      <Footer />
    </div>
  )
}
