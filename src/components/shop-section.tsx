'use client'

import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from '@/components/product-card'
import { useUIStore } from '@/store/ui-store'

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
  inStock: boolean
}

const categoryFilters = [
  { value: 'todos', label: 'Todos' },
  { value: 'bagas', label: 'Bagas' },
  { value: 'arvore', label: 'Árvore' },
  { value: 'arbustos', label: 'Arbustos' },
  { value: 'morangos', label: 'Morangos' },
]

const formatFilters = [
  { value: 'todos', label: 'Todos' },
  { value: 'fresco', label: 'Fresco' },
  { value: 'congelado', label: 'Congelado' },
  { value: 'cabaz-misto', label: 'Cabazes Mistos' },
]

export default function ShopSection() {
  const categoryFilter = useUIStore((s) => s.categoryFilter)
  const formatFilter = useUIStore((s) => s.formatFilter)
  const setCategoryFilter = useUIStore((s) => s.setCategoryFilter)
  const setFormatFilter = useUIStore((s) => s.setFormatFilter)

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products', categoryFilter, formatFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (categoryFilter && categoryFilter !== 'todos') params.set('category', categoryFilter)
      if (formatFilter && formatFilter !== 'todos') params.set('format', formatFilter)
      const res = await fetch(`/api/products?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  return (
    <section id="loja" className="py-16 sm:py-24 bg-[#FDF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <Badge
            variant="secondary"
            className="bg-[#D8F3DC] text-[#2D6A4F] mb-4 px-4 py-1"
          >
            Nossos Produtos
          </Badge>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B4332]">
            Nossa Loja
          </h2>
          <p className="mt-4 text-[#5C7A6B] max-w-2xl mx-auto">
            Explore a nossa seleção de pequenos frutos frescos, congelados e cabazes mistos
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {categoryFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={categoryFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              className={
                categoryFilter === filter.value
                  ? 'bg-[#2D6A4F] text-[#FEFAE0] hover:bg-[#40916C] rounded-full'
                  : 'border-[#B7E4C7] text-[#1B4332] hover:bg-[#D8F3DC] rounded-full'
              }
              onClick={() => setCategoryFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Format Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {formatFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={formatFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              className={
                formatFilter === filter.value
                  ? 'bg-[#2D6A4F] text-[#FEFAE0] hover:bg-[#40916C] rounded-full'
                  : 'border-[#B7E4C7] text-[#1B4332] hover:bg-[#D8F3DC] rounded-full'
              }
              onClick={() => setFormatFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-56 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#5C7A6B] text-lg">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-[#B7E4C7] text-[#2D6A4F] hover:bg-[#D8F3DC]"
              onClick={() => {
                setCategoryFilter('todos')
                setFormatFilter('todos')
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
