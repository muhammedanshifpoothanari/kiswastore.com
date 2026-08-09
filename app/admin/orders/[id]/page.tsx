'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Printer, FileText, Share2 } from 'lucide-react'

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${resolvedParams.id}`)
        const json = await res.json()
        if (json.success) {
          setOrder(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch order', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [resolvedParams.id])

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/orders/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const json = await res.json()
      if (json.success) {
        setOrder({ ...order, status: newStatus })
      }
    } catch (error) {
      console.error('Failed to update order status', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleShareWhatsAppPO = () => {
    if (!order) return
    const itemsList = order.items?.map((item: any, i: number) => `${i + 1}. ${item.productName} (Qty: ${item.quantity})`).join('\n')
    const message = `*WAREHOUSE PO FULFILLMENT REQUEST*\n\nOrder ID: ${order.orderId}\nCustomer: ${order.customerName} (${order.phone || 'No phone'})\nDestination: ${order.shippingAddress?.city}, ${order.shippingAddress?.street}\n\n*ITEMS TO PACK:*\n${itemsList}\n\nPlease prepare and confirm dispatch.`
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading order details...</div>
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">Order not found</h2>
        <Link href="/admin/orders" className="text-[#3d2e1e] hover:underline">Return to orders list</Link>
      </div>
    )
  }

  const isCancelled = order.status === 'cancelled' || order.status === 'refunded'

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <Link href="/admin/orders" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Link>
      </div>

      <div className="md:flex md:items-center md:justify-between pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            Order {order.orderId}
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${
              order.status === 'delivered' ? 'bg-green-50 text-green-700 ring-green-600/20' :
              order.status === 'shipped' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
              isCancelled ? 'bg-red-50 text-red-700 ring-red-600/20' :
              'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
            }`}>
              {order.status.toUpperCase()}
            </span>
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <select 
            className="rounded-lg border-gray-300 text-sm font-semibold py-2 px-3 focus:ring-[#3d2e1e] border"
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updating}
          >
            <option value="pending">Pending Payment</option>
            <option value="payment_done">Payment Done</option>
            <option value="processing">Processing</option>
            <option value="ready_for_pickup">Ready for Pickup</option>
            <option value="office_pickup">Office Pickup</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          <Link
            href={`/admin/orders/${order._id || order.orderId}/packing-slip`}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition"
          >
            <Printer size={16} /> Packing Slip
          </Link>

          <Link
            href={`/admin/orders/${order._id || order.orderId}/invoice`}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition"
          >
            <FileText size={16} /> Invoice
          </Link>

          <button
            onClick={handleShareWhatsAppPO}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition"
          >
            <Share2 size={16} /> WhatsApp PO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase">Order Items</h3>
            </div>
            <ul role="list" className="divide-y divide-gray-100">
              {order.items?.map((item: any, idx: number) => (
                <li key={idx} className="p-6 flex items-center gap-4">
                  <img src={item.image} alt={item.productName} className="h-16 w-16 object-cover rounded-lg border bg-gray-50" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{item.productName}</h4>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">Product ID: {item.productId}</p>
                    <p className="text-xs text-gray-600 mt-1">Qty {item.quantity} × {item.price} SAR</p>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{(item.price * item.quantity).toFixed(2)} SAR</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 px-6 py-4 space-y-2 text-sm bg-gray-50/50">
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{order.subtotal?.toFixed(2) || order.total?.toFixed(2)} SAR</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">{order.shipping === 0 ? 'Free' : `${order.shipping} SAR`}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Tax (15%)</span>
                <span className="font-semibold text-gray-900">{order.tax?.toFixed(2)} SAR</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-2">
                <span>Total</span>
                <span className="text-[#3d2e1e]">{order.total?.toFixed(2)} SAR</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Payment Details */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase">Payment Details</h3>
            </div>
            <div className="px-6 py-4 space-y-4 text-xs text-gray-700">
              <div>
                <span className="text-gray-400 block uppercase font-semibold text-[10px] mb-1.5">Payment Method</span>
                <select
                  value={order.paymentMethod || 'tabby'}
                  onChange={async (e) => {
                    const val = e.target.value
                    setUpdating(true)
                    try {
                      const res = await fetch(`/api/orders/${resolvedParams.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ paymentMethod: val })
                      })
                      const json = await res.json()
                      if (json.success) {
                        setOrder((prev: any) => ({ ...prev, paymentMethod: val }))
                      }
                    } catch (e) {
                      console.error(e)
                    } finally {
                      setUpdating(false)
                    }
                  }}
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:ring-[#3d2e1e] border-gray-300 font-semibold"
                  disabled={updating}
                >
                  <option value="tabby">Tabby (Installments)</option>
                  <option value="cod">Cash on Delivery (COD)</option>
                  <option value="card">Credit Card / Mada</option>
                </select>
              </div>

              <div>
                <span className="text-gray-400 block uppercase font-semibold text-[10px] mb-1">Payment Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    order.status === 'payment_done' || order.status === 'delivered'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {order.status === 'payment_done' || order.status === 'delivered' ? '✓ Payment Received' : '⏳ Payment Pending'}
                  </span>
                  
                  {(order.status !== 'payment_done' && order.status !== 'delivered') && (
                    <button
                      onClick={() => updateStatus('payment_done')}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[11px] font-bold"
                      disabled={updating}
                    >
                      Mark Received
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase">Customer Details</h3>
            </div>
            <div className="px-6 py-4 space-y-3 text-xs text-gray-700">
              <div>
                <span className="text-gray-400 block uppercase font-semibold text-[10px]">Customer Name</span>
                <span className="font-bold text-gray-900 text-sm">{order.customerName}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-semibold text-[10px]">Email</span>
                <span className="font-semibold text-blue-600">{order.customerEmail}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-semibold text-[10px]">Phone</span>
                <span className="font-bold text-[#3d2e1e] text-sm">{order.phone || 'N/A'}</span>
              </div>
              {order.shippingAddress && (
                <div className="pt-2 border-t">
                  <span className="text-gray-400 block uppercase font-semibold text-[10px]">Shipping Address</span>
                  <p className="font-semibold text-gray-800 mt-1">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.postCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
