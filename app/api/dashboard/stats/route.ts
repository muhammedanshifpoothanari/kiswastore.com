import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

// GET /api/dashboard/stats
export async function GET(request: NextRequest) {
  try {
    const ordersCol = await getCollection('orders')
    const customersCol = await getCollection('customers')
    const cartsCol = await getCollection('abandoned_carts')
    const subsCol = await getCollection('subscribers')

    // Basic counts
    const totalOrders = await ordersCol.countDocuments()
    const totalCustomers = await customersCol.countDocuments()
    const totalSubscribers = await subsCol.countDocuments()
    const abandonedCarts = await cartsCol.countDocuments({ recovered: false })

    // Revenue calculation
    const revenueResult = await ordersCol.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]).toArray()
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0

    // Recent orders
    const recentOrders = await ordersCol
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    // Orders by status
    const statusResult = await ordersCol.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).toArray()
    const ordersByStatus = statusResult.reduce((acc, curr) => {
      acc[curr._id] = curr.count
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalCustomers,
        totalSubscribers,
        abandonedCarts,
        recentOrders,
        ordersByStatus
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
