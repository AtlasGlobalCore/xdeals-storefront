import { db } from '@/lib/db'

const PLATFORM_DOMAINS = ['xdeals.online', 'staging.xdeals.online']

/**
 * Extracts the store slug from a Request's headers.
 * Resolution order:
 * 1. x-store-slug header (set by middleware)
 * 2. Host header → subdomain.xdeals.online → "subdomain"
 * 3. Fallback: first store in DB (single-tenant dev mode)
 */
export function extractStoreSlug(request: Request): string | null {
  // 1. Check explicit header (set by middleware)
  const headerSlug = request.headers.get('x-store-slug')
  if (headerSlug) return headerSlug

  // 2. Extract from Host header
  const hostname = request.headers.get('host')?.split(':')[0] ?? ''

  for (const domain of PLATFORM_DOMAINS) {
    if (hostname.endsWith(`.${domain}`)) {
      const slug = hostname.replace(`.${domain}`, '')
      if (slug && slug !== 'www') return slug
    }
  }

  return null
}

/**
 * Resolves the Store from the request context.
 */
export async function resolveStoreFromRequest(
  request: Request
): Promise<{ store: NonNullable<Awaited<ReturnType<typeof db.store.findUnique>>> } | { error: string; status: number }> {
  const slug = extractStoreSlug(request)

  if (slug) {
    const store = await db.store.findUnique({ where: { subdomain: slug } })
    if (store) return { store }
    return { error: `Store not found for slug: ${slug}`, status: 404 }
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
