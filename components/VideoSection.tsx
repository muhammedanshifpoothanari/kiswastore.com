'use client'

import Image from 'next/image'

const YT_ID = 'a8udNoN_ZPQ'

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

      {/* YouTube video — covers full section */}
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
    </div>
  )
}
