import { NextRequest, NextResponse } from 'next/server'

/**
 * XDEALS.ONLINE — Multi-Tenant Subdomain Router
 *
 * Intercepts all page requests and extracts the store slug from the hostname.
 * Rewrites the URL to the dynamic [storeSlug] segment so each store
 * gets its own isolated layout, config, and context.
 *
 * Production:  lovelyproportion.xdeals.online → /lovelyproportion
 * Staging:     lovelyproportion.staging.xdeals.online → /lovelyproportion
 * Local dev:   localhost:3000?__store=lovelyproportion → /lovelyproportion
 *              OR x-store-slug header → /lovelyproportion
 *
 * Skips: /api/*, /_next/*, /images/*, /favicon.ico, static assets
 */

const PLATFORM_DOMAINS = ['xdeals.online', 'staging.xdeals.online']
const SKIP_PREFIXES = ['/api', '/_next', '/images', '/favicon']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes, Next.js internals, and static assets
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  let storeSlug: string | null = null

  // ── Strategy 1: Extract from hostname ──
  const hostname = request.headers.get('host') ?? ''
  const cleanedHostname = hostname.split(':')[0]

  for (const domain of PLATFORM_DOMAINS) {
    if (cleanedHostname.endsWith(`.${domain}`)) {
      const slug = cleanedHostname.replace(`.${domain}`, '')
      if (slug && slug !== 'www') {
        storeSlug = slug
        break
      }
    }
  }

  // ── Strategy 2: Localhost / dev overrides ──
  if (!storeSlug && (cleanedHostname === 'localhost' || cleanedHostname === '127.0.0.1')) {
    const storeParam = request.nextUrl.searchParams.get('__store')
    if (storeParam) storeSlug = storeParam
  }

  // ── Strategy 3: Custom header (works on any host) ──
  if (!storeSlug) {
    const headerSlug = request.headers.get('x-store-slug')
    if (headerSlug) storeSlug = headerSlug
  }

  // If no store slug resolved, serve the root landing page
  if (!storeSlug) {
    return NextResponse.next()
  }

  // Rewrite to the dynamic [storeSlug] route
  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = `/${storeSlug}${pathname === '/' ? '' : pathname}`

  const response = NextResponse.rewrite(rewriteUrl)
  response.headers.set('x-store-slug', storeSlug)
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next|images|favicon\\.ico|.*\\..*).*)',
  ],
}
