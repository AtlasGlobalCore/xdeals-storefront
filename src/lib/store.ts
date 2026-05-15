import { db } from '@/lib/db'

/**
 * Resolves the current store context for a request.
 *
 * In production (Supabase), this would extract the subdomain from the
 * request hostname (e.g. "loja1" from loja1.xdeals.online) and look up
 * the Store by subdomain.
 *
 * For local development / single-tenant mode, falls back to the first store.
 */
export async function resolveStore(
  request?: Request,
  storeIdParam?: string | null
) {
  // 1. If storeId was explicitly provided, use it
  if (storeIdParam) {
    const store = await db.store.findUnique({ where: { id: storeIdParam } })
    if (store) return store
  }

  // 2. TODO: In production, extract subdomain from request hostname
  //    const hostname = request?.headers.get('host') ?? ''
  //    const subdomain = hostname.split('.')[0]
  //    const store = await db.store.findUnique({ where: { subdomain } })
  //    if (store) return store

  // 3. Fallback: return first store (single-tenant dev mode)
  const firstStore = await db.store.findFirst()
  return firstStore ?? null
}

/**
 * Gets the storeId for API routes, returning a 404-friendly error
 * if no store can be resolved.
 */
export async function getStoreId(
  request?: Request,
  storeIdParam?: string | null
): Promise<{ storeId: string } | { error: string; status: number }> {
  const store = await resolveStore(request, storeIdParam)
  if (!store) {
    return { error: 'No store found', status: 404 }
  }
  return { storeId: store.id }
}
