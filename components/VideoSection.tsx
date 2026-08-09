'use client'

import Image from 'next/image'
import Script from 'next/script'

export default function VideoSection() {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg w-full h-[600px] md:h-[800px] bg-[#3d2e1e]">
      {/* Banner image — always rendered, visible instantly */}
      <Image
        src="/kiswa-hero-banner.png"
        alt="Kiswa Store – Premium Hajj & Umrah Essentials"
        fill
        className="object-cover"
        style={{ zIndex: 1 }}
        priority
      />

      {/* Vimeo video — covers full section */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {/* Scale up to cover container regardless of aspect ratio */}
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
            src="https://player.vimeo.com/video/1213567493?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            title="MODEL 01"
          />
        </div>
      </div>

      <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
    </div>
  )
}
