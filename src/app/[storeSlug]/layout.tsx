import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import StoreProviderWrapper from '@/components/store-provider'
import { Toaster } from '@/components/ui/toaster'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
})

interface StoreLayoutProps {
  children: React.ReactNode
  params: Promise<{ storeSlug: string }>
}

/**
 * Dynamic layout per store slug.
 * Fetches store config from the Core Banking API server-side,
 * injects theme CSS variables, and wraps children in StoreProvider.
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

  const themePrimary = storeConfig.themePrimary || '#2D6A4F'

  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${dmSans.variable} antialiased bg-background text-foreground`}
        style={{
          ['--color-primary' as string]: themePrimary,
          ['--color-primary-light' as string]: adjustColor(themePrimary, 30),
          ['--color-primary-dark' as string]: adjustColor(themePrimary, -20),
        }}
      >
        <StoreProviderWrapper initialConfig={storeConfig} storeSlug={storeSlug}>
          {children}
        </StoreProviderWrapper>
        <Toaster />
      </body>
    </html>
  )
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
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
