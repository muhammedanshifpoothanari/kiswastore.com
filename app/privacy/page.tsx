'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShieldCheck, Eye, Lock, FileText } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function PrivacyPolicyPage() {
  const { isArabic } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm text-right rtl:text-right ltr:text-left" style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
          
          <div className="flex items-center gap-4 mb-8 border-b pb-6">
            <div className="w-12 h-12 bg-[#3d2e1e]/10 text-[#3d2e1e] rounded-xl flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {isArabic ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy Policy & Data Protection'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {isArabic 
                  ? 'متوافقة مع نظام التجارة الإلكترونية ولائحة حماية البيانات الشخصية في المملكة العربية السعودية' 
                  : 'Compliant with Saudi E-Commerce Law and Personal Data Protection Regulations'}
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-gray-700 leading-relaxed font-medium">
            {isArabic ? (
              <>
                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <Eye size={18} /> ١. جمع المعلومات الشخصية
                  </h2>
                  <p>
                    نقوم بجمع وتخزين المعلومات التي تقدمها لنا مباشرة عند استخدامك لموقعنا الإلكتروني (مثل رقم الجوال، الاسم الكامل، المدينة، تفاصيل العنوان). نستخدم هذه البيانات لتنفيذ طلباتك وتوصيلها لك بشكل صحيح.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <Lock size={18} /> ٢. حماية وتأمين البيانات
                  </h2>
                  <p>
                    نحن ملتزمون بحماية خصوصيتك ونطبق أعلى معايير الأمان لحماية بياناتك من الوصول غير المصرح به. يتم حفظ بيانات الدفع والمعاملات المالية بشكل آمن ومشفر بالكامل بما يتوافق مع أنظمة البنك المركزي السعودي والمملكة.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <FileText size={18} /> ٣. مشاركة البيانات مع جهات خارجية
                  </h2>
                  <p>
                    لا نشارك أو نبيع بياناتك الشخصية مع أي طرف ثالث لأغراض تسويقية. يتم مشاركة معلومات التوصيل الخاصة بك فقط مع شركات التوصيل المعتمدة لدينا لتسهيل إيصال طلبك إلى منزلك.
                  </p>
                </section>

                <section className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
                  <h2 className="text-base font-bold text-[#3d2e1e] mb-2">امتثال كامل للأنظمة السعودية</h2>
                  <p className="text-xs text-gray-600">
                    تمت صياغة هذه السياسة وفقاً لنظام حماية البيانات الشخصية الصادر بالمرسوم الملكي رقم (م/١٥) وتعديلاته في المملكة العربية السعودية. لأي استفسارات تتعلق ببياناتك، يمكنك التواصل معنا عبر البريد الإلكتروني support@kiswa.store.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <Eye size={18} /> 1. Information Collection
                  </h2>
                  <p>
                    We collect and process personal data that you provide directly to us, including your mobile number, full name, shipping address, and email. This information is vital for completing your checkout and delivering your orders.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <Lock size={18} /> 2. Security and Data Protection
                  </h2>
                  <p>
                    We implement industry-standard encryption and security measures to protect your database transactions. Financial transactions are securely managed via certified Saudi payment gateway providers to guarantee maximum security.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#3d2e1e] mb-3 flex items-center gap-2">
                    <FileText size={18} /> 3. Data Sharing Restrictions
                  </h2>
                  <p>
                    Your personal information will never be sold or rented to third parties. We only share necessary location and phone details with certified logistics and courier partners to fulfill delivery to your doorstep.
                  </p>
                </section>

                <section className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
                  <h2 className="text-base font-bold text-[#3d2e1e] mb-2">Saudi Regulatory Compliance</h2>
                  <p className="text-xs text-gray-600">
                    This Privacy Policy is designed in full compliance with the Personal Data Protection Law (PDPL) enacted by Royal Decree No. M/15 in the Kingdom of Saudi Arabia. For any inquiries, please contact us at support@kiswa.store.
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
