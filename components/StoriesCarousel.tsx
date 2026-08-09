'use client'

import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const stories = [
  { id: 1, name: 'Tents', image: '/categories/tents-badge.png', link: '/collections/tents' },
  { id: 2, name: 'Prayer Mats', image: '/categories/prayer-mats-badge.png', link: '/collections/tents' },
  { id: 3, name: 'Prayer Wear', image: '/categories/prayer-wear-badge.png', link: '/collections/tents' },
  { id: 4, name: 'Furnishings', image: 'bg-gradient-to-br from-teal-400 to-teal-600', link: '/collections/tents' },
  { id: 5, name: 'Accessories', image: 'bg-gradient-to-br from-green-400 to-green-600', link: '/collections/tents' },
  { id: 6, name: 'New Arrivals', image: 'bg-gradient-to-br from-cyan-400 to-teal-600', link: '/collections/tents' },
]

export default function StoriesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 120
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="px-4 md:px-8 lg:px-[80px] py-16 bg-white">
      <div className="relative">
        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Shop by Category</h2>
        <div className="luxury-line mb-10"></div>

        {/* Carousel Container */}
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2.5 premium-shadow transition hidden md:flex items-center justify-center hover:bg-accent border-2 border-muted"
          >
            <ChevronLeft size={20} className="text-primary" />
          </button>

          {/* Scrollable Stories */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-2 scroll-smooth w-full px-8"
            style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {stories.map((story) => (
              <a key={story.id} href={story.link} className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer group">
                {/* Circle Badge */}
                <div className={`w-24 md:w-28 h-24 md:h-28 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all transform group-hover:scale-105 flex items-center justify-center border-3 border-white ${story.image.startsWith('/') ? '' : story.image}`}>
                  {story.image.startsWith('/') ? (
                    <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                {/* Label */}
                <p className="text-xs md:text-sm font-bold text-primary text-center max-w-24 line-clamp-2">
                  {story.name}
                </p>
              </a>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2.5 premium-shadow transition hidden md:flex items-center justify-center hover:bg-accent border-2 border-muted"
          >
            <ChevronRight size={20} className="text-primary" />
          </button>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
