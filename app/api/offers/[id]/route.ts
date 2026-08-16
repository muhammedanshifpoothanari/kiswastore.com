import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// PUT /api/offers/[id] - Update status or details of a submission (Admin approved/rejected)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid or missing status' }, { status: 400 })
    }

    const collection = await getCollection('offer_submissions')
    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (status === 'approved') {
      updateData.verifiedAt = new Date()
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: { id, status } })
  } catch (error: any) {
    console.error('API Error: /api/offers/[id] PUT', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE /api/offers/[id] - Delete a submission (Admin delete)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const collection = await getCollection('offer_submissions')
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API Error: /api/offers/[id] DELETE', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
