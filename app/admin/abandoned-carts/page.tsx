'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, Mail } from 'lucide-react'

export default function AdminAbandonedCarts() {
  const [carts, setCarts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCarts() {
      try {
        const res = await fetch('/api/abandoned-carts')
        const json = await res.json()
        if (json.success) {
          setCarts(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch carts', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCarts()
    // Live Auto-Refresh Polling every 3 seconds
    const interval = setInterval(fetchCarts, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleStatusChange = async (sessionId: string, cartId: string, status: string) => {
    try {
      await fetch('/api/abandoned-carts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, cartId, status })
      })
      setCarts(prev => prev.map(c => (c.sessionId === sessionId || c._id === cartId) ? { ...c, status, recovered: status === 'converted' } : c))
    } catch (e) {
      console.error('Failed to update status', e)
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Abandoned Carts</h1>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Dynamic Stream
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-700">
            Real-time live monitoring of abandoned carts, customer addresses & status controls.
          </p>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading live carts...</div>
        ) : carts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No abandoned carts found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer Info & Location</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Items</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Value</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                  <span>Actions & Status Control</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {carts.map((cart) => (
                <tr key={cart._id || cart.sessionId} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs text-gray-500 sm:pl-6">
                    {new Date(cart.abandonedAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900">
                    <div className="font-bold text-gray-900">{cart.customerName || cart.phone || 'Visitor Lead'}</div>
                    <div className="text-xs text-gray-600 font-mono mt-0.5">
                      {cart.phone && <span className="text-emerald-700 font-bold">{cart.phone}</span>}
                      {cart.phone && cart.customerEmail && ' • '}
                      {cart.customerEmail}
                    </div>
                    {(cart.city || cart.address) && (
                      <div className="text-[11px] text-gray-500 mt-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 w-fit">
                        📍 {cart.city} {cart.address ? `- ${cart.address}` : ''}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1 font-semibold">
                      <ShoppingCart className="h-4 w-4 text-gray-400" />
                      {cart.items?.length || 0} items
                    </div>
                    {cart.items && cart.items.length > 0 && (
                      <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                        {cart.items.map((i: any) => typeof i.productName === 'string' ? i.productName : i.name).filter(Boolean).join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-extrabold text-[#3d2e1e]">
                    SAR {cart.totalValue?.toFixed(2) || '0.00'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {cart.status === 'converted' || cart.recovered ? (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        Converted to Order
                      </span>
                    ) : cart.status === 'contacted' ? (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        Contacted
                      </span>
                    ) : cart.status === 'cancelled' ? (
                      <span className="inline-flex items-center rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-inset ring-rose-600/20">
                        Cancelled
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-inset ring-amber-600/20">
                        Abandoned
                      </span>
                    )}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {cart.phone && (
                        <a
                          href={`https://wa.me/${cart.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام عليكم، نسكي تسعد بخدمتك! لاحظنا وجود منتجات في سلتك بقيمة ${cart.totalValue} SAR. هل تحتاج مساعدة لإكمال طلبك؟`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm transition"
                        >
                          WhatsApp
                        </a>
                      )}

                      {/* Status Management Dropdown / Quick Buttons */}
                      <button
                        onClick={() => handleStatusChange(cart.sessionId, cart._id, 'converted')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2 py-1 rounded-lg transition"
                        title="Mark as Converted"
                      >
                        Converted
                      </button>
                      <button
                        onClick={() => handleStatusChange(cart.sessionId, cart._id, 'contacted')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-2 py-1 rounded-lg transition"
                        title="Mark as Contacted"
                      >
                        Contacted
                      </button>
                      <button
                        onClick={() => handleStatusChange(cart.sessionId, cart._id, 'cancelled')}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-2 py-1 rounded-lg transition"
                        title="Mark as Cancelled"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
