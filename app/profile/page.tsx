'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Package, User, Phone, ShoppingBag, Clock, CheckCircle2, Truck, MapPin, CreditCard, Warehouse, Building2, Ban, RefreshCw } from 'lucide-react'

export default function ProfilePage() {
  const [phone, setPhone] = useState('')
  const [inputPhone, setInputPhone] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  useEffect(() => {
    const savedPhone = localStorage.getItem('kiswa_customer_phone')
    if (savedPhone) {
      setPhone(savedPhone)
      setInputPhone(savedPhone)
      fetchOrders(savedPhone)
    }
  }, [])

  const fetchOrders = useCallback(async (phoneNumber: string) => {
    setLoading(true)
    try {
      const cleaned = phoneNumber.trim()
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(cleaned)}`)
      const data = await res.json()
      if (data.success) {
        setOrders(data.data || [])
      } else {
        setOrders([])
      }
      setLastRefresh(new Date())
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-refresh orders every 30 seconds to pick up admin status changes
  useEffect(() => {
    if (!phone) return
    const interval = setInterval(() => {
      fetchOrders(phone)
    }, 30000)
    return () => clearInterval(interval)
  }, [phone, fetchOrders])

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputPhone.trim()) return
    const cleaned = inputPhone.trim()
    localStorage.setItem('kiswa_customer_phone', cleaned)
    setPhone(cleaned)
    fetchOrders(cleaned)
  }

  const handleLogout = () => {
    localStorage.removeItem('kiswa_customer_phone')
    setPhone('')
    setInputPhone('')
    setOrders([])
  }

  // Fulfillment journey (payment is NOT a step — it can happen at any time)
  const fulfillmentSteps = [
    { id: 'pending', label: 'Order Placed', icon: Clock },
    { id: 'processing', label: 'Processing', icon: Package },
    { id: 'ready_for_pickup', label: 'Ready for Pickup', icon: Warehouse },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ]

  // Map any admin status to the correct fulfillment step index
  const getStepIndex = (status: string): number => {
    const directMap: Record<string, number> = {
      pending: 0,
      payment_done: 0,     // payment can happen early — still at "Order Placed" stage
      processing: 1,
      ready_for_pickup: 2,
      office_pickup: 2,    // office pickup = same stage as ready for pickup
      shipped: 3,
      delivered: 4,
    }
    return directMap[status] ?? 0
  }

  // Check if payment has been made (it's a flag, not a step)
  const isPaymentDone = (status: string) => {
    return ['payment_done', 'delivered'].includes(status)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' }
      case 'shipped': return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' }
      case 'ready_for_pickup': return { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' }
      case 'office_pickup': return { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' }
      case 'processing': return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' }
      case 'payment_done': return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' }
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' }
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Order Placed',
      payment_done: 'Payment Done',
      processing: 'Processing',
      ready_for_pickup: 'Ready for Pickup',
      office_pickup: 'Office Pickup',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    }
    return labels[status] || status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Pending'
  }

  const renderDeliveryTimeline = (status: string) => {
    if (status === 'cancelled') {
      return (
        <div className="py-4 border-t border-gray-100 mt-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
            <Ban size={24} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-700 text-sm">Order Cancelled</p>
              <p className="text-xs text-red-500">This order has been cancelled. Contact us on WhatsApp for any questions.</p>
            </div>
          </div>
        </div>
      )
    }

    const currentIdx = getStepIndex(status)
    const paid = isPaymentDone(status)

    return (
      <div className="py-4 border-t border-gray-100 mt-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
            <Truck size={14} className="text-[#3d2e1e]" /> Live Delivery Tracking
          </p>
          {/* Payment badge — separate from fulfillment flow */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
            paid
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}>
            <CreditCard size={11} />
            {paid ? '✓ Payment Done' : 'Payment Pending (COD)'}
          </span>
        </div>

        {/* Horizontal progress bar */}
        <div className="relative mb-2">
          <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 rounded-full" />
          <div
            className="absolute top-4 left-4 h-1 bg-[#3d2e1e] rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, (currentIdx / (fulfillmentSteps.length - 1)) * 100)}%`, maxWidth: 'calc(100% - 2rem)' }}
          />
        </div>

        <div className="flex justify-between items-start relative px-0 overflow-x-auto">
          {fulfillmentSteps.map((step, idx) => {
            const isPassed = idx <= currentIdx
            const isCurrent = idx === currentIdx
            const StepIcon = step.icon

            return (
              <div key={step.id} className="flex flex-col items-center flex-1 min-w-[56px]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  isCurrent
                    ? 'bg-[#3d2e1e] text-white shadow-lg ring-4 ring-[#3d2e1e]/20 scale-110'
                    : isPassed
                    ? 'bg-[#3d2e1e] text-white shadow-sm'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {isPassed ? <StepIcon size={14} /> : idx + 1}
                </div>
                <span className={`text-[9px] md:text-[10px] font-semibold mt-1.5 text-center leading-tight ${
                  isCurrent ? 'text-[#3d2e1e] font-extrabold' : isPassed ? 'text-[#3d2e1e]' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#3d2e1e]/10 text-[#3d2e1e] rounded-full flex items-center justify-center font-bold text-xl">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Account</h1>
              <p className="text-xs text-gray-500">Track delivery status & view past orders</p>
            </div>
          </div>

          {!phone ? (
            <form onSubmit={handleSavePhone} className="max-w-md bg-gray-50 p-6 rounded-xl border border-gray-200">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Enter your mobile number to view orders
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+966 5X XXX XXXX"
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#3d2e1e]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#3d2e1e] hover:bg-[#2a1f14] text-white text-sm font-bold rounded-lg transition shadow-sm"
                >
                  Lookup Orders
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#3d2e1e]/5 rounded-xl border border-[#3d2e1e]/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#3d2e1e] text-white rounded-lg">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Active Phone Number</span>
                  <span className="text-base font-extrabold text-[#3d2e1e]">{phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchOrders(phone)}
                  className="text-xs font-semibold text-[#3d2e1e] hover:text-[#2a1f14] flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-gray-200 transition"
                  disabled={loading}
                >
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 underline"
                >
                  Change Number
                </button>
              </div>
            </div>
          )}
        </div>

        {phone && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Package size={22} className="text-[#3d2e1e]" />
                Your Orders & Delivery Tracking
              </h2>
              {lastRefresh && (
                <span className="text-[10px] text-gray-400 font-medium">
                  Updated {lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </div>

            {loading && orders.length === 0 ? (
              <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-200">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#3d2e1e]" />
                Loading your orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 rounded-xl text-center border border-gray-200">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-bold text-gray-800 mb-1">No orders found</h3>
                <p className="text-xs text-gray-500 mb-6">No order records associated with {phone}.</p>
                <a href="/collections" className="px-6 py-2.5 bg-[#3d2e1e] text-white font-bold rounded-lg text-sm">
                  Start Shopping
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusColor = getStatusColor(order.status)
                  return (
                    <div key={order._id || order.orderId} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <div className="flex flex-wrap justify-between items-start gap-4 border-b border-gray-100 pb-4 mb-4">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">Order ID</span>
                          <span className="text-base font-bold text-gray-900">{order.orderId}</span>
                          <span className="text-xs text-gray-500 block mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {/* Status badge */}
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusColor.bg} ${statusColor.text}`}>
                            <span className={`w-2 h-2 rounded-full ${statusColor.dot} ${order.status !== 'delivered' && order.status !== 'cancelled' ? 'animate-pulse' : ''}`} />
                            {getStatusLabel(order.status)}
                          </span>
                          <span className="text-lg font-extrabold text-[#3d2e1e]">
                            {order.total?.toFixed(2)} SAR
                          </span>
                        </div>
                      </div>

                      {/* Order Items List */}
                      <div className="space-y-3 mb-4">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between gap-4 text-sm">
                            <div className="flex items-center gap-3">
                              <img src={item.image || '/products/prayer-mat-1.png'} alt={item.productName} className="w-12 h-12 object-cover rounded-lg border" />
                              <div>
                                <p className="font-bold text-gray-800 text-xs md:text-sm">{item.productName}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-bold text-gray-900 text-xs md:text-sm">{(item.price * item.quantity).toFixed(2)} SAR</span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Location */}
                      {order.shippingAddress && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <MapPin size={16} className="text-[#3d2e1e] flex-shrink-0" />
                          <span>Delivery to: <strong className="text-gray-900">{order.shippingAddress.city}</strong>, {order.shippingAddress.street}</span>
                        </div>
                      )}

                      {/* Delivery Timeline */}
                      {renderDeliveryTimeline(order.status)}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
