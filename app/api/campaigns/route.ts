import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { CampaignOffer } from '@/lib/models'

// GET /api/campaigns - List all QR Campaigns (Admin)
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    
    const campaigns = await db.collection<CampaignOffer>('campaign_offers')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
      
    return NextResponse.json({ success: true, data: campaigns })
  } catch (error: any) {
    console.error('API Error: /api/campaigns GET', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST /api/campaigns - Create a new QR Campaign (Admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { offerId, title, giftName, isActive } = body

    if (!offerId || !title || !giftName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields. Please specify Offer URL ID, Campaign Title, and Gift Product.' 
      }, { status: 400 })
    }

    // Validate offerId is clean for URL slugs
    const slugRegex = /^[a-zA-Z0-9_-]+$/
    if (!slugRegex.test(offerId)) {
      return NextResponse.json({
        success: false,
        error: 'Offer URL ID must only contain letters, numbers, hyphens, and underscores.'
      }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Verify uniqueness of offerId
    const existing = await db.collection<CampaignOffer>('campaign_offers').findOne({ 
      offerId: offerId.toLowerCase().trim() 
    })
    
    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'A campaign with this Offer URL ID already exists. Please choose a different ID.'
      }, { status: 400 })
    }

    const newCampaign: CampaignOffer = {
      offerId: offerId.toLowerCase().trim(),
      title: title.trim(),
      giftName: giftName.trim(),
      isActive: isActive !== undefined ? !!isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection<CampaignOffer>('campaign_offers').insertOne(newCampaign)

    return NextResponse.json({ 
      success: true, 
      data: { ...newCampaign, _id: result.insertedId } 
    })
  } catch (error: any) {
    console.error('API Error: /api/campaigns POST', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
