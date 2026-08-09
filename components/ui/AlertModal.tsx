'use client'

import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface AlertModalProps {
  isOpen: boolean
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

export default function AlertModal({
  isOpen,
  message,
  type = 'info',
  onClose,
}: AlertModalProps) {
  const { isArabic } = useLanguage()
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 flex flex-col relative"
        style={{ direction: isArabic ? 'rtl' : 'ltr' }}
      >
        {/* Top Accent Bar */}
        <div className={`h-1.5 w-full ${
          type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-[#3d2e1e]'
        }`} />

        <div className="p-6 text-center flex-1 flex flex-col items-center">
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition"
            aria-label="Close dialog"
          >
            <X size={16} className="text-gray-400" />
          </button>

          {/* Icon */}
          <div className="mb-4">
            {type === 'success' ? (
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100">
                <CheckCircle2 size={24} />
              </div>
            ) : (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                type === 'error' 
                  ? 'bg-red-50 text-red-600 border-red-100' 
                  : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                <AlertCircle size={24} />
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {type === 'success' 
              ? (isArabic ? 'نجاح' : 'Success') 
              : type === 'error' 
              ? (isArabic ? 'خطأ' : 'Error') 
              : (isArabic ? 'تنبيه' : 'Notification')}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
            {message}
          </p>

          {/* Button */}
          <button
            onClick={onClose}
            className={`w-full py-2.5 font-bold text-sm rounded-xl text-white shadow-sm transition active:scale-95 ${
              type === 'success' 
                ? 'bg-green-600 hover:bg-green-700' 
                : type === 'error' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-[#3d2e1e] hover:bg-[#2a1f14]'
            }`}
          >
            {isArabic ? 'موافق' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  )
}
