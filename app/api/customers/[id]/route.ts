import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET /api/customers/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const collection = await getCollection('customers')
    const customer = await collection.findOne({ _id: new ObjectId(id) })
    if (!customer) return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: customer })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch customer' }, { status: 500 })
  }
}

// PUT /api/customers/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const collection = await getCollection('customers')
    const body = await request.json()
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    )
    if (result.matchedCount === 0) return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: { id, ...body } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update customer' }, { status: 500 })
  }
}

// DELETE /api/customers/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const collection = await getCollection('customers')
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete customer' }, { status: 500 })
  }
}
