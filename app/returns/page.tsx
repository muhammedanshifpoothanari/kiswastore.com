'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { RefreshCw, CheckCircle2, ShieldAlert, Truck } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function ReturnsPolicyPage() {
  const { isArabic } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm text-right rtl:text-right ltr:text-left" style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
          
          <div className="flex items-center gap-4 mb-8 border-b pb-6">
            <div className="w-12 h-12 bg-[#3d2e1e]/10 text-[#3d2e1e] rounded-xl flex items-center justify-center">
              <RefreshCw size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {isArabic ? 'سياسة الاستبدال والاسترجاع' : 'Returns & Refunds Policy'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {isArabic 
                  ? 'حقوق الاسترجاع الكاملة خلال ٧ أيام بما يتوافق مع أنظمة وزارة التجارة السعودية' 
                  : 'Full 7-day return rights in compliance with Saudi Ministry of Commerce guidelines'}
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-gray-700 leading-relaxed font-medium">
            {isArabic ? (
              <>
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-start gap-3">
                  <ShieldAlert size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-[#3d2e1e] text-sm">فترة الاسترجاع والاستبدال المعتمدة</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      تماشياً مع لوائح التجارة الإلكترونية في المملكة العربية السعودية، يمكنك تقديم طلب استبدال أو استرجاع للمنتج خلال <strong>٧ أيام</strong> من تاريخ استلام الشحنة.
                    </p>
                  </div>
                </div>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <CheckCircle2 size={18} /> شروط الاسترجاع والاستبدال
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 pl-4">
                    <li>أن يكون المنتج في حالته الأصلية وبغلافه الأصلي دون أي تلف أو استخدام.</li>
                    <li>أن يرفق معه فاتورة الشراء أو إثبات الطلب المستلم.</li>
                    <li>لا يمكن استرجاع السلع الشخصية أو ملابس الإحرام بعد فتح تغليفها لأسباب صحية ووقائية.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <Truck size={18} /> خطوات تقديم طلب الاسترجاع
                  </h2>
                  <p>
                    تواصل معنا عبر رقم الواتساب الخاص بالدعم الفني المباشر (+966 50 123 4567) أو البريد الإلكتروني (support@kiswa.store) موضحاً رقم الطلب وسبب الاسترجاع. سيقوم ممثل خدمة العملاء بتنسيق استلام المنتج وإرجاع المبلغ المالي لحسابك أو عبر تابي.
                  </p>
                </section>
              </>
            ) : (
              <>
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-start gap-3">
                  <ShieldAlert size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-[#3d2e1e] text-sm">Official Return Policy Duration</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      In full compliance with e-commerce regulations in the Kingdom of Saudi Arabia, customers are entitled to request product returns or exchanges within <strong>7 days</strong> of delivery.
                    </p>
                  </div>
                </div>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <CheckCircle2 size={18} /> Conditions for Return
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 pl-4">
                    <li>Products must be unused, in their original packaging, and in clean resellable condition.</li>
                    <li>Proof of purchase/invoice must be supplied with the request.</li>
                    <li>Personal care items, perfumes, and Ihram clothing cannot be returned once opened due to health & safety regulations.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <Truck size={18} /> Return Procedure
                  </h2>
                  <p>
                    Contact our WhatsApp support team (+966 50 123 4567) or write to support@kiswa.store mentioning your order ID. We will issue a return shipping label and credit the amount back to your account or refund your Tabby installments once items are inspected.
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
