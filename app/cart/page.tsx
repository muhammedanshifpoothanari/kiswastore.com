'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Trash2, Plus, Minus, ArrowRight, Tag, Check, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const {
    cart,
    subtotal,
    discount,
    total,
    appliedCoupon,
    couponError,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useCart()

  const [inputCoupon, setInputCoupon] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')



  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (applyCoupon(inputCoupon)) {
      setCouponSuccess(`Coupon ${inputCoupon.toUpperCase()} applied!`)
      setInputCoupon('')
    } else {
      setCouponSuccess('')
    }
  }

  // Track abandoned cart
  useEffect(() => {
    if (cart.length > 0) {
      let sessionId = localStorage.getItem('cart_session_id')
      if (!sessionId) {
        sessionId = `sess_${Math.random().toString(36).substring(7)}`
        localStorage.setItem('cart_session_id', sessionId)
      }

      fetch('/api/abandoned-carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          items: cart.map(item => ({
            productId: `P-${item.id}`,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          totalValue: total
        })
      }).catch(err => console.error('Failed to track cart', err))
    }
  }, [cart, total])

  return (
    <div className="w-full bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="px-4 md:px-8 lg:px-[76px] py-4 border-b border-gray-200 text-sm text-gray-600">
        <a href="/" className="hover:text-gray-800">Home</a>
        <span className="mx-2">/</span>
        <span className="text-[#3d2e1e] font-medium">Shopping Cart</span>
      </div>

      {/* Cart Section */}
      <div className="px-4 md:px-8 lg:px-[76px] py-12">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <Link href="/">
              <button className="inline-block bg-[#3d2e1e] text-white px-8 py-3 font-bold rounded-xl hover:bg-[#2a1f14] transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-8 text-[#3d2e1e]">Shopping Cart</h1>

              <div className="space-y-4 mb-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 items-center">
                    {/* Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image src={item.image || '/products/prayer-mat-1.png'} alt={typeof item.name === 'string' ? item.name : 'Product'} width={96} height={96} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1 text-[#3d2e1e]">
                        {typeof item.name === 'object' && item.name !== null ? (item.name.en || item.name.ar || '') : String(item.name || '')}
                      </h3>
                      <p className="text-[#3d2e1e] font-extrabold text-base">SAR {item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-200 transition text-gray-700"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1 font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-200 transition text-gray-700"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right w-24">
                      <p className="font-bold text-base text-[#3d2e1e]">SAR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <Link href="/">
                <button className="text-[#3d2e1e] font-bold hover:underline flex items-center gap-2 text-sm">
                  <ArrowRight size={16} className="rotate-180" />
                  Continue Shopping
                </button>
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-4 shadow-sm">
                <h2 className="text-xl font-bold text-[#3d2e1e] mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">SAR {subtotal.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Tag size={14} />
                        Coupon ({appliedCoupon.code})
                      </span>
                      <span className="font-bold">- SAR {discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold text-[#3d2e1e]">Total</span>
                    <span className="text-2xl font-extrabold text-[#3d2e1e]">SAR {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code Application */}
                <form onSubmit={handleApplyCoupon} className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Have a promo coupon? Try <span className="text-amber-700 font-mono">KISWA10</span> or <span className="text-amber-700 font-mono">WELCOME20</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-[#3d2e1e]"
                    />
                    <button
                      type="submit"
                      className="bg-[#3d2e1e] hover:bg-[#2a1f14] text-white px-4 py-2 text-xs font-bold rounded-xl transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                  {couponSuccess && <p className="text-xs text-emerald-600 mt-1 font-medium">{couponSuccess}</p>}

                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="mt-2 text-xs text-red-500 hover:underline flex items-center gap-1"
                    >
                      <X size={12} /> Remove Coupon ({appliedCoupon.code})
                    </button>
                  )}
                </form>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <button className="w-full bg-[#3d2e1e] hover:bg-[#2a1f14] text-white py-3.5 font-bold rounded-xl transition mb-3 shadow">
                    Proceed to Checkout
                  </button>
                </Link>

                {/* Info */}
                <div className="mt-6 pt-4 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                  <p className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> All taxes & shipping included in price</p>
                  <p className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Cash on Delivery Available across KSA</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
