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
  Info, 
  Plus, 
  Copy, 
  Printer, 
  Edit3, 
  Check, 
  Globe,
  Gift,
  Loader2
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

interface CampaignOffer {
  _id: string
  offerId: string
  title: string
  giftName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminOffersPage() {
  // Navigation tabs: 'claims' or 'campaigns'
  const [activeTab, setActiveTab] = useState<'claims' | 'campaigns'>('claims')

  // Claims state
  const [submissions, setSubmissions] = useState<OfferSubmission[]>([])
  const [claimsLoading, setClaimsLoading] = useState(true)
  const [claimsError, setClaimsError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  // Campaigns state
  const [campaigns, setCampaigns] = useState<CampaignOffer[]>([])
  const [campaignsLoading, setCampaignsLoading] = useState(true)
  const [campaignsError, setCampaignsError] = useState<string | null>(null)
  const [campaignSearchTerm, setCampaignSearchTerm] = useState('')

  // Modals state
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<OfferSubmission | null>(null)
  
  // Campaign QR Preview modal
  const [previewQrUrl, setPreviewQrUrl] = useState<string | null>(null)
  const [previewCampaign, setPreviewCampaign] = useState<CampaignOffer | null>(null)

  // Campaign Create/Edit Modal state
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<CampaignOffer | null>(null)
  const [campOfferId, setCampOfferId] = useState('')
  const [campTitle, setCampTitle] = useState('')
  const [campGiftName, setCampGiftName] = useState('')
  const [campIsActive, setCampIsActive] = useState(true)
  const [campaignSubmitError, setCampaignSubmitError] = useState<string | null>(null)
  const [isSubmittingCampaign, setIsSubmittingCampaign] = useState(false)

  // Clipboard copies
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Fetch submissions (Claims)
  const fetchSubmissions = async () => {
    try {
      setClaimsLoading(true)
      const res = await fetch('/api/offers')
      const data = await res.json()
      if (res.ok && data.success) {
        setSubmissions(data.data)
      } else {
        throw new Error(data.error || 'Failed to load submissions')
      }
    } catch (err: any) {
      console.error(err)
      setClaimsError(err.message)
    } finally {
      setClaimsLoading(false)
    }
  }

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      setCampaignsLoading(true)
      const res = await fetch('/api/campaigns')
      const data = await res.json()
      if (res.ok && data.success) {
        setCampaigns(data.data)
      } else {
        throw new Error(data.error || 'Failed to load campaigns')
      }
    } catch (err: any) {
      console.error(err)
      setCampaignsError(err.message)
    } finally {
      setCampaignsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchSubmissions()
    fetchCampaigns()
  }, [])

  // Claim status updates (Approve / Reject)
  const handleUpdateClaimStatus = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/offers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSubmissions(prev => prev.map(sub => 
          sub._id === id 
            ? { ...sub, status: newStatus, verifiedAt: newStatus === 'approved' ? new Date().toISOString() : undefined }
            : sub
        ))
        if (selectedSubmission?._id === id) {
          setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null)
        }
      } else {
        alert(data.error || 'Failed to update status')
      }
    } catch (err) {
      console.error(err)
      alert('Network error updating claim status')
    }
  }

  // Delete claim submission
  const handleDeleteClaim = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer claim permanently?')) return
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
      alert('Network error deleting claim')
    }
  }

  // Save Campaign (Create or Edit)
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!campOfferId || !campTitle || !campGiftName) {
      setCampaignSubmitError('Please fill in all fields.')
      return
    }

    setIsSubmittingCampaign(true)
    setCampaignSubmitError(null)

    try {
      const url = editingCampaign 
        ? `/api/campaigns/${editingCampaign._id}`
        : '/api/campaigns'
      
      const method = editingCampaign ? 'PUT' : 'POST'
      
      const payload = {
        offerId: campOfferId.toLowerCase().trim(),
        title: campTitle.trim(),
        giftName: campGiftName.trim(),
        isActive: campIsActive
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save campaign')
      }

      // Refresh campaigns list
      await fetchCampaigns()
      
      // Close modal & reset fields
      setIsCampaignModalOpen(false)
      setEditingCampaign(null)
      setCampOfferId('')
      setCampTitle('')
      setCampGiftName('')
      setCampIsActive(true)
    } catch (err: any) {
      console.error(err)
      setCampaignSubmitError(err.message || 'An error occurred while saving the campaign.')
    } finally {
      setIsSubmittingCampaign(false)
    }
  }

  // Delete Campaign
  const handleDeleteCampaign = async (id: string, offerId: string) => {
    if (!confirm(`Are you sure you want to delete the QR campaign "${offerId}"? This will not delete claims already submitted under this campaign.`)) return
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) {
        setCampaigns(prev => prev.filter(c => c._id !== id))
      } else {
        alert(data.error || 'Failed to delete campaign')
      }
    } catch (err) {
      console.error(err)
      alert('Network error deleting campaign')
    }
  }

  // Open campaign modal for edit
  const openEditCampaign = (camp: CampaignOffer) => {
    setEditingCampaign(camp)
    setCampOfferId(camp.offerId)
    setCampTitle(camp.title)
    setCampGiftName(camp.giftName)
    setCampIsActive(camp.isActive)
    setCampaignSubmitError(null)
    setIsCampaignModalOpen(true)
  }

  // Open campaign modal for create
  const openCreateCampaign = () => {
    setEditingCampaign(null)
    setCampOfferId('')
    setCampTitle('')
    setCampGiftName('')
    setCampIsActive(true)
    setCampaignSubmitError(null)
    setIsCampaignModalOpen(true)
  }

  // Helper to copy offer url to clipboard
  const handleCopyLink = (offerId: string) => {
    const origin = window.location.origin
    const url = `${origin}/offer/${offerId}`
    navigator.clipboard.writeText(url)
    setCopiedId(offerId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Helper to print QR Code
  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow || !previewCampaign) return

    const offerUrl = `${window.location.origin}/offer/${previewCampaign.offerId}`
    const qrSource = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(offerUrl)}`

    printWindow.document.write(`
      <html>
        <head>
          <title>Kiswa Campaign QR - ${previewCampaign.title}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              text-align: center;
              padding: 40px;
              color: #1a1a1a;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              border: 2px solid #8c763e;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .logo {
              height: 60px;
              margin-bottom: 20px;
            }
            h1 {
              color: #2d5f4f;
              font-size: 26px;
              margin-bottom: 5px;
            }
            p.sub {
              font-size: 14px;
              color: #666;
              margin-bottom: 30px;
            }
            img.qr {
              width: 250px;
              height: 250px;
              border: 1px solid #eee;
              padding: 10px;
              background: #fff;
              border-radius: 10px;
            }
            .url {
              margin-top: 30px;
              font-size: 12px;
              color: #8c763e;
              word-break: break-all;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>KISWA SCAN & WIN</h1>
            <p class="sub">${previewCampaign.title}<br>Prize: <strong>${previewCampaign.giftName}</strong></p>
            <img class="qr" src="${qrSource}" />
            <div class="url">${offerUrl}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Calculate statistics for claims
  const totalClaims = submissions.length
  const pendingClaims = submissions.filter(s => s.status === 'pending').length
  const approvedClaims = submissions.filter(s => s.status === 'approved').length
  const rejectedClaims = submissions.filter(s => s.status === 'rejected').length

  // Calculate statistics for campaigns
  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter(c => c.isActive).length

  // Filter claims
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.customerPhone.includes(searchTerm) ||
      sub.qrId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => {
    return (
      c.title.toLowerCase().includes(campaignSearchTerm.toLowerCase()) ||
      c.offerId.toLowerCase().includes(campaignSearchTerm.toLowerCase()) ||
      c.giftName.toLowerCase().includes(campaignSearchTerm.toLowerCase())
    )
  })

  // Format date helper
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
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Campaign Offers Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your QR campaigns, dynamic prizes, and verify customer submissions in one place.
          </p>
        </div>
        
        {/* Main Tab selector */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition ${
              activeTab === 'claims'
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Claims Verification ({pendingClaims} Pending)
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition ${
              activeTab === 'campaigns'
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            QR Campaigns ({totalCampaigns})
          </button>
        </div>
      </div>

      {/* STATS AREA */}
      {activeTab === 'claims' ? (
        /* Claims stats */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Claims</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{totalClaims}</p>
            </div>
            <div className="h-10 w-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
              <QrCode size={20} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Check</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{pendingClaims}</p>
            </div>
            <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <Info size={20} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Approved Claims</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{approvedClaims}</p>
            </div>
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rejected Claims</p>
              <p className="text-2xl font-black text-red-600 mt-1">{rejectedClaims}</p>
            </div>
            <div className="h-10 w-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
              <XCircle size={20} />
            </div>
          </div>
        </div>
      ) : (
        /* Campaigns stats */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total QR Campaigns</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{totalCampaigns}</p>
            </div>
            <div className="h-10 w-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
              <QrCode size={20} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Campaigns</p>
              <p className="text-2xl font-black text-[#2d5f4f] mt-1">{activeCampaigns}</p>
            </div>
            <div className="h-10 w-10 bg-[#2d5f4f]/10 text-[#2d5f4f] rounded-lg flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Inactive Campaigns</p>
              <p className="text-2xl font-black text-gray-400 mt-1">{totalCampaigns - activeCampaigns}</p>
            </div>
            <div className="h-10 w-10 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center">
              <XCircle size={20} />
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE TAB: CLAIMS VERIFICATION */}
      {activeTab === 'claims' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]">
          {/* Claims Toolbar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status tabs */}
            <div className="flex p-1 bg-gray-100 rounded-lg max-w-sm">
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

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, phone, QR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none text-xs bg-white focus:border-[#8c763e] focus:ring-1 focus:ring-[#8c763e] transition"
              />
            </div>
          </div>

          {/* Table */}
          {claimsLoading ? (
            <div className="p-12 text-center">
              <div className="h-8 w-8 border-4 border-gray-200 border-t-[#8c763e] rounded-full animate-spin mx-auto" />
              <p className="text-xs text-gray-500 mt-3 font-semibold">Loading claim submissions...</p>
            </div>
          ) : claimsError ? (
            <div className="p-8 text-center text-red-500">
              <p className="text-sm font-semibold">{claimsError}</p>
              <button onClick={fetchSubmissions} className="mt-3 text-xs text-[#8c763e] font-bold hover:underline">
                Try Again
              </button>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <QrCode size={40} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Submission Date</th>
                    <th className="p-4">QR Campaign ID</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Delivery Address</th>
                    <th className="p-4">Purchase Bill</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubmissions.map(sub => (
                    <tr key={sub._id} className="hover:bg-gray-50/30 transition">
                      <td className="p-4 whitespace-nowrap text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-400" />
                          {formatDate(sub.createdAt)}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 bg-[#8c763e]/10 text-[#8c763e] px-2 py-1 rounded text-[11px] font-bold border border-[#8c763e]/20">
                          <QrCode size={11} />
                          {sub.qrId}
                        </span>
                      </td>
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
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setSelectedImage(sub.billImageUrl)
                            setSelectedSubmission(sub)
                          }}
                          className="group relative h-12 w-12 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 hover:border-[#8c763e] transition"
                        >
                          <img src={sub.billImageUrl} alt="Bill preview" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                            <Eye size={14} />
                          </div>
                        </button>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {sub.status === 'pending' && <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold border border-amber-200">Pending Check</span>}
                        {sub.status === 'approved' && <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold border border-emerald-200">Approved</span>}
                        {sub.status === 'rejected' && <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-[10px] font-bold border border-red-200">Rejected</span>}
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        {sub.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleUpdateClaimStatus(sub._id, 'approved')}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-2 py-1 rounded-md transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateClaimStatus(sub._id, 'rejected')}
                              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-2 py-1 rounded-md transition"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleUpdateClaimStatus(sub._id, 'pending')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-bold px-2 py-1 rounded-md transition"
                          >
                            Reset
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClaim(sub._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-md transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE TAB: QR CAMPAIGNS (CRUD) */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]">
          {/* Campaigns Toolbar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by title, URL ID, gift..."
                value={campaignSearchTerm}
                onChange={(e) => setCampaignSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none text-xs bg-white focus:border-[#8c763e] focus:ring-1 focus:ring-[#8c763e] transition"
              />
            </div>

            {/* Create Campaign action */}
            <button
              onClick={openCreateCampaign}
              className="bg-[#2d5f4f] hover:bg-[#22483c] text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 self-start md:self-auto"
            >
              <Plus size={16} />
              Create QR Campaign
            </button>
          </div>

          {/* Table */}
          {campaignsLoading ? (
            <div className="p-12 text-center">
              <div className="h-8 w-8 border-4 border-gray-200 border-t-[#8c763e] rounded-full animate-spin mx-auto" />
              <p className="text-xs text-gray-500 mt-3 font-semibold">Loading QR campaigns...</p>
            </div>
          ) : campaignsError ? (
            <div className="p-8 text-center text-red-500">
              <p className="text-sm font-semibold">{campaignsError}</p>
              <button onClick={fetchCampaigns} className="mt-3 text-xs text-[#8c763e] font-bold hover:underline">
                Try Again
              </button>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <QrCode size={40} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold">No campaigns created yet</p>
              <p className="text-xs text-gray-500 mt-1">Create your first scan-and-win offer campaign to start.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Campaign Title</th>
                    <th className="p-4">Offer URL ID Slug</th>
                    <th className="p-4">Dynamic Gift Product</th>
                    <th className="p-4">Scan QR Code</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCampaigns.map(camp => {
                    const hostUrl = typeof window !== 'undefined' ? window.location.origin : ''
                    const offerLink = `${hostUrl}/offer/${camp.offerId}`
                    
                    return (
                      <tr key={camp._id} className="hover:bg-gray-50/30 transition">
                        {/* Title & Created Date */}
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-gray-900 block text-[13px]">{camp.title}</span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Calendar size={11} />
                              Created {formatDate(camp.createdAt)}
                            </span>
                          </div>
                        </td>

                        {/* offerId Slug & Link copy */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-gray-50 text-gray-700 px-2 py-1 rounded text-[11px] border border-gray-200 max-w-[150px] overflow-hidden text-ellipsis block">
                              /offer/{camp.offerId}
                            </span>
                            <button
                              onClick={() => handleCopyLink(camp.offerId)}
                              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 transition"
                              title="Copy full offer link to clipboard"
                            >
                              {copiedId === camp.offerId ? (
                                <Check size={14} className="text-emerald-500" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                            <a
                              href={offerLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-[#8c763e] transition"
                              title="Visit live offer page"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </td>

                        {/* Gift product */}
                        <td className="p-4 whitespace-nowrap font-bold text-gray-900">
                          <span className="inline-flex items-center gap-1 bg-[#2d5f4f]/10 text-[#2d5f4f] px-2 py-0.5 rounded text-[11px] border border-[#2d5f4f]/20">
                            <Gift size={11} />
                            {camp.giftName}
                          </span>
                        </td>

                        {/* QR Code thumbnail view */}
                        <td className="p-4">
                          <button
                            onClick={() => {
                              setPreviewQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(offerLink)}`)
                              setPreviewCampaign(camp)
                            }}
                            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 px-2.5 py-1.5 rounded-lg font-bold text-gray-700 transition"
                            title="Generate and view printable QR Code"
                          >
                            <QrCode size={13} className="text-gray-500" />
                            <span>View QR</span>
                          </button>
                        </td>

                        {/* Status */}
                        <td className="p-4 whitespace-nowrap">
                          {camp.isActive ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border border-emerald-200">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border border-gray-200">
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => openEditCampaign(camp)}
                            className="bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-300 hover:text-gray-900 p-1.5 rounded-lg transition"
                            title="Edit campaign settings"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(camp._id, camp.offerId)}
                            className="bg-red-50 hover:bg-red-100 text-red-500 border border-transparent hover:border-red-200 p-1.5 rounded-lg transition"
                            title="Delete campaign"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* MODALS */}
      {/* ---------------------------------------------------------- */}

      {/* IMAGE / CLAIMS LIGHTBOX MODAL */}
      {selectedImage && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 transition-opacity">
          <div className="absolute inset-0 cursor-default" onClick={() => { setSelectedImage(null); setSelectedSubmission(null); }} />

          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl relative w-full max-w-4xl z-10 flex flex-col md:flex-row h-[85vh] animate-[scaleUp_0.2s_ease-out]">
            {/* Left: Image */}
            <div className="flex-1 bg-neutral-900 p-4 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-gray-200">
              <img src={selectedImage} alt="Receipt" className="max-h-[50vh] md:max-h-full max-w-full object-contain" />
              <a href={selectedImage} target="_blank" rel="noreferrer" className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-lg p-2 transition flex items-center gap-1.5 text-xs font-bold backdrop-blur-md">
                Open Original
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Right: details */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-white text-gray-800">
              <div className="space-y-5 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">Claim Details</h3>
                    <p className="text-[10px] text-gray-400">ID: {selectedSubmission._id}</p>
                  </div>
                  <button onClick={() => { setSelectedImage(null); setSelectedSubmission(null); }} className="p-1 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full transition">
                    <XCircle size={20} />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">QR Campaign ID</span>
                    <p className="font-bold text-gray-900 bg-gray-50 px-2 py-1.5 border border-gray-100 rounded flex items-center gap-1.5">
                      <QrCode size={13} className="text-[#8c763e]" />
                      {selectedSubmission.qrId}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Customer Details</span>
                    <div className="bg-gray-50 p-2.5 border border-gray-100 rounded-lg space-y-1.5">
                      <p className="font-bold text-gray-900 flex items-center gap-1.5"><User size={13} /> {selectedSubmission.customerName}</p>
                      <p className="font-semibold text-gray-600 flex items-center gap-1.5"><Phone size={13} /> {selectedSubmission.customerPhone}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Shipping Destination</span>
                    <div className="bg-gray-50 p-2.5 border border-gray-100 rounded-lg space-y-1.5">
                      <p className="font-bold text-gray-800 flex items-start gap-1.5">
                        <MapPin size={13} className="shrink-0 mt-0.5 text-gray-400" />
                        <span>
                          {selectedSubmission.shippingAddress.street}<br />
                          {selectedSubmission.shippingAddress.city}{selectedSubmission.shippingAddress.postCode ? ` - ${selectedSubmission.shippingAddress.postCode}` : ''}<br />
                          <span className="font-extrabold text-gray-900">{selectedSubmission.shippingAddress.country}</span>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Current Status</span>
                    <div>
                      {selectedSubmission.status === 'pending' && <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">Pending Check</span>}
                      {selectedSubmission.status === 'approved' && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">Approved</span>}
                      {selectedSubmission.status === 'rejected' && <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200">Rejected</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                {selectedSubmission.status === 'pending' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateClaimStatus(selectedSubmission._id, 'approved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateClaimStatus(selectedSubmission._id, 'rejected')}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpdateClaimStatus(selectedSubmission._id, 'pending')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-bold py-2 px-4 rounded-xl text-xs transition"
                  >
                    Reset to Pending
                  </button>
                )}
                <button
                  onClick={() => handleDeleteClaim(selectedSubmission._id)}
                  className="w-full border border-red-200 hover:bg-red-50 text-red-600 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  <Trash2 size={13} /> Delete Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR PREVIEW MODAL */}
      {previewQrUrl && previewCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 transition-opacity">
          <div className="absolute inset-0 cursor-default" onClick={() => { setPreviewQrUrl(null); setPreviewCampaign(null); }} />
          
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full text-center relative z-10 space-y-6 shadow-2xl animate-[scaleUp_0.15s_ease-out]">
            <button 
              onClick={() => { setPreviewQrUrl(null); setPreviewCampaign(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            >
              <XCircle size={22} />
            </button>

            <div className="space-y-1 pt-2">
              <h3 className="text-lg font-bold text-gray-900">Campaign QR Code</h3>
              <p className="text-xs text-gray-500 font-medium">{previewCampaign.title}</p>
            </div>

            {/* QR display */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200/80 inline-block mx-auto">
              <img 
                src={previewQrUrl} 
                alt="QR Code" 
                className="h-44 w-44 object-contain mx-auto bg-white p-2 rounded shadow-sm border border-gray-100"
              />
            </div>

            <div className="space-y-1.5 text-xs text-left bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Campaign Prize Attached</span>
              <span className="font-bold text-gray-800 flex items-center gap-1">
                <Gift size={13} className="text-[#2d5f4f]" />
                {previewCampaign.giftName}
              </span>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handlePrintQR}
                className="bg-[#2d5f4f] hover:bg-[#22483c] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Printer size={15} />
                Print QR code
              </button>
              <button
                onClick={() => handleCopyLink(previewCampaign.offerId)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Copy size={14} />
                Copy link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE & EDIT CAMPAIGN MODAL */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 transition-opacity">
          <div className="absolute inset-0 cursor-default" onClick={() => setIsCampaignModalOpen(false)} />

          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md relative z-10 shadow-2xl animate-[scaleUp_0.15s_ease-out]">
            <button 
              onClick={() => setIsCampaignModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            >
              <XCircle size={22} />
            </button>

            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">
              {editingCampaign ? 'Edit QR Campaign' : 'Create QR Campaign'}
            </h2>

            <form onSubmit={handleSaveCampaign} className="space-y-4">
              
              {/* Campaign Slug */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Offer URL ID Slug <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono select-none">
                    /offer/
                  </span>
                  <input
                    type="text"
                    value={campOfferId}
                    onChange={(e) => setCampOfferId(e.target.value)}
                    placeholder="e.g. ramadan-mats"
                    disabled={!!editingCampaign} // Slug cannot be changed once created to avoid broken printed QR links
                    className={`w-full pl-16 pr-4 py-2.5 rounded-xl border border-gray-300 outline-none text-xs bg-gray-50 focus:bg-white focus:border-[#2d5f4f] focus:ring-1 focus:ring-[#2d5f4f] transition ${
                      editingCampaign ? 'opacity-60 cursor-not-allowed bg-gray-100 font-mono' : ''
                    }`}
                    required
                  />
                </div>
                {!editingCampaign && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    Keep it short, lowercase, and simple (e.g. letters, numbers, hyphens).
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Campaign Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  placeholder="e.g. VIP Customers Kaaba Gift"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none text-xs bg-gray-50 focus:bg-white focus:border-[#2d5f4f] focus:ring-1 focus:ring-[#2d5f4f] transition"
                  required
                />
              </div>

              {/* Gift Product attached */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Gift Product Prize <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={campGiftName}
                  onChange={(e) => setCampGiftName(e.target.value)}
                  placeholder="e.g. Premium Sponge Prayer Mat"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none text-xs bg-gray-50 focus:bg-white focus:border-[#2d5f4f] focus:ring-1 focus:ring-[#2d5f4f] transition"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  This product will dynamically render on the lottery wheel and claim details.
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="campIsActive"
                  checked={campIsActive}
                  onChange={(e) => setCampIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#2d5f4f] focus:ring-[#2d5f4f]"
                />
                <label htmlFor="campIsActive" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                  Enable Campaign immediately (Active)
                </label>
              </div>

              {campaignSubmitError && (
                <p className="text-xs text-red-500 font-semibold text-center bg-red-50 border border-red-100 py-2.5 px-3 rounded-lg">
                  {campaignSubmitError}
                </p>
              )}

              {/* Submit buttons */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 py-2.5 px-4 rounded-xl text-xs font-bold transition text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCampaign}
                  className={`py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 ${
                    isSubmittingCampaign 
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-[#2d5f4f] hover:bg-[#22483c] active:scale-95'
                  }`}
                >
                  {isSubmittingCampaign ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Campaign'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
