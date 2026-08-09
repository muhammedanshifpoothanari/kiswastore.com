'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Check, Tag, Plus, CheckCircle2, Phone, MapPin, Truck, ShieldCheck, Zap, PartyPopper, ShoppingBag } from 'lucide-react'
import Confetti from '@/components/Confetti'
import { useCart } from '@/context/CartContext'
import AlertModal from '@/components/ui/AlertModal'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const directId = searchParams ? searchParams.get('directId') : null
  const { clearCart } = useCart()

  const [items, setItems] = useState<any[]>([])
  const [step, setStep] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState('')

  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponError, setCouponError] = useState('')

  // Custom alert modal state
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info')

  // Upsell state
  const [upsellProducts, setUpsellProducts] = useState<any[]>([])

  const [formData, setFormData] = useState({
    phone: '',
    city: '',
    address: '',
    firstName: '',
    lastName: '',
    email: '',
    postCode: '',
    country: 'Saudi Arabia',
    paymentMethod: 'cod',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  // Load items and initialize auto-fill
  useEffect(() => {
    // 1. Comprehensive Auto-fetch from localStorage
    const getAutoValue = (...keys: string[]) => {
      for (const k of keys) {
        const val = localStorage.getItem(k)
        if (val && val.trim()) return val.trim()
      }
      return ''
    }

    const autoPhone = getAutoValue('kiswa_customer_phone', 'nusuki_customer_phone', 'user_phone', 'phone', 'customer_phone')
    const autoName = getAutoValue('kiswa_customer_name', 'nusuki_customer_name', 'user_name', 'customer_name')
    const autoCity = getAutoValue('kiswa_customer_city', 'nusuki_customer_city', 'user_city', 'customer_city')
    const autoAddress = getAutoValue('kiswa_customer_address', 'nusuki_customer_address', 'user_address', 'customer_address')
    const autoEmail = getAutoValue('kiswa_customer_email', 'nusuki_customer_email', 'user_email', 'email')

    setFormData(prev => ({
      ...prev,
      phone: autoPhone || prev.phone,
      firstName: autoName || prev.firstName,
      city: autoCity || prev.city,
      address: autoAddress || prev.address,
      email: autoEmail || prev.email,
    }))

    // 2. Load products
    if (directId) {
      fetch(`/api/products`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const found = data.data.find((p: any) => p._id === directId || p.slug === directId || p.id === directId)
            if (found) {
              setItems([{
                id: found._id || found.id || '1',
                productId: found._id || found.id,
                productName: found.name?.en || found.name || 'Rawdat Al-Haramain Prayer Rug',
                price: found.price || 65.22,
                quantity: 1,
                image: found.image || '/products/prayer-mat-1.png'
              }])
            }
          }
        })
        .catch(() => {})
    } else {
      const savedCart = localStorage.getItem('kiswa_cart_items')
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed.map(i => ({
              id: i.id,
              productId: i.productId || i.id,
              productName: i.name,
              price: i.price,
              quantity: i.quantity,
              image: i.image
            })))
          }
        } catch (e) {}
      }
    }

    // 3. Fetch upsells
    fetch('/api/products?isUpsell=true')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUpsellProducts(data.data.slice(0, 2))
        }
      })
      .catch(() => {})
  }, [directId])

  // Calculate pricing (Free Shipping and Inclusive VAT)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.discountValue) / 100
    } else {
      discount = appliedCoupon.discountValue
    }
  }

  const shipping = 0 // Free shipping
  const tax = 0 // VAT is included in price
  const total = Math.max(0, subtotal - discount)

  // Real-time sync of draft order in orders database
  const syncDraftOrderToDatabase = async (phoneValue: string, updatedData: typeof formData) => {
    if (!phoneValue.trim() || items.length === 0) return

    try {
      const orderDbId = localStorage.getItem('checkout_order_db_id')
      const payload = {
        customerEmail: updatedData.email || `${phoneValue.trim()}@lead.customer`,
        customerName: `${updatedData.firstName || 'Customer'} ${updatedData.lastName || ''}`.trim(),
        phone: phoneValue.trim(),
        customerPhone: phoneValue.trim(),
        items: items.map(i => ({
          productId: i.productId || i.id,
          productName: i.productName || i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image
        })),
        subtotal,
        discount,
        shipping: 0,
        tax: 0,
        total,
        status: 'pending', // pending payment
        paymentMethod: 'cod',
        shippingAddress: {
          street: updatedData.address || 'Address pending',
          city: updatedData.city || 'Riyadh',
          postCode: updatedData.postCode || '11564',
          country: updatedData.country || 'Saudi Arabia',
        }
      }

      if (orderDbId) {
        await fetch(`/api/orders/${orderDbId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (data.success && data.data?._id) {
          localStorage.setItem('checkout_order_db_id', data.data._id)
          localStorage.setItem('checkout_order_id', data.data.orderId)
        }
      }
    } catch (err) {
      console.error('Failed to sync draft order:', err)
    }
  }

  // Debounced sync for draft orders and abandoned carts to prevent DB write flood on keypress
  useEffect(() => {
    if (!formData.phone.trim() || items.length === 0) return

    const timer = setTimeout(() => {
      syncDraftOrderToDatabase(formData.phone, formData)

      try {
        let sessionId = localStorage.getItem('cart_session_id') || `sess_${Date.now()}`
        fetch('/api/abandoned-carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            customerEmail: formData.email || `${formData.phone.trim()}@lead.customer`,
            phone: formData.phone.trim(),
            items: items.map(i => ({ productId: i.productId, productName: i.productName, price: i.price, quantity: i.quantity, image: i.image })),
            totalValue: total
          })
        }).catch(() => {})
      } catch (err) {}
    }, 1500) // Commit to MongoDB only when user pauses typing for 1.5s

    return () => clearTimeout(timer)
  }, [formData.phone, formData.firstName, formData.lastName, formData.city, formData.address, formData.email, items])

  // Instant capture phone & location into localStorage
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      
      // Auto-save fields to localStorage
      if (value.trim()) {
        if (name === 'phone') localStorage.setItem('kiswa_customer_phone', value.trim())
        if (name === 'firstName' || name === 'lastName') localStorage.setItem('kiswa_customer_name', `${updated.firstName} ${updated.lastName}`.trim())
        if (name === 'city') localStorage.setItem('kiswa_customer_city', value.trim())
        if (name === 'address') localStorage.setItem('kiswa_customer_address', value.trim())
        if (name === 'email') localStorage.setItem('kiswa_customer_email', value.trim())
      }

      return updated
    })
  }

  // Handle coupon application
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return
    setCouponError('')
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(couponCode.trim())}`)
      const data = await res.json()
      if (data.success && data.data && data.data.isActive) {
        setAppliedCoupon(data.data)
        // Refresh draft order with coupon discount
        if (formData.phone.trim()) {
          const updated = { ...formData }
          syncDraftOrderToDatabase(formData.phone, updated)
        }
      } else {
        setCouponError('Invalid or expired coupon code')
      }
    } catch (err) {
      setCouponError('Error applying coupon')
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePlaceOrder = async () => {
    if (!formData.phone) {
      setAlertMsg('Please enter your mobile number so we can process your order.')
      setAlertType('error')
      setAlertOpen(true)
      setStep(1)
      return
    }

    setIsSubmitting(true)
    try {
      localStorage.setItem('kiswa_customer_phone', formData.phone.trim())
      const orderDbId = localStorage.getItem('checkout_order_db_id')
      let orderData

      const orderPayload = {
        customerEmail: formData.email || `${formData.phone.trim()}@customer.kiswa`,
        customerName: `${formData.firstName || 'Customer'} ${formData.lastName || ''}`.trim(),
        phone: formData.phone,
        items: items.map(item => ({
          productId: item.productId || `P-${item.id}`,
          productName: item.productName || item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal,
        discount,
        shipping: 0,
        tax: 0,
        total,
        status: 'processing', // completed checkout, processing order
        paymentMethod: 'cod',
        shippingAddress: {
          street: formData.address || 'Address provided via phone',
          city: formData.city || 'Riyadh',
          postCode: formData.postCode || '11564',
          country: formData.country,
        }
      }

      if (orderDbId) {
        const orderRes = await fetch(`/api/orders/${orderDbId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        })
        orderData = await orderRes.json()
      } else {
        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        })
        orderData = await orderRes.json()
      }
      
      if (orderData.success) {
        setPlacedOrderId(orderData.data?.orderId || localStorage.getItem('checkout_order_id') || 'KSW-ORDER')

        // 1. Mark the abandoned cart session as converted/recovered
        try {
          const sessionId = localStorage.getItem('cart_session_id')
          if (sessionId) {
            await fetch('/api/abandoned-carts', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId, status: 'converted' })
            })
            localStorage.removeItem('cart_session_id')
          }
        } catch (e) {
          console.error(e)
        }

        // 2. Clear global cart and local storage draft keys
        clearCart()
        localStorage.removeItem('checkout_order_db_id')
        localStorage.removeItem('checkout_order_id')

        await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: formData.firstName || 'Valued',
            lastName: formData.lastName || 'Customer',
            email: formData.email || `${formData.phone.trim()}@customer.kiswa`,
            phone: formData.phone,
            address: {
              street: formData.address || 'Address provided via phone',
              city: formData.city || 'Riyadh',
              postCode: formData.postCode || '11564',
              country: formData.country,
            },
            orderId: orderData.data?.orderId,
            totalSpent: total
          })
        })
      }

      setOrderPlaced(true)
    } catch (error) {
      console.error('Failed to place order', error)
      setAlertMsg('Failed to place order. Please try again.')
      setAlertType('error')
      setAlertOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addUpsellToCart = (upsell: any) => {
    setItems(prev => {
      const updated = [
        ...prev,
        {
          id: upsell._id || upsell.id,
          productId: upsell._id || upsell.id,
          productName: upsell.name?.en || upsell.name,
          price: upsell.price,
          quantity: 1,
          image: upsell.image
        }
      ]
      // Sync draft in real-time with new items
      if (formData.phone.trim()) {
        setTimeout(() => syncDraftOrderToDatabase(formData.phone, formData), 50)
      }
      return updated
    })
  }

  const steps = [
    { number: 1, label: 'Mobile & Location' },
    { number: 2, label: 'Payment Method' },
    { number: 3, label: 'Confirm Order' },
  ]

  if (orderPlaced) {
    return (
      <div className="w-full bg-white min-h-screen flex flex-col">
        <Header />
        <Confetti active={true} duration={4000} particleCount={120} intensity="full" />

        {/* Full-screen success overlay */}
        <div className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 md:p-10 text-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}
          >
            <div className="relative mx-auto mb-6 w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-20" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <PartyPopper size={22} className="text-amber-500" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#3d2e1e]">Order Confirmed!</h1>
              <PartyPopper size={22} className="text-amber-500 scale-x-[-1]" />
            </div>

            <p className="text-gray-500 text-sm mb-5">Thank you for shopping with Kiswa! 🎉</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 text-left space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Order ID</span>
                <span className="text-sm font-bold text-[#3d2e1e] font-mono">{placedOrderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Contact</span>
                <span className="text-sm font-semibold text-gray-800">{formData.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Payment</span>
                <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                  💵 Cash on Delivery
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500 font-medium">Total</span>
                <span className="text-lg font-extrabold text-[#3d2e1e]">{total.toFixed(2)} SAR</span>
              </div>
            </div>

            <p className="text-gray-500 text-xs mb-6 leading-relaxed">
              We will contact you on <span className="font-bold text-gray-800">{formData.phone}</span> via WhatsApp for delivery confirmation and live tracking updates.
            </p>

            <div className="flex flex-col gap-3">
              <a href="/profile" className="w-full py-3.5 bg-[#3d2e1e] hover:bg-[#2a1f14] text-white text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md">
                <Truck size={18} />
                Track Delivery Status
              </a>
              <a href="/" className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                <ShoppingBag size={16} />
                Continue Shopping
              </a>
            </div>
          </div>
        </div>

        <div className="flex-1" />
        <Footer />
      </div>
    )
  }

  return (
    <div className="w-full bg-white min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="px-4 md:px-8 lg:px-[76px] py-4 border-b border-gray-200 text-sm text-gray-600">
        <a href="/" className="hover:text-gray-800">Home</a>
        <span className="mx-2">/</span>
        <a href="/cart" className="hover:text-gray-800">Cart</a>
        <span className="mx-2">/</span>
        <span className="text-[#3d2e1e] font-medium">Quick Checkout</span>
      </div>

      {/* Progress Steps */}
      <div className="px-4 md:px-8 lg:px-[76px] py-8 border-b border-gray-200">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center flex-1">
              <button
                onClick={() => {
                  if (s.number > 1 && !formData.phone) {
                    setAlertMsg('Please enter your mobile number before proceeding.')
                    setAlertType('error')
                    setAlertOpen(true)
                    return
                  }
                  setStep(s.number)
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                  step >= s.number ? 'bg-[#3d2e1e] text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > s.number ? <Check size={20} /> : s.number}
              </button>
              <p className="ml-2 text-xs md:text-sm font-semibold">{s.label}</p>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 transition ${step > s.number ? 'bg-[#3d2e1e]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Checkout Container */}
      <div className="px-4 md:px-8 lg:px-[76px] py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Forms */}
          <div className="lg:col-span-2 space-y-8">
            {step === 1 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[#3d2e1e]/10 text-[#3d2e1e] rounded-xl">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Mobile & Location First</h2>
                    <p className="text-xs text-gray-500">Provide your phone number & city so our delivery driver can reach you</p>
                  </div>
                </div>

                <form className="space-y-5">
                  {/* MOBILE NUMBER (PRIMARY REQUIRED FIELD) */}
                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                    <label className="block text-xs font-bold text-[#3d2e1e] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Phone size={16} /> Mobile Number (Required) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+966 5X XXX XXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3d2e1e]"
                    />
                    <p className="text-[11px] text-gray-500 mt-1.5">
                      We will contact you on this number to confirm delivery & send WhatsApp tracking.
                    </p>
                  </div>

                  {/* LOCATION / CITY */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin size={16} /> City / Delivery Location *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3d2e1e]"
                    >
                      <option value="">Select Delivery City</option>
                      <option value="Riyadh">Riyadh (الرياض)</option>
                      <option value="Jeddah">Jeddah (جدة)</option>
                      <option value="Makkah">Makkah (مكة المكرمة)</option>
                      <option value="Madinah">Madinah (المدينة المنورة)</option>
                      <option value="Dammam">Dammam (الدمام)</option>
                      <option value="Khobar">Khobar (الخبر)</option>
                    </select>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Street / District Address (Optional)</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="e.g. Al-Malqa District, King Fahd Road"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3d2e1e]"
                    />
                  </div>

                  {/* Full Name */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">First Name (Optional)</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3d2e1e]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name (Optional)</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3d2e1e]"
                      />
                    </div>
                  </div>
                </form>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => {
                      if (!formData.phone) {
                        setAlertMsg('Please enter your mobile number before proceeding.')
                        setAlertType('error')
                        setAlertOpen(true)
                        return
                      }
                      setStep(2)
                    }}
                    className="px-8 py-3.5 bg-[#3d2e1e] hover:bg-[#2a1f14] text-white font-bold rounded-xl transition text-sm shadow-md"
                  >
                    Continue to Payment Method
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2e1e] mb-6">Select Payment Method</h2>
                <div className="space-y-4">
                  {/* Cash on Delivery (Only Option) */}
                  <label className={`flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition border-[#3d2e1e] bg-[#3d2e1e]/5`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={true}
                      readOnly
                      className="w-5 h-5 accent-[#3d2e1e] mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-extrabold text-gray-900 text-lg">Cash on Delivery</p>
                        <span className="bg-green-100 text-green-800 font-extrabold text-xs px-2.5 py-0.5 rounded flex items-center gap-1">
                          💵 COD
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">Pay in cash when your order arrives at your door. No card required.</p>
                      <div className="flex gap-2">
                        <span className="text-[10px] bg-white border px-1.5 py-0.5 rounded text-gray-500 font-semibold">Pay on delivery</span>
                        <span className="text-[10px] bg-white border px-1.5 py-0.5 rounded text-gray-500 font-semibold">Amount: {total.toFixed(2)} SAR</span>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-8 py-3.5 bg-[#3d2e1e] hover:bg-[#2a1f14] text-white font-bold rounded-xl transition text-sm shadow-md"
                  >
                    Review & Confirm Order
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2e1e] mb-6">Review & Place Order</h2>
                <div className="p-5 bg-gray-50 rounded-xl space-y-2 border border-gray-200 mb-6 text-sm">
                  <p className="text-gray-500 text-xs font-bold uppercase">Delivery Contact</p>
                  <p className="font-bold text-gray-900 text-base flex items-center gap-2"><Phone size={16}/> {formData.phone}</p>
                  <p className="text-gray-700 font-medium flex items-center gap-2"><MapPin size={16}/> {formData.city || 'Riyadh'}, {formData.address || 'Address provided via phone'}</p>
                  <p className="text-gray-600 font-semibold pt-2 border-t mt-2 flex items-center gap-2">
                    Payment: 
                    <span className="bg-green-100 text-green-800 font-extrabold text-xs px-2 py-0.5 rounded flex items-center gap-1">
                      💵 Cash on Delivery
                    </span>
                  </p>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="px-10 py-4 bg-[#3d2e1e] hover:bg-[#2a1f14] text-white font-bold text-lg rounded-xl transition shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    <Zap size={20} className="fill-current text-amber-400" />
                    {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
                  </button>
                </div>
              </div>
            )}

            {/* Upsell Section */}
            {upsellProducts.length > 0 && (
              <div className="bg-[#3d2e1e]/5 p-6 rounded-2xl border border-[#3d2e1e]/20">
                <h3 className="text-base font-bold text-[#3d2e1e] mb-3">Frequently Added Together (Special Offers)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upsellProducts.map((prod) => (
                    <div key={prod._id || prod.id} className="bg-white p-3 rounded-xl flex items-center gap-3 border border-gray-200">
                      <img src={prod.image} alt={prod.name?.en} className="w-14 h-14 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-gray-900 truncate">{prod.name?.en || prod.name}</p>
                        <p className="text-xs font-semibold text-[#3d2e1e]">{prod.price} SAR</p>
                      </div>
                      <button
                        onClick={() => addUpsellToCart(prod)}
                        className="p-2 bg-[#3d2e1e] text-white rounded-lg hover:bg-[#2a1f14]"
                        title="Add to order"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Box */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.productName} className="w-12 h-12 object-cover rounded-lg border" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.productName}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} SAR</span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="mb-6">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                  <Tag size={14} /> Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs uppercase focus:outline-none focus:border-[#3d2e1e]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#3d2e1e] text-white text-xs font-bold rounded-lg hover:bg-[#2a1f14]"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs font-semibold text-green-600 mt-1">
                    Coupon applied! ({appliedCoupon.discountValue}% off)
                  </p>
                )}
                {couponError && (
                  <p className="text-xs font-semibold text-red-600 mt-1">{couponError}</p>
                )}
              </form>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{subtotal.toFixed(2)} SAR</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount</span>
                    <span>-{discount.toFixed(2)} SAR</span>
                  </div>
                )}
                <p className="text-xs text-gray-400">All taxes & shipping included in price</p>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center font-bold text-base text-gray-900">
                  <span>Total</span>
                  <span className="text-[#3d2e1e] text-lg">{total.toFixed(2)} SAR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <AlertModal 
        isOpen={alertOpen} 
        message={alertMsg} 
        type={alertType} 
        onClose={() => setAlertOpen(false)} 
      />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
