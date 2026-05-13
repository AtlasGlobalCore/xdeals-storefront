'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cart-store'
import { useUIStore } from '@/store/ui-store'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

export default function CartSheet() {
  const items = useCartStore((s) => s.items)
  const isOpen = useCartStore((s) => s.isOpen)
  const setCartOpen = useCartStore((s) => s.setCartOpen)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const getTotal = useCartStore((s) => s.getTotal)
  const setCheckoutOpen = useUIStore((s) => s.setCheckoutOpen)

  const total = getTotal()

  const handleCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="bg-white w-full sm:max-w-md flex flex-col border-[#B7E4C7]">
        <SheetHeader>
          <SheetTitle className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1B4332] flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#2D6A4F]" />
            Carrinho de Compras
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-24 h-24 bg-[#D8F3DC] rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-[#2D6A4F]" />
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#1B4332] mb-2">
              Carrinho Vazio
            </h3>
            <p className="text-[#5C7A6B] text-sm">
              Adicione produtos à sua encomenda para começar
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 p-3 bg-[#F0F4F0] rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#1B4332] truncate">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-[#5C7A6B]">
                      {item.unitPrice.toFixed(2)}€/{item.unit}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 border-[#B7E4C7] text-[#1B4332]"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium text-[#1B4332] w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 border-[#B7E4C7] text-[#1B4332]"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-[#9B2226] hover:bg-[#9B2226]/10"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-bold text-[#2D6A4F]">
                      {(item.unitPrice * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-[#B7E4C7]" />

            {/* Total & Checkout */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#5C7A6B]">Subtotal</span>
                <span className="text-lg font-bold text-[#1B4332]">
                  {total.toFixed(2)}€
                </span>
              </div>
              <Button
                className="w-full bg-[#2D6A4F] hover:bg-[#40916C] text-[#FEFAE0] py-3 rounded-lg font-semibold"
                onClick={handleCheckout}
              >
                Finalizar Encomenda
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
