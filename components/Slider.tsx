'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const VIMEO_SRC = 'https://player.vimeo.com/video/1213567493?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1&dnt=1&quality=auto'

export default function Slider() {
  const [loadVideo, setLoadVideo] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setLoadVideo(true), 300)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <Link
      ref={ref}
      href="/collections"
      className="block relative w-full h-[360px] md:h-[560px] overflow-hidden bg-[#3d2e1e] group cursor-pointer"
    >
      {/* Video loads silently behind image */}
      {loadVideo && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
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
              src={VIMEO_SRC}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              title="Kiswa Hero"
            />
          </div>
        </div>
      )}

      {/* Image stays on top — fades out after Vimeo is ready */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ zIndex: 2, opacity: loadVideo ? 0 : 1, transitionDelay: loadVideo ? '2s' : '0s' }}
      >
        <Image
          src="/kiswa-hero-banner.png"
          alt="Kiswa – Premium Islamic Home Decor"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Hover CTA */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
        <div className="px-7 py-3 bg-white/95 backdrop-blur-sm text-[#3d2e1e] font-extrabold text-sm md:text-base rounded-full shadow-xl transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          Explore Our Collections
        </div>
      </div>
    </Link>
  )
}
