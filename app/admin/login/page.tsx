'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (data.success) {
        router.push('/admin')
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#3d2e1e]/5 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-[#3d2e1e]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#8c763e]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full p-8 md:p-10 relative overflow-hidden">
        
        {/* Top Header Banner decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#3d2e1e]" />

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 bg-[#3d2e1e]/10 text-[#3d2e1e] rounded-2xl flex items-center justify-center shadow-inner">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#3d2e1e]">Admin Access Only</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Please enter your credentials to access the Kiswa dashboard.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={16} />
              </span>
              <input
                type="text"
                required
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d2e1e] font-semibold text-gray-900"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d2e1e] font-semibold text-gray-900"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-[#3d2e1e] hover:bg-[#2a1f14] disabled:opacity-50 text-white font-extrabold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
          </button>
        </form>

      </div>
    </div>
  )
}
