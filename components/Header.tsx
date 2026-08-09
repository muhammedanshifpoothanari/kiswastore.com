'use client'

import { Menu, X, Search, User, ShoppingCart, Heart, Home, Grid, MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { useCart } from '@/context/CartContext'
import AnnouncementBanner from './AnnouncementBanner'
import SearchModal from './SearchModal'

const navItems = {
  en: [
    { label: 'Home', href: '/' },
    { label: 'Prayer Mats', href: '/collections/prayer-mat' },
    { label: 'Wall Art', href: '/collections/metal-art' },
    { label: 'Table Decor', href: '/collections/table-decor' },
    { label: 'Clocks', href: '/collections/clocks' },
    { label: 'Accessories', href: '/collections/accessories' },
    { label: 'Gift Boxes', href: '/collections/gifts' },
    { label: 'About', href: '/about' },
  ],
  ar: [
    { label: 'الرئيسية', href: '/' },
    { label: 'سجادات الصلاة', href: '/collections/prayer-mat' },
    { label: 'الفن الجداري', href: '/collections/metal-art' },
    { label: 'ديكور الطاولة', href: '/collections/table-decor' },
    { label: 'الساعات', href: '/collections/clocks' },
    { label: 'الإكسسوارات', href: '/collections/accessories' },
    { label: 'صناديق الهدايا', href: '/collections/gifts' },
    { label: 'عن كسوة', href: '/about' },
  ],
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [savedPhone, setSavedPhone] = useState('')
  const { language, setLanguage, isArabic } = useLanguage()
  const { cartCount } = useCart()
  const items = navItems[language]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    const phone = localStorage.getItem('kiswa_customer_phone')
    if (phone) setSavedPhone(phone)

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`w-full z-50 bg-white transition-all duration-300 ${isScrolled ? 'sticky top-0 shadow-md' : ''}`}>
        <AnnouncementBanner />

        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4">
          <div className="flex items-center justify-between">
            {/* Search - Left Column */}
            <div className="flex items-center w-1/4 justify-start">
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-gray-50 rounded-full transition flex items-center gap-2 text-gray-700 hover:text-[#3d2e1e]"
              >
                <Search size={22} />
                <span className="text-xs uppercase tracking-wider hidden lg:inline-block font-semibold">
                  {isArabic ? 'بحث' : 'Search'}
                </span>
              </button>
            </div>

            {/* Logo - Centered Column */}
            <div className="flex-1 relative flex items-center justify-center h-12">
              <a href="/" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group">
                <img 
                  src="/kiswa-logo.png" 
                  alt="Kiswa Logo" 
                  className="h-20 md:h-28 w-auto max-w-none object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </a>
            </div>

            {/* Icons - Right Column */}
            <div className="flex items-center gap-3 w-1/4 justify-end">
              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
                className="px-2.5 py-1.5 border border-[#3d2e1e]/30 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-xs font-extrabold text-[#3d2e1e] rounded-lg transition-all shadow-sm shrink-0 touch-manipulation z-20"
                title="Change Language / تغيير اللغة"
              >
                {isArabic ? 'English' : 'العربية'}
              </button>

              {/* Profile / Phone display */}
              <a 
                href="/profile" 
                className="px-2.5 py-1 hover:bg-gray-100 rounded-full transition text-gray-700 hover:text-[#3d2e1e] hidden sm:inline-flex items-center gap-1.5 border border-gray-200"
                title="Account"
              >
                <User size={18} />
                {savedPhone && (
                  <span className="text-[11px] font-bold text-[#3d2e1e] max-w-[100px] truncate">
                    {savedPhone}
                  </span>
                )}
              </a>

              {/* Cart */}
              <a 
                href="/cart" 
                className="p-2 hover:bg-gray-50 rounded-full transition text-gray-700 hover:text-[#3d2e1e] relative"
                title="Cart"
              >
                <ShoppingCart size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#3d2e1e] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              </a>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-[#3d2e1e]"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:block border-t border-b border-gray-100 bg-[#fbfbfa]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center items-center gap-8 py-3 text-sm font-medium text-[#3d2e1e]">
              {items.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="hover:text-[#3d2e1e] transition-all duration-300 uppercase tracking-wide relative py-1 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3d2e1e] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Menu Drawer */}
        <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className={`fixed top-0 bottom-0 w-80 bg-white max-w-[85vw] shadow-2xl transition-transform duration-300 ${isArabic ? 'right-0' : 'left-0'} ${mobileMenuOpen ? 'translate-x-0' : isArabic ? 'translate-x-full' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-[#3d2e1e] text-lg">{isArabic ? 'القائمة' : 'Navigation Menu'}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-gray-50 rounded-full">
                <X size={22} className="text-gray-700" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {/* Prominent Language Switcher inside Mobile Drawer */}
              <button
                type="button"
                onClick={() => {
                  setLanguage(isArabic ? 'en' : 'ar')
                  setMobileMenuOpen(false)
                }}
                className="w-full py-3 px-4 bg-[#3d2e1e] text-white font-bold text-sm rounded-xl flex items-center justify-between shadow-sm active:scale-98 transition touch-manipulation"
              >
                <span>{isArabic ? 'Switch to English' : 'التحويل إلى العربية'}</span>
                <span className="bg-white/20 px-2.5 py-0.5 rounded text-xs">
                  {isArabic ? 'English' : 'العربية'}
                </span>
              </button>

              {items.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 hover:bg-gray-50 rounded-lg text-[#3d2e1e] font-semibold transition text-base"
                >
                  {item.label}
                </a>
              ))}
              <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
                <a href="/profile" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <User size={18} />
                  <span>{isArabic ? 'حسابي' : 'My Account'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* App-like Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg lg:hidden flex justify-around items-center py-2 px-1 pb-safe-bottom">
        <a href="/" className="flex flex-col items-center justify-center flex-1 text-center py-1 text-gray-500 hover:text-[#3d2e1e]">
          <Home size={20} />
          <span className="text-[10px] mt-1 font-semibold">{isArabic ? 'الرئيسية' : 'Home'}</span>
        </a>
        <button onClick={() => setSearchOpen(true)} className="flex flex-col items-center justify-center flex-1 text-center py-1 text-gray-500 hover:text-[#3d2e1e]">
          <Search size={20} />
          <span className="text-[10px] mt-1 font-semibold">{isArabic ? 'بحث' : 'Search'}</span>
        </button>
        <a href="/collections" className="flex flex-col items-center justify-center flex-1 text-center py-1 text-gray-500 hover:text-[#3d2e1e]">
          <Grid size={20} />
          <span className="text-[10px] mt-1 font-semibold">{isArabic ? 'الأقسام' : 'Collections'}</span>
        </a>
        <a href="/cart" className="flex flex-col items-center justify-center flex-1 text-center py-1 text-gray-500 hover:text-[#3d2e1e] relative">
          <ShoppingCart size={20} />
          <span className="absolute top-0.5 right-6 w-4 h-4 bg-[#3d2e1e] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
            {cartCount}
          </span>
          <span className="text-[10px] mt-0.5">{isArabic ? 'السلة' : 'Cart'}</span>
        </a>
        <a href="/profile" className="flex flex-col items-center justify-center flex-1 text-center py-1 text-gray-500 hover:text-[#3d2e1e]">
          <User size={20} />
          <span className="text-[10px] mt-1 font-semibold">{isArabic ? 'حسابي' : 'Account'}</span>
        </a>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
