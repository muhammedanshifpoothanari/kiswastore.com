import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

// GET /api/orders — List all orders (supports filtering by status, phone, email)
export async function GET(request: NextRequest) {
  try {
    const collection = await getCollection('orders')
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const phone = searchParams.get('phone')
    const email = searchParams.get('email')
    const limit = parseInt(searchParams.get('limit') || '50')

    const query: Record<string, any> = {}
    if (status) query.status = status
    if (phone) {
      // Match phone number flexibly — strip spaces, dashes, and leading zeros
      const cleaned = phone.replace(/[\s\-()]/g, '')
      query.$or = [
        { phone: cleaned },
        { phone: phone },
        { phone: { $regex: cleaned.replace(/^\+/, ''), $options: 'i' } },
      ]
    }
    if (email) query.customerEmail = email

    const orders = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST /api/orders — Create a new order
export async function POST(request: NextRequest) {
  try {
    const collection = await getCollection('orders')
    const body = await request.json()

    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const count = await collection.countDocuments()
    const orderId = `KSW-${dateStr}-${String(count + 1).padStart(3, '0')}`

    const order = {
      orderId,
      ...body,
      status: body.status || 'pending',
      createdAt: now,
      updatedAt: now,
    }

    const result = await collection.insertOne(order)
    return NextResponse.json({ success: true, data: { ...order, _id: result.insertedId } }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 })
  }
}
