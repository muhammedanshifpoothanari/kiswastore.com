'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function VideoSection() {
  const videoUrl = "/kiswa-hero.mp4"
  const [videoReady, setVideoReady] = useState(false)

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

      {/* Video layer — fades in on top of image once loaded */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover absolute inset-0"
        style={{
          zIndex: 2,
          opacity: videoReady ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
        onCanPlay={() => setVideoReady(true)}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  )
}
