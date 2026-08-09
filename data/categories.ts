// =============================================================================
// KISWA - Static Category Catalog
// =============================================================================
// Categories are managed in code for ZERO delay loading.
// Each category has a unique ID referenced by products and MongoDB orders.
// =============================================================================

export interface Category {
  id: string            // Unique category ID (e.g., "CAT-prayer-mat")
  slug: string          // URL-friendly slug (used in /collections/[slug])
  name: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  image: string         // Badge/icon image path
  parentCategory?: string  // For subcategory support
  sortOrder: number     // Display order
}

// ---------------------------------------------------------------------------
// All Categories
// ---------------------------------------------------------------------------
export const categories: Category[] = [
  {
    id: 'CAT-gifts',
    slug: 'gifts',
    name: { en: 'Gift Sets', ar: 'أطقم هدايا' },
    description: { en: 'Premium Islamic gift sets for every occasion.', ar: 'أطقم هدايا إسلامية فاخرة لكل مناسبة.' },
    image: '/categories/prayer-mats-badge.png',
    sortOrder: 1,
  },
  {
    id: 'CAT-prayer-mat',
    slug: 'prayer-mat',
    name: { en: 'Prayer Mats', ar: 'سجاد صلاة' },
    description: { en: 'Premium prayer mats for your daily worship.', ar: 'سجادات صلاة فاخرة لعبادتك اليومية.' },
    image: '/categories/prayer-mats-badge.png',
    sortOrder: 2,
  },
  {
    id: 'CAT-metal-art',
    slug: 'metal-art',
    name: { en: 'Islamic Wall Art', ar: 'فن الجدار الإسلامي' },
    description: { en: 'Premium Islamic metal wall art and calligraphy pieces.', ar: 'لوحات جدارية إسلامية فاخرة وأعمال الخط العربي.' },
    image: '/categories/prayer-wear-badge.png',
    sortOrder: 3,
  },
  {
    id: 'CAT-table-decor',
    slug: 'table-decor',
    name: { en: 'Table Decor', ar: 'ديكور طاولة' },
    description: { en: 'Islamic table decor pieces for home and office.', ar: 'قطع ديكور طاولة إسلامية للمنزل والمكتب.' },
    image: '/categories/prayer-wear-badge.png',
    sortOrder: 4,
  },
  {
    id: 'CAT-clocks',
    slug: 'clocks',
    name: { en: 'Islamic Clocks', ar: 'ساعات إسلامية' },
    description: { en: 'Decorative Islamic wall clocks with beautiful calligraphy.', ar: 'ساعات جدارية إسلامية زخرفية بخط جميل.' },
    image: '/categories/tents-badge.png',
    sortOrder: 5,
  },
  {
    id: 'CAT-accessories',
    slug: 'accessories',
    name: { en: 'Prayer Accessories', ar: 'إكسسوارات صلاة' },
    description: { en: 'Prayer stools, stands and accessories for worship.', ar: 'كراسي صلاة وحوامل وإكسسوارات للعبادة.' },
    image: '/categories/prayer-wear-badge.png',
    sortOrder: 6,
  },
]

// =============================================================================
// Lookup Helpers
// =============================================================================

/** Look up a category by its unique ID */
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

/** Look up a category by its URL slug */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

/** Get all categories sorted by sortOrder */
export function getSortedCategories(): Category[] {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
}

/** Get subcategories of a parent category */
export function getSubcategories(parentId: string): Category[] {
  return categories.filter((c) => c.parentCategory === parentId)
}
