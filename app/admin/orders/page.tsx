'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, Search, Filter } from 'lucide-react'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    async function fetchOrders() {
      try {
        const url = statusFilter ? `/api/orders?status=${statusFilter}` : '/api/orders'
        const res = await fetch(url)
        const json = await res.json()
        if (json.success) {
          setOrders(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch orders', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [statusFilter])

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o))
    } catch (e) {
      console.error('Failed to update order status', e)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'payment_done':
        return 'bg-emerald-100 text-emerald-800'
      case 'ready_for_pickup':
        return 'bg-purple-100 text-purple-800'
      case 'office_pickup':
        return 'bg-indigo-100 text-indigo-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'processing':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            View, track, and update order fulfillment statuses (Payment Done, Ready for Pickup, Office Pickup, Shipped, Cancelled).
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3d2e1e] sm:text-sm sm:leading-6"
            placeholder="Search orders..."
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#3d2e1e] sm:text-sm sm:leading-6"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Payment</option>
            <option value="payment_done">Payment Done</option>
            <option value="processing">Processing</option>
            <option value="ready_for_pickup">Ready for Pickup</option>
            <option value="office_pickup">Office Pickup</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No orders found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer & Phone</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Manage Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                  <span>View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6">
                    {order.orderId || order._id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900">
                    <div className="font-bold">{order.customerName || 'Customer'}</div>
                    <div className="text-xs text-emerald-700 font-mono">{order.customerPhone || order.phone}</div>
                    <div className="text-xs text-gray-400">{order.customerEmail}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">Method:</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase font-sans ${
                        order.paymentMethod === 'tabby' ? 'bg-[#33ffd6] text-black border-[#26d0b0]' :
                        order.paymentMethod === 'cod' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {order.paymentMethod || 'tabby'}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-extrabold text-[#3d2e1e]">
                    SAR {order.total?.toFixed(2) || '0.00'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadge(order.status)}`}
                    >
                      <option value="pending">Pending Payment</option>
                      <option value="payment_done">Payment Done</option>
                      <option value="processing">Processing</option>
                      <option value="ready_for_pickup">Ready for Pickup</option>
                      <option value="office_pickup">Office Pickup</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link href={`/admin/orders/${order._id}`} className="text-[#3d2e1e] hover:underline font-bold text-xs inline-flex items-center gap-1">
                      <Eye size={14} /> Details
                    </Link>
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
