import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { redis } from '@/lib/redis'

export async function POST() {
  try {
    if (!redis) {
      return NextResponse.json({ success: false, message: 'Redis is not configured' })
    }

    const events: any[] = []
    let eventRaw = await redis.rpop('click_events_queue')

    while (eventRaw && events.length < 500) {
      try {
        const parsed = typeof eventRaw === 'string' ? JSON.parse(eventRaw) : eventRaw
        events.push({
          ...parsed,
          timestamp: new Date(parsed.timestamp)
        })
      } catch (err) {
        console.error('Failed to parse queued event:', err)
      }
      eventRaw = await redis.rpop('click_events_queue')
    }

    if (events.length > 0) {
      const collection = await getCollection('button_clicks')
      await collection.insertMany(events)
    }

    return NextResponse.json({ success: true, processedCount: events.length })
  } catch (error: any) {
    console.error('Analytics sync error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
