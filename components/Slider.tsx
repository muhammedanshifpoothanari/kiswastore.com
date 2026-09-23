'use client'

import Link from 'next/link'
import { useRef } from 'react'

// Load immediately (hero is above fold) - give Vimeo max time to buffer
const VIMEO_SRC = 'https://player.vimeo.com/video/1213567493?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1&dnt=1&quality=auto&api=1'

export default function Slider() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

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

      {/* Hover CTA */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
        <div className="px-7 py-3 bg-white/95 backdrop-blur-sm text-[#3d2e1e] font-extrabold text-sm md:text-base rounded-full shadow-xl transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          Explore Our Collections
        </div>
      </div>
    </Link>
  )
}
