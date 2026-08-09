import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

// POST /api/email-subscribe
export async function POST(request: NextRequest) {
  try {
    const collection = await getCollection('subscribers')
    const body = await request.json()
    const { email, source = 'footer' } = body

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    // Upsert subscriber
    const result = await collection.updateOne(
      { email },
      {
        $setOnInsert: {
          email,
          source,
          subscribedAt: new Date(),
          active: true
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true, isNew: result.upsertedCount > 0 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to subscribe' }, { status: 500 })
  }
}

// GET /api/email-subscribe (Admin)
export async function GET(request: NextRequest) {
  try {
    const collection = await getCollection('subscribers')
    const subscribers = await collection.find({}).sort({ subscribedAt: -1 }).toArray()
    return NextResponse.json({ success: true, data: subscribers })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}
