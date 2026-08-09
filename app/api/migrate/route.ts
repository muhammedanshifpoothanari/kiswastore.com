import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { getSortedCategories } from '@/data/categories'
import { prayerMats, metalArt, prayerAccessories, giftBoxes } from '@/data/products'

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // 1. Migrate Categories
    const categories = getSortedCategories()
    const categoriesCollection = db.collection('categories')
    
    // Clear existing
    await categoriesCollection.deleteMany({})
    
    if (categories.length > 0) {
      const categoriesToInsert = categories.map(c => ({
        slug: c.slug,
        name: c.name,
        image: c.image,
        description: c.description || c.name, // fallback
        sortOrder: c.sortOrder
      }))
      await categoriesCollection.insertMany(categoriesToInsert)
    }

    // 2. Migrate Products
    const allProducts = [...metalArt, ...prayerMats, ...prayerAccessories, ...giftBoxes]
    const productsCollection = db.collection('products')

    // Clear existing
    await productsCollection.deleteMany({})

    if (allProducts.length > 0) {
      const productsToInsert = allProducts.map(p => ({
        slug: p.slug,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice,
        offer: p.offer,
        image: p.image,
        categoryId: p.categoryId,
        description: p.description,
        inStock: p.inStock,
        stockQuantity: 100, // default dummy stock
        barcode: `BC-${p.id}`,
        weight: '1kg',
        dimensions: { length: 10, width: 10, height: 10 },
        isUpsell: p.featured || false, // default upsell logic
        featured: p.featured,
        sortOrder: p.sortOrder,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      await productsCollection.insertMany(productsToInsert)
    }

    // 3. Migrate Dummy Coupon
    const couponsCollection = db.collection('coupons')
    await couponsCollection.deleteMany({})
    await couponsCollection.insertOne({
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 0,
      isActive: true
    })

    return NextResponse.json({ success: true, message: 'Migration successful' })
  } catch (error: any) {
    console.error('API Error: /api/migrate POST', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
