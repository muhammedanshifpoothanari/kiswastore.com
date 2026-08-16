import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { OfferSubmission } from '@/lib/models'

// GET /api/offers - Fetch all submissions (Admin view)
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    
    // Fetch all submissions, sorted by newest first
    const submissions = await db.collection<OfferSubmission>('offer_submissions')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
      
    return NextResponse.json({ success: true, data: submissions })
  } catch (error: any) {
    console.error('API Error: /api/offers GET', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST /api/offers - Submit a new scan-and-win claim (User submit)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrId, billImageUrl, customerName, customerPhone, shippingAddress } = body

    if (!qrId || !billImageUrl || !customerName || !customerPhone || !shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.country) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required submission fields' 
      }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const newSubmission: OfferSubmission = {
      qrId,
      billImageUrl,
      customerName,
      customerPhone,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || '',
        postCode: shippingAddress.postCode || '',
        country: shippingAddress.country
      },
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection<OfferSubmission>('offer_submissions').insertOne(newSubmission)

    return NextResponse.json({ 
      success: true, 
      data: { ...newSubmission, _id: result.insertedId } 
    })
  } catch (error: any) {
    console.error('API Error: /api/offers POST', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
