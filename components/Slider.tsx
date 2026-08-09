'use client'

import Image from 'next/image'
import Link from 'next/link'

const YT_ID = 'a8udNoN_ZPQ'

export default function Slider() {
  return (
    <Link href="/collections" className="block relative w-full h-[360px] md:h-[560px] overflow-hidden bg-[#3d2e1e] group cursor-pointer">
      {/* Fallback image shown instantly */}
      <Image
        src="/kiswa-hero-banner.png"
        alt="Kiswa – Premium Islamic Home Decor"
        fill
        className="object-cover"
        style={{ zIndex: 1 }}
        priority
      />

      {/* YouTube background video – covers full hero */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '177.78vh',
          height: '100vh',
          minWidth: '100%',
          minHeight: '56.25vw',
          transform: 'translate(-50%, -50%)',
        }}>
          <iframe
            src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            title="Kiswa Hero"
          />
        </div>
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
