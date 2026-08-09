import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

// GET /api/abandoned-carts
export async function GET(request: NextRequest) {
  try {
    const collection = await getCollection('abandoned_carts')
    const carts = await collection
      .find({})
      .sort({ abandonedAt: -1 })
      .limit(50)
      .toArray()
    return NextResponse.json({ success: true, data: carts })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch abandoned carts' }, { status: 500 })
  }
}

// POST /api/abandoned-carts (Track or update cart)
export async function POST(request: NextRequest) {
  try {
    const collection = await getCollection('abandoned_carts')
    const body = await request.json()
    const { sessionId, items, customerEmail, phone, customerName, city, address, totalValue } = body

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 })
    }

    // Upsert the cart
    await collection.updateOne(
      { sessionId },
      {
        $set: {
          items,
          customerEmail,
          phone: phone || '',
          customerName: customerName || '',
          city: city || '',
          address: address || '',
          totalValue,
          abandonedAt: new Date(),
          status: 'abandoned',
          recovered: false
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to track cart' }, { status: 500 })
  }
}

// PATCH /api/abandoned-carts (Update cart status: converted, cancelled, contacted)
export async function PATCH(request: NextRequest) {
  try {
    const collection = await getCollection('abandoned_carts')
    const body = await request.json()
    const { sessionId, cartId, status } = body

    const query = sessionId ? { sessionId } : { _id: cartId }
    const isConverted = status === 'converted'

    await collection.updateOne(
      query,
      {
        $set: {
          status,
          recovered: isConverted,
          updatedAt: new Date()
        }
      }
    )

    // When status is converted, automatically create a real Order!
    if (isConverted) {
      const cart = await collection.findOne(query)
      if (cart) {
        const ordersCol = await getCollection('orders')
        const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
        await ordersCol.insertOne({
          orderId,
          customerName: cart.customerName || cart.phone || 'Converted Lead',
          customerEmail: cart.customerEmail || '',
          phone: cart.phone || '',
          customerPhone: cart.phone || '',
          shippingAddress: {
            street: cart.address || '',
            city: cart.city || 'Saudi Arabia',
            country: 'Saudi Arabia'
          },
          items: cart.items || [],
          subtotal: cart.totalValue || 0,
          total: cart.totalValue || 0,
          status: 'payment_done',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update cart status' }, { status: 500 })
  }
}
