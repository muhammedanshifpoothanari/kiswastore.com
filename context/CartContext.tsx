'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string | number
  productId?: string
  name: string
  price: number
  quantity: number
  image?: string
  color?: string
}

export interface Coupon {
  code: string
  discountPercent: number
  discountAmount?: number
  minSubtotal?: number
}

interface CartContextType {
  cart: CartItem[]
  cartCount: number
  subtotal: number
  discount: number
  total: number
  appliedCoupon: Coupon | null
  couponError: string
  addToCart: (item: Partial<CartItem>) => void
  removeFromCart: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const DEFAULT_COUPONS: Record<string, number> = {
  KISWA10: 10,
  WELCOME20: 20,
  RAMADAN15: 15,
  PROMO50: 50,
  SPECIAL10: 10,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountPercent = appliedCoupon ? appliedCoupon.discountPercent : 0
  const discount = (subtotal * discountPercent) / 100
  const total = Math.max(0, subtotal - discount)

  // 1. Load cart from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    try {
      const savedCart = localStorage.getItem('kiswa_cart_items')
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed)
        } else {
          setCart([])
        }
      } else {
        setCart([])
      }

      const savedCoupon = localStorage.getItem('kiswa_applied_coupon')
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon))
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e)
    }
  }, [])

  // 2. Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('kiswa_cart_items', JSON.stringify(cart))
    }
  }, [cart, isMounted])

  // 3. Persist coupon to localStorage
  useEffect(() => {
    if (isMounted) {
      if (appliedCoupon) {
        localStorage.setItem('kiswa_applied_coupon', JSON.stringify(appliedCoupon))
      } else {
        localStorage.removeItem('kiswa_applied_coupon')
      }
    }
  }, [appliedCoupon, isMounted])

  // 4. Auto-track/update abandoned cart in the database
  useEffect(() => {
    if (!isMounted) return

    // Create session ID if not exists
    let sessionId = localStorage.getItem('cart_session_id')
    if (!sessionId) {
      sessionId = `sess_${Math.random().toString(36).substring(7)}`
      localStorage.setItem('cart_session_id', sessionId)
    }

    // Get any customer details we have saved in localStorage
    const phone = localStorage.getItem('kiswa_customer_phone') || ''
    const customerName = localStorage.getItem('kiswa_customer_name') || ''
    const city = localStorage.getItem('kiswa_customer_city') || ''
    const address = localStorage.getItem('kiswa_customer_address') || ''
    const customerEmail = localStorage.getItem('kiswa_customer_email') || ''

    if (cart.length > 0) {
      // Send cart details to API
      fetch('/api/abandoned-carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          items: cart.map(item => ({
            productId: (item.productId || item.id).toString(),
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          phone,
          customerName,
          city,
          address,
          customerEmail,
          totalValue: total
        })
      }).catch(err => console.error('Failed to auto-track abandoned cart', err))
    }
  }, [cart, total, isMounted])

  const addToCart = (newItem: Partial<CartItem>) => {
    const itemToAdd: CartItem = {
      id: newItem.id || newItem.productId || `item_${Date.now()}`,
      productId: (newItem.productId || newItem.id || '').toString(),
      name: newItem.name || 'Kiswa Product',
      price: newItem.price || 99.00,
      quantity: newItem.quantity || 1,
      image: newItem.image || '/products/prayer-mat-1.png',
      color: newItem.color || ''
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id.toString() === itemToAdd.id.toString())
      if (existingIndex > -1) {
        const updated = [...prevCart]
        updated[existingIndex].quantity += itemToAdd.quantity
        return updated
      } else {
        return [...prevCart, itemToAdd]
      }
    })
  }

  const removeFromCart = (id: string | number) => {
    setCart(prev => prev.filter(item => item.id.toString() !== id.toString()))
  }

  const updateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCart(prev => prev.map(item => item.id.toString() === id.toString() ? { ...item, quantity: newQuantity } : item))
  }

  const clearCart = () => {
    setCart([])
  }

  const applyCoupon = (code: string): boolean => {
    setCouponError('')
    const cleanCode = code.trim().toUpperCase()
    if (!cleanCode) {
      setCouponError('Please enter a coupon code')
      return false
    }

    if (DEFAULT_COUPONS[cleanCode]) {
      const discountPercent = DEFAULT_COUPONS[cleanCode]
      const coupon: Coupon = {
        code: cleanCode,
        discountPercent
      }
      setAppliedCoupon(coupon)
      return true
    } else {
      setCouponError('Invalid coupon code')
      return false
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponError('')
  }

  // Derived state values are now declared at the top of CartProvider to avoid TDZ issues

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      subtotal,
      discount,
      total,
      appliedCoupon,
      couponError,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    // Return fallback safe values during SSR or non-wrapped components
    return {
      cart: [],
      cartCount: 0,
      subtotal: 0,
      discount: 0,
      total: 0,
      appliedCoupon: null,
      couponError: '',
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      applyCoupon: () => false,
      removeCoupon: () => {}
    }
  }
  return context
}
