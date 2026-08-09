'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function CategoryCarousel() {
  const [scrollPos, setScrollPos] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setCategories(data.data.map((cat: any) => ({
            id: cat._id || cat.slug,
            slug: cat.slug,
            name: cat.name[language as 'en' | 'ar'] || cat.name.en || cat.name,
            image: cat.image
          })))
        }
      })
      .catch(() => {})
  }, [language])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 300
    const newPos =
      direction === 'left'
        ? Math.max(0, scrollPos - scrollAmount)
        : scrollPos + scrollAmount

    setScrollPos(newPos)
    scrollContainerRef.current.scrollTo({
      left: newPos,
      behavior: 'smooth',
    })
  }

  if (categories.length === 0) return null

  return (
    <section className="py-8 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-8 overflow-x-auto scroll-smooth justify-start md:justify-center items-start pb-4 hide-scrollbar"
        >
          {categories.map((category) => {
            const catName = typeof category.name === 'object' && category.name !== null 
              ? (category.name[language as 'en' | 'ar'] || category.name.en || category.name.ar || '') 
              : String(category.name || '')
            return (
              <div
                key={category.id}
                className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group"
                onClick={() => window.location.href = `/collections/${category.slug}`}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[#3d2e1e]/10 group-hover:border-[#3d2e1e] transition-colors duration-300">
                  <img
                    src={category.image}
                    alt={catName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700 text-center max-w-[100px] leading-tight group-hover:text-[#3d2e1e]">
                  {catName}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
