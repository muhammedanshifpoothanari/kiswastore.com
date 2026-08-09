'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Search, Edit3, Trash2, Tag, Barcode, Scale, CheckCircle, XCircle } from 'lucide-react'

const DEFAULT_PRODUCTS = [
  { _id: '1', slug: 'rawdat-al-haramain', name: { en: 'Rawdat Al-Haramain Luxury Prayer Rug', ar: 'سجادة الروضة الشريفة الفاخرة' }, price: 65.22, stockQuantity: 45, categoryId: 'prayer-mat', barcode: 'BC-984012', image: '/products/prayer-mat-1.png', inStock: true },
  { _id: '2', slug: 'kiswa-tent-2p', name: { en: 'Kiswa Premium Camping Tent 2P', ar: 'خيمة نسكي الملكية للرحلات' }, price: 1450.00, stockQuantity: 12, categoryId: 'tents', barcode: 'BC-552109', image: '/products/tent-1.png', inStock: true },
  { _id: '3', slug: 'luxury-ihram-bamboo', name: { en: 'Luxury Bamboo Microfiber Ihram Set', ar: 'طقم إحرام بامبو فاخر خفيف' }, price: 290.00, stockQuantity: 80, categoryId: 'ihrams', barcode: 'BC-112093', image: '/products/ihram-1.png', inStock: true },
  { _id: '4', slug: 'kiswa-musk-oud', name: { en: 'Royal Kiswa Musk & Oud Concentrated Perfume', ar: 'عطر مسك وعود نسكي الملكي' }, price: 195.00, stockQuantity: 30, categoryId: 'perfumes', barcode: 'BC-772184', image: '/products/perfume-1.png', inStock: true },
  { _id: '5', slug: 'makkah-memory-foam-mat', name: { en: 'Makkah Memory Foam Orthopedic Prayer Mat', ar: 'سجادة صلاة طبية ميموري فوم مكة' }, price: 450.00, stockQuantity: 25, categoryId: 'prayer-mat', barcode: 'BC-309182', image: '/products/prayer-mat-2.png', inStock: true },
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const [formData, setFormData] = useState({
    slug: '',
    nameEn: '',
    nameAr: '',
    price: 0,
    stockQuantity: 50,
    categoryId: 'CAT-prayer-mat',
    barcode: '',
    weight: '1kg',
    isUpsell: false,
    image: '/products/prayer-mat-1.png',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.success && data.data && data.data.length > 0) {
        setProducts(data.data)
      } else {
        setProducts(DEFAULT_PRODUCTS)
      }
    } catch (err) {
      console.error('Failed to fetch products', err)
      setProducts(DEFAULT_PRODUCTS)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setFormData({
      slug: `product-${Date.now()}`,
      nameEn: '',
      nameAr: '',
      price: 99,
      stockQuantity: 50,
      categoryId: 'CAT-prayer-mat',
      barcode: `BC-${Math.floor(100000 + Math.random() * 900000)}`,
      weight: '1kg',
      isUpsell: false,
      image: '/products/prayer-mat-1.png',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        slug: formData.slug,
        name: { en: formData.nameEn, ar: formData.nameAr || formData.nameEn },
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        categoryId: formData.categoryId,
        barcode: formData.barcode,
        weight: formData.weight,
        isUpsell: formData.isUpsell,
        image: formData.image,
        inStock: Number(formData.stockQuantity) > 0
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.success) {
        fetchProducts()
        setShowModal(false)
      }
    } catch (err) {
      console.error('Failed to save product', err)
    }
  }

  const filteredProducts = products.filter(p => {
    const name = p.name?.en || p.name || ''
    return name.toLowerCase().includes(search.toLowerCase()) || (p.barcode || '').includes(search)
  })

  return (
    <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="text-[#3d2e1e]" size={26} />
              Product & Stock Management
            </h1>
            <p className="text-sm text-gray-500">Manage catalog products, barcode data, weights, stock levels, and upsells</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3d2e1e] hover:bg-[#2a1f14] text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            <Plus size={18} />
            Add New Product
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 max-w-md">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm bg-transparent border-none focus:outline-none"
          />
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Barcode / Weight</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Upsell</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">Loading products...</td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">No products found.</td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id || product.slug} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={product.image || '/products/prayer-mat-1.png'} alt="" className="w-10 h-10 object-cover rounded-lg border" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {typeof product.name === 'object' && product.name !== null 
                              ? (product.name.en || product.name.ar || '') 
                              : String(product.name || '')}
                          </p>
                          <p className="text-xs text-gray-400">{product.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs space-y-0.5">
                          <p className="flex items-center gap-1 font-mono text-gray-700"><Barcode size={14}/> {product.barcode || 'N/A'}</p>
                          <p className="flex items-center gap-1 text-gray-500"><Scale size={14}/> {product.weight || '1kg'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-600">
                        {product.categoryId}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {product.price} SAR
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          (product.stockQuantity || 0) > 10
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : (product.stockQuantity || 0) > 0
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {product.stockQuantity || 0} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {product.isUpsell ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            <CheckCircle size={12} /> Yes
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 text-gray-500 hover:text-[#3d2e1e] hover:bg-gray-100 rounded-lg transition">
                          <Edit3 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Catalog Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name (EN)</label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#3d2e1e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Price (SAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#3d2e1e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#3d2e1e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Barcode</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#3d2e1e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#3d2e1e]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.isUpsell}
                  onChange={(e) => setFormData({ ...formData, isUpsell: e.target.checked })}
                  className="rounded text-[#3d2e1e] focus:ring-[#3d2e1e]"
                />
                <span className="text-xs font-semibold text-gray-700">Mark as Checkout Upsell Product</span>
              </label>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3d2e1e] text-white rounded-lg font-semibold hover:bg-[#2a1f14]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
