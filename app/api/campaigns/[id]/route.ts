import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Helper to construct query that supports both ObjectId and slug offerId
const getQueryForId = (id: string) => {
  if (ObjectId.isValid(id)) {
    return { $or: [{ _id: new ObjectId(id) }, { offerId: id.toLowerCase().trim() }] }
  }
  return { offerId: id.toLowerCase().trim() }
}

// GET /api/campaigns/[id] - Fetch a specific campaign configuration (used by /offer/[id])
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const collection = await getCollection('campaign_offers')
    
    const campaign = await collection.findOne(getQueryForId(id))
    
    if (!campaign) {
      return NextResponse.json({ success: false, error: 'Campaign campaign not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: campaign })
  } catch (error: any) {
    console.error('API Error: /api/campaigns/[id] GET', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT /api/campaigns/[id] - Update a campaign configuration (Admin)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, giftName, isActive, offerId } = body

    const collection = await getCollection('campaign_offers')
    
    const updateData: any = {
      updatedAt: new Date()
    }
    
    if (title !== undefined) updateData.title = title.trim()
    if (giftName !== undefined) updateData.giftName = giftName.trim()
    if (isActive !== undefined) updateData.isActive = !!isActive
    
    if (offerId !== undefined) {
      const slugRegex = /^[a-zA-Z0-9_-]+$/
      if (!slugRegex.test(offerId)) {
        return NextResponse.json({
          success: false,
          error: 'Offer URL ID must only contain letters, numbers, hyphens, and underscores.'
        }, { status: 400 })
      }
      
      const cleanOfferId = offerId.toLowerCase().trim()
      updateData.offerId = cleanOfferId
      
      // If we are changing the offerId, verify that the new one is unique
      const existing = await collection.findOne({
        offerId: cleanOfferId,
        _id: { $ne: ObjectId.isValid(id) ? new ObjectId(id) : undefined }
      })
      if (existing) {
        return NextResponse.json({
          success: false,
          error: 'A campaign with this Offer URL ID already exists. Please choose a different ID.'
        }, { status: 400 })
      }
    }

    const result = await collection.updateOne(
      getQueryForId(id),
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Campaign campaign not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: { id, ...updateData } })
  } catch (error: any) {
    console.error('API Error: /api/campaigns/[id] PUT', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE /api/campaigns/[id] - Delete a campaign configuration (Admin)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const collection = await getCollection('campaign_offers')
    
    const result = await collection.deleteOne(getQueryForId(id))

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Campaign campaign not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API Error: /api/campaigns/[id] DELETE', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
