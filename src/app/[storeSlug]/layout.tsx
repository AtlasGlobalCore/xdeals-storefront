import type { Metadata } from 'next'
import StoreProviderWrapper from '@/components/store-provider'
import { Toaster } from '@/components/ui/toaster'

interface StoreLayoutProps {
  children: React.ReactNode
  params: Promise<{ storeSlug: string }>
}

/**
 * Dynamic layout per store slug.
 * Fetches store config from the Core Banking API server-side,
 * and wraps children in StoreProvider for client-side theming.
 *
 * NOTE: <html> and <body> are in the root layout only (src/app/layout.tsx).
 * This layout adds the StoreProvider + Toaster for store pages.
 * Theme CSS variables are injected client-side by StoreProvider
 * into document.documentElement.style.
 */
export default async function StoreLayout({ children, params }: StoreLayoutProps) {
  const { storeSlug } = await params

  // Server-side config fetch from Core Banking API
  let storeConfig = null
  try {
    const coreApiBase = process.env.CORE_API_BASE || 'https://api.atlasglobal.digital'
    const res = await fetch(`${coreApiBase}/stores/${encodeURIComponent(storeSlug)}/config`, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'xdeals-storefront/1.0' },
      next: { revalidate: 300 },
    })
    if (res.ok) {
      storeConfig = await res.json()
    }
  } catch {
    // Will use client-side fallback
  }

  // Fallback config for dev
  if (!storeConfig) {
    storeConfig = {
      storeId: '659c9c61-5dc7-461c-b728-e141ce896e89',
      slug: storeSlug,
      name: storeSlug.charAt(0).toUpperCase() + storeSlug.slice(1),
      logoUrl: '/images/mirtilos.png',
      themePrimary: '#2D6A4F',
      themeSecondary: '#FDF8F0',
      publishableKey: `pk_test_xdeals_${storeSlug}_001`,
      allowedMethods: ['CARD', 'MBWAY', 'MULTIBANCO'],
      currency: 'EUR',
      locale: 'pt_PT',
    }
  }

  return (
    <StoreProviderWrapper initialConfig={storeConfig} storeSlug={storeSlug}>
      {children}
      <Toaster />
    </StoreProviderWrapper>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ storeSlug: string }> }): Promise<Metadata> {
  const { storeSlug } = await params

  let storeName = storeSlug
  try {
    const coreApiBase = process.env.CORE_API_BASE || 'https://api.atlasglobal.digital'
    const res = await fetch(`${coreApiBase}/stores/${encodeURIComponent(storeSlug)}/config`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 300 },
    })
    if (res.ok) {
      const data = await res.json()
      storeName = data.name || storeSlug
    }
  } catch {
    // Use slug as fallback
  }

  return {
    title: `${storeName} — xdeals.online`,
    description: `Loja ${storeName} na plataforma xdeals.online`,
    openGraph: {
      title: `${storeName} — xdeals.online`,
      type: 'website',
      locale: 'pt_PT',
    },
  }
}
