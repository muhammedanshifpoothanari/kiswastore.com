'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Eye, 
  Search, 
  ExternalLink, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  QrCode, 
  Info 
} from 'lucide-react'

interface ShippingAddress {
  street: string
  city: string
  state?: string
  postCode?: string
  country: string
}

interface OfferSubmission {
  _id: string
  qrId: string
  billImageUrl: string
  customerName: string
  customerPhone: string
  shippingAddress: ShippingAddress
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  verifiedAt?: string
}

export default function AdminOffersPage() {
  const [submissions, setSubmissions] = useState<OfferSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  
  // Lightbox Modal state
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<OfferSubmission | null>(null)

  // Fetch submissions from API
  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/offers')
      const data = await res.json()
      if (res.ok && data.success) {
        setSubmissions(data.data)
      } else {
        throw new Error(data.error || 'Failed to load submissions')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  // Update status (Approve / Reject)
  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/offers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        // Update local state
        setSubmissions(prev => prev.map(sub => 
          sub._id === id 
            ? { ...sub, status: newStatus, verifiedAt: newStatus === 'approved' ? new Date().toISOString() : undefined }
            : sub
        ))
        
        // Update active modal submission status if it is open
        if (selectedSubmission?._id === id) {
          setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null)
        }
      } else {
        alert(data.error || 'Failed to update status')
      }
    } catch (err) {
      console.error(err)
      alert('Network error updating status')
    }
  }

  // Delete submission
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this claim submission permanently?')) return

    try {
      const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) {
        setSubmissions(prev => prev.filter(sub => sub._id !== id))
        if (selectedSubmission?._id === id) {
          setSelectedSubmission(null)
          setSelectedImage(null)
        }
      } else {
        alert(data.error || 'Failed to delete submission')
      }
    } catch (err) {
      console.error(err)
      alert('Network error deleting submission')
    }
  }

  // Calculate statistics
  const totalCount = submissions.length
  const pendingCount = submissions.filter(s => s.status === 'pending').length
  const approvedCount = submissions.filter(s => s.status === 'approved').length
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length

  // Filter and search submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.customerPhone.includes(searchTerm) ||
      sub.qrId.toLowerCase().includes(searchTerm.toLowerCase())
      
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Helper to format Date
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Scan &amp; Win Offer Claims
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Verify submitted purchase bills and approve deliveries of the Sponge Prayer Mat gifts.
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
          className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg shadow-sm transition"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Claims</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
            <QrCode size={20} />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Check</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
            <Info size={20} />
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Approved &amp; Shipped</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rejected Claims</p>
            <p className="text-2xl font-black text-red-600 mt-1">{rejectedCount}</p>
          </div>
          <div className="h-10 w-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {/* Main filters & list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 lg:border-none p-1 bg-gray-100 rounded-lg max-w-sm">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${
                  statusFilter === tab 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by customer name, phone, QR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none text-xs bg-white focus:border-[#8c763e] focus:ring-1 focus:ring-[#8c763e] transition"
            />
          </div>
        </div>

        {/* Content table */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="h-8 w-8 border-4 border-gray-200 border-t-[#8c763e] rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-500 mt-3 font-semibold">Loading claim submissions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p className="text-sm font-semibold">{error}</p>
            <button 
              onClick={fetchSubmissions}
              className="mt-3 text-xs text-[#8c763e] font-bold hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <QrCode size={40} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold">No submissions found</p>
            <p className="text-xs text-gray-500 mt-1">Try resetting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">QR ID</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Delivery Address</th>
                  <th className="p-4">Purchase Bill</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map(sub => (
                  <tr key={sub._id} className="hover:bg-gray-50/50 transition">
                    {/* Date */}
                    <td className="p-4 whitespace-nowrap text-gray-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(sub.createdAt)}
                      </div>
                    </td>

                    {/* QR ID */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 bg-[#8c763e]/10 text-[#8c763e] px-2 py-1 rounded text-[11px] font-bold border border-[#8c763e]/20">
                        <QrCode size={11} />
                        {sub.qrId}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900">
                          <User size={13} className="text-gray-400" />
                          {sub.customerName}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Phone size={13} className="text-gray-400" />
                          {sub.customerPhone}
                        </div>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="p-4 max-w-xs">
                      <div className="flex items-start gap-1 text-gray-600">
                        <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">{sub.shippingAddress.street}</p>
                          <p className="text-[11px] text-gray-500">
                            {sub.shippingAddress.city}
                            {sub.shippingAddress.postCode ? `, ${sub.shippingAddress.postCode}` : ''}
                            {`, ${sub.shippingAddress.country}`}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Bill Preview */}
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedImage(sub.billImageUrl)
                          setSelectedSubmission(sub)
                        }}
                        className="group relative h-12 w-12 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 hover:border-[#8c763e] transition"
                        title="Click to view full bill receipt"
                      >
                        <img 
                          src={sub.billImageUrl} 
                          alt="Bill thumbnail" 
                          className="h-full w-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                          <Eye size={14} />
                        </div>
                      </button>
                    </td>

                    {/* Status */}
                    <td className="p-4 whitespace-nowrap">
                      {sub.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border border-amber-200">
                          Pending Check
                        </span>
                      )}
                      {sub.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border border-emerald-200">
                          Approved
                        </span>
                      )}
                      {sub.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border border-red-200">
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      {sub.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(sub._id, 'approved')}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-2 py-1.5 rounded-lg shadow-xs transition active:scale-95"
                            title="Verify and Approve delivery"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(sub._id, 'rejected')}
                            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-2 py-1.5 rounded-lg shadow-xs transition active:scale-95"
                            title="Reject Claim"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {sub.status !== 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(sub._id, 'pending')}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-bold px-2 py-1.5 rounded-lg shadow-xs transition"
                          title="Reset to pending status"
                        >
                          Reset Status
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 border border-transparent hover:border-red-200 hover:bg-red-50 rounded-lg transition"
                        title="Delete Claim permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lightbox / Verification Modal */}
      {selectedImage && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 transition-opacity">
          {/* Close Backdrop click */}
          <div className="absolute inset-0 cursor-default" onClick={() => { setSelectedImage(null); setSelectedSubmission(null); }} />

          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl relative w-full max-w-4xl z-10 flex flex-col md:flex-row h-[85vh]">
            {/* Left Column: Image viewer */}
            <div className="flex-1 bg-neutral-900 p-4 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-gray-200">
              <img
                src={selectedImage}
                alt="Verification receipt"
                className="max-h-[50vh] md:max-h-full max-w-full object-contain filter drop-shadow-lg"
              />
              <a 
                href={selectedImage} 
                target="_blank" 
                rel="noreferrer" 
                className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-lg p-2 transition flex items-center gap-1.5 text-xs font-bold backdrop-blur-md"
              >
                Open Original
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Right Column: Submission Info & Verification Actions */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-white text-gray-800">
              <div className="space-y-5 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">Claim Details</h3>
                    <p className="text-[10px] text-gray-500">ID: {selectedSubmission._id}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedImage(null); setSelectedSubmission(null); }}
                    className="p-1 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full transition"
                  >
                    <XCircle size={20} />
                  </button>
                </div>

                {/* Info Card */}
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Scanned QR Code</span>
                    <p className="font-bold text-gray-900 bg-gray-50 px-2 py-1.5 border border-gray-100 rounded flex items-center gap-1.5">
                      <QrCode size={13} className="text-[#8c763e]" />
                      {selectedSubmission.qrId}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Customer Details</span>
                    <div className="bg-gray-50 p-2.5 border border-gray-100 rounded-lg space-y-1.5">
                      <p className="font-bold text-gray-900 flex items-center gap-1.5">
                        <User size={13} className="text-gray-400" />
                        {selectedSubmission.customerName}
                      </p>
                      <p className="font-semibold text-gray-600 flex items-center gap-1.5">
                        <Phone size={13} className="text-gray-400" />
                        {selectedSubmission.customerPhone}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Shipping Destination</span>
                    <div className="bg-gray-50 p-2.5 border border-gray-100 rounded-lg space-y-1.5">
                      <p className="font-bold text-gray-800 flex items-start gap-1.5">
                        <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
                        <span>
                          {selectedSubmission.shippingAddress.street}
                          <br />
                          {selectedSubmission.shippingAddress.city}
                          {selectedSubmission.shippingAddress.postCode ? ` - ${selectedSubmission.shippingAddress.postCode}` : ''}
                          <br />
                          <span className="font-extrabold text-gray-900">{selectedSubmission.shippingAddress.country}</span>
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Current Status</span>
                    <div>
                      {selectedSubmission.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                          Pending Check
                        </span>
                      )}
                      {selectedSubmission.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                          Approved
                        </span>
                      )}
                      {selectedSubmission.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions at bottom */}
              <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                {selectedSubmission.status === 'pending' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedSubmission._id, 'approved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition active:scale-98"
                    >
                      Approve Claim
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedSubmission._id, 'rejected')}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition active:scale-98"
                    >
                      Reject Claim
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(selectedSubmission._id, 'pending')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-bold py-2.5 px-4 rounded-xl text-xs transition"
                  >
                    Reset Status to Pending
                  </button>
                )}

                <button
                  onClick={() => {
                    handleDelete(selectedSubmission._id)
                  }}
                  className="w-full border border-red-200 hover:bg-red-50 text-red-600 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={13} />
                  Delete Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
