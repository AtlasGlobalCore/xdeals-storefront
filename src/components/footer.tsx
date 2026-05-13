'use client'

import { Leaf, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

const quickLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Loja', href: '#loja' },
  { label: 'B2B', href: '#b2b' },
  { label: 'Sobre Nós', href: '#sobre' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1B4332] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-[#74C69D]" />
              <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#FEFAE0]">
                Lovelyproportion
              </span>
            </div>
            <p className="text-[#95D5B2] text-sm leading-relaxed">
              Pequenos frutos de produção própria, colhidos com cuidado em
              Sátão, Viseu. Do campo para a sua mesa, com sabor e frescura
              incomparáveis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-sm font-semibold text-[#FEFAE0] uppercase tracking-wider mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#95D5B2] hover:text-[#FEFAE0] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-sm font-semibold text-[#FEFAE0] uppercase tracking-wider mb-4">
              Contactos
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#74C69D] shrink-0" />
                <span className="text-[#95D5B2] text-sm">
                  Sátão, Viseu, Portugal
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#74C69D] shrink-0" />
                <span className="text-[#95D5B2] text-sm">+351 232 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#74C69D] shrink-0" />
                <span className="text-[#95D5B2] text-sm">
                  info@lovelyproportion.pt
                </span>
              </li>
            </ul>
          </div>

          {/* Fiscal Data */}
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-sm font-semibold text-[#FEFAE0] uppercase tracking-wider mb-4">
              Dados Fiscais
            </h3>
            <ul className="space-y-2 text-[#95D5B2] text-sm">
              <li>
                <strong className="text-[#D8F3DC]">NIF:</strong> 515444669
              </li>
              <li>
                <strong className="text-[#D8F3DC]">Tipo:</strong> Sociedade
                Unipessoal
              </li>
              <li>
                <strong className="text-[#D8F3DC]">Razão Social:</strong>
                <br />
                Lovelyproportion — Fruits Unipessoal Lda
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#2D6A4F]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#95D5B2] text-sm">
              © {currentYear} Lovelyproportion — Fruits Unipessoal Lda. Todos os
              direitos reservados.
            </p>
            <div className="flex items-center gap-1 text-[#95D5B2] text-sm">
              <Leaf className="h-3 w-3 text-[#74C69D]" />
              <span>Produção Natural & Sustentável</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
