'use client'

import { useRouter } from 'next/navigation'
import ProductCard from './ProductCard'
import InstaStoryBar from './InstaStoryBar'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  offer?: string
  image: string
}

interface ProductGridProps {
  title: string
  products: Product[]
  buttonText: string
  categoryId: string
}

export default function ProductGrid({ title, products, buttonText, categoryId }: ProductGridProps) {
  const router = useRouter()

  const handleViewAll = () => {
    router.push(`/collections/${categoryId}`)
  }

  return (
    <section className="w-full bg-white py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Decorative Title */}
      <div className="flex flex-col items-center justify-center mb-8 md:mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-[#3d2e1e] text-center bg-white px-4 relative z-10">
          {title}
        </h2>
        {/* Background decorative pattern - optional, simulated with a line for now */}
        <div className="w-full h-px bg-gray-200 -mt-3 relative z-0 hidden md:block"></div>
      </div>

      {/* Products Grid - 2 Cols Mobile, 4 Cols Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            image={product.image}
            offer={product.offer}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-8 md:mt-10">
        <button 
          onClick={handleViewAll}
          className="px-8 py-2.5 bg-[#3d2e1e] text-white font-bold hover:bg-[#2a1f14] transition-colors text-xs md:text-sm rounded"
        >
          {buttonText}
        </button>
      </div>
    </section>
  )
}
