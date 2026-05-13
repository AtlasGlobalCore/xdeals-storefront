'use client'

import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Mail, FileText, Building2, Leaf } from 'lucide-react'

export default function AboutSection() {
  return (
    <section id="sobre" className="py-16 sm:py-24 bg-[#FDF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="secondary"
            className="bg-[#D8F3DC] text-[#2D6A4F] mb-4 px-4 py-1"
          >
            Informações
          </Badge>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B4332]">
            Sobre Nós
          </h2>
          <p className="mt-4 text-[#5C7A6B] max-w-2xl mx-auto">
            Conheça a Lovelyproportion — Fruits Unipessoal Lda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Company Info */}
          <div className="bg-white rounded-2xl p-6 border border-[#B7E4C7]">
            <div className="w-12 h-12 bg-[#D8F3DC] rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-[#2D6A4F]" />
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-3">
              Dados da Empresa
            </h3>
            <div className="space-y-2 text-sm text-[#5C7A6B]">
              <p>
                <strong className="text-[#1B4332]">Razão Social:</strong>{' '}
                Lovelyproportion — Fruits Unipessoal Lda
              </p>
              <p>
                <strong className="text-[#1B4332]">Tipo:</strong> Sociedade
                Unipessoal
              </p>
              <p>
                <strong className="text-[#1B4332]">NIF:</strong> 515444669
              </p>
              <p>
                <strong className="text-[#1B4332]">Atividade:</strong>{' '}
                Produção e Comercialização de Pequenos Frutos
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 border border-[#B7E4C7]">
            <div className="w-12 h-12 bg-[#D8F3DC] rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-[#2D6A4F]" />
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-3">
              Localização
            </h3>
            <div className="space-y-2 text-sm text-[#5C7A6B]">
              <p>Sátão, Viseu</p>
              <p>Portugal</p>
              <p className="mt-4 text-xs italic">
                No coração da região de Viseu, onde o clima e a terra criam as
                condições perfeitas para o cultivo de pequenos frutos.
              </p>
            </div>
            {/* Map Placeholder */}
            <div className="mt-4 h-32 bg-[#D8F3DC] rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-[#2D6A4F] mx-auto mb-1" />
                <p className="text-xs text-[#5C7A6B]">Sátão, Viseu</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 border border-[#B7E4C7]">
            <div className="w-12 h-12 bg-[#D8F3DC] rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-[#2D6A4F]" />
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-3">
              Contactos
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#2D6A4F] shrink-0" />
                <span className="text-sm text-[#5C7A6B]">+351 232 000 000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#2D6A4F] shrink-0" />
                <span className="text-sm text-[#5C7A6B]">
                  info@lovelyproportion.pt
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-[#2D6A4F] shrink-0" />
                <span className="text-sm text-[#5C7A6B]">NIF: 515444669</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#D8F3DC] rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-4 w-4 text-[#2D6A4F]" />
                <span className="text-sm font-semibold text-[#1B4332]">
                  Compromisso
                </span>
              </div>
              <p className="text-xs text-[#5C7A6B] leading-relaxed">
                Produção natural e sustentável, respeitando o ambiente e
                garantindo a máxima qualidade dos nossos frutos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
