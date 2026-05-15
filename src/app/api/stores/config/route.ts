import { NextResponse } from 'next/server'

/**
 * GET /api/stores/config?slug=lovelyproportion
 *
 * Proxies the store configuration from the Core Banking API
 * at https://api.atlasglobal.digital/stores/{slug}/config.
 *
 * This keeps the publishableKey and other sensitive config
 * server-side, only exposing what the storefront needs.
 */

const CORE_API_BASE = process.env.CORE_API_BASE || 'https://api.atlasglobal.digital'

// Fallback config for local development when Core API is unreachable
const FALLBACK_CONFIG: Record<string, object> = {
  lovelyproportion: {
    storeId: '659c9c61-5dc7-461c-b728-e141ce896e89',
    slug: 'lovelyproportion',
    name: 'Lovelyproportion Fruits',
    logoUrl: '/images/mirtilos.png',
    themePrimary: '#2D6A4F',
    themeSecondary: '#FDF8F0',
    publishableKey: 'pk_test_xdeals_lovelyproportion_001',
    allowedMethods: ['CARD', 'MBWAY', 'MULTIBANCO'],
    currency: 'EUR',
    locale: 'pt_PT',
  },
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 })
    }

    // Try to fetch from Core Banking API
    try {
      const coreRes = await fetch(`${CORE_API_BASE}/stores/${encodeURIComponent(slug)}/config`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'xdeals-storefront/1.0',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      })

      if (coreRes.ok) {
        const data = await coreRes.json()
        return NextResponse.json(data)
      }

      console.warn(`[StoreConfig] Core API returned ${coreRes.status} for slug "${slug}", using fallback`)
    } catch (fetchError) {
      console.warn(`[StoreConfig] Core API unreachable for slug "${slug}":`, fetchError)
    }

    // Fallback to local config
    const fallback = FALLBACK_CONFIG[slug]
    if (fallback) {
      return NextResponse.json(fallback)
    }

    return NextResponse.json(
      { error: `Store not found: ${slug}` },
      { status: 404 }
    )
  } catch (error) {
    console.error('[StoreConfig] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch store config' }, { status: 500 })
  }
}
