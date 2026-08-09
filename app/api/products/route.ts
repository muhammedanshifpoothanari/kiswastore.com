import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Product } from '@/lib/models'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured')
    const isUpsell = searchParams.get('isUpsell')

    const { db } = await connectToDatabase()

    const query: any = {}
    if (categoryId) query.categoryId = categoryId
    if (featured === 'true') query.featured = true
    if (isUpsell === 'true') query.isUpsell = true

    const products = await db.collection<Product>('products')
      .find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .toArray()

    return NextResponse.json({ success: true, data: products })
  } catch (error: any) {
    console.error('API Error: /api/products GET', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    const newProduct: Product = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection<Product>('products').insertOne(newProduct)
    
    return NextResponse.json({ 
      success: true, 
      data: { ...newProduct, _id: result.insertedId } 
    })
  } catch (error: any) {
    console.error('API Error: /api/products POST', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
