'use client'

import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'

export default function Slider() {
  return (
    <Link href="/collections" className="block relative w-full h-[360px] md:h-[560px] overflow-hidden bg-[#3d2e1e] group cursor-pointer">
      {/* Fallback image shown instantly */}
      <Image
        src="/kiswa-hero-banner.png"
        alt="Kiswa – Premium Islamic Home Decor"
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ zIndex: 1 }}
        priority
      />

      {/* Vimeo background video – covers full hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {/* 16:9 ratio wrapper scaled up to cover any container */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '177.78vh', /* 16/9 * 100vh */
          height: '100vh',
          minWidth: '100%',
          minHeight: '56.25vw', /* 9/16 * 100vw */
          transform: 'translate(-50%, -50%)',
        }}>
          <iframe
            src="https://player.vimeo.com/video/1213567493?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            title="MODEL 01"
          />
        </div>
      </div>

      {/* Subtle hover CTA */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
        <div className="px-7 py-3 bg-white/95 backdrop-blur-sm text-[#3d2e1e] font-extrabold text-sm md:text-base rounded-full shadow-xl transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          Explore Our Collections
        </div>
      </div>

      <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
    </Link>
  )
}
