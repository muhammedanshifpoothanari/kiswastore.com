import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const adminUser = process.env.ADMIN_USERNAME || 'admin'
    const adminPass = process.env.ADMIN_PASSWORD || 'admin'

    if (username === adminUser && password === adminPass) {
      const response = NextResponse.json({ success: true, message: 'Logged in successfully' })
      
      // Set secure HTTP-only cookie valid for 7 days
      response.cookies.set('admin_token', 'kiswa_admin_secure_session_2026', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    }

    return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 })
  }
}
