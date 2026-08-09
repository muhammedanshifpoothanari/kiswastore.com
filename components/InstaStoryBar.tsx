'use client'

import { useLanguage } from '@/hooks/useLanguage'

export default function InstaStoryBar() {
  const { isArabic } = useLanguage()

  const stories = [
    {
      id: 'prayer-mat',
      title: isArabic ? 'سجادات الصلاة' : 'Prayer Mats',
      image: '/products/4mm2.png',
      href: '/collections/prayer-mat',
    },
    {
      id: 'metal-art',
      title: isArabic ? 'الفن الجداري' : 'Wall Art',
      image: '/products/MID9001.webp',
      href: '/collections/metal-art',
    },
    {
      id: 'table-decor',
      title: isArabic ? 'ديكور الطاولة' : 'Table Decor',
      image: '/products/MID9009_Bismillah.webp',
      href: '/collections/table-decor',
    },
    {
      id: 'clocks',
      title: isArabic ? 'الساعات' : 'Clocks',
      image: '/products/MID9042.webp',
      href: '/collections/clocks',
    },
    {
      id: 'accessories',
      title: isArabic ? 'الإكسسوارات' : 'Accessories',
      image: '/products/meditationstool (1).webp',
      href: '/collections/accessories',
    },
    {
      id: 'gifts',
      title: isArabic ? 'الهدايا' : 'Gift Boxes',
      image: '/products/GiftBoxQuranBlack.png',
      href: '/collections/gifts',
    },
  ]

  return (
    <section className="py-6 w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar justify-start md:justify-center py-2">
          {stories.map((story) => (
            <a
              key={story.id}
              href={story.href}
              className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
            >
              <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <div className="w-18 h-18 md:w-22 md:h-22 rounded-full overflow-hidden bg-white p-0.5 border border-white">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <span className="text-xs font-extrabold text-gray-800 text-center group-hover:text-[#3d2e1e] transition">
                {story.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
