import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET /api/orders/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const collection = await getCollection('orders')
    const order = await collection.findOne({ _id: new ObjectId(id) })
    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 })
  }
}

// PUT /api/orders/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const collection = await getCollection('orders')
    const body = await request.json()
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    )
    if (result.matchedCount === 0) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: { id, ...body } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 })
  }
}

// DELETE /api/orders/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const collection = await getCollection('orders')
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete order' }, { status: 500 })
  }
}
