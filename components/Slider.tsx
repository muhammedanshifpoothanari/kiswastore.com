'use client'

import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

const VIMEO_ID = '1213567493'

export default function Slider() {
  const [loadVideo, setLoadVideo] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const containerRef = useRef<HTMLAnchorElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Step 1: Defer iframe injection until element is in viewport
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
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Step 2: Once iframe is mounted, attach Vimeo Player API
  useEffect(() => {
    if (!loadVideo) return

    // Poll until Vimeo Player API is available (loaded by Script tag)
    let attempts = 0
    const init = setInterval(() => {
      attempts++
      if ((window as any).Vimeo?.Player && iframeRef.current) {
        clearInterval(init)

        const player = new (window as any).Vimeo.Player(iframeRef.current)

        // Start at 360p for instant playback
        player.setQuality('360p').catch(() => {})

        // Once playing, upgrade to highest quality after 1.5s
        player.on('playing', () => {
          setVideoPlaying(true)
          setTimeout(() => {
            player.setQuality('auto').catch(() => {})
          }, 1500)
        })
      }
      if (attempts > 30) clearInterval(init) // stop after 3s
    }, 100)

    return () => clearInterval(init)
  }, [loadVideo])

  return (
    <>
      {/* Load Vimeo Player API early but non-blocking */}
      <Script src="https://player.vimeo.com/api/player.js" strategy="afterInteractive" />

      <Link
        ref={containerRef}
        href="/collections"
        className="block relative w-full h-[360px] md:h-[560px] overflow-hidden bg-[#3d2e1e] group cursor-pointer"
      >
        {/* Banner image — visible instantly, fades out when video plays */}
        <Image
          src="/kiswa-hero-banner.png"
          alt="Kiswa – Premium Islamic Home Decor"
          fill
          className="object-cover transition-opacity duration-1000"
          style={{ zIndex: 1, opacity: videoPlaying ? 0 : 1 }}
          priority
        />

        {/* Vimeo iframe — injected after viewport entry, starts at 360p */}
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
                ref={iframeRef}
                src={`https://player.vimeo.com/video/${VIMEO_ID}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1&dnt=1&quality=360p`}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                title="Kiswa Hero"
              />
            </div>
          </div>
        )}

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
          <div className="px-7 py-3 bg-white/95 backdrop-blur-sm text-[#3d2e1e] font-extrabold text-sm md:text-base rounded-full shadow-xl transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            Explore Our Collections
          </div>
        </div>
      </Link>
    </>
  )
}
