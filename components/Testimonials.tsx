'use client'

import { Star } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

const testimonials = [
  {
    id: 1,
    name: 'عبدالرحمن محمد',
    date: '15 أكتوبر 2023',
    title: 'قماش سجادات الصلاة استثنائي',
    text: 'قماش سجادات الصلاة استثنائي والمسند مريح جداً. شكراً لكم على هذا المنتج الرائع.',
    rating: 5,
    productImage: '/products/prayer-mat-1.png',
  },
  {
    id: 2,
    name: 'سارة خالد',
    date: '02 نوفمبر 2023',
    title: 'سرعة التوصيل وخدمة العملاء',
    text: 'سرعة التوصيل وخدمة العملاء مميزة جداً. جودة الإحرام فوق الوصف وتستحق كل ريال.',
    rating: 5,
    productImage: '/products/prayer-wear-premium.png',
  },
  {
    id: 3,
    name: 'يوسف العلي',
    date: '28 ديسمبر 2023',
    title: 'أفضل هدية للوالدة',
    text: 'أفضل هدية للوالدة. المسند مريح جداً للصلاة وقراءة القرآن الكريم. جزاكم الله خيراً.',
    rating: 5,
    productImage: '/products/prayer-mat-1.png',
  },
]

export default function Testimonials() {
  const { isArabic } = useLanguage()

  return (
    <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header Badge */}
      <div className="flex justify-center mb-10">
        <div className="bg-[#3d2e1e] text-white px-6 py-2.5 rounded flex items-center gap-4 shadow-md">
          <h2 className="font-bold text-sm md:text-base">
            {isArabic ? 'آراء العملاء يتحدثون عنا' : 'Customers Speak About Us'}
          </h2>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-white text-white" />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="flex flex-col gap-4 md:gap-6">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="bg-white border border-gray-100 p-4 md:p-6 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition hover:shadow-md"
          >
            {/* Review Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < testimonial.rating ? 'fill-[#8c763e] text-[#3d2e1e]' : 'text-gray-600'}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {testimonial.name} <span className="mx-1">•</span> {testimonial.date}
                </div>
              </div>
              <h3 className="font-bold text-[#3d2e1e] mb-2">{testimonial.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{testimonial.text}</p>
            </div>

            {/* Product Image Thumbnail */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded border border-gray-100 flex-shrink-0 flex items-center justify-center p-1">
              <img 
                src={testimonial.productImage} 
                alt="Product" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
