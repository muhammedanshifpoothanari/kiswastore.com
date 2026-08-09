import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import { LanguageProvider } from '@/context/LanguageContext'
import { CartProvider } from '@/context/CartContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kiswa - Premium Quality Islamic Products',
  description: 'Kiswa offers premium quality Islamic products, prayer mats, camping essentials, and elegant home furnishings. All the way from Makkah.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1b4d3e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" className="bg-white scroll-smooth">
      <body className="antialiased bg-white text-foreground font-sans">
        <LanguageProvider>
          <CartProvider>
            {children}
            <WhatsAppWidget />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
