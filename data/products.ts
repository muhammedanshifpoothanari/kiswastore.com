// =============================================================================
// KISWA - Static Product Catalog
// =============================================================================
// Products are managed in code for ZERO delay loading.
// Prices are VAT inclusive (per catalog: "Total amount include vat").
// =============================================================================

export interface Product {
  id: string
  slug: string
  name: { en: string; ar: string }
  price: number
  originalPrice?: number
  offer?: string
  image: string
  categoryId: string
  itemCode?: string
  size?: string
  material?: string
  description?: { en: string; ar: string }
  inStock: boolean
  featured?: boolean
  sortOrder?: number
}

// ---------------------------------------------------------------------------
// Metal Art, Wall Decor & Clocks
// ---------------------------------------------------------------------------
export const metalArt: Product[] = [
  // Maqam Ibrahim
  {
    id: 'MID9072-A', slug: 'kiswa-maqam-ibrahim-mild-steel-gold',
    name: { en: 'Kiswa Maqam Ibrahim – Mild Steel Gold', ar: 'مقام إبراهيم كسوة – فولاذ ذهبي' },
    price: 900, image: '/products/metal art 1.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9072', size: '30 CM × 45 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Kiswa Maqam Ibrahim in 1.5mm mild steel with gold powder coating. 30×45 cm.', ar: 'مقام إبراهيم كسوة فولاذ خفيف 1.5 ملم طلاء ذهبي. 30×45 سم.' },
    inStock: true, featured: true, sortOrder: 1,
  },
  {
    id: 'MID9072-B', slug: 'kiswa-maqam-ibrahim-stainless-steel-gold',
    name: { en: 'Kiswa Maqam Ibrahim – Stainless Steel Gold', ar: 'مقام إبراهيم كسوة – ستانلس ذهبي' },
    price: 1600, image: '/products/metal art 1.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9072', size: '30 CM × 45 CM', material: '1.5mm Stainless Steel – Gold Powder Coating',
    description: { en: 'Kiswa Maqam Ibrahim in 1.5mm stainless steel with gold powder coating. 30×45 cm.', ar: 'مقام إبراهيم كسوة ستانلس ستيل 1.5 ملم طلاء ذهبي. 30×45 سم.' },
    inStock: true, featured: true, sortOrder: 2,
  },
  // Quran Stand
  {
    id: 'MID9073-A', slug: 'kiswa-quran-stand-gold',
    name: { en: 'Kiswa Quran Stand – Gold', ar: 'حامل قرآن كسوة – ذهبي' },
    price: 340, image: '/products/MID9073_QuranStand.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9073', size: '25 CM × 45 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Quran stand in gold powder coating. 25×45 cm.', ar: 'حامل قرآن طلاء ذهبي. 25×45 سم.' },
    inStock: true, featured: true, sortOrder: 3,
  },
  {
    id: 'MID9073-B', slug: 'kiswa-quran-stand-black',
    name: { en: 'Kiswa Quran Stand – Black', ar: 'حامل قرآن كسوة – أسود' },
    price: 340, image: '/products/MID9073_QuranStand.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9073', size: '25 CM × 45 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Quran stand in black powder coating. 25×45 cm.', ar: 'حامل قرآن طلاء أسود. 25×45 سم.' },
    inStock: true, sortOrder: 4,
  },
  // Bismillah Table Decor MID9078
  {
    id: 'MID9078-A', slug: 'kiswa-bismillah-table-decor-gold-9078',
    name: { en: 'Kiswa Bismillah Table Decor – Gold', ar: 'ديكور طاولة بسم الله – ذهبي' },
    price: 110, image: '/products/MID9009_Bismillah.webp', categoryId: 'CAT-table-decor',
    itemCode: 'MID9078', size: '20 CM × 22 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Bismillah table decor in gold. 20×22 cm.', ar: 'ديكور طاولة بسم الله ذهبي. 20×22 سم.' },
    inStock: true, featured: true, sortOrder: 5,
  },
  {
    id: 'MID9078-B', slug: 'kiswa-bismillah-table-decor-black-9078',
    name: { en: 'Kiswa Bismillah Table Decor – Black', ar: 'ديكور طاولة بسم الله – أسود' },
    price: 110, image: '/products/MID9009_Bismillah.webp', categoryId: 'CAT-table-decor',
    itemCode: 'MID9078', size: '20 CM × 22 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Bismillah table decor in black. 20×22 cm.', ar: 'ديكور طاولة بسم الله أسود. 20×22 سم.' },
    inStock: true, sortOrder: 6,
  },
  // Alhamdulillah Table Decor MID9074
  {
    id: 'MID9074-A', slug: 'kiswa-alhamdulillah-table-decor-gold',
    name: { en: 'Kiswa Alhamdulillah Table Decor – Gold', ar: 'ديكور طاولة الحمد لله – ذهبي' },
    price: 110, image: '/products/MID9007_Allahu.webp', categoryId: 'CAT-table-decor',
    itemCode: 'MID9074', size: '20 CM × 22 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Alhamdulillah table decor in gold. 20×22 cm.', ar: 'ديكور طاولة الحمد لله ذهبي. 20×22 سم.' },
    inStock: true, featured: true, sortOrder: 7,
  },
  {
    id: 'MID9074-B', slug: 'kiswa-alhamdulillah-table-decor-black',
    name: { en: 'Kiswa Alhamdulillah Table Decor – Black', ar: 'ديكور طاولة الحمد لله – أسود' },
    price: 110, image: '/products/MID9007_Allahu.webp', categoryId: 'CAT-table-decor',
    itemCode: 'MID9074', size: '20 CM × 22 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Alhamdulillah table decor in black. 20×22 cm.', ar: 'ديكور طاولة الحمد لله أسود. 20×22 سم.' },
    inStock: true, sortOrder: 8,
  },
  // Masjid Table Decor MID9077
  {
    id: 'MID9077-A', slug: 'kiswa-masjid-table-decor-gold',
    name: { en: 'Kiswa Masjid Table Decor – Gold', ar: 'ديكور طاولة مسجد – ذهبي' },
    price: 110, image: '/products/metal art 4.webp', categoryId: 'CAT-table-decor',
    itemCode: 'MID9077', size: '20 CM × 22 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Masjid silhouette table decor in gold. 20×22 cm.', ar: 'ديكور طاولة مسجد ذهبي. 20×22 سم.' },
    inStock: true, featured: true, sortOrder: 9,
  },
  {
    id: 'MID9077-B', slug: 'kiswa-masjid-table-decor-black',
    name: { en: 'Kiswa Masjid Table Decor – Black', ar: 'ديكور طاولة مسجد – أسود' },
    price: 110, image: '/products/metal art 5.webp', categoryId: 'CAT-table-decor',
    itemCode: 'MID9077', size: '20 CM × 22 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Masjid silhouette table decor in black. 20×22 cm.', ar: 'ديكور طاولة مسجد أسود. 20×22 سم.' },
    inStock: true, sortOrder: 10,
  },
  // Bismillah Moon MID9076
  {
    id: 'MID9076-A', slug: 'kiswa-bismillah-moon-decor-gold',
    name: { en: 'Kiswa Bismillah Moon Table Decor – Gold', ar: 'ديكور طاولة بسم الله هلال – ذهبي' },
    price: 110, image: '/products/MID9009_Bismillah.webp', categoryId: 'CAT-table-decor',
    itemCode: 'MID9076', size: '20 CM × 22 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Bismillah crescent moon table decor in gold. 20×22 cm.', ar: 'ديكور طاولة بسم الله هلال ذهبي. 20×22 سم.' },
    inStock: true, sortOrder: 11,
  },
  {
    id: 'MID9076-B', slug: 'kiswa-bismillah-moon-decor-black',
    name: { en: 'Kiswa Bismillah Moon Table Decor – Black', ar: 'ديكور طاولة بسم الله هلال – أسود' },
    price: 110, image: '/products/MID9009_Bismillah.webp', categoryId: 'CAT-table-decor',
    itemCode: 'MID9076', size: '20 CM × 22 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Bismillah crescent moon table decor in black. 20×22 cm.', ar: 'ديكور طاولة بسم الله هلال أسود. 20×22 سم.' },
    inStock: true, sortOrder: 12,
  },
  // Allahu Muhammed MID9075
  {
    id: 'MID9075-A', slug: 'kiswa-allahu-muhammed-decor-gold',
    name: { en: 'Kiswa Allahu Muhammed (S) Table Decor – Gold', ar: 'ديكور طاولة الله محمد ﷺ – ذهبي' },
    price: 110, image: '/products/MID9007_Allahu.webp', categoryId: 'CAT-table-decor',
    itemCode: 'MID9075', size: '20 CM × 22 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Allah & Muhammad (SAW) calligraphy table decor in gold. 20×22 cm.', ar: 'ديكور طاولة بخط الله ومحمد ﷺ ذهبي. 20×22 سم.' },
    inStock: true, featured: true, sortOrder: 13,
  },
  {
    id: 'MID9075-B', slug: 'kiswa-allahu-muhammed-decor-black',
    name: { en: 'Kiswa Allahu Muhammed (S) Table Decor – Black', ar: 'ديكور طاولة الله محمد ﷺ – أسود' },
    price: 110, image: '/products/MID9007_Allahu.webp', categoryId: 'CAT-table-decor',
    itemCode: 'MID9075', size: '20 CM × 22 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Allah & Muhammad (SAW) calligraphy table decor in black. 20×22 cm.', ar: 'ديكور طاولة بخط الله ومحمد ﷺ أسود. 20×22 سم.' },
    inStock: true, sortOrder: 14,
  },
  // Ayatul Kursi Wall Art MID9001 - Black
  {
    id: 'MID9001-58-BK', slug: 'kiswa-ayatul-kursi-58-black',
    name: { en: 'Kiswa Ayatul Kursi Wall Art 58cm – Black', ar: 'لوحة آية الكرسي 58 سم – أسود' },
    price: 520, image: '/products/MID9001.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9001', size: '58 CM × 77 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Ayatul Kursi wall art black. 58×77 cm.', ar: 'لوحة آية الكرسي أسود. 58×77 سم.' },
    inStock: true, featured: true, sortOrder: 15,
  },
  {
    id: 'MID9001-70-BK', slug: 'kiswa-ayatul-kursi-70-black',
    name: { en: 'Kiswa Ayatul Kursi Wall Art 70cm – Black', ar: 'لوحة آية الكرسي 70 سم – أسود' },
    price: 875, image: '/products/MID9001.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9001', size: '70 CM × 90 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Ayatul Kursi wall art black. 70×90 cm.', ar: 'لوحة آية الكرسي أسود. 70×90 سم.' },
    inStock: true, sortOrder: 16,
  },
  {
    id: 'MID9001-90-BK', slug: 'kiswa-ayatul-kursi-90-black',
    name: { en: 'Kiswa Ayatul Kursi Wall Art 90cm – Black', ar: 'لوحة آية الكرسي 90 سم – أسود' },
    price: 1525, image: '/products/MID9001.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9001', size: '90 CM × 116 CM', material: '2mm Mild Steel – Black Powder Coating',
    description: { en: 'Extra-large Ayatul Kursi wall art black. 90×116 cm.', ar: 'لوحة آية الكرسي كبيرة أسود. 90×116 سم.' },
    inStock: true, sortOrder: 17,
  },
  // Ayatul Kursi Wall Art MID9001 - Gold
  {
    id: 'MID9001-58-GD', slug: 'kiswa-ayatul-kursi-58-gold',
    name: { en: 'Kiswa Ayatul Kursi Wall Art 58cm – Gold', ar: 'لوحة آية الكرسي 58 سم – ذهبي' },
    price: 520, image: '/products/MID9001.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9001', size: '58 CM × 77 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Ayatul Kursi wall art gold. 58×77 cm.', ar: 'لوحة آية الكرسي ذهبي. 58×77 سم.' },
    inStock: true, featured: true, sortOrder: 18,
  },
  {
    id: 'MID9001-70-GD', slug: 'kiswa-ayatul-kursi-70-gold',
    name: { en: 'Kiswa Ayatul Kursi Wall Art 70cm – Gold', ar: 'لوحة آية الكرسي 70 سم – ذهبي' },
    price: 875, image: '/products/MID9001.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9001', size: '70 CM × 90 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Ayatul Kursi wall art gold. 70×90 cm.', ar: 'لوحة آية الكرسي ذهبي. 70×90 سم.' },
    inStock: true, sortOrder: 19,
  },
  // Ayatul Kursi Wall Art MID9001 - Silver
  {
    id: 'MID9001-58-SV', slug: 'kiswa-ayatul-kursi-58-silver',
    name: { en: 'Kiswa Ayatul Kursi Wall Art 58cm – Silver', ar: 'لوحة آية الكرسي 58 سم – فضي' },
    price: 520, image: '/products/MID9001.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9001', size: '58 CM × 77 CM', material: '1.5mm Mild Steel – Silver Powder Coating',
    description: { en: 'Ayatul Kursi wall art silver. 58×77 cm.', ar: 'لوحة آية الكرسي فضي. 58×77 سم.' },
    inStock: true, sortOrder: 20,
  },
  // Allahu-Muhammad Wall Art MID9006
  {
    id: 'MID9006-GD', slug: 'kiswa-allahu-muhammad-wall-art-gold',
    name: { en: 'Kiswa Allahu-Muhammad Wall Art – Gold', ar: 'لوحة الله محمد – ذهبي' },
    price: 875, image: '/products/MID9006.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9006', size: '65 CM × 89 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Allahu-Muhammad calligraphy wall art in gold. 65×89 cm.', ar: 'لوحة الله محمد ذهبي. 65×89 سم.' },
    inStock: true, featured: true, sortOrder: 21,
  },
  {
    id: 'MID9006-BK', slug: 'kiswa-allahu-muhammad-wall-art-black',
    name: { en: 'Kiswa Allahu-Muhammad Wall Art – Black', ar: 'لوحة الله محمد – أسود' },
    price: 875, image: '/products/MID9006.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9006', size: '65 CM × 89 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Allahu-Muhammad calligraphy wall art in black. 65×89 cm.', ar: 'لوحة الله محمد أسود. 65×89 سم.' },
    inStock: true, sortOrder: 22,
  },
  // Surah Al-Ikhlas Clock MID9042 - 60cm
  {
    id: 'MID9042-GD', slug: 'kiswa-surah-ikhlas-clock-60-gold',
    name: { en: 'Kiswa Surah Al-Ikhlas Clock 60cm – Gold', ar: 'ساعة سورة الإخلاص 60 سم – ذهبي' },
    price: 495, image: '/products/MID9042.webp', categoryId: 'CAT-clocks',
    itemCode: 'MID9042', size: '60 CM × 60 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Surah Al-Ikhlas wall clock in gold. 60×60 cm.', ar: 'ساعة سورة الإخلاص ذهبي. 60×60 سم.' },
    inStock: true, featured: true, sortOrder: 23,
  },
  {
    id: 'MID9042-BK', slug: 'kiswa-surah-ikhlas-clock-60-black',
    name: { en: 'Kiswa Surah Al-Ikhlas Clock 60cm – Black', ar: 'ساعة سورة الإخلاص 60 سم – أسود' },
    price: 495, image: '/products/MID9042.webp', categoryId: 'CAT-clocks',
    itemCode: 'MID9042', size: '60 CM × 60 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Surah Al-Ikhlas wall clock in black. 60×60 cm.', ar: 'ساعة سورة الإخلاص أسود. 60×60 سم.' },
    inStock: true, sortOrder: 24,
  },
  // Ayatul Kursi Clock MID9044
  {
    id: 'MID9044-GD', slug: 'kiswa-ayatul-kursi-clock-60-gold',
    name: { en: 'Kiswa Ayatul Kursi Clock 60cm – Gold', ar: 'ساعة آية الكرسي 60 سم – ذهبي' },
    price: 495, image: '/products/MID9043.webp', categoryId: 'CAT-clocks',
    itemCode: 'MID9044', size: '60 CM × 60 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Ayatul Kursi wall clock in gold. 60×60 cm.', ar: 'ساعة آية الكرسي ذهبي. 60×60 سم.' },
    inStock: true, featured: true, sortOrder: 25,
  },
  {
    id: 'MID9044-BK', slug: 'kiswa-ayatul-kursi-clock-60-black',
    name: { en: 'Kiswa Ayatul Kursi Clock 60cm – Black', ar: 'ساعة آية الكرسي 60 سم – أسود' },
    price: 495, image: '/products/MID9043.webp', categoryId: 'CAT-clocks',
    itemCode: 'MID9044', size: '60 CM × 60 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Ayatul Kursi wall clock in black. 60×60 cm.', ar: 'ساعة آية الكرسي أسود. 60×60 سم.' },
    inStock: true, sortOrder: 26,
  },
  // Surah Al-Ikhlas Clock MID9015 - 45cm
  {
    id: 'MID9015-GD', slug: 'kiswa-surah-ikhlas-clock-45-gold',
    name: { en: 'Kiswa Surah Al-Ikhlas Clock 45cm – Gold', ar: 'ساعة سورة الإخلاص 45 سم – ذهبي' },
    price: 285, image: '/products/MID9015_SurahAlIkhlas.webp', categoryId: 'CAT-clocks',
    itemCode: 'MID9015', size: '45 CM × 45 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Surah Al-Ikhlas wall clock in gold. 45×45 cm.', ar: 'ساعة سورة الإخلاص ذهبي. 45×45 سم.' },
    inStock: true, sortOrder: 27,
  },
  {
    id: 'MID9015-BK', slug: 'kiswa-surah-ikhlas-clock-45-black',
    name: { en: 'Kiswa Surah Al-Ikhlas Clock 45cm – Black', ar: 'ساعة سورة الإخلاص 45 سم – أسود' },
    price: 285, image: '/products/MID9015_SurahAlIkhlas.webp', categoryId: 'CAT-clocks',
    itemCode: 'MID9015', size: '45 CM × 45 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Surah Al-Ikhlas wall clock in black. 45×45 cm.', ar: 'ساعة سورة الإخلاص أسود. 45×45 سم.' },
    inStock: true, sortOrder: 28,
  },
  // Allahu Akbar MID9022
  {
    id: 'MID9022-GD', slug: 'kiswa-allahu-akbar-gold',
    name: { en: 'Kiswa Allahu Akbar Wall Art – Gold', ar: 'لوحة الله أكبر – ذهبي' },
    price: 360, image: '/products/MID9022.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9022', size: '19 CM × 90 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: 'Allahu Akbar vertical wall art in gold. 19×90 cm.', ar: 'لوحة الله أكبر عمودية ذهبية. 19×90 سم.' },
    inStock: true, featured: true, sortOrder: 29,
  },
  {
    id: 'MID9022-BK', slug: 'kiswa-allahu-akbar-black',
    name: { en: 'Kiswa Allahu Akbar Wall Art – Black', ar: 'لوحة الله أكبر – أسود' },
    price: 360, image: '/products/MID9022.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9022', size: '19 CM × 90 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: 'Allahu Akbar vertical wall art in black. 19×90 cm.', ar: 'لوحة الله أكبر عمودية سوداء. 19×90 سم.' },
    inStock: true, sortOrder: 30,
  },
  // Hadha Min Fadli Rabbi MID9017
  {
    id: 'MID9017-GD', slug: 'kiswa-hadha-min-fadli-rabbi-gold',
    name: { en: 'Kiswa Hadha Min Fadli Rabbi – Gold', ar: 'لوحة هذا من فضل ربي – ذهبي' },
    price: 420, image: '/products/MID9017.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9017', size: '105 CM × 29 CM', material: '1.5mm Mild Steel – Gold Powder Coating',
    description: { en: '"Hadha Min Fadli Rabbi" wall art in gold. 105×29 cm.', ar: 'لوحة "هذا من فضل ربي" ذهبية. 105×29 سم.' },
    inStock: true, featured: true, sortOrder: 31,
  },
  {
    id: 'MID9017-BK', slug: 'kiswa-hadha-min-fadli-rabbi-black',
    name: { en: 'Kiswa Hadha Min Fadli Rabbi – Black', ar: 'لوحة هذا من فضل ربي – أسود' },
    price: 420, image: '/products/MID9017.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9017', size: '105 CM × 29 CM', material: '1.5mm Mild Steel – Black Powder Coating',
    description: { en: '"Hadha Min Fadli Rabbi" wall art in black. 105×29 cm.', ar: 'لوحة "هذا من فضل ربي" سوداء. 105×29 سم.' },
    inStock: true, sortOrder: 32,
  },
  // 35 Bismillah Stainless MID9020
  {
    id: 'MID9020-75', slug: 'kiswa-35-bismillah-stainless-75cm',
    name: { en: 'Kiswa 35 Bismillah Stainless Gold 75cm', ar: 'لوحة 35 بسملة ستانلس ذهبي 75 سم' },
    price: 2400, image: '/products/MID9009_Bismillah.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9020', size: '75 CM × 75 CM', material: '1.5mm Stainless Steel – Gold PVD Coating',
    description: { en: '35 Bismillah stainless steel wall art gold PVD. 75×75 cm.', ar: 'لوحة 35 بسملة ستانلس ذهبي PVD. 75×75 سم.' },
    inStock: true, featured: true, sortOrder: 33,
  },
  {
    id: 'MID9020-90', slug: 'kiswa-35-bismillah-stainless-90cm',
    name: { en: 'Kiswa 35 Bismillah Stainless Gold 90cm', ar: 'لوحة 35 بسملة ستانلس ذهبي 90 سم' },
    price: 3485, image: '/products/MID9009_Bismillah.webp', categoryId: 'CAT-metal-art',
    itemCode: 'MID9020', size: '90 CM × 90 CM', material: '1.5mm Stainless Steel – Gold PVD Coating',
    description: { en: '35 Bismillah stainless steel wall art gold PVD. 90×90 cm.', ar: 'لوحة 35 بسملة ستانلس ذهبي PVD. 90×90 سم.' },
    inStock: true, sortOrder: 34,
  },
  // Acrylic Quran Stand MID2495
  {
    id: 'MID2495', slug: 'kiswa-acrylic-quran-stand',
    name: { en: 'Kiswa Acrylic Quran Stand – 8mm Arabic Engraved', ar: 'حامل قرآن أكريليك 8 ملم نقش عربي' },
    price: 120, image: '/products/MetalQuranStandGold.png', categoryId: 'CAT-metal-art',
    itemCode: 'MID2495', size: '32 CM × 24 CM', material: '8mm Acrylic – Engraved Arabic Alphabet',
    description: { en: 'Acrylic Quran stand with Arabic engraving. 32×24 cm.', ar: 'حامل قرآن أكريليك نقش عربي. 32×24 سم.' },
    inStock: true, featured: true, sortOrder: 35,
  },
]

// ---------------------------------------------------------------------------
// Prayer Mats
// ---------------------------------------------------------------------------
export const prayerMats: Product[] = [
  {
    id: 'PM-BAG-MIX', slug: 'kiswa-bag-prayer-mat-mix',
    name: { en: 'Kiswa Bag Prayer Mat – Mix Design & Colour', ar: 'سجادة صلاة كيس – تصاميم متنوعة' },
    price: 46, image: '/products/bagprayermatmixeddesigncreambeige3 (1).webp', categoryId: 'CAT-prayer-mat',
    description: { en: 'Bag prayer mat in mixed designs and colours.', ar: 'سجادة صلاة كيس بتصاميم وألوان متنوعة.' },
    inStock: true, featured: true, sortOrder: 1,
  },
  {
    id: 'PM-ROLL', slug: 'kiswa-prayer-mat-roll',
    name: { en: 'Kiswa Prayer Mat Roll', ar: 'سجادة صلاة لفة كسوة' },
    price: 46, image: '/products/rollupprayermatmixedcolourcreambeigeme (2).webp', categoryId: 'CAT-prayer-mat',
    description: { en: 'Compact roll-up prayer mat, easy to carry.', ar: 'سجادة صلاة قابلة للف، سهلة الحمل.' },
    inStock: true, featured: true, sortOrder: 2,
  },
  {
    id: 'PM-LUXURY-COMFORT', slug: 'luxurious-comfortable-prayer-rug',
    name: { en: 'Luxurious & Comfortable Prayer Rug – Multiple Colours', ar: 'سجادة صلاة فاخرة ومريحة – ألوان متعددة' },
    price: 110, image: '/products/prayer-mat-premium.png', categoryId: 'CAT-prayer-mat',
    description: { en: 'Luxurious and comfortable prayer rug in multiple colours.', ar: 'سجادة صلاة فاخرة ومريحة بألوان متعددة.' },
    inStock: true, featured: true, sortOrder: 3,
  },
  {
    id: 'PM-VISCOUS', slug: 'kiswa-viscous-prayer-mat',
    name: { en: 'Kiswa Viscous Prayer Mat', ar: 'سجادة صلاة فسكوز كسوة' },
    price: 690, image: '/products/viscous 1.jpg', categoryId: 'CAT-prayer-mat',
    description: { en: 'Premium viscous prayer mat with intricate design.', ar: 'سجادة صلاة فسكوز فاخرة.' },
    inStock: true, featured: true, sortOrder: 4,
  },
  {
    id: 'PM-BAMBOO-SILK', slug: 'kiswa-bamboo-silk-prayer-mat',
    name: { en: 'Kiswa Bamboo Silk Prayer Mat', ar: 'سجادة صلاة حرير بامبو كسوة' },
    price: 600, image: '/products/bamboo silk red 2.webp', categoryId: 'CAT-prayer-mat',
    description: { en: 'Premium bamboo silk prayer mat in assorted colours.', ar: 'سجادة صلاة حرير بامبو فاخرة بألوان متنوعة.' },
    inStock: true, featured: true, sortOrder: 5,
  },
  {
    id: 'PM-GROUP', slug: 'kiswa-group-prayer-mat',
    name: { en: 'Kiswa Group Prayer Mat', ar: 'سجادة صلاة جماعية كسوة' },
    price: 500, image: '/products/GroupBakPrayerMat.webp', categoryId: 'CAT-prayer-mat',
    description: { en: 'Group prayer mat for congregation.', ar: 'سجادة صلاة جماعية.' },
    inStock: true, featured: true, sortOrder: 6,
  },
  {
    id: 'PM-MEMORY-BAB-KAABA', slug: 'kiswa-bab-kaaba-memory-foam-mat',
    name: { en: 'Kiswa Bab Al-Kaaba Memory Foam Prayer Mat – Black & Gold', ar: 'سجادة فوم ذاكرة باب الكعبة – أسود وذهبي' },
    price: 300, image: '/products/GiftBox_PrayerMatBlack.png', categoryId: 'CAT-prayer-mat',
    description: { en: 'Memory foam prayer mat, removable/washable. 2cm foam. Colors: Black & Gold.', ar: 'سجادة فوم ذاكرة قابلة للإزالة والغسيل. فوم 2 سم. الألوان: أسود وذهبي.' },
    inStock: true, featured: true, sortOrder: 7,
  },
  {
    id: 'PM-FOAM-HIGHQ', slug: 'kiswa-prayer-mat-foam-1cm-washable',
    name: { en: 'Kiswa Prayer Mat – 1cm High Quality Foam Washable', ar: 'سجادة صلاة – فوم 1 سم قابل للغسيل' },
    price: 20, image: '/products/1FoamPrayerMat_Arch.png', categoryId: 'CAT-prayer-mat',
    description: { en: '1cm washable foam prayer mat. Assorted 6-8 colors.', ar: 'سجادة فوم 1 سم قابل للغسيل. 6-8 ألوان متنوعة.' },
    inStock: true, sortOrder: 8,
  },
  {
    id: 'PM-FOAM-PREMIUM-80', slug: 'kiswa-premium-foam-prayer-mat',
    name: { en: 'Kiswa Premium Foam Prayer Mat', ar: 'سجادة صلاة فوم كسوة بريميوم' },
    price: 80, image: '/products/3FoamPrayerMat_Arch.png', categoryId: 'CAT-prayer-mat',
    description: { en: 'Premium foam prayer mat with arch design.', ar: 'سجادة صلاة فوم فاخرة بتصميم قوس.' },
    inStock: true, featured: true, sortOrder: 9,
  },
  {
    id: 'PM-FOAM-PREMIUM-10', slug: 'kiswa-premium-prayer-mat-10mm',
    name: { en: 'Kiswa Premium Prayer Mat 10mm – Colour & Design Assorted', ar: 'سجادة صلاة بريميوم 10 ملم – ألوان وتصاميم متنوعة' },
    price: 140, image: '/products/3mm.png', categoryId: 'CAT-prayer-mat',
    description: { en: 'Premium 10mm foam prayer mat, assorted colours and designs.', ar: 'سجادة فوم 10 ملم فاخرة بألوان وتصاميم متنوعة.' },
    inStock: true, featured: true, sortOrder: 10,
  },
  {
    id: 'PM-FOAM-PREMIUM-135', slug: 'kiswa-premium-prayer-mat-13-5mm',
    name: { en: 'Kiswa Premium Prayer Mat 13.5mm – Colour & Design Assorted', ar: 'سجادة صلاة بريميوم 13.5 ملم – ألوان وتصاميم متنوعة' },
    price: 180, image: '/products/4mm2.png', categoryId: 'CAT-prayer-mat',
    description: { en: 'Premium 13.5mm foam prayer mat, assorted colours and designs.', ar: 'سجادة فوم 13.5 ملم فاخرة بألوان وتصاميم متنوعة.' },
    inStock: true, featured: true, sortOrder: 11,
  },
]

// ---------------------------------------------------------------------------
// Prayer Accessories
// ---------------------------------------------------------------------------
export const prayerAccessories: Product[] = [
  {
    id: 'PA-STOOL', slug: 'kiswa-prayer-stool',
    name: { en: 'Kiswa Prayer Stool', ar: 'كرسي صلاة كسوة' },
    price: 100, image: '/products/meditationstool (1).webp', categoryId: 'CAT-accessories',
    description: { en: 'Ergonomic prayer stool for comfortable worship.', ar: 'كرسي صلاة مريح للعبادة.' },
    inStock: true, featured: true, sortOrder: 1,
  },
  {
    id: 'PA-WAQAR-STAND', slug: 'kiswa-al-waqar-stand',
    name: { en: 'Kiswa Al-Waqar Stand', ar: 'حامل الوقار كسوة' },
    price: 600, image: '/products/MetalArtWhitePrayerStand.png', categoryId: 'CAT-accessories',
    description: { en: 'Premium prayer rug display stand.', ar: 'حامل عرض سجادة الصلاة الوقار الفاخر.' },
    inStock: true, featured: true, sortOrder: 2,
  },
]

// ---------------------------------------------------------------------------
// Gift Boxes
// ---------------------------------------------------------------------------
export const giftBoxes: Product[] = [
  {
    id: 'GB-QURAN-BLACK', slug: 'kiswa-giftbox-quran',
    name: { en: 'Kiswa GiftBox Quran', ar: 'صندوق هدية قرآن كسوة' },
    price: 184, image: '/products/GiftBoxQuranBlack.png', categoryId: 'CAT-gifts',
    description: { en: 'Premium Kiswa gift box with Quran, ideal for special occasions.', ar: 'صندوق هدية كسوة الفاخر يحتوي على قرآن.' },
    inStock: true, featured: true, sortOrder: 1,
  },
  {
    id: 'GB-PRAYERMAT-BOX', slug: 'kiswa-giftbox-with-prayer-mat',
    name: { en: 'Kiswa GiftBox With Prayer Mat', ar: 'صندوق هدية كسوة مع سجادة صلاة' },
    price: 218, image: '/products/GiftBOxPrayerMatBeige.png', categoryId: 'CAT-gifts',
    description: { en: 'Luxury Kiswa gift box including a premium prayer mat.', ar: 'صندوق هدية كسوة الفاخر مع سجادة صلاة فاخرة.' },
    inStock: true, featured: true, sortOrder: 2,
  },
]

// =============================================================================
// ALL PRODUCTS & Lookup Helpers
// =============================================================================

export const allProducts: Product[] = [
  ...metalArt,
  ...prayerMats,
  ...prayerAccessories,
  ...giftBoxes,
]

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug)
}

export function getProductsByCategoryId(categoryId: string): Product[] {
  return allProducts.filter((p) => p.categoryId === categoryId)
}

export function getFeaturedProducts(categoryId?: string): Product[] {
  let products = allProducts.filter((p) => p.featured)
  if (categoryId) {
    products = products.filter((p) => p.categoryId === categoryId)
  }
  return products.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
}
