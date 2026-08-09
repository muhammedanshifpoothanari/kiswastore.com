'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ExternalLink, Heart, MessageCircle } from 'lucide-react'

const instagramPosts = [
  {
    id: 1,
    image: '/products/prayer-mat-1.png',
    caption: 'Discover the elegance of Rawdat Al-Haramain prayer rug series. Inspired by holy sanctuary craftsmanship. ✨ #KiswaKSA #LuxuryPrayerMat',
    likes: '1.2k',
    comments: '48',
    url: 'https://www.instagram.com/kiswa.ksa/?hl=en'
  },
  {
    id: 2,
    image: '/products/prayer-mat-2.png',
    caption: 'Silk woven perfection for your daily moments of humility and peace. Available in Saudi Arabia. 🇸🇦 #Kiswa #IslamicLuxury',
    likes: '890',
    comments: '32',
    url: 'https://www.instagram.com/kiswa.ksa/?hl=en'
  },
  {
    id: 3,
    image: '/products/tent-1.png',
    caption: 'Unmatched comfort under the stars. Premium camping tents crafted for luxury wilderness journeys. ⛺️ #KiswaOutdoors',
    likes: '2.4k',
    comments: '95',
    url: 'https://www.instagram.com/kiswa.ksa/?hl=en'
  },
  {
    id: 4,
    image: '/products/prayer-wear-1.png',
    caption: 'Flowing grace and pure modest elegance. Explore our luxury prayer dress collection. 🌿 #KiswaWear',
    likes: '1.5k',
    comments: '64',
    url: 'https://www.instagram.com/kiswa.ksa/?hl=en'
  },
  {
    id: 5,
    image: '/products/incense-1.png',
    caption: 'Immerse your home in authentic royal oud and fragrance oils. Crafted in Medina. 🕌 #OudKiswa',
    likes: '3.1k',
    comments: '112',
    url: 'https://www.instagram.com/kiswa.ksa/?hl=en'
  },
  {
    id: 6,
    image: '/products/prayer-mat-3.png',
    caption: 'Embroidered details with cushioned support for long night prayers. #KiswaLuxury #PrayerRug',
    likes: '970',
    comments: '29',
    url: 'https://www.instagram.com/kiswa.ksa/?hl=en'
  }
]

export default function InstagramPage() {
  return (
    <div className="w-full bg-[#fbfbfa] min-h-screen flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-12">
        {/* Profile Banner */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-200 shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600">
              <img src="/kiswa-logo.png" alt="Kiswa.KSA" className="w-full h-full object-contain bg-white rounded-full p-2" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">kiswa.ksa</h1>
                <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">✓ Verified</span>
              </div>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">Kiswa.SA Official Instagram Gallery</p>
              <p className="text-xs text-gray-600 mt-2 max-w-md">
                Luxury Islamic Lifestyle, Premium Prayer Rugs, Ihram Sets, Fragrances & Camping Gear in Saudi Arabia. 🇸🇦
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/kiswa.ksa/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2 hover:opacity-95 shrink-0"
          >
            <span>Follow @kiswa.ksa on Instagram</span>
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>Latest Posts from @kiswa.ksa</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={post.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
                    <span className="flex items-center gap-1.5"><Heart size={18} fill="white" /> {post.likes}</span>
                    <span className="flex items-center gap-1.5"><MessageCircle size={18} fill="white" /> {post.comments}</span>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
                    {post.caption}
                  </p>
                  <span className="text-[10px] text-purple-600 font-bold mt-2 block">View on Instagram →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
