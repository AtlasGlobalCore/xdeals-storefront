'use client'

import { useState, useMemo } from 'react'
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
import { useStoreConfig, METHOD_META, type AllowedMethod } from '@/lib/store-context'
import {
  CreditCard,
  Smartphone,
  Landmark,
  QrCode,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Copy,
  Clock,
  Shield,
} from 'lucide-react'

// Icon map for payment methods
const METHOD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CARD: CreditCard,
  MBWAY: Smartphone,
  MULTIBANCO: Landmark,
  PIX: QrCode,
}

interface CheckoutForm {
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  paymentMethod: string
}

/** Response from the Universal Relay / Core Banking API */
interface CheckoutResponse {
  type: 'REFERENCE' | 'IFRAME' | 'ASYNC_WAIT'
  sessionId: string
  expiresAt: string
  reference?: {
    entity?: string
    reference?: string
    amount: number
    pixCode?: string
    qrCodeUrl?: string
  }
  iframe?: {
    clientSecret: string
    publishableKey: string
    returnUrl: string
  }
  asyncWait?: {
    message: string
    phoneNumber: string
    deepLink?: string
  }
}

export default function CheckoutDialog() {
  const isCheckoutOpen = useUIStore((s) => s.isCheckoutOpen)
  const setCheckoutOpen = useUIStore((s) => s.setCheckoutOpen)
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const clearCart = useCartStore((s) => s.clearCart)
  const { config } = useStoreConfig()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(null)
  const [orderId, setOrderId] = useState('')
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})

  // Get allowed methods from store config, with fallback
  const allowedMethods: AllowedMethod[] = config?.allowedMethods || ['CARD', 'MBWAY', 'MULTIBANCO']
  const defaultMethod = allowedMethods[0] || 'MULTIBANCO'

  const [form, setForm] = useState<CheckoutForm>({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: defaultMethod,
  })

  const total = getTotal()
  const isSuccess = !!checkoutResult

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
      const res = await fetch('/api/checkout/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publishableKey: config?.publishableKey || '',
          storeSlug: config?.slug || '',
          customer: {
            name: form.customerName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
          },
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            unit: item.unit,
          })),
          paymentMethod: form.paymentMethod,
          total,
          currency: config?.currency || 'EUR',
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Checkout failed')
      }

      const data: CheckoutResponse = await res.json()
      setCheckoutResult(data)
      setOrderId(data.sessionId?.substring(0, 8).toUpperCase() || '')
      clearCart()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao processar pagamento. Tente novamente.'
      setErrors({ email: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      if (isSuccess) {
        setCheckoutResult(null)
        setOrderId('')
        setForm({
          customerName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          postalCode: '',
          paymentMethod: defaultMethod,
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // ──── Success View: REFERENCE type ────
  const renderReferenceResult = () => {
    if (!checkoutResult?.reference) return null
    const ref = checkoutResult.reference

    // PIX reference
    if (ref.pixCode) {
      return (
        <div className="bg-[#F0F4F0] rounded-xl p-4 mb-4 space-y-3">
          <p className="text-sm text-[#5C7A6B] font-medium">Pagamento via PIX</p>
          {ref.qrCodeUrl && (
            <div className="bg-white rounded-lg p-3 flex justify-center">
              <img src={ref.qrCodeUrl} alt="QR Code PIX" className="w-48 h-48 object-contain" />
            </div>
          )}
          <div className="flex items-center justify-between bg-white rounded-lg p-3">
            <div>
              <p className="text-xs text-[#5C7A6B]">Código PIX</p>
              <p className="text-xs font-mono text-[#1B4332] break-all max-w-[280px]">{ref.pixCode}</p>
            </div>
            <button
              onClick={() => copyToClipboard(ref.pixCode || '')}
              className="p-1.5 rounded hover:bg-[#F0F4F0] transition-colors shrink-0"
            >
              <Copy className="h-4 w-4 text-[#5C7A6B]" />
            </button>
          </div>
          <div className="flex items-center justify-between bg-white rounded-lg p-3">
            <div>
              <p className="text-xs text-[#5C7A6B]">Valor</p>
              <p className="text-lg font-bold text-[var(--color-primary)] font-mono">{ref.amount.toFixed(2)}€</p>
            </div>
          </div>
        </div>
      )
    }

    // Multibanco reference
    return (
      <div className="bg-[#F0F4F0] rounded-xl p-4 mb-4 space-y-3">
        <p className="text-sm text-[#5C7A6B] font-medium">Pagamento Multibanco</p>
        <div className="flex items-center justify-between bg-white rounded-lg p-3">
          <div>
            <p className="text-xs text-[#5C7A6B]">Entidade</p>
            <p className="text-lg font-bold text-[#1B4332] font-mono">{ref.entity}</p>
          </div>
          <button onClick={() => copyToClipboard(ref.entity || '')} className="p-1.5 rounded hover:bg-[#F0F4F0] transition-colors">
            <Copy className="h-4 w-4 text-[#5C7A6B]" />
          </button>
        </div>
        <div className="flex items-center justify-between bg-white rounded-lg p-3">
          <div>
            <p className="text-xs text-[#5C7A6B]">Referência</p>
            <p className="text-lg font-bold text-[#1B4332] font-mono">{ref.reference}</p>
          </div>
          <button onClick={() => copyToClipboard(ref.reference || '')} className="p-1.5 rounded hover:bg-[#F0F4F0] transition-colors">
            <Copy className="h-4 w-4 text-[#5C7A6B]" />
          </button>
        </div>
        <div className="flex items-center justify-between bg-white rounded-lg p-3">
          <div>
            <p className="text-xs text-[#5C7A6B]">Valor</p>
            <p className="text-lg font-bold text-[var(--color-primary)] font-mono">{ref.amount.toFixed(2)}€</p>
          </div>
        </div>
      </div>
    )
  }

  // ──── Success View: IFRAME type ────
  const renderIframeResult = () => {
    if (!checkoutResult?.iframe) return null
    const iframe = checkoutResult.iframe

    return (
      <div className="bg-[#F0F4F0] rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-[var(--color-primary)]" />
          <p className="text-sm font-medium text-[#1B4332]">Pagamento Seguro com Cartão</p>
        </div>
        <div className="bg-white rounded-lg border border-[#B7E4C7] overflow-hidden">
          <iframe
            src={`${process.env.NEXT_PUBLIC_CORE_API_BASE || 'https://api.atlasglobal.digital'}/checkout/frame?client_secret=${iframe.clientSecret}&pk=${iframe.publishableKey}`}
            className="w-full min-h-[320px] border-0"
            title="Secure Card Payment"
            sandbox="allow-scripts allow-forms allow-same-origin allow-top-navigation"
          />
        </div>
        <p className="text-xs text-[#5C7A6B]/60 mt-2 text-center">
          Os dados do cartão são processados de forma segura. Nunca armazenamos dados do cartão.
        </p>
      </div>
    )
  }

  // ──── Success View: ASYNC_WAIT type ────
  const renderAsyncWaitResult = () => {
    if (!checkoutResult?.asyncWait) return null
    const wait = checkoutResult.asyncWait

    return (
      <div className="bg-[#F0F4F0] rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-[var(--color-primary)] animate-pulse" />
          <p className="text-sm font-medium text-[#1B4332]">A aguardar confirmação</p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Smartphone className="h-8 w-8 text-[var(--color-primary)]" />
          </div>
          <p className="text-sm text-[#1B4332] mb-2">{wait.message}</p>
          {wait.phoneNumber && (
            <p className="text-lg font-bold text-[var(--color-primary)] font-mono mb-3">{wait.phoneNumber}</p>
          )}
          {wait.deepLink && (
            <a
              href={wait.deepLink}
              className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Abrir MB WAY
            </a>
          )}
        </div>
        <p className="text-xs text-[#5C7A6B]/60 mt-2 text-center">
          Tempo limite: 30 minutos. A página atualizará automaticamente quando o pagamento for confirmado.
        </p>
      </div>
    )
  }

  // ──── Success View: Router ────
  const renderSuccessContent = () => {
    if (!checkoutResult) return null

    return (
      <>
        {checkoutResult.type === 'REFERENCE' && renderReferenceResult()}
        {checkoutResult.type === 'IFRAME' && renderIframeResult()}
        {checkoutResult.type === 'ASYNC_WAIT' && renderAsyncWaitResult()}

        {/* Session info */}
        <div className="bg-[#F0F4F0] rounded-xl p-3 mb-4 w-full">
          <p className="text-xs text-[#5C7A6B]">Sessão</p>
          <p className="text-sm font-mono text-[#1B4332] break-all">{checkoutResult.sessionId}</p>
        </div>
      </>
    )
  }

  // ──── Payment method radio buttons from allowedMethods ────
  const methodOptions = useMemo(() => {
    return allowedMethods.map((method) => {
      const meta = METHOD_META[method]
      const Icon = METHOD_ICONS[method] || CreditCard
      return { value: method, label: meta.label, description: meta.description, icon: Icon }
    })
  }, [allowedMethods])

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white border-[#B7E4C7]">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-[var(--color-primary)]" />
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1B4332] mb-2">
              Checkout Iniciado!
            </h2>
            <p className="text-[#5C7A6B] mb-2">
              A sua encomenda foi registada com sucesso.
            </p>
            <p className="text-sm text-[#5C7A6B]/70 mb-4">
              Estado: <span className="font-medium text-[var(--color-primary)]">A aguardar pagamento</span>
            </p>

            {renderSuccessContent()}

            {orderId && (
              <p className="text-xs text-[#5C7A6B]/60 mb-4">
                ID: {orderId}
              </p>
            )}

            <Button
              className="text-[#FEFAE0] rounded-lg"
              style={{ backgroundColor: 'var(--color-primary)' }}
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
                <h3 className="font-semibold text-[#1B4332]">Dados de Envio</h3>

                <div className="space-y-1">
                  <Label htmlFor="name" className="text-[#5C7A6B]">Nome Completo</Label>
                  <Input id="name" value={form.customerName} onChange={(e) => updateField('customerName', e.target.value)} className="border-[#B7E4C7] focus:ring-[var(--color-primary)]" placeholder="João Silva" />
                  {errors.customerName && <p className="text-xs text-[#9B2226]">{errors.customerName}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[#5C7A6B]">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className="border-[#B7E4C7] focus:ring-[var(--color-primary)]" placeholder="joao@email.com" />
                  {errors.email && <p className="text-xs text-[#9B2226]">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-[#5C7A6B]">Telefone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className="border-[#B7E4C7] focus:ring-[var(--color-primary)]" placeholder="912345678" />
                  {errors.phone && <p className="text-xs text-[#9B2226]">{errors.phone}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address" className="text-[#5C7A6B]">Morada</Label>
                  <Input id="address" value={form.address} onChange={(e) => updateField('address', e.target.value)} className="border-[#B7E4C7] focus:ring-[var(--color-primary)]" placeholder="Rua das Flores, 10" />
                  {errors.address && <p className="text-xs text-[#9B2226]">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-[#5C7A6B]">Cidade</Label>
                    <Input id="city" value={form.city} onChange={(e) => updateField('city', e.target.value)} className="border-[#B7E4C7] focus:ring-[var(--color-primary)]" placeholder="Viseu" />
                    {errors.city && <p className="text-xs text-[#9B2226]">{errors.city}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postal" className="text-[#5C7A6B]">Código Postal</Label>
                    <Input id="postal" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} className="border-[#B7E4C7] focus:ring-[var(--color-primary)]" placeholder="3500-000" />
                    {errors.postalCode && <p className="text-xs text-[#9B2226]">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>

              {/* Order Summary & Payment */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1B4332]">Resumo da Encomenda</h3>

                <div className="bg-[#F0F4F0] rounded-xl p-4 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-[#1B4332] truncate mr-2">{item.productName} x{item.quantity}</span>
                      <span className="text-[var(--color-primary)] font-medium whitespace-nowrap">{(item.unitPrice * item.quantity).toFixed(2)}€</span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-[#B7E4C7]" />

                <div className="flex justify-between font-bold text-[#1B4332]">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>

                <Separator className="bg-[#B7E4C7]" />

                <h3 className="font-semibold text-[#1B4332]">Método de Pagamento</h3>

                <RadioGroup
                  value={form.paymentMethod}
                  onValueChange={(v) => updateField('paymentMethod', v)}
                  className="space-y-2"
                >
                  {methodOptions.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        form.paymentMethod === method.value
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                          : 'border-[#B7E4C7] hover:bg-[#F0F4F0]'
                      }`}
                    >
                      <RadioGroupItem value={method.value} className="text-[var(--color-primary)]" />
                      <method.icon className="h-5 w-5 text-[var(--color-primary)]" />
                      <div>
                        <p className="text-sm font-medium text-[#1B4332]">{method.label}</p>
                        <p className="text-xs text-[#5C7A6B]">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                <Button
                  className="w-full text-[#FEFAE0] py-3 rounded-lg font-semibold mt-2"
                  style={{ backgroundColor: 'var(--color-primary)' }}
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
