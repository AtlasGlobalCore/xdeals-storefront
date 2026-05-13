'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useUIStore } from '@/store/ui-store'
import { useCartStore } from '@/store/cart-store'
import {
  ShoppingCart,
  MapPin,
  Snowflake,
  Sun,
  Leaf,
  Info,
  Sparkles,
  Minus,
  Plus,
} from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  unit: string
  image: string
  isSeasonal: boolean
  seasonStart: string | null
  seasonEnd: string | null
  format: string
  category: string
  inStock: boolean
  origin: string
  nutritionalInfo: string | null
  storageTips: string | null
}

export default function ProductDetailDialog() {
  const selectedProductSlug = useUIStore((s) => s.selectedProductSlug)
  const isProductDialogOpen = useUIStore((s) => s.isProductDialogOpen)
  const setProductDialogOpen = useUIStore((s) => s.setProductDialogOpen)
  const setSelectedProduct = useUIStore((s) => s.setSelectedProduct)
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const { toast } = useToast()

  const { data: product } = useQuery<Product>({
    queryKey: ['product', selectedProductSlug],
    queryFn: async () => {
      const res = await fetch(`/api/products/${selectedProductSlug}`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    enabled: !!selectedProductSlug,
  })

  const formatLabel =
    product?.format === 'fresco'
      ? 'Fresco'
      : product?.format === 'congelado'
      ? 'Congelado'
      : 'Cabaz Misto'

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity,
      unit: product.unit,
      image: product.image,
    })
    toast({
      title: 'Adicionado ao carrinho',
      description: `${quantity}x ${product.name} adicionado ao seu carrinho.`,
    })
    setProductDialogOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedProduct(null)
      setQuantity(1)
    }
    setProductDialogOpen(open)
  }

  return (
    <Dialog open={isProductDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white border-[#B7E4C7]">
        {product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isSeasonal && (
                  <Badge className="bg-[#2D6A4F] text-[#FEFAE0]">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Sazonal
                  </Badge>
                )}
                <Badge className="bg-white/90 text-[#1B4332]">
                  {formatLabel}
                </Badge>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <DialogHeader className="mb-4">
                <DialogTitle className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1B4332]">
                  {product.name}
                </DialogTitle>
              </DialogHeader>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-[#2D6A4F]">
                  {product.price.toFixed(2)}€
                </span>
                <span className="text-[#5C7A6B]">/{product.unit}</span>
              </div>

              <p className="text-[#5C7A6B] leading-relaxed mb-4">
                {product.description}
              </p>

              <Separator className="my-3 bg-[#B7E4C7]" />

              {/* Origin */}
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-[#2D6A4F]" />
                <span className="text-sm text-[#5C7A6B]">
                  Origem: {product.origin}
                </span>
              </div>

              {/* Seasonal Availability */}
              {product.isSeasonal && product.seasonStart && product.seasonEnd && (
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="h-4 w-4 text-[#2D6A4F]" />
                  <span className="text-sm text-[#5C7A6B]">
                    Época: {product.seasonStart} - {product.seasonEnd}
                  </span>
                </div>
              )}

              {/* Storage Tips */}
              {product.storageTips && (
                <div className="flex items-start gap-2 mb-2">
                  <Snowflake className="h-4 w-4 text-[#2D6A4F] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#5C7A6B]">
                    Conservação: {product.storageTips}
                  </span>
                </div>
              )}

              {/* Nutritional Info */}
              {product.nutritionalInfo && (
                <div className="flex items-start gap-2 mb-4">
                  <Leaf className="h-4 w-4 text-[#2D6A4F] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#5C7A6B]">
                    Nutrição: {product.nutritionalInfo}
                  </span>
                </div>
              )}

              <Separator className="my-3 bg-[#B7E4C7]" />

              {/* Quantity & Add to Cart */}
              <div className="mt-auto">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-[#5C7A6B]">Quantidade:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-[#B7E4C7] text-[#1B4332]"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-[#1B4332]">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-[#B7E4C7] text-[#1B4332]"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full bg-[#2D6A4F] hover:bg-[#40916C] text-[#FEFAE0] py-3 rounded-lg font-semibold"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock
                    ? `Adicionar - ${(product.price * quantity).toFixed(2)}€`
                    : 'Esgotado'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <Info className="h-6 w-6 text-[#5C7A6B] animate-pulse" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
