'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useUIStore } from '@/store/ui-store'
import { Sparkles } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  unit: string
  image: string
  isSeasonal: boolean
  seasonStart: string | null
  seasonEnd: string | null
  format: string
  category: string
}

export default function SeasonalHighlights() {
  const setSelectedProduct = useUIStore((s) => s.setSelectedProduct)

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const res = await fetch('/api/products?featured=true')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-16 sm:py-24 bg-[#FDF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="secondary"
              className="bg-[#D8F3DC] text-[#2D6A4F] mb-4 px-4 py-1"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Época Atual
            </Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B4332]">
              Destaques da Época
            </h2>
            <p className="mt-4 text-[#5C7A6B] max-w-2xl mx-auto">
              Os nossos pequenos frutos mais frescos, prontos para levar até si
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-[#B7E4C7]">
                <Skeleton className="h-56 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products?.map((product) => (
              <motion.div key={product.id} variants={item}>
                <Card
                  className="overflow-hidden border-[#B7E4C7] hover:shadow-lg transition-shadow cursor-pointer group bg-white"
                  onClick={() => setSelectedProduct(product.slug)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isSeasonal && (
                      <Badge className="absolute top-3 left-3 bg-[#2D6A4F] text-[#FEFAE0]">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Sazonal
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="absolute top-3 right-3 bg-white/90 text-[#1B4332]"
                    >
                      {product.format === 'fresco'
                        ? 'Fresco'
                        : product.format === 'congelado'
                        ? 'Congelado'
                        : 'Cabaz Misto'}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#1B4332] group-hover:text-[#2D6A4F] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#2D6A4F] font-bold text-lg">
                        {product.price.toFixed(2)}€
                        <span className="text-sm font-normal text-[#5C7A6B]">
                          /{product.unit}
                        </span>
                      </span>
                      {product.isSeasonal && product.seasonStart && product.seasonEnd && (
                        <span className="text-xs text-[#5C7A6B]">
                          Época: {product.seasonStart} - {product.seasonEnd}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
