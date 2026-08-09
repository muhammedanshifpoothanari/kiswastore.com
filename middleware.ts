import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if target path starts with /admin
  if (pathname.startsWith('/admin')) {
    // Exclude /admin/login from authentication check to prevent redirect loops
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    const token = request.cookies.get('admin_token')?.value

    // If token is missing or invalid, redirect to login page
    if (!token || token !== 'kiswa_admin_secure_session_2026') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Configure middleware matcher for admin paths
export const config = {
  matcher: ['/admin/:path*'],
}
