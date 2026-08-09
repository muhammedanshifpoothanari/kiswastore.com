'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FileText, Award, Scale, HelpCircle } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function TermsOfServicePage() {
  const { isArabic } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm text-right rtl:text-right ltr:text-left" style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
          
          <div className="flex items-center gap-4 mb-8 border-b pb-6">
            <div className="w-12 h-12 bg-[#3d2e1e]/10 text-[#3d2e1e] rounded-xl flex items-center justify-center">
              <Scale size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {isArabic ? 'شروط الخدمة والأحكام' : 'Terms of Service'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {isArabic 
                  ? 'شروط البيع والاستخدام الخاضعة لأنظمة وزارة التجارة في المملكة العربية السعودية' 
                  : 'Terms of sale governed by the Ministry of Commerce regulations in Saudi Arabia'}
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-gray-700 leading-relaxed font-medium">
            {isArabic ? (
              <>
                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <FileText size={18} /> ١. الاتفاقية القانونية
                  </h2>
                  <p>
                    دخولك واستخدامك لموقع كسوة الإلكتروني يعني موافقتك الكاملة على الشروط والأحكام الواردة هنا. يحق للموقع تعديل هذه الشروط في أي وقت مع إشعار المستخدمين عبر تحديث هذه الصفحة.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <Award size={18} /> ٢. حماية المستهلك والأسعار
                  </h2>
                  <p>
                    جميع أسعار المنتجات المعروضة تشمل ضريبة القيمة المضافة (VAT) المقررة قانوناً في المملكة العربية السعودية بنسبة ١٥٪. نحن نضمن مطابقة المنتجات للمواصفات المعلن عنها ونوفر دعماً كاملاً لعملائنا.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <HelpCircle size={18} /> ٣. القوانين المنظمة
                  </h2>
                  <p>
                    تخضع هذه الاتفاقية وتفسر بموجب الأنظمة والقوانين المعمول بها في المملكة العربية السعودية، وخصوصاً نظام التجارة الإلكترونية ولائحته التنفيذية. أي نزاع ينشأ يخضع للاختصاص القضائي الحصري للمحاكم السعودية.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <FileText size={18} /> 1. Legal Agreement
                  </h2>
                  <p>
                    By accessing and purchasing from Kiswa Store, you fully agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <Award size={18} /> 2. Pricing & VAT Compliance
                  </h2>
                  <p>
                    All product prices shown on our website are inclusive of the 15% Value Added Tax (VAT) required by Saudi Arabian ZATCA regulations. There are no hidden fees.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <HelpCircle size={18} /> 3. Governing Law
                  </h2>
                  <p>
                    These terms and conditions are governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia, in particular the Saudi E-Commerce Law. Any dispute shall be resolved through competent Saudi courts.
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
