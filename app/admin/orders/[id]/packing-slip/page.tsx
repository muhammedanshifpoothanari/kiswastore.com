'use client'

import { useState, useEffect, use } from 'react'
import { Printer, ArrowLeft } from 'lucide-react'

export default function PackingSlipPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/orders/${resolvedParams.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrder(data.data)
        }
      })
      .finally(() => setLoading(false))
  }, [resolvedParams.id])

  if (loading) return <div className="p-8 text-center text-gray-500">Loading packing slip...</div>
  if (!order) return <div className="p-8 text-center text-red-500">Order not found.</div>

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 print:p-0 print:bg-white text-gray-900 font-sans">
      {/* Top action bar (hidden during print) */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <a href={`/admin/orders`} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
          <ArrowLeft size={18} /> Back to Orders
        </a>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2 bg-[#3d2e1e] text-white font-bold rounded-lg hover:bg-[#2a1f14]"
        >
          <Printer size={18} /> Print Packing Slip
        </button>
      </div>

      {/* Printable Sheet */}
      {/* Printable Letterhead Packing Sheet */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm print:shadow-none print:border-none print:rounded-none overflow-hidden">
        {/* Official Kiswa Letterhead Banner Header */}
        <div className="w-full">
          <img src="/kiswa-letterhead-header.jpg" alt="Unique Kiswa Trading Company Letterhead" className="w-full h-auto object-contain" />
        </div>

        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#3d2e1e]">WAREHOUSE PACKING SLIP / قائمة التعبئة</h2>
              <p className="text-xs text-gray-500 font-mono">CR: 7025657201 • VAT: 3147466998000003</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-gray-900">ORDER #{order.orderId}</p>
              <p className="text-xs text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Deliver To / العميل:</h3>
              <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
              <p className="text-xs text-gray-700">{order.customerEmail}</p>
              <p className="text-xs font-semibold text-[#3d2e1e] mt-1">{order.phone}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Shipping Address / عنوان التسليم:</h3>
              <p className="text-xs text-gray-800">{order.shippingAddress?.street}</p>
              <p className="text-xs text-gray-800">{order.shippingAddress?.city}, {order.shippingAddress?.postCode}</p>
              <p className="text-xs font-semibold text-gray-900">{order.shippingAddress?.country || 'Saudi Arabia'}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Package Contents Manifest</h2>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-xs font-bold text-gray-700 uppercase border-y border-gray-300">
                  <th className="py-2.5 px-3">Item #</th>
                  <th className="py-2.5 px-3">Product Description</th>
                  <th className="py-2.5 px-3 text-center">SKU / ID</th>
                  <th className="py-2.5 px-3 text-center">Qty Picked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="py-3 px-3 text-xs text-gray-500">{index + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-gray-900 text-sm">{item.productName}</p>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-xs text-gray-600">{item.productId}</td>
                    <td className="py-3 px-3 text-center font-bold text-base text-gray-900">
                      <span className="inline-block px-3 py-0.5 bg-gray-100 rounded border border-gray-300">
                        {item.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-300 pt-6 mb-4 grid grid-cols-3 gap-6 text-xs text-gray-500 items-end">
            <div>
              <p className="font-bold text-gray-700 mb-2">Quality Control Inspection:</p>
              <div className="space-y-1 text-[11px]">
                <p>[ ✓ ] Items verified against order</p>
                <p>[ ✓ ] No fabric defect / quality inspection</p>
                <p>[ ✓ ] Luxury Kiswa packaging sleeve included</p>
              </div>
            </div>

            <div className="text-center">
              <p className="font-bold text-gray-700 mb-1">Packed & Inspected By:</p>
              <p className="border-b border-gray-400 w-32 mx-auto mt-6"></p>
              <p className="text-[10px] text-gray-400 mt-1">Signature & Date</p>
            </div>

            <div className="text-right flex flex-col items-end">
              <p className="text-[10px] font-bold text-gray-800 mb-1">شركة كسوة مميزة التجارية</p>
              <img
                src="/kiswa-company-seal.png"
                alt="Kiswa Official Stamp"
                className="w-32 h-auto object-contain mix-blend-multiply rotate-[-2deg]"
              />
            </div>
          </div>
        </div>

        {/* Official Kiswa Letterhead Banner Footer */}
        <div className="w-full">
          <img src="/kiswa-letterhead-footer.jpg" alt="Jeddah Kingdom of Saudi Arabia Address Footer" className="w-full h-auto object-contain" />
        </div>
      </div>
    </div>
  )
}
