import { db } from '@/lib/db'

// Domains that serve the platform (subdomain-eligible)
const PLATFORM_DOMAINS = ['xdeals.online']

/**
 * Extracts the store subdomain from a Request's Host header.
 *
 * Resolution order:
 * 1. x-store-subdomain header (set by middleware or client)
 * 2. Host header → subdomain.xdeals.online → "subdomain"
 * 3. Fallback: first store in DB (single-tenant dev mode)
 */
export function extractSubdomain(request: Request): string | null {
  // 1. Check explicit header (set by middleware)
  const headerSubdomain = request.headers.get('x-store-subdomain')
  if (headerSubdomain) return headerSubdomain

  // 2. Extract from Host header
  const hostname = request.headers.get('host')?.split(':')[0] ?? ''

  for (const domain of PLATFORM_DOMAINS) {
    if (hostname.endsWith(`.${domain}`)) {
      const subdomain = hostname.replace(`.${domain}`, '')
      if (subdomain && subdomain !== 'www') return subdomain
    }
  }

  // 3. Localhost: check custom header or return null
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null // Will trigger fallback
  }

  return null
}

/**
 * Resolves the Store from the request context.
 * Uses subdomain extraction from Host header, then DB lookup.
 */
export async function resolveStoreFromRequest(
  request: Request
): Promise<{ store: NonNullable<Awaited<ReturnType<typeof db.store.findUnique>>> } | { error: string; status: number }> {
  const subdomain = extractSubdomain(request)

  if (subdomain) {
    const store = await db.store.findUnique({ where: { subdomain } })
    if (store) return { store }
    return { error: `Store not found for subdomain: ${subdomain}`, status: 404 }
  }

  // Fallback: first store (dev mode)
  const firstStore = await db.store.findFirst()
  if (!firstStore) {
    return { error: 'No store found', status: 404 }
  }
  return { store: firstStore }
}

/**
 * Convenience: returns just the storeId or an error response.
 */
export async function getStoreIdFromRequest(
  request: Request
): Promise<{ storeId: string; walletReference?: string } | { error: string; status: number }> {
  const result = await resolveStoreFromRequest(request)
  if ('error' in result) return result
  return { storeId: result.store.id, walletReference: result.store.walletReference }
}
