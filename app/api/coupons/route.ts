import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Coupon } from '@/lib/models'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    const { db } = await connectToDatabase()

    if (code) {
      const coupon = await db.collection<Coupon>('coupons').findOne({ code: code.toUpperCase() })
      if (!coupon) {
        return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: coupon })
    }

    const coupons = await db.collection<Coupon>('coupons')
      .find({})
      .toArray()

    return NextResponse.json({ success: true, data: coupons })
  } catch (error: any) {
    console.error('API Error: /api/coupons GET', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    const newCoupon: Coupon = {
      ...body,
      code: body.code.toUpperCase()
    }

    // Convert date if string
    if (newCoupon.validUntil && typeof newCoupon.validUntil === 'string') {
      newCoupon.validUntil = new Date(newCoupon.validUntil)
    }

    const result = await db.collection<Coupon>('coupons').insertOne(newCoupon)

    return NextResponse.json({
      success: true,
      data: { ...newCoupon, _id: result.insertedId }
    })
  } catch (error: any) {
    console.error('API Error: /api/coupons POST', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
