'use client'

import { use, useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { useLanguage } from '@/hooks/useLanguage'
import { getCategoryBySlug, categories } from '@/data/categories'
import { getProductsByCategoryId } from '@/data/products'
import { ChevronRight } from 'lucide-react'

export default function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params)
  const { language, isArabic } = useLanguage()
  const staticCategory = getCategoryBySlug(resolvedParams.category)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const catId = staticCategory ? staticCategory.id : `CAT-${resolvedParams.category}`
          const filtered = data.data.filter((p: any) =>
            p.categoryId === catId || p.categoryId === `CAT-${resolvedParams.category}`
          )
          if (filtered.length > 0) {
            setProducts(filtered)
            return
          }
        }
        if (staticCategory) {
          setProducts(getProductsByCategoryId(staticCategory.id))
        }
      })
      .catch(() => {
        if (staticCategory) {
          setProducts(getProductsByCategoryId(staticCategory.id))
        }
      })
      .finally(() => setLoading(false))
  }, [resolvedParams.category, staticCategory?.id])

  const categoryName = staticCategory
    ? (staticCategory.name[language as 'en' | 'ar'] || staticCategory.name.en)
    : resolvedParams.category
  const categoryDesc = staticCategory
    ? (staticCategory.description[language as 'en' | 'ar'] || staticCategory.description.en)
    : ''

  const otherCategories = categories.filter(c => c.slug !== resolvedParams.category)

  return (
    <div className="w-full bg-[#fbfbfa] min-h-screen">
      <Header />

      {/* Category Hero */}
      <div className="bg-[#3d2e1e] text-white py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-amber-200/70 text-xs mb-4">
            <a href="/" className="hover:text-amber-200 transition">{isArabic ? 'الرئيسية' : 'Home'}</a>
            <ChevronRight size={12} />
            <a href="/collections" className="hover:text-amber-200 transition">{isArabic ? 'الأقسام' : 'Collections'}</a>
            <ChevronRight size={12} />
            <span className="text-amber-100">{categoryName}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{categoryName}</h1>
          {categoryDesc && <p className="mt-2 text-amber-200/80 text-sm md:text-base max-w-xl">{categoryDesc}</p>}
          <p className="mt-3 text-amber-100/60 text-xs">
            {loading ? '...' : `${products.length} ${isArabic ? 'منتج' : 'products'}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex gap-8">
          {/* Sidebar: Other Categories */}
          <aside className="hidden lg:block w-52 shrink-0">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">
              {isArabic ? 'الأقسام' : 'Categories'}
            </p>
            <div className="flex flex-col gap-1">
              {categories.map(cat => {
                const isActive = cat.slug === resolvedParams.category
                return (
                  <a
                    key={cat.id}
                    href={`/collections/${cat.slug}`}
                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#3d2e1e] text-white'
                        : 'text-gray-700 hover:bg-amber-50 hover:text-[#3d2e1e]'
                    }`}
                  >
                    {cat.name[language as 'en' | 'ar']}
                  </a>
                )
              })}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl animate-pulse h-64" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 text-gray-400">
                <p className="text-lg font-semibold">{isArabic ? 'لا توجد منتجات في هذا القسم' : 'No products found in this category.'}</p>
                <a href="/collections" className="mt-4 inline-block text-sm text-[#3d2e1e] font-bold underline">
                  {isArabic ? 'تصفح الأقسام الأخرى' : 'Browse other collections'}
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    id={product._id || product.id}
                    name={product.name?.[language as 'en' | 'ar'] || product.name?.en || product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.image}
                    offer={product.offer}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
