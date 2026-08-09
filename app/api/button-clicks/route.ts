import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { redis } from '@/lib/redis'

// POST /api/button-clicks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, productId, categoryId, metadata, sessionId, phone } = body

    if (!action) {
      return NextResponse.json({ success: false, error: 'Action is required' }, { status: 400 })
    }

    const event = {
      action,
      productId,
      categoryId,
      metadata,
      sessionId,
      phone: phone || null,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    }

    if (redis) {
      // Push event to Redis queue for asynchronous processing
      await redis.lpush('click_events_queue', JSON.stringify(event))
    } else {
      // Fallback: direct insert to MongoDB if Redis is not configured
      const collection = await getCollection('button_clicks')
      await collection.insertOne({ ...event, timestamp: new Date(event.timestamp) })
    }

    return NextResponse.json({ success: true, queued: !!redis })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to record event' }, { status: 500 })
  }
}

// GET /api/button-clicks (Admin Analytics)
export async function GET(request: NextRequest) {
  try {
    const collection = await getCollection('button_clicks')
    const events = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray()
    return NextResponse.json({ success: true, data: events })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 })
  }
}
