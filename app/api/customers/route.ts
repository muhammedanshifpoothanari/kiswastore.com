import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

// GET /api/customers
export async function GET(request: NextRequest) {
  try {
    const collection = await getCollection('customers')
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const customers = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({ success: true, data: customers })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 })
  }
}

// POST /api/customers
export async function POST(request: NextRequest) {
  try {
    const collection = await getCollection('customers')
    const body = await request.json()

    // Check if customer already exists by email
    const existing = await collection.findOne({ email: body.email })
    if (existing) {
      // Update existing customer
      const result = await collection.updateOne(
        { email: body.email },
        { 
          $set: { ...body, updatedAt: new Date() },
          $addToSet: { orderHistory: body.orderId } // If an order ID is provided
        }
      )
      return NextResponse.json({ success: true, data: { ...existing, ...body } })
    }

    // Create new customer
    const now = new Date()
    const customer = {
      ...body,
      orderHistory: body.orderId ? [body.orderId] : [],
      createdAt: now,
      updatedAt: now,
    }

    const result = await collection.insertOne(customer)
    return NextResponse.json({ success: true, data: { ...customer, _id: result.insertedId } }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create customer' }, { status: 500 })
  }
}
