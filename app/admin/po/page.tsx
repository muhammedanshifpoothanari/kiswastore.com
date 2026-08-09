'use client'

import { useState, useEffect } from 'react'
import { FileText, Printer, Share2, Plus, Trash2, CheckCircle2 } from 'lucide-react'

export default function AdminPOPage() {
  const [poNumber, setPoNumber] = useState(`PO-${Date.now().toString().slice(-6)}`)
  const [supplierName, setSupplierName] = useState('Al-Rawda Weaving & Textiles Factory')
  const [supplierContact, setSupplierContact] = useState('+966501234567')
  const [items, setItems] = useState([
    { id: 1, name: 'Rawdat Al-Haramain Luxury Prayer Rug (Gold Trim)', sku: 'BC-984012', qty: 50, unitCost: 42.00 },
    { id: 2, name: 'Kiswa Premium Camping Tent 2P (Olive Green)', sku: 'BC-552109', qty: 20, unitCost: 950.00 },
    { id: 3, name: 'Luxury Bamboo Microfiber Ihram Set', sku: 'BC-112093', qty: 100, unitCost: 180.00 }
  ])

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: 'New Kiswa Inventory Item', sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`, qty: 10, unitCost: 50.00 }
    ])
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.unitCost), 0)

  const handleShareWhatsAppPO = () => {
    const itemManifest = items.map((it, i) => `${i + 1}. ${it.name} (SKU: ${it.sku}) - Qty: ${it.qty} @ ${it.unitCost} SAR`).join('\n')
    const message = `*OFFICIAL KISWA PURCHASE ORDER (PO)*\n\nPO Number: ${poNumber}\nSupplier: ${supplierName}\nDate: ${new Date().toLocaleDateString()}\n\n*ITEMS MANIFEST:*\n${itemManifest}\n\n*Total PO Value:* SAR ${totalAmount.toFixed(2)}\n\nCommercial Registration: 7025657201\nشركة كسوة مميزة التجارية`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-[#3d2e1e]" size={26} />
            Purchase Order (PO) Dispatch Generator
          </h1>
          <p className="text-sm text-gray-500">Create, print, and WhatsApp dispatch purchase orders to suppliers</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-xl transition"
          >
            <Printer size={16} /> Print Official PO
          </button>
          <button
            onClick={handleShareWhatsAppPO}
            className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-bold rounded-xl transition shadow-sm"
          >
            <Share2 size={16} /> Dispatch via WhatsApp
          </button>
        </div>
      </div>

      {/* Printable Purchase Order Sheet with Official Letterhead */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm print:shadow-none print:border-none print:rounded-none overflow-hidden">
        {/* Official Kiswa Letterhead Banner Header */}
        <div className="w-full">
          <img src="/kiswa-letterhead-header.jpg" alt="Unique Kiswa Trading Company Letterhead" className="w-full h-auto object-contain" />
        </div>

        <div className="p-6 md:p-10">
          <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#3d2e1e]">PURCHASE ORDER (PO) / أمر شراء توريد</h2>
              <p className="text-xs text-gray-500 font-mono">CR: 7025657201 • VAT: 3147466998000003</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#3d2e1e] text-white text-xs font-bold px-3 py-0.5 rounded mb-1">OFFICIAL PO</span>
              <p className="text-sm font-extrabold text-gray-900">{poNumber}</p>
              <p className="text-xs text-gray-500">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Supplier Info Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 print:border-none print:bg-transparent">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Supplier / Factory Name:</label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold focus:ring-[#3d2e1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Contact / Phone:</label>
              <input
                type="text"
                value={supplierContact}
                onChange={(e) => setSupplierContact(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold font-mono focus:ring-[#3d2e1e]"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-xs font-bold text-gray-700 uppercase border-y border-gray-300">
                  <th className="py-2.5 px-3">Product Description</th>
                  <th className="py-2.5 px-3">SKU / Barcode</th>
                  <th className="py-2.5 px-3 text-center">Qty Required</th>
                  <th className="py-2.5 px-3 text-right">Unit Cost (SAR)</th>
                  <th className="py-2.5 px-3 text-right">Total (SAR)</th>
                  <th className="py-2.5 px-2 text-center print:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-bold text-gray-900"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={item.sku}
                        onChange={(e) => updateItem(idx, 'sku', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-mono text-gray-600"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItem(idx, 'qty', Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-200 rounded text-xs font-bold text-center"
                      />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <input
                        type="number"
                        value={item.unitCost}
                        onChange={(e) => updateItem(idx, 'unitCost', Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-200 rounded text-xs font-bold text-right"
                      />
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-gray-900 text-sm">
                      {(item.qty * item.unitCost).toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center print:hidden">
                      <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3 print:hidden">
              <button
                onClick={addItem}
                className="flex items-center gap-1 text-xs font-bold text-[#3d2e1e] hover:underline"
              >
                <Plus size={14} /> Add Item Line
              </button>
            </div>
          </div>

          {/* Footer & Company Seal */}
          <div className="flex justify-between items-end border-t border-gray-300 pt-6 mt-8">
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">Total PO Valuation:</p>
              <p className="text-2xl font-black text-[#3d2e1e]">SAR {totalAmount.toFixed(2)}</p>
              <p className="text-[10px] text-gray-400 mt-2">Terms: Payment upon delivery & warehouse inspection</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-500 font-semibold mb-1">Authorized Procurement Signature</p>
                <div className="w-36 border-b border-gray-400 h-8"></div>
              </div>

              {/* Official Kiswa Seal */}
              <div>
                <img
                  src="/kiswa-company-seal.png"
                  alt="Kiswa Official Stamp"
                  className="w-36 h-auto object-contain mix-blend-multiply rotate-[-2deg]"
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
