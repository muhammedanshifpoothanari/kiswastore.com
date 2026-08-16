// =============================================================================
// KISWA - MongoDB TypeScript Interfaces (Models)
// =============================================================================
// These interfaces define the shape of documents in each MongoDB collection.
// Products/Categories are NOT here — they live in data/products.ts (static).
// =============================================================================

import { ObjectId } from 'mongodb'

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------
export interface Product {
  _id?: ObjectId
  slug: string
  name: {
    en: string
    ar: string
  }
  price: number
  originalPrice?: number
  offer?: string
  image: string
  categoryId: string
  description?: {
    en: string
    ar: string
  }
  inStock: boolean // legacy field, replaced by stockQuantity logic
  stockQuantity: number // New field for DB inventory
  barcode?: string
  weight?: string
  dimensions?: {
    length: number
    width: number
    height: number
  }
  isUpsell: boolean
  featured?: boolean
  sortOrder?: number
  createdAt: Date
  updatedAt: Date
}

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------
export interface Category {
  _id?: ObjectId
  slug: string
  name: {
    en: string
    ar: string
  }
  image: string
  description?: {
    en: string
    ar: string
  }
  parentId?: string // For subcategories
  sortOrder?: number
}

// ---------------------------------------------------------------------------
// Coupon
// ---------------------------------------------------------------------------
export interface Coupon {
  _id?: ObjectId
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase?: number
  validUntil?: Date
  isActive: boolean
}

// ---------------------------------------------------------------------------
// Customer
// ---------------------------------------------------------------------------
export interface Customer {
  _id?: ObjectId
  firstName: string
  lastName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    postCode: string
    country: string
  }
  orderHistory: string[]    // Array of order IDs
  totalSpent: number
  createdAt: Date
  updatedAt: Date
}

// ---------------------------------------------------------------------------
// Order
// ---------------------------------------------------------------------------
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export interface OrderItem {
  productId: string         // References static product ID (e.g., "PM-001")
  productName: string       // Snapshot of product name at time of order
  price: number             // Price at time of order
  quantity: number
  image: string             // Product image path
}

export interface Order {
  _id?: ObjectId
  orderId: string           // Human-readable order ID (e.g., "KSW-20260728-001")
  customerId?: string       // MongoDB ObjectId as string
  customerEmail: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  shippingAddress: {
    street: string
    city: string
    postCode: string
    country: string
  }
  paymentMethod: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// ---------------------------------------------------------------------------
// Abandoned Cart
// ---------------------------------------------------------------------------
export interface AbandonedCartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
}

export interface AbandonedCart {
  _id?: ObjectId
  sessionId: string
  customerEmail?: string
  items: AbandonedCartItem[]
  totalValue: number
  abandonedAt: Date
  recovered: boolean
  recoveredAt?: Date
}

// ---------------------------------------------------------------------------
// Email Subscriber
// ---------------------------------------------------------------------------
export interface EmailSubscriber {
  _id?: ObjectId
  email: string
  source: 'footer' | 'popup' | 'checkout' | 'manual'
  subscribedAt: Date
  active: boolean
}

// ---------------------------------------------------------------------------
// Button Click / Event Queue
// ---------------------------------------------------------------------------
export type ClickAction =
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_product'
  | 'view_category'
  | 'wishlist'
  | 'share'
  | 'search'
  | 'custom'

export interface ButtonClick {
  _id?: ObjectId
  action: ClickAction
  productId?: string        // Static product ID if applicable
  categoryId?: string       // Static category ID if applicable
  metadata?: Record<string, string>
  sessionId: string
  userAgent?: string
  timestamp: Date
}

// ---------------------------------------------------------------------------
// Checkout Session
// ---------------------------------------------------------------------------
export type CheckoutStatus = 'started' | 'shipping_entered' | 'payment_entered' | 'completed' | 'failed'

export interface CheckoutSession {
  _id?: ObjectId
  sessionId: string
  customerId?: string
  items: OrderItem[]
  shippingInfo?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postCode: string
    country: string
  }
  paymentStatus: CheckoutStatus
  subtotal: number
  shipping: number
  tax: number
  total: number
  createdAt: Date
  updatedAt: Date
}

// ---------------------------------------------------------------------------
// Dashboard Stats (computed, not stored)
// ---------------------------------------------------------------------------
export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  totalSubscribers: number
  abandonedCarts: number
  recentOrders: Order[]
  topProducts: { productId: string; productName: string; totalSold: number }[]
  ordersByStatus: Record<OrderStatus, number>
}

// ---------------------------------------------------------------------------
// QR Scan & Win Offer Submissions
// ---------------------------------------------------------------------------
export type OfferSubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface OfferSubmission {
  _id?: ObjectId
  qrId: string              // Scanned QR code identifier (e.g. "qr-mats-01")
  billImageUrl: string      // Cloudinary image URL or local fallback URL
  customerName: string
  customerPhone: string
  shippingAddress: {
    street: string
    city: string
    state?: string
    postCode?: string
    country: string
  }
  status: OfferSubmissionStatus
  createdAt: Date
  updatedAt: Date
  verifiedAt?: Date
}

