'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/hooks/useLanguage'
import { useCart } from '@/context/CartContext'
import { Zap, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  id: number | string
  name: string
  price: number
  originalPrice?: number
  image: string
  offer?: string
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  offer,
}: ProductCardProps) {
  const router = useRouter()
  const [addingToCart, setAddingToCart] = useState(false)
  const { isArabic } = useLanguage()
  const { addToCart } = useCart()

  const trackEvent = async (action: string) => {
    try {
      let sessionId = localStorage.getItem('cart_session_id')
      if (!sessionId) {
        sessionId = `sess_${Math.random().toString(36).substring(7)}`
        localStorage.setItem('cart_session_id', sessionId)
      }
      await fetch('/api/button-clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, productId: id.toString(), sessionId })
      })
    } catch (e) {
      console.error('Failed to track event', e)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAddingToCart(true)
    trackEvent('add_to_cart')
    addToCart({
      id,
      productId: id.toString(),
      name,
      price,
      quantity: 1,
      image
    })
    setTimeout(() => setAddingToCart(false), 1200)
  }

  const handleProductClick = () => {
    trackEvent('view_product')
    router.push(`/products/${id}`)
  }

  const displayName = typeof name === 'object' && name !== null 
    ? ((name as any)[isArabic ? 'ar' : 'en'] || (name as any).en || (name as any).ar || '') 
    : String(name || '')

  return (
    <div 
      onClick={handleProductClick}
      className="group cursor-pointer border border-gray-200 rounded-2xl bg-white flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition duration-300"
    >
      <div>
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center">
          <img 
            src={image} 
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount/Offer Badge */}
          {offer && (
            <div className="absolute top-2.5 left-2.5 bg-[#3d2e1e] text-white px-2 py-0.5 text-[10px] font-bold rounded-md shadow-sm">
              {offer}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-4 pt-3 text-start">
          <h3 className="text-xs font-semibold text-gray-800 mb-1.5 line-clamp-2 h-9 leading-snug">
            {displayName}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-sm font-extrabold text-[#3d2e1e]">
              {price.toFixed(2)} SAR
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {originalPrice.toFixed(2)} SAR
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: BUY NOW IS LARGER, ADD TO CART IS SMALLER */}
      <div className="px-3 pb-3 flex flex-col gap-1.5">
        {/* Buy Now (Larger, Primary) */}
        <button 
          onClick={(e) => {
            e.stopPropagation()
            trackEvent('direct_checkout')
            router.push(`/checkout?directId=${id}&qty=1`)
          }}
          className="w-full bg-[#3d2e1e] hover:bg-[#2a1f14] text-white py-2 px-3 font-bold rounded-xl transition text-xs shadow-sm flex items-center justify-center gap-1.5"
        >
          <Zap size={14} className="fill-current text-amber-400" />
          {isArabic ? 'شراء الآن' : 'Buy Now'}
        </button>

        {/* Add to Cart (Smaller, Secondary) */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 py-1.5 px-2 font-medium rounded-lg transition text-[10px] flex items-center justify-center gap-1"
        >
          <ShoppingCart size={12} />
          {addingToCart ? (isArabic ? 'تمت الإضافة' : 'Added') : (isArabic ? 'أضف للسلة' : 'Add to cart')}
        </button>
      </div>
    </div>
  )
}
