'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/hooks/useLanguage'

export default function WhatsAppWidget() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { isArabic } = useLanguage()

  // Multi-line nudge state
  const [nudgeMessages, setNudgeMessages] = useState<string[]>([])
  const [currentTyping, setCurrentTyping] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showNudge, setShowNudge] = useState(false)

  // The 3-line message sequence — each appears as its own bubble
  const messageLines = isArabic
    ? [
        'السلام عليكم 👋',
        'أنشيف من كسوة هنا',
        'هل تحتاج أي مساعدة؟ 💬',
      ]
    : [
        'Salam Alaikum 👋',
        'Anshif from Kiswa here',
        'Is any help required? 💬',
      ]

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      
      // First high pitch ding
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(880, ctx.currentTime) // A5 note
      gain1.gain.setValueAtTime(0.08, ctx.currentTime)
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc1.start(ctx.currentTime)
      osc1.stop(ctx.currentTime + 0.15)
      
      // Second high pitch ding (slightly later and higher)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.1) // C6 note
      gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.1)
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      osc2.start(ctx.currentTime + 0.1)
      osc2.stop(ctx.currentTime + 0.25)
    } catch (e) {}
  }

  const playSoftClickSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(987.77, ctx.currentTime) // B5
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.1)
    } catch (e) {}
  }

  useEffect(() => {
    setMounted(true)
    setNudgeMessages([])
    setCurrentTyping('')
    setIsTyping(false)
    setShowNudge(false)

    // Only trigger on home page
    if (pathname !== '/') return

    let cancelled = false

    const runSequence = async () => {
      // Wait 2s before starting
      await new Promise(r => setTimeout(r, 2000))
      if (cancelled) return

      setShowNudge(true)
      playNotificationSound()

      for (let lineIdx = 0; lineIdx < messageLines.length; lineIdx++) {
        if (cancelled) return
        const line = messageLines[lineIdx]
        
        // 1. Show Typing indicator
        setIsTyping(true)
        await new Promise(r => setTimeout(r, 1000))
        if (cancelled) return

        // 2. Type characters sequentially
        let typed = ''
        for (let charIdx = 0; charIdx < line.length; charIdx++) {
          if (cancelled) return
          typed += line[charIdx]
          setCurrentTyping(typed)
          await new Promise(r => setTimeout(r, 30))
        }
        
        // 3. Complete line, push to main bubble log, reset typing status
        setIsTyping(false)
        setNudgeMessages(prev => [...prev, line])
        setCurrentTyping('')

        if (lineIdx > 0) {
          playSoftClickSound()
        }

        // Wait between messages
        await new Promise(r => setTimeout(r, 1500))
      }

      // Wait 5 seconds after the sequence finishes, then hide the nudge bubbles
      await new Promise(r => setTimeout(r, 5000))
      if (cancelled) return
      setShowNudge(false)
    }

    runSequence()

    return () => {
      cancelled = true
    }
  }, [pathname, isArabic])

  const handleSendMessage = () => {
    const defaultText = isArabic 
      ? `السلام عليكم! أنا أتصفح موقعكم. أحتاج إلى مساعدة.`
      : `Hey, Salam Alaikum! I am visiting your website.`
      
    const whatsappMessage = encodeURIComponent(defaultText)
    const phoneNumber = '966548608504' 
    window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, '_blank')
  }

  if (!mounted) return null

  return (
    <>
      {/* Multi-line Nudge Bubbles — stacked ABOVE the WhatsApp icon */}
      {showNudge && (
        <div
          onClick={handleSendMessage}
          style={{ right: '0.5rem', position: 'fixed' }}
          className="bottom-[8rem] md:bottom-[6.5rem] z-[9998] flex flex-col items-end gap-1.5 cursor-pointer hover:scale-105 transition-transform"
        >
          {/* Completed message lines */}
          {nudgeMessages.map((msg, idx) => (
            <div
              key={idx}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="relative bg-white px-3.5 py-2 rounded-xl rounded-br-sm shadow-lg border border-gray-100/80 max-w-[240px]"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
              >
                <p className="text-[13px] text-gray-800 leading-snug font-medium whitespace-nowrap">
                  {msg}
                </p>
              </div>
            </div>
          ))}

          {/* Currently typing line */}
          {(isTyping || currentTyping) && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="relative bg-white px-3.5 py-2 rounded-xl rounded-br-sm shadow-lg border border-gray-100/80 max-w-[240px]"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
              >
                <p className="text-[13px] text-gray-800 leading-snug font-medium whitespace-nowrap">
                  {currentTyping}
                  {isTyping && <span className="animate-pulse text-[#25D366] ml-0.5 font-bold">|</span>}
                </p>
              </div>
            </div>
          )}

          {/* Typing indicator (3 dots) */}
          {isTyping && !currentTyping && (
            <div className="animate-in fade-in duration-200">
              <div className="bg-white px-3.5 py-2.5 rounded-xl rounded-br-sm shadow-lg border border-gray-100/80">
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={handleSendMessage}
        style={{ right: '0.75rem', left: 'auto', position: 'fixed' }}
        className="bottom-16 md:bottom-6 z-[9999] w-[52px] h-[52px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 bg-transparent p-0 group relative"
        title="Chat with Anshif on WhatsApp"
      >
        {/* Live Red Blinking Badge */}
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 md:h-[18px] md:w-[18px] z-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 md:h-[18px] md:w-[18px] bg-red-600 border-2 border-white shadow-sm" />
        </span>

        {/* WhatsApp Icon */}
        <div className="relative w-[52px] h-[52px] md:w-[60px] md:h-[60px]">
          <svg className="w-full h-full shrink-0 drop-shadow-xl" viewBox="0 0 48 48">
            <path fill="#25D366" d="M24,4C13,4,4,13,4,24c0,3.5,0.9,6.8,2.5,9.7L4,44l10.6-2.4C17.4,43.2,20.6,44,24,44c11,0,20-9,20-20S35,4,24,4z"/>
            <path fill="#FFFFFF" d="M35.2,29.7c-0.6-0.3-3.4-1.7-3.9-1.9c-0.5-0.2-0.9-0.3-1.3,0.3c-0.4,0.6-1.5,1.9-1.8,2.3c-0.3,0.4-0.7,0.5-1.3,0.2c-0.6-0.3-2.5-0.9-4.8-3c-1.8-1.6-3-3.6-3.4-4.2c-0.3-0.6,0-0.9,0.3-1.2c0.3-0.3,0.6-0.7,0.9-1.1c0.3-0.4,0.4-0.7,0.6-1.1c0.2-0.4,0.1-0.8-0.1-1.1c-0.2-0.3-1.3-3.2-1.8-4.4c-0.5-1.2-1-1-1.3-1c-0.3,0-0.7,0-1.1,0c-0.4,0-1,0.2-1.5,0.7c-0.5,0.5-2,1.9-2,4.7c0,2.8,2.1,5.5,2.4,5.9c0.3,0.4,4.1,6.3,9.9,8.8c1.4,0.6,2.5,1,3.3,1.3c1.4,0.4,2.7,0.4,3.7,0.2c1.1-0.2,3.4-1.4,3.9-2.7c0.5-1.3,0.5-2.5,0.3-2.7C36.1,30.2,35.8,30,35.2,29.7z"/>
          </svg>
        </div>
      </button>
    </>
  )
}
