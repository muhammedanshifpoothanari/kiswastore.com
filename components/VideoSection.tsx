'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const VIMEO_SRC = 'https://player.vimeo.com/video/1213567493?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1&dnt=1&quality=auto'

export default function VideoSection() {
  const [loadVideo, setLoadVideo] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setLoadVideo(true), 500)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative rounded-2xl overflow-hidden shadow-lg w-full h-[600px] md:h-[800px] bg-[#3d2e1e]"
    >
      {/* Banner image — always visible, fades out when video ready */}
      <Image
        src="/kiswa-hero-banner.png"
        alt="Kiswa Store – Premium Hajj & Umrah Essentials"
        fill
        className="object-cover transition-opacity duration-700"
        style={{ zIndex: 1, opacity: loadVideo ? 0 : 1 }}
        priority
      />

      {/* Vimeo — injected only when section scrolls into view */}
      {loadVideo && (
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
    </div>
  )
}
