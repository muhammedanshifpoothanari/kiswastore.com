import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

// POST /api/checkout (Start checkout session)
export async function POST(request: NextRequest) {
  try {
    const collection = await getCollection('checkout_sessions')
    const body = await request.json()
    
    // Generate simple session ID if not provided
    const sessionId = body.sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`

    const session = {
      sessionId,
      items: body.items || [],
      subtotal: body.subtotal || 0,
      shipping: body.shipping || 0,
      tax: body.tax || 0,
      total: body.total || 0,
      paymentStatus: 'started',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await collection.insertOne(session)

    return NextResponse.json({ success: true, sessionId })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to start checkout session' }, { status: 500 })
  }
}

// PUT /api/checkout (Update checkout session)
export async function PUT(request: NextRequest) {
  try {
    const collection = await getCollection('checkout_sessions')
    const body = await request.json()
    const { sessionId, ...updates } = body

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 })
    }

    await collection.updateOne(
      { sessionId },
      { $set: { ...updates, updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update checkout session' }, { status: 500 })
  }
}
