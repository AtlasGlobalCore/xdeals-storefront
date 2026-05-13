'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Building2,
  CheckCircle2,
  Loader2,
  Send,
  Phone,
  Mail,
} from 'lucide-react'

interface B2BForm {
  companyName: string
  contactName: string
  email: string
  phone: string
  nif: string
  businessType: string
  products: string
  quantity: string
  message: string
}

export default function B2BSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Partial<B2BForm>>({})

  const [form, setForm] = useState<B2BForm>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    nif: '',
    businessType: '',
    products: '',
    quantity: '',
    message: '',
  })

  const validate = (): boolean => {
    const newErrors: Partial<B2BForm> = {}
    if (!form.companyName.trim())
      newErrors.companyName = 'Nome da empresa obrigatório'
    if (!form.contactName.trim())
      newErrors.contactName = 'Nome do contacto obrigatório'
    if (!form.email.trim()) newErrors.email = 'Email obrigatório'
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Email inválido'
    if (!form.businessType) newErrors.businessType = 'Tipo de negócio obrigatório'
    if (!form.quantity.trim())
      newErrors.quantity = 'Quantidade estimada obrigatória'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateField = (field: keyof B2BForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('B2B submission failed')

      setIsSuccess(true)
      setForm({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        nif: '',
        businessType: '',
        products: '',
        quantity: '',
        message: '',
      })
    } catch {
      setErrors({ email: 'Erro ao enviar pedido. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="b2b" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Info */}
          <div>
            <Badge
              variant="secondary"
              className="bg-[#D8F3DC] text-[#2D6A4F] mb-4 px-4 py-1"
            >
              <Building2 className="h-3 w-3 mr-1" />
              Para Empresas
            </Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B4332] mb-6">
              Encomendas B2B / Revenda
            </h2>
            <div className="space-y-4 text-[#5C7A6B] leading-relaxed">
              <p>
                Procura pequenos frutos de qualidade para o seu restaurante,
                loja de retalho ou distribuição? Na Lovelyproportion oferecemos
                soluções à medida para o seu negócio.
              </p>
              <p>
                Fornecemos mirtilos, framboesas, amoras, groselhas e morangos
                em quantidades especiais para clientes empresariais, com preços
                competitivos e entrega personalizada.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D8F3DC] rounded-full flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-sm text-[#5C7A6B]">Telefone</p>
                  <p className="font-medium text-[#1B4332]">+351 232 000 000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D8F3DC] rounded-full flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-sm text-[#5C7A6B]">Email</p>
                  <p className="font-medium text-[#1B4332]">
                    b2b@lovelyproportion.pt
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#F0F4F0] rounded-2xl p-6 sm:p-8">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-[#D8F3DC] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-[#2D6A4F]" />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1B4332] mb-2">
                  Pedido Enviado!
                </h3>
                <p className="text-[#5C7A6B] text-sm mb-4">
                  Entraremos em contacto consigo em breve.
                </p>
                <Button
                  variant="outline"
                  className="border-[#B7E4C7] text-[#2D6A4F] hover:bg-[#D8F3DC]"
                  onClick={() => setIsSuccess(false)}
                >
                  Enviar Outro Pedido
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-semibold text-[#1B4332] text-lg mb-2">
                  Solicitar Cotação
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[#5C7A6B]">Nome da Empresa *</Label>
                    <Input
                      value={form.companyName}
                      onChange={(e) =>
                        updateField('companyName', e.target.value)
                      }
                      className="border-[#B7E4C7] bg-white focus:ring-[#2D6A4F]"
                      placeholder="Restaurante Silva Lda"
                    />
                    {errors.companyName && (
                      <p className="text-xs text-[#9B2226]">
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[#5C7A6B]">Pessoa de Contacto *</Label>
                    <Input
                      value={form.contactName}
                      onChange={(e) =>
                        updateField('contactName', e.target.value)
                      }
                      className="border-[#B7E4C7] bg-white focus:ring-[#2D6A4F]"
                      placeholder="João Silva"
                    />
                    {errors.contactName && (
                      <p className="text-xs text-[#9B2226]">
                        {errors.contactName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[#5C7A6B]">Email *</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="border-[#B7E4C7] bg-white focus:ring-[#2D6A4F]"
                      placeholder="joao@empresa.pt"
                    />
                    {errors.email && (
                      <p className="text-xs text-[#9B2226]">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[#5C7A6B]">Telefone</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="border-[#B7E4C7] bg-white focus:ring-[#2D6A4F]"
                      placeholder="912345678"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[#5C7A6B]">NIF</Label>
                    <Input
                      value={form.nif}
                      onChange={(e) => updateField('nif', e.target.value)}
                      className="border-[#B7E4C7] bg-white focus:ring-[#2D6A4F]"
                      placeholder="515444669"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[#5C7A6B]">Tipo de Negócio *</Label>
                    <Select
                      value={form.businessType}
                      onValueChange={(v) => updateField('businessType', v)}
                    >
                      <SelectTrigger className="border-[#B7E4C7] bg-white focus:ring-[#2D6A4F]">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restauracao">Restauração</SelectItem>
                        <SelectItem value="retalho">Retalho</SelectItem>
                        <SelectItem value="distribuidor">Distribuidor</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.businessType && (
                      <p className="text-xs text-[#9B2226]">
                        {errors.businessType}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[#5C7A6B]">
                      Produtos de Interesse
                    </Label>
                    <Input
                      value={form.products}
                      onChange={(e) =>
                        updateField('products', e.target.value)
                      }
                      className="border-[#B7E4C7] bg-white focus:ring-[#2D6A4F]"
                      placeholder="Mirtilos, Framboesas..."
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[#5C7A6B]">Quantidade Estimada *</Label>
                    <Input
                      value={form.quantity}
                      onChange={(e) =>
                        updateField('quantity', e.target.value)
                      }
                      className="border-[#B7E4C7] bg-white focus:ring-[#2D6A4F]"
                      placeholder="50 kg/semana"
                    />
                    {errors.quantity && (
                      <p className="text-xs text-[#9B2226]">
                        {errors.quantity}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[#5C7A6B]">Mensagem</Label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    className="border-[#B7E4C7] bg-white focus:ring-[#2D6A4F] min-h-[100px]"
                    placeholder="Informações adicionais sobre a sua necessidade..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#2D6A4F] hover:bg-[#40916C] text-[#FEFAE0] py-3 rounded-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      A enviar...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Pedido
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
