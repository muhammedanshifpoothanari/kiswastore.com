'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Mail, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  RefreshCcw,
  Package,
  Grid,
  AlertTriangle,
  FileText,
  Gift
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Abandoned Carts', href: '/admin/abandoned-carts', icon: RefreshCcw },
  { name: 'Products List', href: '/admin/products', icon: Package },
  { name: 'Categories List', href: '/admin/categories', icon: Grid },
  { name: 'Stock Out Report', href: '/admin/reports/stock-out', icon: AlertTriangle },
  { name: 'PO Dispatch', href: '/admin/po', icon: FileText },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Subscribers', href: '/admin/subscribers', icon: Mail },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Offer Claims', href: '/admin/offers', icon: Gift },
]


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' })
      if (res.ok) {
        window.location.href = '/admin/login'
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-900/80 transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1a1a1a] text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-72 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8c763e]">
            <span className="text-sm font-bold text-white">K</span>
          </div>
          <span className="text-xl font-bold tracking-wider text-white">KISWA ADMIN</span>
          <button 
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex flex-1 flex-col px-4 py-6 overflow-y-auto">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 transition-colors
                          ${isActive 
                            ? 'bg-[#8c763e] text-white' 
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          }
                        `}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            
            <li className="mt-auto space-y-1">
              <Link
                href="/"
                className="group -mx-2 flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <LogOut className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-white" aria-hidden="true" />
                Back to Store
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left group -mx-2 flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut className="h-6 w-6 shrink-0 text-red-400 group-hover:text-red-300" aria-hidden="true" />
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col xl:pl-0">
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 lg:hidden">
          <button 
            type="button" 
            className="-m-2.5 p-2.5 text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6"></div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <span className="text-sm font-semibold text-gray-900">Admin User</span>
          </div>
        </div>

        <main className="flex-1 pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
