'use client'

import { Leaf, Phone, Mail, MapPin, RotateCcw, Truck, Shield, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useUIStore, type PolicyType } from '@/store/ui-store'

const quickLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Loja', href: '#loja' },
  { label: 'B2B', href: '#b2b' },
  { label: 'Sobre Nós', href: '#sobre' },
]

const policyLinks: { label: string; policy: Exclude<PolicyType, null>; icon: React.ElementType }[] = [
  { label: 'Política de Reembolso', policy: 'reembolso', icon: RotateCcw },
  { label: 'Política de Entrega', policy: 'entrega', icon: Truck },
  { label: 'Política de Privacidade', policy: 'privacidade', icon: Shield },
  { label: 'Livro de Reclamações', policy: 'reclamacoes', icon: BookOpen },
]

// Payment method SVG icons
function VisaIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Visa">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path d="M20.5 21h-2.8l1.7-10h2.8L20.5 21zm12-9.8c-.6-.2-1.4-.5-2.5-.5-2.8 0-4.7 1.4-4.7 3.5 0 1.5 1.4 2.4 2.4 2.9 1.1.5 1.5.9 1.5 1.3 0 .7-.9 1-1.7 1-1.1 0-1.8-.2-2.7-.6l-.4-.2-.4 2.4c.7.3 2 .6 3.3.6 3 0 4.9-1.4 4.9-3.6 0-1.2-.7-2.1-2.4-2.8-1-.5-1.6-.8-1.6-1.3 0-.5.5-1 1.6-1 .9 0 1.6.2 2.1.4l.3.1.4-2.2zm7.2 0h-2.2c-.7 0-1.2.2-1.5.9L32 21h2.9l.6-1.6h3.5l.3 1.6H42l-2.3-9.8zm-3.4 6.3l1.1-2.8.3-.8.3 1.1.7 2.5h-2.4zM17.7 11l-2.6 6.8-.3-1.4c-.5-1.7-2-3.5-3.7-4.4l2.4 8.9h3l4.4-10h-3.2v.1z" fill="#FFFFFF" />
      <path d="M12.6 11H8.3l0 .2c3.3.8 5.5 2.8 6.4 5.1l-.9-4.4c-.2-.7-.6-.9-1.2-.9z" fill="#F9A533" />
    </svg>
  )
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Mastercard">
      <rect width="48" height="32" rx="4" fill="#252525" />
      <circle cx="18.5" cy="16" r="8" fill="#EB001B" />
      <circle cx="29.5" cy="16" r="8" fill="#F79E1B" />
      <path d="M24 10.3a7.96 7.96 0 0 1 0 11.4 7.96 7.96 0 0 1 0-11.4z" fill="#FF5F00" />
    </svg>
  )
}

function MbWayIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="MB WAY">
      <rect width="48" height="32" rx="4" fill="#E30613" />
      <text x="24" y="14" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="sans-serif">MB</text>
      <text x="24" y="24" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="sans-serif">WAY</text>
    </svg>
  )
}

function BizumIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Bizum">
      <rect width="48" height="32" rx="4" fill="#00A0DF" />
      <text x="24" y="19" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="sans-serif">Bizum</text>
    </svg>
  )
}

function MultibancoIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Multibanco">
      <rect width="48" height="32" rx="4" fill="#003399" />
      <rect x="12" y="8" width="6" height="16" rx="1" fill="white" />
      <rect x="21" y="8" width="6" height="16" rx="1" fill="white" />
      <rect x="30" y="8" width="6" height="16" rx="1" fill="white" />
    </svg>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const setActivePolicy = useUIStore((s) => s.setActivePolicy)

  return (
    <footer className="bg-[#1B4332] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
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

          {/* Legal / Policies */}
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-sm font-semibold text-[#FEFAE0] uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {policyLinks.map((link) => (
                <li key={link.policy}>
                  <button
                    onClick={() => setActivePolicy(link.policy)}
                    className="flex items-center gap-2 text-[#95D5B2] hover:text-[#FEFAE0] text-sm transition-colors group"
                  >
                    <link.icon className="h-3.5 w-3.5 text-[#74C69D] group-hover:text-[#95D5B2] transition-colors" />
                    {link.label}
                  </button>
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
          <div className="flex flex-col gap-6">
            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[#95D5B2] text-xs uppercase tracking-wider mr-2">Pagamentos Seguros</span>
                <div className="flex items-center gap-2">
                  <div className="rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <VisaIcon />
                  </div>
                  <div className="rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <MastercardIcon />
                  </div>
                  <div className="rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <MbWayIcon />
                  </div>
                  <div className="rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <BizumIcon />
                  </div>
                  <div className="rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <MultibancoIcon />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-[#74C69D]" />
                <span className="text-[#95D5B2] text-xs">Pagamentos 100% Seguros</span>
              </div>
            </div>

            {/* Copyright Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[#95D5B2] text-sm">
                © {currentYear} Lovelyproportion — Fruits Unipessoal Lda. Todos os
                direitos reservados.
              </p>
              <div className="flex items-center gap-4 text-[#95D5B2] text-sm">
                <button
                  onClick={() => setActivePolicy('reembolso')}
                  className="hover:text-[#FEFAE0] transition-colors"
                >
                  Reembolso
                </button>
                <span className="text-[#2D6A4F]">•</span>
                <button
                  onClick={() => setActivePolicy('entrega')}
                  className="hover:text-[#FEFAE0] transition-colors"
                >
                  Entrega
                </button>
                <span className="text-[#2D6A4F]">•</span>
                <button
                  onClick={() => setActivePolicy('privacidade')}
                  className="hover:text-[#FEFAE0] transition-colors"
                >
                  Privacidade
                </button>
                <span className="text-[#2D6A4F]">•</span>
                <button
                  onClick={() => setActivePolicy('reclamacoes')}
                  className="hover:text-[#FEFAE0] transition-colors"
                >
                  Reclamações
                </button>
              </div>
              <div className="flex items-center gap-1 text-[#95D5B2] text-sm">
                <Leaf className="h-3 w-3 text-[#74C69D]" />
                <span>Produção Natural & Sustentável</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
