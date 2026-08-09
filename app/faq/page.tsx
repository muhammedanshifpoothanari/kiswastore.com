'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

export default function FAQPage() {
  const { isArabic } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = isArabic
    ? [
        {
          q: 'هل الشحن مجاني لجميع مناطق المملكة؟',
          a: 'نعم، نوفر شحن مجاني بالكامل وبدون حد أدنى للشراء لكافة مدن ومحافظات المملكة العربية السعودية.',
        },
        {
          q: 'ما هي طرق الدفع المتاحة؟',
          a: 'نحن نقبل الدفع الحصري عبر تابي (Tabby)، مما يتيح لك تقسيم قيمة مشترياتك على 4 دفعات ميسرة بدون رسوم أو فوائد.',
        },
        {
          q: 'كم يستغرق توصيل الشحنة؟',
          a: 'تستغرق عملية التجهيز والشحن والتوصيل لعنوانك ما بين ٢ إلى ٧ أيام عمل كحد أقصى.',
        },
        {
          q: 'ما هي سياسة الاسترجاع أو الاستبدال؟',
          a: 'يمكنك طلب استبدال أو استرجاع أي منتج غير مستخدم وفي تغليفه الأصلي خلال ٧ أيام من استلام الطلب عن طريق التواصل مع خدمة العملاء بالواتساب.',
        },
      ]
    : [
        {
          q: 'Is shipping free across Saudi Arabia?',
          a: 'Yes! We provide 100% free delivery to all cities and regions in the Kingdom of Saudi Arabia with no minimum purchase requirements.',
        },
        {
          q: 'What payment methods do you support?',
          a: 'We accept payments exclusively through Tabby, allowing you to split your order total into 4 easy monthly installments with absolutely no fees or interest.',
        },
        {
          q: 'How long does shipping/delivery take?',
          a: 'Processing and shipping take between 2 to 7 working days to deliver directly to your registered doorstep.',
        },
        {
          q: 'What is the return/refund policy?',
          a: 'You can request a product return or exchange within 7 days of receiving your package. Items must be unused and in their original packaging.',
        },
      ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm text-right rtl:text-right ltr:text-left" style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
          
          <div className="flex items-center gap-4 mb-8 border-b pb-6">
            <div className="w-12 h-12 bg-[#3d2e1e]/10 text-[#3d2e1e] rounded-xl flex items-center justify-center">
              <HelpCircle size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {isArabic ? 'إجابات على الأسئلة الأكثر شيوعاً حول الطلبات والدفع والتوصيل' : 'Find answers to common questions about orders, payments, and shipping'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx
              return (
                <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50 hover:bg-gray-50 transition">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-base font-bold text-gray-800 focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed font-medium border-t border-gray-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
