'use client'

import { useEffect, useState } from 'react'
import { MousePointerClick, TrendingUp, Search } from 'lucide-react'

export default function AdminAnalytics() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/button-clicks')
        const json = await res.json()
        if (json.success) {
          setEvents(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch events', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Aggregate event data
  const actionCounts = events.reduce((acc, curr) => {
    acc[curr.action] = (acc[curr.action] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topProducts = events
    .filter(e => e.productId && e.action === 'add_to_cart')
    .reduce((acc, curr) => {
      acc[curr.productId] = (acc[curr.productId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const sortedProducts = Object.entries(topProducts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Events</h1>
        <p className="mt-2 text-sm text-gray-700">
          Track user interactions, button clicks, and popular products.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8c763e]"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Level Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <MousePointerClick className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-gray-900">Total Tracked Events</h3>
              </div>
              <p className="text-3xl font-bold">{events.length}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="h-5 w-5 text-green-500" />
                <h3 className="font-medium text-gray-900">Add to Carts</h3>
              </div>
              <p className="text-3xl font-bold">{actionCounts['add_to_cart'] || 0}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium text-gray-900">Product Views</h3>
              </div>
              <p className="text-3xl font-bold">{actionCounts['view_product'] || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Products Added to Cart */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  Top Products (Add to Cart)
                </h3>
              </div>
              {sortedProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No product data yet.</div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {sortedProducts.map(([productId, count]) => (
                    <li key={productId} className="px-6 py-4 flex justify-between items-center">
                      <span className="font-medium text-gray-900">{productId}</span>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {count} times
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Recent Event Log */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  Recent Event Log
                </h3>
              </div>
              {events.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No events logged yet.</div>
              ) : (
                <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {events.slice(0, 20).map((event) => (
                    <li key={event._id} className="px-6 py-4 text-sm hover:bg-gray-50/50 transition">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-[#3d2e1e] uppercase text-xs tracking-wider">
                          {event.action?.replace(/_/g, ' ') || 'click'}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {new Date(event.timestamp || event.createdAt || Date.now()).toLocaleString()}
                        </span>
                      </div>
                      {(event.productId || event.categoryId) && (
                        <p className="text-xs text-gray-600 font-semibold mb-1">
                          Target: {event.productId || event.categoryId}
                        </p>
                      )}
                      {/* Detailed Metadata / Customer details */}
                      {event.metadata && (
                        <div className="mt-2 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono text-gray-600 overflow-x-auto whitespace-pre-wrap max-h-32">
                          <span className="text-[9px] font-bold text-gray-400 block uppercase mb-1">More Details:</span>
                          {typeof event.metadata === 'object' 
                            ? Object.entries(event.metadata).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n')
                            : String(event.metadata)}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Quick hack to reuse icons from lucide-react in the file
import { ShoppingCart, Eye } from 'lucide-react'
