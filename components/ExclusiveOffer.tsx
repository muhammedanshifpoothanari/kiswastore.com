'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/hooks/useLanguage'
import { useCart } from '@/context/CartContext'

const products = [
  {
    id: 'exc-1',
    nameEn: 'Gold & Silver 2cm Foam Mat',
    nameAr: 'سجادة إسفنجية ٢ سم ذهبي وفضي',
    descEn: '2 pcs for 96 SAR — premium 2cm foam comfort, 70×115 cm',
    descAr: 'حبتين بـ ٩٦ ريال — راحة إسفنجية ٢ سم فاخرة، ٧٠×١١٥ سم',
    price: 96,
    priceLabel: '/ 2 pcs',
    priceLabelAr: '/ حبتين',
    dimensions: '70 × 115 cm',
    badge: 'Best Seller',
    badgeAr: 'الأكثر مبيعاً',
    image: '/banners/offer-foam-gold-silver.jpg',
  },
  {
    id: 'exc-2',
    nameEn: 'Purple & Champagne 2cm Foam Mat',
    nameAr: 'سجادة إسفنجية ٢ سم بنفسجي وشمبانيا',
    descEn: '2 pcs for 96 SAR — premium 2cm foam comfort, 70×115 cm',
    descAr: 'حبتين بـ ٩٦ ريال — راحة إسفنجية ٢ سم فاخرة، ٧٠×١١٥ سم',
    price: 96,
    priceLabel: '/ 2 pcs',
    priceLabelAr: '/ حبتين',
    dimensions: '70 × 115 cm',
    badge: 'Elegant',
    badgeAr: 'أنيق',
    image: '/banners/offer-foam-purple-champagne.jpg',
  },
  {
    id: 'exc-3',
    nameEn: 'Navy & Olive 2cm Memory Foam Mat',
    nameAr: 'سجادة إسفنج ذاكرة ٢ سم كحلي وزيتوني',
    descEn: '2 pcs for 96 SAR — 2cm memory foam with ornate design, 70×120 cm',
    descAr: 'حبتين بـ ٩٦ ريال — إسفنج ذاكرة ٢ سم بتصميم مزخرف، ٧٠×١٢٠ سم',
    price: 96,
    priceLabel: '/ 2 pcs',
    priceLabelAr: '/ حبتين',
    dimensions: '70 × 120 cm',
    badge: 'Popular',
    badgeAr: 'رائج',
    image: '/banners/offer-memory-navy-olive.png',
  },
  {
    id: 'exc-4',
    nameEn: 'Burgundy & Charcoal 2cm Memory Foam Mat',
    nameAr: 'سجادة إسفنج ذاكرة ٢ سم عنابي وفحمي',
    descEn: '2 pcs for 96 SAR — 2cm memory foam with ornate design, 70×120 cm',
    descAr: 'حبتين بـ ٩٦ ريال — إسفنج ذاكرة ٢ سم بتصميم مزخرف، ٧٠×١٢٠ سم',
    price: 96,
    priceLabel: '/ 2 pcs',
    priceLabelAr: '/ حبتين',
    dimensions: '70 × 120 cm',
    badge: 'Limited',
    badgeAr: 'كمية محدودة',
    image: '/banners/offer-memory-burgundy-dark.png',
  },
]

type Product = typeof products[0]

export default function ExclusiveOffer() {
  const { isArabic } = useLanguage()
  const router = useRouter()
  const { addToCart, clearCart } = useCart()
  const [activeProduct, setActiveProduct] = useState<Product>(products[0])

  const handleOrderNow = () => {
    clearCart()
    addToCart({
      id: activeProduct.id,
      productId: activeProduct.id,
      name: isArabic ? activeProduct.nameAr : activeProduct.nameEn,
      nameEn: activeProduct.nameEn,
      nameAr: activeProduct.nameAr,
      price: activeProduct.price,
      image: activeProduct.image,
      quantity: 1,
    })
    router.push('/checkout')
  }

  return (
    <section className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">
            {isArabic ? 'اليوم الوطني ٩٦' : 'Saudi National Day 96'}
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#3d2e1e]">
            {isArabic ? 'العروض الحصرية' : 'Exclusive Offers'}
          </h2>
        </div>
        <Link
          href="/collections/prayer-mat"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#3d2e1e] hover:text-amber-700 transition-colors"
        >
          {isArabic ? 'عرض الكل' : 'View All'} →
        </Link>
      </div>

      {/* Main card */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#0d4f3c]">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/banners/_Saudi National Day Instagram (1).png"
            alt="Saudi National Day"
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d4f3c]/90 via-[#0d4f3c]/80 to-[#0d4f3c]/90" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
          {/* ── LEFT/TOP: 2x2 grid of all 4 images ── */}
          <div className="lg:col-span-6 p-4 md:p-6 grid grid-cols-2 gap-3 lg:gap-4">
            <div className="col-span-2">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1 lg:mb-2">
                {isArabic ? 'اختر العرض' : 'Select Offer'}
              </p>
            </div>
            
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveProduct(p)}
                className={`relative w-full rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group cursor-pointer aspect-[3/4] md:aspect-[4/5] ${
                  activeProduct.id === p.id
                    ? 'ring-4 ring-amber-400 scale-[1.02] z-10'
                    : 'ring-1 ring-white/15 hover:ring-white/50 hover:scale-[1.02]'
                }`}
              >
                <Image
                  src={p.image}
                  alt={p.nameEn}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Active tick */}
                {activeProduct.id === p.id && (
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 w-5 h-5 md:w-6 md:h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#3d2e1e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Bottom label */}
                <div className="absolute bottom-0 inset-x-0 p-2 md:p-3 text-left">
                  <p className={`text-[8px] md:text-[9px] font-extrabold uppercase tracking-widest mb-0.5 ${
                    activeProduct.id === p.id ? 'text-amber-400' : 'text-white/70'
                  }`}>
                    {isArabic ? p.badgeAr : p.badge}
                  </p>
                  <p className="text-white text-[10px] md:text-xs font-bold leading-tight line-clamp-2">
                    {isArabic ? p.nameAr : p.nameEn}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* ── RIGHT/BOTTOM: Detail panel ── */}
          <div
            key={activeProduct.id}
            className="lg:col-span-6 flex flex-col justify-center p-6 md:p-10 border-t lg:border-t-0 lg:border-l border-white/10"
            style={{ animation: 'fadeSlideIn 0.3s ease' }}
          >
            {/* Badge */}
            <span className="self-start mb-4 px-3 py-1 bg-amber-400 text-[#3d2e1e] text-xs font-extrabold rounded-full uppercase tracking-wide shadow">
              {isArabic ? activeProduct.badgeAr : activeProduct.badge}
            </span>

            {/* Name */}
            <h3 className="text-white text-2xl md:text-3xl font-extrabold leading-tight mb-2">
              {isArabic ? activeProduct.nameAr : activeProduct.nameEn}
            </h3>

            {/* Dimensions chip */}
            <span className="self-start mb-4 px-2.5 py-1 bg-white/10 text-white/80 text-xs font-bold rounded-lg border border-white/20 tracking-widest">
              {activeProduct.dimensions}
            </span>

            {/* Description */}
            <p className="text-white/70 text-sm md:text-base mb-6 leading-relaxed max-w-md">
              {isArabic ? activeProduct.descAr : activeProduct.descEn}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-black text-white">{activeProduct.price}</span>
              <span className="text-lg font-bold text-white/80">SAR</span>
              <span className="text-base font-extrabold text-amber-400">
                {isArabic ? activeProduct.priceLabelAr : activeProduct.priceLabel}
              </span>
            </div>
            <p className="text-white/50 text-xs mb-8">
              {isArabic ? '٤٨ ريال للقطعة' : '48 SAR per piece'}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={handleOrderNow}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#3d2e1e] font-extrabold text-sm px-8 py-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {isArabic ? 'اطلب الآن' : 'Order Now'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="relative z-10 border-t border-white/10 px-6 md:px-10 py-4 flex flex-wrap items-center gap-5">
          {[
            { icon: '🕌', en: '2cm Foam Comfort',   ar: 'راحة إسفنجية ٢ سم' },
            { icon: '📦', en: 'Fast Delivery',      ar: 'شحن سريع' },
            { icon: '🎁', en: 'National Day Deal',  ar: 'عرض اليوم الوطني' },
            { icon: '✨', en: 'Premium Quality',    ar: 'جودة عالية' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-white/60 text-xs font-semibold">
              <span className="text-sm">{item.icon}</span>
              {isArabic ? item.ar : item.en}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}
