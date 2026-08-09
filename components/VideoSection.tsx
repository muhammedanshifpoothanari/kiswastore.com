'use client'

import Image from 'next/image'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

const VIMEO_ID = '1213567493'

export default function VideoSection() {
  const [loadVideo, setLoadVideo] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Step 1: Load iframe when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setLoadVideo(true), 200)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Step 2: Attach Vimeo Player API and upgrade quality
  useEffect(() => {
    if (!loadVideo) return

    let attempts = 0
    const init = setInterval(() => {
      attempts++
      if ((window as any).Vimeo?.Player && iframeRef.current) {
        clearInterval(init)

        const player = new (window as any).Vimeo.Player(iframeRef.current)

        // Start at 360p for fast initial load
        player.setQuality('360p').catch(() => {})

        // Upgrade to auto (HD) 1.5s after playback starts
        player.on('playing', () => {
          setVideoPlaying(true)
          setTimeout(() => {
            player.setQuality('auto').catch(() => {})
          }, 1500)
        })
      }
      if (attempts > 30) clearInterval(init)
    }, 100)

    return () => clearInterval(init)
  }, [loadVideo])

  return (
    <>
      <Script src="https://player.vimeo.com/api/player.js" strategy="afterInteractive" />

      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden shadow-lg w-full h-[600px] md:h-[800px] bg-[#3d2e1e]"
      >
        {/* Banner image — fades out once video is playing */}
        <Image
          src="/kiswa-hero-banner.png"
          alt="Kiswa Store – Premium Hajj & Umrah Essentials"
          fill
          className="object-cover transition-opacity duration-1000"
          style={{ zIndex: 1, opacity: videoPlaying ? 0 : 1 }}
          priority
        />

        {/* Vimeo — starts at 360p, upgrades to auto after 1.5s */}
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
      </div>
    </>
  )
}
