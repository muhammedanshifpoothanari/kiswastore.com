import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Category } from '@/lib/models'

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const categories = await db.collection<Category>('categories')
      .find({})
      .sort({ sortOrder: 1 })
      .toArray()

    return NextResponse.json({ success: true, data: categories })
  } catch (error: any) {
    console.error('API Error: /api/categories GET', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    const newCategory: Category = {
      ...body
    }

    const result = await db.collection<Category>('categories').insertOne(newCategory)
    
    return NextResponse.json({ 
      success: true, 
      data: { ...newCategory, _id: result.insertedId } 
    })
  } catch (error: any) {
    console.error('API Error: /api/categories POST', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
