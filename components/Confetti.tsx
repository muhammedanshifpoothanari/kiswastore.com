'use client'

import { useEffect, useRef, useCallback } from 'react'

interface ConfettiProps {
  active: boolean
  duration?: number
  particleCount?: number
  intensity?: 'subtle' | 'full'
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  w: number
  h: number
  rotation: number
  rotationSpeed: number
  opacity: number
  shape: 'rect' | 'circle' | 'ribbon'
  wave: number
  waveSpeed: number
  waveAmp: number
}

// Gold & rich tones matching Kiswa brand + celebratory colours
const COLORS = [
  '#FFD700', '#FFC200', '#FFB300',   // golds
  '#C8963E', '#A67C52', '#8B5E3C',   // warm browns
  '#FF6B6B', '#FF8C42', '#FFA07A',   // oranges/reds
  '#4ECDC4', '#45B7D1', '#85C1E9',   // teals/blues
  '#DDA0DD', '#BB8FCE', '#F1948A',   // purples/pinks
  '#98FB98', '#82E0AA', '#2ECC71',   // greens
]

export default function Confetti({
  active,
  duration = 4000,
  particleCount = 120,
  intensity = 'full',
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  const createParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const count = intensity === 'subtle' ? Math.floor(particleCount * 0.5) : particleCount
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      // Spawn across full top width with slight Y offset above viewport
      const x = Math.random() * canvas.width
      const y = -20 - Math.random() * 80

      // Mostly downward with gentle sideways drift
      const vx = (Math.random() - 0.5) * (intensity === 'subtle' ? 2 : 4)
      const vy = (intensity === 'subtle' ? 1.5 : 2.5) + Math.random() * 3

      const size = intensity === 'subtle'
        ? 5 + Math.random() * 5
        : 7 + Math.random() * 8

      const shapes: Particle['shape'][] = ['rect', 'rect', 'circle', 'ribbon']

      particles.push({
        x,
        y,
        vx,
        vy,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: size,
        h: size * (0.4 + Math.random() * 0.6),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 0.9 + Math.random() * 0.1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        wave: Math.random() * Math.PI * 2,
        waveSpeed: 0.05 + Math.random() * 0.05,
        waveAmp: 0.5 + Math.random() * 1.5,
      })
    }

    // Also add two cannon bursts from bottom-left and bottom-right
    const burst = intensity === 'subtle' ? 0 : Math.floor(count * 0.3)
    for (let i = 0; i < burst; i++) {
      const side = i < burst / 2 ? 0 : 1 // 0 = left, 1 = right
      const x = side === 0 ? -10 : canvas.width + 10
      const y = canvas.height * 0.7

      const angle = side === 0
        ? -Math.PI / 4 + (Math.random() - 0.5) * (Math.PI / 3)
        : -Math.PI * 3 / 4 + (Math.random() - 0.5) * (Math.PI / 3)

      const speed = 10 + Math.random() * 10

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: 8 + Math.random() * 7,
        h: 5 + Math.random() * 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: ['rect', 'ribbon', 'circle'][Math.floor(Math.random() * 3)] as Particle['shape'],
        wave: Math.random() * Math.PI * 2,
        waveSpeed: 0.04 + Math.random() * 0.04,
        waveAmp: 1 + Math.random() * 2,
      })
    }

    particlesRef.current = particles
  }, [particleCount, intensity])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const elapsed = Date.now() - startTimeRef.current
    const progress = Math.min(elapsed / duration, 1)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particlesRef.current.forEach((p) => {
      // Physics
      p.wave += p.waveSpeed
      p.x += p.vx + Math.sin(p.wave) * p.waveAmp
      p.vy += 0.07  // gravity (gentle)
      p.y += p.vy
      p.vx *= 0.995 // slight air resistance
      p.rotation += p.rotationSpeed

      // Fade out in last 25%
      if (progress > 0.75) {
        p.opacity = Math.max(0, (1 - progress) / 0.25)
      }

      // Skip off-canvas particles
      if (p.y > canvas.height + 50) return

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color

      if (p.shape === 'circle') {
        ctx.beginPath()
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
        ctx.fill()
      } else if (p.shape === 'ribbon') {
        // Thin long strip
        ctx.fillRect(-p.w * 0.2, -p.w, p.w * 0.4, p.w * 2)
      } else {
        // Rectangle confetti
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      }

      ctx.restore()
    })

    if (progress < 1) {
      animFrameRef.current = requestAnimationFrame(animate)
    }
  }, [duration])

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    startTimeRef.current = Date.now()
    createParticles()
    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [active, createParticles, animate])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 99999 }}
    />
  )
}
