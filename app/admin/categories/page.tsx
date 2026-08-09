'use client'

import { useState, useEffect } from 'react'
import { Grid, Plus, Edit3, Trash2 } from 'lucide-react'

const DEFAULT_CATEGORIES = [
  { _id: '1', name: { en: 'Prayer Mats (سجاد الصلاة)', ar: 'سجاد الصلاة' }, slug: 'prayer-mat', image: '/categories/prayer-mats-badge.png', productCount: 14 },
  { _id: '2', name: { en: 'Ihram Sets (طقوم الإحرام)', ar: 'طقم الإحرام' }, slug: 'ihrams', image: '/categories/ihram-badge.png', productCount: 8 },
  { _id: '3', name: { en: 'Prayer Dresses (شراشف الصلاة)', ar: 'شراشف الصلاة' }, slug: 'prayer-wear', image: '/categories/women-prayer-badge.png', productCount: 12 },
  { _id: '4', name: { en: 'Travel & Camping (مستلزمات الرحلات)', ar: 'مستلزمات الرحلات' }, slug: 'tents', image: '/categories/camping-badge.png', productCount: 6 },
  { _id: '5', name: { en: 'Luxury Gifts (هدايا فاخرة)', ar: 'هدايا فاخرة' }, slug: 'gifts', image: '/categories/gifts-badge.png', productCount: 10 },
  { _id: '6', name: { en: 'Perfumes & Oud (العطور والعود)', ar: 'العطور والعود' }, slug: 'perfumes', image: '/categories/perfume-badge.png', productCount: 5 },
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setCategories(data.data)
        } else {
          setCategories(DEFAULT_CATEGORIES)
        }
      })
      .catch(() => setCategories(DEFAULT_CATEGORIES))
      .finally(() => setLoading(false))
  }, [])

  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Grid className="text-[#3d2e1e]" size={26} />
            Category & Subcategory Management
          </h1>
          <p className="text-sm text-gray-500">Organize store categories, subcategories, and badges</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-400">Loading categories...</p>
        ) : (
          displayCategories.map((cat) => (
            <div key={cat._id || cat.slug} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition">
              <img src={cat.image || '/categories/prayer-mats-badge.png'} alt="" className="w-16 h-16 object-cover rounded-xl border border-gray-100 bg-gray-50" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm">
                  {typeof cat.name === 'object' && cat.name !== null 
                    ? (cat.name.en || cat.name.ar || '') 
                    : String(cat.name || '')}
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">/{cat.slug}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                    Active Category
                  </span>
                  {cat.productCount && (
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">
                      {cat.productCount} Items
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
