'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { useLanguage } from '@/hooks/useLanguage'
import { Star, Plus, Minus, ShoppingCart, Zap, CheckCircle2 } from 'lucide-react'
import { allProducts } from '@/data/products'
import { useCart } from '@/context/CartContext'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isArabic, language } = useLanguage()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addToCart } = useCart()

  const defaultSpecs = [
    { label: 'Height', value: '114 cm' },
    { label: 'Width', value: '68 cm' },
    { label: 'Weight', value: '900g' },
    { label: 'Thickness', value: '4 mm' },
    { label: 'Material', value: 'velvet' }
  ]

  useEffect(() => {
    const id = params ? (params.id as string) : '1'

    // 1. Instantly look up in static allProducts catalog for zero latency loading
    const localProduct = allProducts.find((p: any) => p.id === id || p.slug === id || p._id === id)
    if (localProduct) {
      const nameString = typeof localProduct.name === 'object' && localProduct.name !== null 
        ? (localProduct.name[language as 'en' | 'ar'] || localProduct.name.en || localProduct.name.ar || Object.values(localProduct.name)[0] || '') 
        : String(localProduct.name || '')
      const descString = typeof localProduct.description === 'object' && localProduct.description !== null
        ? (localProduct.description[language as 'en' | 'ar'] || localProduct.description.en || localProduct.description.ar || Object.values(localProduct.description)[0] || '')
        : String(localProduct.description || '')

      setProduct({
        ...localProduct,
        nameStr: nameString,
        descriptionStr: descString,
        specifications: defaultSpecs,
        images: [localProduct.image, '/products/prayer-mat-1b.png', '/products/prayer-mat-1c.png'],
        relatedProducts: allProducts.filter(p => p.categoryId === localProduct.categoryId && p.id !== localProduct.id).slice(0, 2)
      })
      setLoading(false)
    }

    // 2. Fetch in background to match database updates
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const found = data.data.find((p: any) => p._id === id || p.slug === id || p.id === id)
          if (found) {
            const nameString = typeof found.name === 'object' && found.name !== null 
              ? (found.name[language as 'en' | 'ar'] || found.name.en || found.name.ar || Object.values(found.name)[0] || '') 
              : String(found.name || '')
            const descString = typeof found.description === 'object' && found.description !== null
              ? (found.description[language as 'en' | 'ar'] || found.description.en || found.description.ar || Object.values(found.description)[0] || '')
              : String(found.description || 'Comfortable prayer mat with a design inspired by Rawdat Al-Haramain carpets.')
            
            setProduct({
              ...found,
              nameStr: nameString,
              descriptionStr: descString,
              specifications: defaultSpecs,
              images: [found.image, '/products/prayer-mat-1b.png', '/products/prayer-mat-1c.png'],
              relatedProducts: data.data.filter((p: any) => p.categoryId === found.categoryId && p._id !== found._id).slice(0, 2)
            })
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params, language])

  const handleAddToCart = () => {
    if (!product) return
    addToCart({
      id: product._id || product.id,
      productId: (product._id || product.id || '').toString(),
      name: product.nameStr || product.name,
      price: typeof product.price === 'number' ? product.price : Number(product.price || 0),
      quantity,
      image: product.image || product.images?.[0] || '/products/prayer-mat-1.png',
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const handleBuyNow = () => {
    router.push(`/checkout?directId=${product._id || product.id || '1'}&qty=${quantity}`)
  }

  if (loading) return <div className="p-12 text-center text-gray-500">Loading product details...</div>
  if (!product) return <div className="p-12 text-center text-gray-500">Product not found</div>

  return (
    <div className="w-full bg-white min-h-screen">
      <Header />
      
      {/* Breadcrumb */}
      <div className="px-4 md:px-8 lg:px-[76px] py-4 border-b border-gray-200 text-sm text-gray-600">
        <a href="/" className="hover:text-gray-800">Home</a>
        <span className="mx-2">/</span>
        <a href="/collections" className="hover:text-gray-800">Products</a>
        <span className="mx-2">/</span>
        <span className="text-[#3d2e1e] font-medium">{product.nameStr}</span>
      </div>

      {/* Product Detail Main Section */}
      <div className="px-4 md:px-8 lg:px-[76px] py-12 pb-24 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16 max-w-7xl mx-auto">
          {/* Image Gallery Column */}
          <div>
            <div className="bg-gray-50 mb-4 aspect-square rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center">
              <img src={product.images?.[selectedImage] || product.image} alt={product.nameStr} className="w-full h-full object-cover" />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${selectedImage === idx ? 'border-[#3d2e1e]' : 'border-gray-200'} transition`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Actions Column */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{product.brand || 'Kiswa.SA'}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.nameStr}</h1>
              
              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl md:text-3xl font-bold text-[#3d2e1e]">
                  {typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price || 0).toFixed(2)} SAR
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : Number(product.originalPrice).toFixed(2)} SAR
                  </span>
                )}
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                  {product.availability || 'In Stock'}
                </span>
              </div>

              {/* Tabby Installment Widget */}
              <div className="mb-6 p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#33ffd6] rounded-full animate-pulse" />
                  <span className="text-gray-600">
                    {isArabic 
                      ? `أو قسّمها على 4 دفعات شهرية بقيمة ${(product.price / 4).toFixed(2)} ر.س بدون فوائد`
                      : `or 4 interest-free payments of ${(product.price / 4).toFixed(2)} SAR`}
                  </span>
                </div>
                <span className="bg-[#33ffd6] text-black font-extrabold px-2 py-0.5 rounded font-sans text-xs flex items-center gap-1 shrink-0">
                  tabby
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {typeof (product.descriptionStr || product.description) === 'object' && (product.descriptionStr || product.description) !== null
                  ? ((product.descriptionStr || product.description)[language as 'en' | 'ar'] || (product.descriptionStr || product.description).en || (product.descriptionStr || product.description).ar || '')
                  : String(product.descriptionStr || product.description || '')}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-gray-700">{isArabic ? 'الكمية:' : 'Quantity:'}</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="p-2 hover:bg-gray-100 text-gray-600"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-5 py-1.5 font-bold text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="p-2 hover:bg-gray-100 text-gray-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* --- ACTION BUTTONS: DESKTOP INLINE --- */}
              <div className="hidden md:block space-y-3 pb-6">
                {/* Buy Now Button (LARGER) */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-[#3d2e1e] hover:bg-[#2a1f14] text-white font-bold text-lg rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  <Zap size={22} className="fill-current text-amber-400" />
                  {isArabic ? 'شراء الآن' : 'BUY NOW'}
                </button>

                {/* Add to Cart Button (SMALLER) */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm rounded-lg transition border border-gray-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  {addedToCart ? (isArabic ? 'تمت الإضافة للعربة' : 'Added to Cart') : (isArabic ? 'أضف للسلة' : 'Add to Cart')}
                </button>
              </div>

              {/* --- DETAILS PLACED AFTER ACTION BUTTONS --- */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 mb-4">
                <h3 className="text-sm font-bold text-[#3d2e1e] uppercase tracking-wider mb-3">{isArabic ? 'التفاصيل والمواصفات:' : 'Details & Specifications:'}</h3>
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
                  {product.specifications?.map((spec: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100">
                      <span className="font-semibold text-gray-500">{spec.label}:</span>
                      <span className="font-bold text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-2xl z-50 flex items-center gap-2">
        <button
          onClick={handleAddToCart}
          className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl border border-gray-300 flex items-center justify-center shrink-0"
          aria-label="Add to Cart"
        >
          <ShoppingCart size={20} />
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3.5 bg-[#3d2e1e] hover:bg-[#2a1f14] text-white font-extrabold text-base rounded-xl transition shadow-md flex items-center justify-center gap-2"
        >
          <Zap size={20} className="fill-current text-amber-400" />
          {isArabic ? 'شراء الآن' : 'BUY NOW'}
        </button>
      </div>

      <Footer />
    </div>
  )
}
