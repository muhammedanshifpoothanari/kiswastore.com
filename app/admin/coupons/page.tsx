'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '../layout'
import { Tag, Plus, CheckCircle2, XCircle } from 'lucide-react'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState(10)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/coupons')
      const data = await res.json()
      if (data.success) {
        setCoupons(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch coupons', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discountType,
          discountValue: Number(discountValue),
          isActive: true
        })
      })
      const data = await res.json()
      if (data.success) {
        fetchCoupons()
        setShowModal(false)
        setCode('')
      }
    } catch (err) {
      console.error('Failed to create coupon', err)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="text-[#3d2e1e]" size={26} />
              Offers & Coupon Management
            </h1>
            <p className="text-sm text-gray-500">Create and manage promo discount codes</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3d2e1e] hover:bg-[#2a1f14] text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            <Plus size={18} />
            Create Coupon
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">Loading coupons...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No coupons found.</td></tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c._id || c.code} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{c.code}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {c.discountValue} {c.discountType === 'percentage' ? '%' : 'SAR'} OFF
                    </td>
                    <td className="px-6 py-4">
                      {c.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 rounded-full border border-green-200">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-700 rounded-full border border-red-200">
                          <XCircle size={12} /> Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Coupon</h2>
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg uppercase focus:outline-none focus:border-[#3d2e1e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#3d2e1e]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (SAR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#3d2e1e]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3d2e1e] text-white rounded-lg font-semibold hover:bg-[#2a1f14]"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
