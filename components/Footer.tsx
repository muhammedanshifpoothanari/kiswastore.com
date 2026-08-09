'use client'

import { Mail, Phone, MapPin, Globe, CreditCard, Send } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useState } from 'react'
import AlertModal from '@/components/ui/AlertModal'

export default function Footer() {
  const { language, setLanguage, isArabic } = useLanguage()
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertType, setAlertType] = useState<'success' | 'error'>('success')

  return (
    <footer className="bg-[#3d2e1e] text-white border-t border-[#2a1f14] pt-16 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16 text-right rtl:text-right ltr:text-left">
          {/* Brand Info */}
          <div className="flex flex-col items-center lg:items-start justify-center lg:justify-start">
            <div className="flex flex-col items-center lg:items-start group mb-4">
              <img 
                src="/kiswa-logo.png" 
                alt="Kiswa Logo" 
                className="h-12 md:h-16 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-sm text-gray-300 font-medium leading-relaxed text-center lg:text-start max-w-xs mb-6">
              {isArabic 
                ? 'كسوة.. مستوحاة من هيبة كسوة الكعبة المشرفة لنقدم أفخر سجادات الصلاة وملابس الإحرام والهدايا الإسلامية المميزة.' 
                : 'Kiswa.. inspired by the majesty of Kaaba’s Kiswa. High quality prayer mats, Ihram clothing, and Islamic luxury gifts.'}
            </p>
          </div>

          {/* Shopper Guide */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 border-b border-[#8c763e]/30 pb-2 inline-block">
              {isArabic ? 'دليل المتسوق' : 'Shopper Guide'}
            </h3>
            <ul className="space-y-3.5 text-sm text-gray-300">
              <li><a href="/collections" className="hover:text-[#8c763e] transition">{isArabic ? 'جميع المجموعات' : 'All Collections'}</a></li>
              <li><a href="/collections/prayer-mat" className="hover:text-[#8c763e] transition">{isArabic ? 'سجاد صلاة فاخر' : 'Luxury Prayer Mats'}</a></li>
              <li><a href="/collections/ihrams" className="hover:text-[#8c763e] transition">{isArabic ? 'ملابس الإحرام' : 'Ihram Clothing'}</a></li>
              <li><a href="/collections/tents" className="hover:text-[#8c763e] transition">{isArabic ? 'معدات الرحلات' : 'Camping Gear'}</a></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 border-b border-[#8c763e]/30 pb-2 inline-block">
              {isArabic ? 'مساعدة' : 'Help & Support'}
            </h3>
            <ul className="space-y-3.5 text-sm text-gray-300">
              <li><a href="https://www.instagram.com/kiswa.ksa/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-[#8c763e] transition text-amber-300 font-semibold flex items-center gap-1.5">Instagram: @kiswa.ksa</a></li>
              <li><a href="/about" className="hover:text-[#8c763e] transition">{isArabic ? 'من نحن' : 'About Us'}</a></li>
              <li><a href="/faq" className="hover:text-[#8c763e] transition">{isArabic ? 'الأسئلة الشائعة' : 'FAQs'}</a></li>
              <li><a href="/shipping" className="hover:text-[#8c763e] transition">{isArabic ? 'سياسة الشحن والتوصيل' : 'Shipping Policy'}</a></li>
              <li><a href="/returns" className="hover:text-[#8c763e] transition">{isArabic ? 'سياسة الاستبدال والاسترجاع' : 'Returns & Refunds'}</a></li>
            </ul>
          </div>

          {/* Newsletter / Subscription */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 border-b border-[#8c763e]/30 pb-2 inline-block">
              {isArabic ? 'اشترك في بريدنا الإلكتروني' : 'Subscribe to Email'}
            </h3>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              {isArabic 
                ? 'ابق على اطلاع بأحدث العروض والمنتجات الحصرية.' 
                : 'Stay up to date with the latest releases and exclusive offers.'}
            </p>
            <form 
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const emailInput = form.elements.namedItem('email') as HTMLInputElement
                const email = emailInput.value
                if (!email) return
                
                try {
                  const res = await fetch('/api/email-subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, source: 'footer' })
                  })
                  if (res.ok) {
                    setAlertMsg(isArabic ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!')
                    setAlertType('success')
                    setAlertOpen(true)
                    emailInput.value = ''
                  } else {
                    setAlertMsg(isArabic ? 'حدث خطأ ما. يرجى المحاولة لاحقاً.' : 'Something went wrong. Please try again.')
                    setAlertType('error')
                    setAlertOpen(true)
                  }
                } catch (error) {
                  console.error('Failed to subscribe', error)
                }
              }} 
              className="flex gap-2 w-full max-w-sm"
            >
              <input 
                type="email" 
                name="email"
                required
                placeholder={isArabic ? 'البريد الإلكتروني' : 'Your Email Address'}
                className="flex-1 px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8c763e]"
              />
              <button 
                type="submit" 
                className="bg-[#2a1f14] hover:bg-[#736133] text-white px-4 py-2 rounded transition flex items-center justify-center border border-amber-400/20"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Currency & Language selectors */}
        <div className="border-t border-[#2a1f14] pt-8 pb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Language / Region Selector */}
            <div className="flex gap-2">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
                className="bg-[#2a1f14] text-xs text-white border border-[#8c763e]/30 px-3 py-1.5 rounded focus:outline-none"
              >
                <option value="ar">العربية / المملكة العربية السعودية (SAR)</option>
                <option value="en">English / Saudi Arabia (SAR)</option>
              </select>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-3.5 flex-wrap justify-center bg-white/5 py-2 px-4 rounded-lg">
            <span className="text-[10px] text-gray-300 uppercase tracking-widest mr-2 font-semibold">
              {isArabic ? 'طرق الدفع' : 'Payment Methods'}
            </span>
            <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6 w-auto object-contain bg-white rounded px-1" alt="Visa" />
            <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6 w-auto object-contain bg-white rounded px-1" alt="Mastercard" />
            <img src="https://img.icons8.com/color/48/000000/apple-pay.png" className="h-6 w-auto object-contain bg-white rounded px-1" alt="Apple Pay" />
            {/* Mada simulated badge */}
            <span className="text-[10px] bg-white text-[#3d2e1e] font-extrabold px-1.5 py-0.5 rounded border border-gray-100 font-sans">mada</span>
            <span className="text-[10px] bg-[#33ffd6] text-black font-extrabold px-2.5 py-0.5 rounded border border-gray-100 flex items-center gap-1 font-sans">
              <span className="w-1.5 h-1.5 bg-black rounded-full" />
              tabby
            </span>
          </div>
        </div>

        {/* Bottom Bar with Commercial Registration & Official Company Info */}
        <div className="border-t border-[#2a1f14] pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
            <p>© {new Date().getFullYear()} {isArabic ? 'شركة كسوة مميزة التجارية' : 'Unique Kiswa Trading Company'}</p>
            <span className="hidden md:inline">•</span>
            <p className="font-mono text-amber-200/80 font-semibold">{isArabic ? 'س.ت: ٧٠٢٥٦٥٧٢٠١' : 'C.R: 7025657201'}</p>
            <span className="hidden md:inline">•</span>
            <p className="font-mono text-gray-400">{isArabic ? 'الرقم الضريبي: ٣١٤٧٤٦٦٩٩٨٠٠٠٠٣' : 'VAT: 3147466998000003'}</p>
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-[#8c763e] transition">{isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}</a>
            <a href="/terms" className="hover:text-[#8c763e] transition">{isArabic ? 'شروط الخدمة' : 'Terms of Service'}</a>
          </div>
        </div>
      </div>

      <AlertModal 
        isOpen={alertOpen} 
        message={alertMsg} 
        type={alertType} 
        onClose={() => setAlertOpen(false)} 
      />
    </footer>
  )
}
