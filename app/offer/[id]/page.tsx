'use client'

import React, { use, useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Confetti from '@/components/Confetti'
import { Upload, CheckCircle2, Gift, MapPin, Phone, User, ChevronRight, HelpCircle, AlertTriangle, Loader2 } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

interface CampaignOffer {
  offerId: string
  title: string
  giftName: string
  isActive: boolean
}

export default function OfferPage({ params }: PageProps) {
  // Unwrap the params promise using React.use
  const resolvedParams = use(params)
  const qrId = resolvedParams?.id || 'default-qr'

  // Campaign loading states
  const [campaign, setCampaign] = useState<CampaignOffer | null>(null)
  const [campaignLoading, setCampaignLoading] = useState(true)
  const [campaignError, setCampaignError] = useState<string | null>(null)

  // Step state: 'upload' -> 'lottery' -> 'details' -> 'success'
  const [step, setStep] = useState<'upload' | 'lottery' | 'details' | 'success'>('upload')
  
  // File Upload states
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string>('')
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Lottery states
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [showWinMessage, setShowWinMessage] = useState(false)
  const [triggerConfetti, setTriggerConfetti] = useState(false)

  // Delivery details states
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [postCode, setPostCode] = useState('')
  const [country, setCountry] = useState('Saudi Arabia')
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Fetch campaign config on mount
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setCampaignLoading(true)
        const response = await fetch(`/api/campaigns/${qrId}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'This offer campaign does not exist.')
        }

        const config = data.data as CampaignOffer
        if (!config.isActive) {
          throw new Error('This campaign offer has ended or is temporarily inactive.')
        }

        setCampaign(config)
      } catch (err: any) {
        console.error(err)
        setCampaignError(err.message || 'Failed to load campaign settings.')
      } finally {
        setCampaignLoading(false)
      }
    }

    if (qrId) {
      fetchCampaign()
    }
  }, [qrId])

  // Clean up preview url when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    const selected = e.target.files?.[0]
    if (!selected) return

    // Limit file size to 8MB
    if (selected.size > 8 * 1024 * 1024) {
      setUploadError('File size exceeds 8MB limit. Please upload a smaller image.')
      return
    }

    setFile(selected)
    const url = URL.createObjectURL(selected)
    setPreviewUrl(url)
  }

  // Handle bill upload
  const handleUploadBill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setUploadError('Please select a receipt image first.')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/offers/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload receipt.')
      }

      setUploadedUrl(data.url)
      // Save phone number in localStorage if it exists
      const savedPhone = localStorage.getItem('kiswa_customer_phone')
      if (savedPhone) setPhone(savedPhone)

      // Automatically advance to lottery screen after successful upload
      setStep('lottery')
    } catch (err: any) {
      console.error(err)
      setUploadError(err.message || 'An error occurred during upload. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  // Lottery sectors definition (winning prize is dynamically inserted at index 3)
  const sectors = [
    { label: 'Velvet Gift Box', color: '#111827' },   // Dark gray
    { label: 'Kiswa Perfume Oil', color: '#b59d5b' }, // Soft Gold
    { label: 'Premium Tasbih', color: '#3d2e1e' },    // Brand Brown
    { label: `${campaign?.giftName || 'Sponge Prayer Mat'} 🎁`, color: '#2d5f4f' }, // Brand Teal (Winner!)
    { label: 'Kaaba Frame', color: '#8c763e' },       // Brand Gold
    { label: 'Travel Ihram', color: '#78350f' },      // Brand Orange/Amber
  ]

  // Spin Wheel function
  const handleSpinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setShowWinMessage(false)

    // Calculate rotation to land inside sector 3 (winning prize)
    // Sector 3 spans 120 to 180 degrees rotationally. Center is 150.
    // Adding a slight random offset (between -12 and +12) makes it land organically off-center!
    const totalSpins = 6
    const randomOffset = Math.floor(Math.random() * 24) - 12
    const targetRotation = 360 * totalSpins + 150 + randomOffset
    setRotation(targetRotation)

    setTimeout(() => {
      setIsSpinning(false)
      setShowWinMessage(true)
      setTriggerConfetti(true)
      
      // Stop confetti after 5 seconds
      setTimeout(() => setTriggerConfetti(false), 5000)
    }, 5000) // matches transition duration (5s)
  }

  // Handle shipping details submit
  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone || !street || !city || !country) {
      setSubmitError('Please fill in all required fields.')
      return
    }

    setIsSubmittingDetails(true)
    setSubmitError(null)

    try {
      const submissionData = {
        qrId,
        billImageUrl: uploadedUrl,
        customerName: name,
        customerPhone: phone,
        shippingAddress: {
          street,
          city,
          postCode,
          country,
        }
      }

      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit details.')
      }

      // Store phone in localStorage to pre-fill on future visits
      localStorage.setItem('kiswa_customer_phone', phone)

      setStep('success')
    } catch (err: any) {
      console.error(err)
      setSubmitError(err.message || 'Failed to save delivery details. Please try again.')
    } finally {
      setIsSubmittingDetails(false)
    }
  }

  // SVG slice generator for spinning wheel
  const renderWheelSlices = () => {
    return sectors.map((sector, index) => {
      const angle = 60
      const startAngle = index * angle
      const endAngle = (index + 1) * angle
      
      const radStart = (startAngle - 90) * Math.PI / 180
      const radEnd = (endAngle - 90) * Math.PI / 180
      
      const x1 = 100 + 90 * Math.cos(radStart)
      const y1 = 100 + 90 * Math.sin(radStart)
      const x2 = 100 + 90 * Math.cos(radEnd)
      const y2 = 100 + 90 * Math.sin(radEnd)
      
      const pathData = `
        M 100 100
        L ${x1} ${y1}
        A 90 90 0 0 1 ${x2} ${y2}
        Z
      `
      
      const textAngle = startAngle + angle / 2 - 90
      const textRad = textAngle * Math.PI / 180
      const tx = 100 + 55 * Math.cos(textRad)
      const ty = 100 + 55 * Math.sin(textRad)
      
      return (
        <g key={index}>
          <path d={pathData} fill={sector.color} stroke="#ffffff" strokeWidth="0.8" />
          <text
            x={tx}
            y={ty}
            fill="#ffffff"
            fontSize="7.5"
            fontWeight="900"
            textAnchor="middle"
            transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
          >
            {sector.label}
          </text>
        </g>
      )
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 animate-[fadeIn_0.3s_ease-out]">
      <Header />
      <Confetti active={triggerConfetti} />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8 md:py-12 flex flex-col justify-center">
        
        {/* Loading Configuration Screen */}
        {campaignLoading && (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-xl max-w-2xl mx-auto w-full flex flex-col items-center justify-center p-8">
            <Loader2 className="h-10 w-10 text-[#8c763e] animate-spin" />
            <p className="text-sm font-semibold text-gray-600 mt-4">Verifying dynamic offer settings...</p>
          </div>
        )}

        {/* Error Campaign Screen */}
        {!campaignLoading && campaignError && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto w-full p-8 text-center space-y-6">
            <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-red-700">Campaign Not Available</h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                {campaignError}
              </p>
            </div>

            <div className="h-px bg-gray-100 my-6" />

            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Visit Kiswa Store
              </p>
              <div className="flex justify-center gap-3">
                <Link 
                  href="/" 
                  className="px-6 py-3 bg-[#2d5f4f] hover:bg-[#22483c] border border-transparent rounded-xl text-xs font-bold text-white shadow-sm transition"
                >
                  Go to Home Store
                </Link>
                <Link 
                  href="/collections/prayer-mat" 
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 transition"
                >
                  Explore Collections
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Active Campaign Screen */}
        {!campaignLoading && !campaignError && campaign && (
          <>
            {/* Banner header */}
            <div className="text-center mb-8">
              <span className="bg-[#8c763e]/10 text-[#8c763e] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#8c763e]/20">
                {campaign.title}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#2d5f4f] mt-4 tracking-tight">
                Kiswa Scan &amp; Win
              </h1>
              <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
                Scan your QR code, upload your purchase bill, spin the lucky wheel, and receive your {campaign.giftName} at your doorstep!
              </p>
            </div>

            {/* Progress Tracker */}
            <div className="flex items-center justify-center gap-2 mb-10 max-w-md mx-auto text-xs font-semibold text-gray-400">
              <div className={`flex items-center gap-1.5 ${step === 'upload' ? 'text-[#2d5f4f]' : 'text-gray-500'}`}>
                <span className={`h-6 w-6 rounded-full flex items-center justify-center border ${step === 'upload' ? 'border-[#2d5f4f] bg-[#2d5f4f] text-white' : 'border-gray-300 bg-white'}`}>
                  1
                </span>
                <span>Upload Receipt</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
              
              <div className={`flex items-center gap-1.5 ${step === 'lottery' ? 'text-[#2d5f4f]' : step === 'details' || step === 'success' ? 'text-gray-500' : ''}`}>
                <span className={`h-6 w-6 rounded-full flex items-center justify-center border ${step === 'lottery' ? 'border-[#2d5f4f] bg-[#2d5f4f] text-white' : step === 'details' || step === 'success' ? 'border-gray-300 bg-gray-100 text-gray-500' : 'border-gray-300 bg-white'}`}>
                  2
                </span>
                <span>Draw Lottery</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />

              <div className={`flex items-center gap-1.5 ${step === 'details' ? 'text-[#2d5f4f]' : step === 'success' ? 'text-gray-500' : ''}`}>
                <span className={`h-6 w-6 rounded-full flex items-center justify-center border ${step === 'details' ? 'border-[#2d5f4f] bg-[#2d5f4f] text-white' : step === 'success' ? 'border-gray-300 bg-gray-100 text-gray-500' : 'border-gray-300 bg-white'}`}>
                  3
                </span>
                <span>Home Delivery</span>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden max-w-2xl mx-auto w-full">
              
              {/* STEP 1: UPLOAD BILL */}
              {step === 'upload' && (
                <div className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-[#2d5f4f] mb-4 text-center">
                    Submit Your Purchase Bill
                  </h2>
                  
                  <div className="bg-[#2d5f4f]/5 border border-[#2d5f4f]/20 rounded-xl p-4 mb-6">
                    <p className="text-xs text-[#2d5f4f] leading-relaxed font-semibold text-center">
                      ⚠️ Verification Policy: Your purchase bill is required to claim the prize. We will verify the submitted bill. The gift will only be delivered after the bill is successfully checked and approved by our admin team.
                    </p>
                  </div>

                  <form onSubmit={handleUploadBill} className="space-y-6">
                    {/* File Dropzone */}
                    <div className="relative border-2 border-dashed border-gray-300 hover:border-[#2d5f4f] transition rounded-xl p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50 hover:bg-[#2d5f4f]/5">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                        required
                      />
                      
                      {previewUrl ? (
                        <div className="space-y-4">
                          <img
                            src={previewUrl}
                            alt="Receipt preview"
                            className="max-h-48 rounded-lg mx-auto shadow-sm object-contain"
                          />
                          <div>
                            <p className="text-xs font-bold text-gray-500">{file?.name}</p>
                            <p className="text-[10px] text-gray-400">Click or drag another image to change</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="h-12 w-12 rounded-full bg-[#8c763e]/10 flex items-center justify-center text-[#8c763e] mx-auto">
                            <Upload size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-700">Upload or Take Photo of Bill</p>
                            <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG, JPEG up to 8MB</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {uploadError && (
                      <p className="text-xs text-red-500 font-semibold text-center bg-red-50 border border-red-100 py-2.5 px-3 rounded-lg">
                        {uploadError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isUploading || !file}
                      className={`w-full py-3.5 px-6 rounded-xl text-white font-bold tracking-wide shadow-md transition flex items-center justify-center gap-2 ${
                        isUploading || !file
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-[#2d5f4f] hover:bg-[#22483c] active:scale-[0.98]'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Uploading Receipt...
                        </>
                      ) : (
                        <>
                          Submit Receipt &amp; Try Luck
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 2: LOTTERY SPIN */}
              {step === 'lottery' && (
                <div className="p-6 md:p-8 flex flex-col items-center">
                  <h2 className="text-xl md:text-2xl font-bold text-[#2d5f4f] mb-2 text-center">
                    Draw Your Lucky Gift
                  </h2>
                  <p className="text-xs text-gray-500 text-center mb-8 max-w-sm">
                    Your receipt has been received. Spin the campaign wheel to claim your prize!
                  </p>

                  {/* Wheel Container */}
                  <div className="relative mb-10 flex items-center justify-center h-[280px] w-[280px] md:h-[360px] md:w-[360px]">
                    
                    {/* Golden Pointer (Center-Aligned at Top, Overlapping the Wheel) */}
                    <div 
                      className="absolute top-[-16px] left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-amber-500 filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
                    />

                    {/* Outer Ring with Static Chasing Marquee Lights */}
                    <div className="absolute inset-0 rounded-full border-[10px] border-[#8c763e] bg-[#1a1a1a] shadow-2xl flex items-center justify-center">
                      
                      {/* Spinning Wheel */}
                      <div 
                        className="h-[236px] w-[236px] md:h-[312px] md:w-[312px] rounded-full overflow-hidden relative bg-white"
                        style={{ 
                          transform: `rotate(${rotation}deg)`,
                          transition: isSpinning ? 'transform 5s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none',
                        }}
                      >
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                          {renderWheelSlices()}
                          {/* Inner gold hub */}
                          <circle cx="100" cy="100" r="14" fill="#8c763e" stroke="#ffffff" strokeWidth="1.5" />
                          <circle cx="100" cy="100" r="6" fill="#1a1a1a" />
                        </svg>
                      </div>

                      {/* Static Chasing Light Bulbs SVG Overlay */}
                      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none z-20">
                        {/* Inner light ring guide */}
                        <circle cx="100" cy="100" r="95.5" fill="none" stroke="#b59d5b" strokeWidth="1.5" opacity="0.3" />
                        
                        {/* 24 Light Bulbs (Odd and Even blink out-of-phase) */}
                        {[...Array(24)].map((_, i) => {
                          const angle = (i * 15 * Math.PI) / 180
                          const cx = 100 + 95.5 * Math.cos(angle)
                          const cy = 100 + 95.5 * Math.sin(angle)
                          return (
                            <circle
                              key={i}
                              cx={cx}
                              cy={cy}
                              r="1.8"
                              fill={i % 2 === 0 ? '#fbbf24' : '#ffffff'}
                              className={i % 2 === 0 ? 'animate-[pulse_0.5s_infinite_alternate]' : 'animate-[pulse_0.5s_infinite_alternate_0.25s]'}
                            />
                          )
                        })}
                      </svg>

                    </div>
                  </div>

                  {/* Action / Win section */}
                  {showWinMessage ? (
                    <div className="text-center w-full max-w-md space-y-5 animate-[fadeIn_0.5s_ease-out]">
                      <div className="inline-flex h-14 w-14 rounded-full bg-emerald-50 text-emerald-500 items-center justify-center border border-emerald-100 mx-auto animate-bounce">
                        <CheckCircle2 size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-[#2d5f4f]">Congratulations! 🎉</h3>
                        <p className="text-sm font-bold text-gray-700 mt-1.5">
                          You won a <span className="text-[#8c763e] underline decoration-[#8c763e] decoration-2">{campaign.giftName}</span>!
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Submit your delivery details below so we can ship the {campaign.giftName} directly to your home once the bill is verified.
                      </p>
                      
                      <button
                        onClick={() => setStep('details')}
                        className="w-full bg-[#2d5f4f] hover:bg-[#22483c] text-white py-3.5 px-6 rounded-xl font-bold tracking-wide shadow-md transition flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        Enter Delivery Details
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleSpinWheel}
                      disabled={isSpinning}
                      className={`py-3.5 px-8 rounded-full text-white font-extrabold text-sm uppercase tracking-widest shadow-lg transition-all animate-pulse ${
                        isSpinning 
                          ? 'bg-gray-300 cursor-not-allowed animate-none' 
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {isSpinning ? 'Drawing Gift...' : 'Spin the Wheel'}
                    </button>
                  )}
                </div>
              )}

              {/* STEP 3: SHIPPING DETAILS */}
              {step === 'details' && (
                <div className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-[#2d5f4f] mb-4 text-center">
                    Delivery Details
                  </h2>
                  
                  <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-3.5 mb-6">
                    <p className="text-[11px] text-amber-800 leading-relaxed font-semibold text-center">
                      🚚 Note: We will deliver your {campaign.giftName} only after we review and verify the bill you submitted.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitDetails} className="space-y-4">
                    {/* Full name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#2d5f4f] focus:ring-1 focus:ring-[#2d5f4f] outline-none text-sm bg-gray-50 focus:bg-white transition"
                          required
                        />
                      </div>
                    </div>

                    {/* Mobile number */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +966 50 123 4567"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#2d5f4f] focus:ring-1 focus:ring-[#2d5f4f] outline-none text-sm bg-gray-50 focus:bg-white transition"
                          required
                        />
                      </div>
                    </div>

                    {/* Street address */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Street Address / Home Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3 text-gray-400" size={18} />
                        <textarea
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="Street name, Building number, Apartment number"
                          rows={2}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#2d5f4f] focus:ring-1 focus:ring-[#2d5f4f] outline-none text-sm bg-gray-50 focus:bg-white transition resize-none"
                          required
                        />
                      </div>
                    </div>

                    {/* City & Postcode grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Riyadh"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2d5f4f] focus:ring-1 focus:ring-[#2d5f4f] outline-none text-sm bg-gray-50 focus:bg-white transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                          Postal Code / ZIP
                        </label>
                        <input
                          type="text"
                          value={postCode}
                          onChange={(e) => setPostCode(e.target.value)}
                          placeholder="Optional"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2d5f4f] focus:ring-1 focus:ring-[#2d5f4f] outline-none text-sm bg-gray-50 focus:bg-white transition"
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. Saudi Arabia"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2d5f4f] focus:ring-1 focus:ring-[#2d5f4f] outline-none text-sm bg-gray-50 focus:bg-white transition"
                        required
                      />
                    </div>

                    {submitError && (
                      <p className="text-xs text-red-500 font-semibold text-center bg-red-50 border border-red-100 py-2 px-3 rounded-lg">
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingDetails}
                      className={`w-full py-3.5 px-6 rounded-xl text-white font-bold tracking-wide shadow-md transition flex items-center justify-center gap-2 mt-4 ${
                        isSubmittingDetails
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-[#2d5f4f] hover:bg-[#22483c] active:scale-[0.98]'
                      }`}
                    >
                      {isSubmittingDetails ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting Claim...
                        </>
                      ) : (
                        <>
                          Confirm Delivery Address
                          <CheckCircle2 size={18} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 4: SUCCESS */}
              {step === 'success' && (
                <div className="p-8 text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
                  <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                    <CheckCircle2 size={38} className="animate-bounce" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-[#2d5f4f]">
                      Claim Submitted Successfully!
                    </h2>
                    <p className="text-sm font-bold text-amber-700">
                      Status: Pending Verification
                    </p>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                      Thank you! We will review and verify your purchase bill shortly. Once approved, your {campaign.giftName} will be delivered directly to your home at:
                      <span className="block font-bold text-gray-700 mt-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        {street}, {city}, {country}
                      </span>
                    </p>
                  </div>

                  <div className="h-px bg-gray-100 my-6" />

                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Explore More on Kiswa Store
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <Link 
                        href="/" 
                        className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl text-xs font-bold text-gray-700 transition"
                      >
                        Home Store
                      </Link>
                      <Link 
                        href="/collections/prayer-mat" 
                        className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl text-xs font-bold text-gray-700 transition"
                      >
                        Prayer Mats
                      </Link>
                      <Link 
                        href="/about" 
                        className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-xl text-xs font-bold text-gray-700 transition"
                      >
                        About Us
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Security & Support Note */}
            <div className="text-center mt-10 max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <HelpCircle size={14} />
                <span>Need help or have questions about the offer?</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                By submitting, you agree to our offer terms. Deliveries are only made to valid street addresses in served regions. Limit one claim per purchase receipt. Duplicate receipts or unverifiable uploads will lead to claim rejection.
              </p>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
