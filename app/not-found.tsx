'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Home, MessageCircle, Compass, ArrowRight, Wrench } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="w-full bg-[#fbfbfa] min-h-screen flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 md:py-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm text-center">
          {/* Maintenance Icon Badge */}
          <div className="w-20 h-20 bg-amber-50 text-[#3d2e1e] border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench size={32} className="text-[#3d2e1e]" />
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Page Under Maintenance / الصفحة قيد الصيانة
          </h1>
          <p className="text-sm md:text-base text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
            We are currently updating this section to bring you an enhanced luxury experience. Check our Instagram feed or contact us directly on WhatsApp!
          </p>

          {/* Primary Quick Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <a
              href="/"
              className="px-6 py-3 bg-[#3d2e1e] hover:bg-[#2a1f14] text-white text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2"
            >
              <Home size={18} /> Return to Homepage
            </a>
            <a
              href="https://www.instagram.com/kiswa.ksa/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2 hover:opacity-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow @kiswa.ksa on Instagram
            </a>
            <a
              href="https://wa.me/966500000000?text=Hello%20Kiswa%20Support"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2"
            >
              <MessageCircle size={18} /> WhatsApp Support
            </a>
          </div>

          {/* Quick Collection Shortcuts */}
          <div className="border-t border-gray-100 pt-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-center gap-1.5">
              <Compass size={14} className="text-[#3d2e1e]" /> Explore Active Collections
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <a
                href="/collections/prayer-mat"
                className="p-3 bg-gray-50 hover:bg-[#3d2e1e]/5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 hover:text-[#3d2e1e] transition flex items-center justify-between group"
              >
                <span>Prayer Rugs</span>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-[#3d2e1e] group-hover:translate-x-0.5 transition" />
              </a>

              <a
                href="/collections/ihrams"
                className="p-3 bg-gray-50 hover:bg-[#3d2e1e]/5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 hover:text-[#3d2e1e] transition flex items-center justify-between group"
              >
                <span>Ihram Sets</span>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-[#3d2e1e] group-hover:translate-x-0.5 transition" />
              </a>

              <a
                href="/collections/prayer-wear"
                className="p-3 bg-gray-50 hover:bg-[#3d2e1e]/5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 hover:text-[#3d2e1e] transition flex items-center justify-between group"
              >
                <span>Prayer Dresses</span>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-[#3d2e1e] group-hover:translate-x-0.5 transition" />
              </a>

              <a
                href="/collections/tents"
                className="p-3 bg-gray-50 hover:bg-[#3d2e1e]/5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 hover:text-[#3d2e1e] transition flex items-center justify-between group"
              >
                <span>Camping Gear</span>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-[#3d2e1e] group-hover:translate-x-0.5 transition" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
