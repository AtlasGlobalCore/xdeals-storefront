'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Root Landing Page — xdeals.online
 *
 * When no subdomain is resolved, this page is shown.
 * In local dev, auto-redirects to the default store.
 */
export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      router.replace('/?__store=lovelyproportion')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF8F0] px-4">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.998 2.998 0 002.25 1.016 2.993 2.993 0 002.25-1.016m0 0a2.993 2.993 0 002.25 1.016M3 9.35l1.036-4.144A1.5 1.5 0 015.49 4.1h13.02a1.5 1.5 0 011.454 1.106L21 9.35" />
          </svg>
        </div>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#1B4332] mb-3">
          xdeals.online
        </h1>
        <p className="text-[#5C7A6B] mb-6 text-lg">
          SaaS Storefront Headless — Plataforma de E-commerce Multi-Loja
        </p>
        <div className="bg-white rounded-2xl p-6 border border-[#B7E4C7] text-left space-y-3">
          <p className="text-sm text-[#5C7A6B]">
            Cada loja opera num subdomínio dedicado com configuração independente,
            métodos de pagamento configuráveis e integração direta com o Core Banking.
          </p>
          <div className="border-t border-[#B7E4C7] pt-3">
            <p className="text-xs text-[#5C7A6B]/70 mb-2">Exemplo de acesso:</p>
            <code className="text-sm font-mono text-[#2D6A4F] bg-[#F0F4F0] px-3 py-1.5 rounded-lg">
              lovelyproportion.xdeals.online
            </code>
          </div>
          <div className="border-t border-[#B7E4C7] pt-3">
            <p className="text-xs text-[#5C7A6B]/70 mb-2">Ambiente local:</p>
            <code className="text-sm font-mono text-[#2D6A4F] bg-[#F0F4F0] px-3 py-1.5 rounded-lg">
              localhost:3000/?__store=lovelyproportion
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
