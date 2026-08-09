'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const VIMEO_SRC = 'https://player.vimeo.com/video/1213567493?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1&dnt=1&quality=auto&api=1'

export default function VideoSection() {
  const [loadVideo, setLoadVideo] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Defer below-fold video until visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideo(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Listen for Vimeo play event via postMessage
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.origin.includes('vimeo.com')) return
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data

        if (data.event === 'ready') {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ method: 'addEventListener', value: 'play' }),
            'https://player.vimeo.com'
          )
        }

        if (data.event === 'play') {
          setTimeout(() => setShowVideo(true), 300)
        }
      } catch {}
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden shadow-lg w-full h-[600px] md:h-[800px] bg-[#3d2e1e]"
    >
      {/* Video loads behind image */}
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
              ref={iframeRef}
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

      {/* Image on top — fades only when Vimeo confirms playing */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ zIndex: 2, opacity: showVideo ? 0 : 1 }}
      >
        <Image
          src="/kiswa-hero-banner.png"
          alt="Kiswa Store – Premium Hajj & Umrah Essentials"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
