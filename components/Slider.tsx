'use client'

import Image from 'next/image'
import Link from 'next/link'

const VIMEO_ID = '1213567493'

export default function Slider() {
  return (
    <Link href="/collections" className="block relative w-full h-[360px] md:h-[560px] overflow-hidden bg-[#3d2e1e] group cursor-pointer">
      {/* Fallback image shown before iframe loads */}
      <Image
        src="/kiswa-hero-banner.png"
        alt="Kiswa – Premium Islamic Home Decor"
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ zIndex: 1 }}
        priority
      />

      {/* Vimeo background video layer */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <iframe
          src={`https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&muted=1&loop=1&background=1&quality=auto`}
          allow="autoplay; fullscreen"
          className="w-full h-full"
          style={{
            border: 'none',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.05)',
          }}
        />
      </div>

      {/* Subtle hover CTA */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
        <div className="px-7 py-3 bg-white/95 backdrop-blur-sm text-[#3d2e1e] font-extrabold text-sm md:text-base rounded-full shadow-xl transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          Explore Our Collections
        </div>
      </div>
    </Link>
  )
}
