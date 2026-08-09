'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Search, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useRouter } from 'next/navigation'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const { isArabic, language } = useLanguage()
  const router = useRouter()
  const modalRef = useRef<HTMLDivElement>(null)

  // Fetch products catalog
  useEffect(() => {
    if (isOpen) {
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setProducts(data.data)
          }
        })
        .catch((err) => console.error('Failed to load products for search:', err))
    }
  }, [isOpen])

  // Live filter suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts([])
      return
    }

    const cleanQuery = query.toLowerCase().trim()
    const matches = products.filter((p) => {
      const nameEn = String(p.name?.en || p.name || '').toLowerCase()
      const nameAr = String(p.name?.ar || p.name || '').toLowerCase()
      const descEn = String(p.description?.en || p.description || '').toLowerCase()
      const descAr = String(p.description?.ar || p.description || '').toLowerCase()
      
      return (
        nameEn.includes(cleanQuery) ||
        nameAr.includes(cleanQuery) ||
        descEn.includes(cleanQuery) ||
        descAr.includes(cleanQuery)
      )
    })

    setFilteredProducts(matches.slice(0, 5))
  }, [query, products])

  // Control page scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSelectProduct = (productId: string) => {
    router.push(`/products/${productId}`)
    setQuery('')
    onClose()
  }

  const getProductName = (prod: any) => {
    if (typeof prod.name === 'object' && prod.name !== null) {
      return prod.name[language] || prod.name.en || prod.name.ar || ''
    }
    return prod.name || ''
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990] transition-opacity"
      />

      {/* Search Input Container */}
      <div 
        ref={modalRef}
        className="fixed top-0 left-0 right-0 z-[9999] bg-white shadow-2xl border-b border-gray-100 animate-in slide-in-from-top duration-300"
        style={{ direction: isArabic ? 'rtl' : 'ltr' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center gap-4">
            {/* Input Wrapper */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث عن منتج، سجادة صلاة، عطور...' : 'Search products, prayer mats, tents...'}
                autoFocus
                className="w-full px-5 py-3.5 pl-12 pr-12 border-2 border-[#3d2e1e] rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-[#3d2e1e]/10 text-gray-900 font-semibold"
              />
              <Search 
                size={22} 
                className={`absolute ${isArabic ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400`} 
              />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition flex-shrink-0"
            >
              <X size={22} className="text-gray-700" />
            </button>
          </div>

          {/* Auto Suggestions Dropdown Result */}
          {query.trim() !== '' && (
            <div className="mt-6 border-t pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                {isArabic ? 'نتائج البحث المقترحة' : 'Suggested Search Results'}
              </p>
              
              {filteredProducts.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center font-medium">
                  {isArabic ? 'لا توجد منتجات مطابقة للبحث' : 'No products match your search.'}
                </p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredProducts.map((prod) => (
                    <button
                      key={prod._id || prod.id}
                      onClick={() => handleSelectProduct(prod._id || prod.id)}
                      className="w-full py-3.5 flex items-center gap-4 hover:bg-gray-50 rounded-xl px-2 transition text-right rtl:text-right ltr:text-left"
                    >
                      <img 
                        src={prod.image || '/products/prayer-mat-1.png'} 
                        alt={getProductName(prod)} 
                        className="w-12 h-12 object-cover rounded-lg border flex-shrink-0 bg-gray-50"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate">
                          {getProductName(prod)}
                        </p>
                        <p className="text-xs text-amber-700 font-extrabold mt-0.5">
                          {prod.price} SAR
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 flex-shrink-0 rtl:rotate-180" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Popular Default Options when input is empty */}
          {query.trim() === '' && (
            <div className="mt-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                {isArabic ? 'عمليات البحث الشائعة' : 'Popular Searches'}
              </p>
              <div className="flex flex-wrap gap-2">
                {(isArabic 
                  ? ['سجاد صلاة', 'ملابس الإحرام', 'خيام رحلات', 'عطور'] 
                  : ['Prayer Mats', 'Ihram Sets', 'Camping Tents', 'Perfumes']
                ).map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-gray-100 hover:bg-[#3d2e1e] hover:text-white text-xs font-bold rounded-full transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
