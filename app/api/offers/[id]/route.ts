import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// PUT /api/offers/[id] - Update status or details of a submission (Admin approved/rejected)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, customerName, customerPhone, shippingAddress } = body

    const submissionsColl = await getCollection('offer_submissions')
    const existingSubmission = await submissionsColl.findOne({ _id: new ObjectId(id) })

    if (!existingSubmission) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 })
    }

    const updateData: any = {
      updatedAt: new Date()
    }

    // Capture customer details if edited
    if (customerName !== undefined) updateData.customerName = customerName.trim()
    if (customerPhone !== undefined) updateData.customerPhone = customerPhone.trim()
    
    if (shippingAddress !== undefined) {
      updateData.shippingAddress = {
        street: shippingAddress.street?.trim() || existingSubmission.shippingAddress.street,
        city: shippingAddress.city?.trim() || existingSubmission.shippingAddress.city,
        postCode: shippingAddress.postCode?.trim() || existingSubmission.shippingAddress.postCode || '',
        country: shippingAddress.country?.trim() || existingSubmission.shippingAddress.country
      }
    }

    // Capture status and handle automatic order conversion
    if (status !== undefined) {
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 })
      }
      
      updateData.status = status

      // If approved, verify the claim and automatically create a corresponding store order
      if (status === 'approved' && existingSubmission.status !== 'approved') {
        updateData.verifiedAt = new Date()

        // Fetch campaign configuration to resolve custom gift name
        const campaignsColl = await getCollection('campaign_offers')
        const campaign = await campaignsColl.findOne({ offerId: existingSubmission.qrId.toLowerCase().trim() })

        // Generate Order ID matching the store's convention
        const ordersColl = await getCollection('orders')
        const now = new Date()
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
        const count = await ordersColl.countDocuments()
        const orderId = `KSW-GIFT-${dateStr}-${String(count + 1).padStart(3, '0')}`

        // Combine existing data with any edited values in the request body
        const finalName = customerName !== undefined ? customerName.trim() : existingSubmission.customerName
        const finalPhone = customerPhone !== undefined ? customerPhone.trim() : existingSubmission.customerPhone
        const finalAddress = {
          street: shippingAddress?.street?.trim() || existingSubmission.shippingAddress.street,
          city: shippingAddress?.city?.trim() || existingSubmission.shippingAddress.city,
          postCode: shippingAddress?.postCode?.trim() || existingSubmission.shippingAddress.postCode || '',
          country: shippingAddress?.country?.trim() || existingSubmission.shippingAddress.country
        }

        const order = {
          orderId,
          customerEmail: `${finalPhone}@kiswastore.com`,
          customerName: finalName,
          phone: finalPhone,
          items: [
            {
              productId: `GIFT-${existingSubmission.qrId.toUpperCase()}`,
              productName: campaign?.giftName || 'Sponge Prayer Mat',
              price: 0,
              quantity: 1,
              image: existingSubmission.billImageUrl
            }
          ],
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          status: 'pending',
          shippingAddress: finalAddress,
          paymentMethod: 'Campaign Gift (Free)',
          notes: `QR Campaign Claim: ${existingSubmission.qrId} (${campaign?.title || 'Lottery Offer'}). Bill verified on admin panel.`,
          createdAt: now,
          updatedAt: now
        }

        await ordersColl.insertOne(order)
      }
    }

    await submissionsColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    return NextResponse.json({ success: true, data: { id, ...updateData } })
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
