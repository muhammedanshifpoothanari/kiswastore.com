'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Truck, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function ShippingPolicyPage() {
  const { isArabic } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm text-right rtl:text-right ltr:text-left" style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
          
          <div className="flex items-center gap-4 mb-8 border-b pb-6">
            <div className="w-12 h-12 bg-[#3d2e1e]/10 text-[#3d2e1e] rounded-xl flex items-center justify-center">
              <Truck size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {isArabic ? 'سياسة الشحن والتوصيل' : 'Shipping & Delivery Policy'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {isArabic 
                  ? 'شحن سريع ومجاني بالكامل لكافة مناطق المملكة خلال ٧ أيام' 
                  : 'Fast, free shipping to all regions in Saudi Arabia within 7 days'}
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-gray-700 leading-relaxed font-medium">
            {isArabic ? (
              <>
                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <CheckCircle2 size={18} /> شحن مجاني بالكامل
                  </h2>
                  <p>
                    نقدم لعملائنا في متجر كسوة خدمة الشحن والتوصيل المجاني بالكامل وبدون أي حد أدنى للشراء لكافة مناطق ومدن المملكة العربية السعودية. السعر المعروض هو السعر النهائي شامل كل شيء.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <Clock size={18} /> مدة وتوقيت التوصيل
                  </h2>
                  <p>
                    يتم تجهيز وشحن طلبك مباشرة وتوصيله إلى عنوانك المسجل في غضون <strong>٧ أيام عمل</strong> كحد أقصى. نسعى دائماً لتوصيل الشحنات لمدن مثل الرياض ومكة وجدة والمدينة المنورة في وقت أسرع.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <ShieldCheck size={18} /> تتبع الشحنة المباشر
                  </h2>
                  <p>
                    بمجرد شحن طلبك، يمكنك تتبع حالة الطلب والتوصيل في الوقت الفعلي عبر صفحة التتبع في حسابك الشخصي أو من خلال التواصل معنا على الواتساب المباشر.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <CheckCircle2 size={18} /> 100% Free Shipping
                  </h2>
                  <p>
                    Kiswa offers absolutely free shipping and home delivery with no minimum order value constraint to all major regions and cities in the Kingdom of Saudi Arabia.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <Clock size={18} /> Delivery Timeline
                  </h2>
                  <p>
                    All items are packed and shipped directly from our warehouse. Standard delivery takes up to a maximum of <strong>7 working days</strong>. Deliveries to main cities (Riyadh, Makkah, Jeddah) are often completed sooner.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <ShieldCheck size={18} /> Real-time Tracking
                  </h2>
                  <p>
                    Once your order is processed, you can track its delivery status directly on our live tracking profile page or reach out to our WhatsApp support agent for real-time status details.
                  </p>
                </section>
              </>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
