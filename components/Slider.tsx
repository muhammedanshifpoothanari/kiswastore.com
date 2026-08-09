'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Load immediately (hero is above fold) - give Vimeo max time to buffer
const VIMEO_SRC = 'https://player.vimeo.com/video/1213567493?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1&dnt=1&quality=auto&api=1'

export default function Slider() {
  const [showVideo, setShowVideo] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.origin.includes('vimeo.com')) return
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data

        // When iframe is ready, subscribe to play events
        if (data.event === 'ready') {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ method: 'addEventListener', value: 'play' }),
            'https://player.vimeo.com'
          )
        }

        // Video is actually playing — fade image out with a small buffer
        // so the first frame is visible before image disappears
        if (data.event === 'play') {
          setTimeout(() => setShowVideo(true), 300)
        }
      } catch {}
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <Link
      href="/collections"
      className="block relative w-full h-[360px] md:h-[560px] overflow-hidden bg-[#3d2e1e] group cursor-pointer"
    >
      {/* Vimeo loads immediately in background (below image) */}
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

      {/* Image stays on TOP — fades ONLY when Vimeo confirms playing */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ zIndex: 2, opacity: showVideo ? 0 : 1 }}
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
