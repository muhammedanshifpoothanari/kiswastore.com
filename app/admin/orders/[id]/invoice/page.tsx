'use client'

import { useState, useEffect, use } from 'react'
import { Printer, ArrowLeft } from 'lucide-react'

export default function CustomerInvoicePage({ params }: { params: Promise<{ id: string }> }) {
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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading invoice...</div>
  if (!order) return <div className="p-8 text-center text-red-500">Order not found.</div>

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 print:p-0 print:bg-white text-gray-900 font-sans">
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <a href={`/admin/orders`} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
          <ArrowLeft size={18} /> Back to Orders
        </a>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2 bg-[#3d2e1e] text-white font-bold rounded-lg hover:bg-[#2a1f14]"
        >
          <Printer size={18} /> Print Customer Invoice
        </button>
      </div>

      {/* Printable Letterhead Document */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm print:shadow-none print:border-none print:rounded-none overflow-hidden">
        {/* Official Kiswa Letterhead Banner Header */}
        <div className="w-full">
          <img src="/kiswa-letterhead-header.jpg" alt="Unique Kiswa Trading Company Letterhead" className="w-full h-auto object-contain" />
        </div>

        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#3d2e1e]">TAX INVOICE / فاتورة ضريبية</h2>
              <p className="text-xs text-gray-500 font-mono">CR: 7025657201 • VAT: 3147466998000003</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-gray-900">INVOICE #{order.orderId}</p>
              <p className="text-xs text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-gray-500">Payment: {order.paymentMethod || 'Cash on Delivery'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Billed To / العميل:</h3>
              <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
              <p className="text-xs text-gray-700">{order.customerEmail}</p>
              <p className="text-xs text-gray-700">{order.phone}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Shipping Address / عنوان الشحن:</h3>
              <p className="text-xs text-gray-800">{order.shippingAddress?.street}</p>
              <p className="text-xs text-gray-800">{order.shippingAddress?.city}, {order.shippingAddress?.postCode}</p>
              <p className="text-xs font-semibold text-gray-900">{order.shippingAddress?.country || 'Saudi Arabia'}</p>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-xs font-bold text-gray-700 uppercase border-y border-gray-300">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Unit Price</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="py-3 px-3 font-semibold text-gray-900">{item.productName}</td>
                    <td className="py-3 px-3 text-center text-gray-700">{item.price} SAR</td>
                    <td className="py-3 px-3 text-center text-gray-900 font-bold">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} SAR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end border-t border-gray-300 pt-4 mb-8">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">{order.subtotal?.toFixed(2) || order.total?.toFixed(2)} SAR</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Discount:</span>
                  <span>-{order.discount?.toFixed(2)} SAR</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee:</span>
                <span className="font-semibold text-gray-900">{order.shipping === 0 ? 'Free' : `${order.shipping} SAR`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (15%):</span>
                <span className="font-semibold text-gray-900">{order.tax?.toFixed(2)} SAR</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#3d2e1e] border-t pt-2">
                <span>Total Paid / Due:</span>
                <span>{order.total?.toFixed(2)} SAR</span>
              </div>
            </div>
          </div>

          {/* Signature & Seal */}
          <div className="flex justify-between items-end border-t border-gray-300 pt-6 mb-4">
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-bold text-gray-800">شركة كسوة مميزة التجارية</p>
              <p>CR: <span className="font-mono font-bold text-gray-900">7025657201</span> | VAT: <span className="font-mono font-bold text-gray-900">3147466998000003</span></p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-400 font-semibold mb-1">Authorized Signature</p>
                <div className="w-32 border-b border-gray-300 h-8"></div>
              </div>
              <div>
                <img
                  src="/kiswa-company-seal.png"
                  alt="شركة كسوة مميزة التجارية - Seal Stamp"
                  className="w-36 h-auto object-contain drop-shadow-sm rotate-[-3deg] mix-blend-multiply"
                />
              </div>
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
