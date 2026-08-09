'use client'

import Image from 'next/image'

const VIMEO_ID = '1213567493'

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

      {/* Vimeo video layer — plays on top of image */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <iframe
          src={`https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&muted=1&loop=1&background=1&quality=auto`}
          allow="autoplay; fullscreen"
          className="w-full h-full"
          style={{
            border: 'none',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.05)',
          }}
        />
      </div>
    </div>
  )
}
