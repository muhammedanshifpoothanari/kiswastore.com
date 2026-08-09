'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Slider() {
  const videoUrl = "/kiswa-hero.mp4"
  const [videoReady, setVideoReady] = useState(false)

  return (
    <Link href="/collections" className="block relative w-full h-[360px] md:h-[560px] overflow-hidden bg-[#3d2e1e] group cursor-pointer">
      {/* Fallback image */}
      <Image
        src="/kiswa-hero-banner.png"
        alt="Kiswa – Premium Islamic Home Decor"
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ zIndex: 1 }}
        priority
      />

      {/* Video layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700"
        style={{
          zIndex: 2,
          opacity: videoReady ? 1 : 0,
          transition: 'opacity 0.8s ease, transform 0.7s ease',
        }}
        onCanPlay={() => setVideoReady(true)}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Subtle hover CTA */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
        <div className="px-7 py-3 bg-white/95 backdrop-blur-sm text-[#3d2e1e] font-extrabold text-sm md:text-base rounded-full shadow-xl transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          Explore Our Collections
        </div>
      </div>
    </Link>
  )
}
