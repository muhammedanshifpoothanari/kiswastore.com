'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Award, Globe, Users, ShieldCheck, Heart } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function AboutPage() {
  const { isArabic } = useLanguage()

  const values = isArabic 
    ? [
        {
          icon: Award,
          title: 'جودة استثنائية فاخرة',
          description: 'صناعة يدوية بأجود الخامات من مكة المكرمة لتوفير تجربة روحانية متميزة.',
        },
        {
          icon: Globe,
          title: 'إرث إسلامي أصيل',
          description: 'نخدم ضيوف الرحمن حول العالم بمنتجات مستوحاة من هيبة الكعبة المشرفة.',
        },
        {
          icon: Users,
          title: 'العميل أولاً دائماً',
          description: 'ملتزمون بتقديم خدمة راقية ودعم مباشر على مدار الساعة عبر الواتساب.',
        },
        {
          icon: Heart,
          title: 'شغف بالجمال والإتقان',
          description: 'نهتم بأدق التفاصيل والزخارف والنقوش الإسلامية الفريدة.',
        },
      ]
    : [
        {
          icon: Award,
          title: 'Premium Quality',
          description: 'Handcrafted with the finest materials in Makkah for an ultra-luxury spiritual experience.',
        },
        {
          icon: Globe,
          title: 'Authentic Islamic Heritage',
          description: 'Serving believers worldwide with designs inspired by the majesty of the Holy Kaaba.',
        },
        {
          icon: Users,
          title: 'Customer Centricity',
          description: 'Committed to premium services and instant support via WhatsApp around the clock.',
        },
        {
          icon: Heart,
          title: 'Passion for Excellence',
          description: 'Meticulous attention to detailing, texture, and elegant Islamic patterns.',
        },
      ]

  const stats = isArabic
    ? [
        { number: '+١٥', label: 'عاماً من التميز' },
        { number: '+٥٠ ألف', label: 'عميل سعيد' },
        { number: '+٢٠٠', label: 'منتج حصري ومميز' },
        { number: '٪٩٨', label: 'نسبة رضا العملاء' },
      ]
    : [
        { number: '15+', label: 'Years of Excellence' },
        { number: '50k+', label: 'Satisfied Customers' },
        { number: '200+', label: 'Exclusive Products' },
        { number: '98%', label: 'Customer Satisfaction' },
      ]

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#3d2e1e]/10 to-transparent py-20 px-4 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {isArabic ? 'قصة متجر كسوة' : 'Our Story – Kiswa'}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
          {isArabic 
            ? 'نصنع الجودة والفخامة الروحانية من مكة المكرمة لنثري تفاصيل يومك ونوفر مستلزمات الحج والعمرة والرحلات الفاخرة.'
            : 'Crafting luxury and spiritual elegance directly from Makkah to enrich your daily routines and spiritual journeys.'}
        </p>
      </div>

      {/* Our Story Section */}
      <div className="px-4 py-20 max-w-4xl mx-auto text-right rtl:text-right ltr:text-left" style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4 border-[#3d2e1e]/20 inline-block">
          {isArabic ? 'من نحن' : 'Who We Are'}
        </h2>
        <div className="space-y-6 text-sm md:text-base text-gray-700 leading-relaxed font-medium">
          {isArabic ? (
            <>
              <p>
                متجر <strong>كسوة</strong> هو وجهة سعودية رائدة متخصصة في توفير أفخر سجادات الصلاة الفاخرة، ومستلزمات التخييم، والملابس الإسلامية المصنعة بأعلى درجات الإتقان.
              </p>
              <p>
                نستلهم تصاميمنا من هيبة وعظمة كسوة الكعبة المشرفة ونقوش الروضة الشريفة، لنقدم منتجات فريدة تعكس قيم الإتقان والتفرد التي تليق بعملائنا المميّزين.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Kiswa</strong> is a leading Saudi destination specializing in high-end luxury prayer rugs, camping equipment, and premium Islamic lifestyle products manufactured with utmost dedication.
              </p>
              <p>
                We draw our design inspiration directly from the majestic elements of the Holy Kaaba and Al-Rawdah Al-Sharifah patterns, delivering products that reflect beauty, spirituality, and comfort.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#3d2e1e] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-1">
                <p className="text-4xl md:text-5xl font-extrabold text-amber-400 font-sans">{stat.number}</p>
                <p className="text-sm text-gray-300 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 py-24 w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-16 text-center">
          {isArabic ? 'قيمنا الأساسية' : 'Our Core Values'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {values.map((value, idx) => {
            const Icon = value.icon
            return (
              <div key={idx} className="flex gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 items-start" style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#3d2e1e] text-white rounded-xl flex items-center justify-center shadow-md">
                    <Icon size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{value.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Footer />
    </div>
  )
}
