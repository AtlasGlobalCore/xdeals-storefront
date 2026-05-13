'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useUIStore } from '@/store/ui-store'
import { useToast } from '@/hooks/use-toast'

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

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const setSelectedProduct = useUIStore((s) => s.setSelectedProduct)
  const { toast } = useToast()

  const formatLabel =
    product.format === 'fresco'
      ? 'Fresco'
      : product.format === 'congelado'
      ? 'Congelado'
      : 'Cabaz Misto'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: 1,
      unit: product.unit,
      image: product.image,
    })
    toast({
      title: 'Adicionado ao carrinho',
      description: `${product.name} foi adicionado ao seu carrinho.`,
    })
  }

  return (
    <Card
      className="overflow-hidden border-[#B7E4C7] hover:shadow-lg transition-all cursor-pointer group bg-white"
      onClick={() => setSelectedProduct(product.slug)}
    >
      <div className="relative h-52 sm:h-56 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isSeasonal && (
            <Badge className="bg-[#2D6A4F] text-[#FEFAE0] text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Sazonal
            </Badge>
          )}
          {!product.inStock && (
            <Badge className="bg-[#9B2226] text-white text-xs">
              Esgotado
            </Badge>
          )}
        </div>
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 bg-white/90 text-[#1B4332] text-xs"
        >
          {formatLabel}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-[family-name:var(--font-playfair)] text-base sm:text-lg font-semibold text-[#1B4332] group-hover:text-[#2D6A4F] transition-colors line-clamp-1">
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
            <span className="text-xs text-[#5C7A6B] hidden sm:inline">
              {product.seasonStart} - {product.seasonEnd}
            </span>
          )}
        </div>
        <div className="mt-3">
          <Button
            size="sm"
            className="w-full bg-[#2D6A4F] hover:bg-[#40916C] text-[#FEFAE0] rounded-lg"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
