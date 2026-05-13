'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cart-store'
import { useUIStore } from '@/store/ui-store'
import {
  CreditCard,
  Smartphone,
  Landmark,
  CheckCircle2,
  Loader2,
} from 'lucide-react'

interface CheckoutForm {
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  paymentMethod: string
}

export default function CheckoutDialog() {
  const isCheckoutOpen = useUIStore((s) => s.isCheckoutOpen)
  const setCheckoutOpen = useUIStore((s) => s.setCheckoutOpen)
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const clearCart = useCartStore((s) => s.clearCart)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [paymentRef, setPaymentRef] = useState('')
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})

  const [form, setForm] = useState<CheckoutForm>({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'mbway',
  })

  const total = getTotal()

  const validate = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {}
    if (!form.customerName.trim()) newErrors.customerName = 'Nome obrigatório'
    if (!form.email.trim()) newErrors.email = 'Email obrigatório'
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Email inválido'
    if (!form.phone.trim()) newErrors.phone = 'Telefone obrigatório'
    if (!form.address.trim()) newErrors.address = 'Morada obrigatória'
    if (!form.city.trim()) newErrors.city = 'Cidade obrigatória'
    if (!form.postalCode.trim())
      newErrors.postalCode = 'Código postal obrigatório'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            unit: item.unit,
          })),
        }),
      })

      if (!res.ok) throw new Error('Order failed')

      const data = await res.json()
      setPaymentRef(data.order?.paymentRef || '')
      setIsSuccess(true)
      clearCart()
    } catch {
      setErrors({ email: 'Erro ao processar encomenda. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      if (isSuccess) {
        setIsSuccess(false)
        setPaymentRef('')
        setForm({
          customerName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          postalCode: '',
          paymentMethod: 'mbway',
        })
        setErrors({})
      }
      setCheckoutOpen(open)
    }
  }

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const paymentMethods = [
    {
      value: 'mbway',
      label: 'MB WAY',
      icon: Smartphone,
      description: 'Pagamento via MB WAY',
    },
    {
      value: 'multibanco',
      label: 'Multibanco',
      icon: Landmark,
      description: 'Referência Multibanco',
    },
    {
      value: 'cartao',
      label: 'Cartão de Crédito',
      icon: CreditCard,
      description: 'Visa, Mastercard',
    },
  ]

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white border-[#B7E4C7]">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 bg-[#D8F3DC] rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-[#2D6A4F]" />
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1B4332] mb-2">
              Encomenda Confirmada!
            </h2>
            <p className="text-[#5C7A6B] mb-4">
              Obrigado pela sua encomenda. Receberá um email com os detalhes.
            </p>
            {paymentRef && (
              <div className="bg-[#F0F4F0] rounded-xl p-4 mb-4">
                <p className="text-sm text-[#5C7A6B]">Referência de Pagamento</p>
                <p className="text-xl font-bold text-[#2D6A4F] font-mono">
                  {paymentRef}
                </p>
              </div>
            )}
            <Button
              className="bg-[#2D6A4F] hover:bg-[#40916C] text-[#FEFAE0] rounded-lg"
              onClick={() => handleClose(false)}
            >
              Fechar
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1B4332]">
                Finalizar Encomenda
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1B4332]">
                  Dados de Envio
                </h3>

                <div className="space-y-1">
                  <Label htmlFor="name" className="text-[#5C7A6B]">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    value={form.customerName}
                    onChange={(e) => updateField('customerName', e.target.value)}
                    className="border-[#B7E4C7] focus:ring-[#2D6A4F]"
                    placeholder="João Silva"
                  />
                  {errors.customerName && (
                    <p className="text-xs text-[#9B2226]">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[#5C7A6B]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="border-[#B7E4C7] focus:ring-[#2D6A4F]"
                    placeholder="joao@email.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-[#9B2226]">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-[#5C7A6B]">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="border-[#B7E4C7] focus:ring-[#2D6A4F]"
                    placeholder="912345678"
                  />
                  {errors.phone && (
                    <p className="text-xs text-[#9B2226]">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address" className="text-[#5C7A6B]">
                    Morada
                  </Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className="border-[#B7E4C7] focus:ring-[#2D6A4F]"
                    placeholder="Rua das Flores, 10"
                  />
                  {errors.address && (
                    <p className="text-xs text-[#9B2226]">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-[#5C7A6B]">
                      Cidade
                    </Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="border-[#B7E4C7] focus:ring-[#2D6A4F]"
                      placeholder="Viseu"
                    />
                    {errors.city && (
                      <p className="text-xs text-[#9B2226]">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postal" className="text-[#5C7A6B]">
                      Código Postal
                    </Label>
                    <Input
                      id="postal"
                      value={form.postalCode}
                      onChange={(e) =>
                        updateField('postalCode', e.target.value)
                      }
                      className="border-[#B7E4C7] focus:ring-[#2D6A4F]"
                      placeholder="3500-000"
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-[#9B2226]">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary & Payment */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1B4332]">
                  Resumo da Encomenda
                </h3>

                <div className="bg-[#F0F4F0] rounded-xl p-4 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-[#1B4332] truncate mr-2">
                        {item.productName} x{item.quantity}
                      </span>
                      <span className="text-[#2D6A4F] font-medium whitespace-nowrap">
                        {(item.unitPrice * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-[#B7E4C7]" />

                <div className="flex justify-between font-bold text-[#1B4332]">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>

                <Separator className="bg-[#B7E4C7]" />

                <h3 className="font-semibold text-[#1B4332]">
                  Método de Pagamento
                </h3>

                <RadioGroup
                  value={form.paymentMethod}
                  onValueChange={(v) => updateField('paymentMethod', v)}
                  className="space-y-2"
                >
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        form.paymentMethod === method.value
                          ? 'border-[#2D6A4F] bg-[#D8F3DC]'
                          : 'border-[#B7E4C7] hover:bg-[#F0F4F0]'
                      }`}
                    >
                      <RadioGroupItem
                        value={method.value}
                        className="text-[#2D6A4F]"
                      />
                      <method.icon className="h-5 w-5 text-[#2D6A4F]" />
                      <div>
                        <p className="text-sm font-medium text-[#1B4332]">
                          {method.label}
                        </p>
                        <p className="text-xs text-[#5C7A6B]">
                          {method.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                <Button
                  className="w-full bg-[#2D6A4F] hover:bg-[#40916C] text-[#FEFAE0] py-3 rounded-lg font-semibold mt-2"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      A processar...
                    </>
                  ) : (
                    `Confirmar Encomenda - ${total.toFixed(2)}€`
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
