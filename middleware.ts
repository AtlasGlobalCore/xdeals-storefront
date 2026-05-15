import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware: Dynamic Subdomain Router
 *
 * Extracts the subdomain from the request hostname and rewrites
 * the URL to the dynamic [storeDomain] segment.
 *
 * Production:  loja1.xdeals.online → /loja1
 * Local dev:   localhost:3000?__store=loja1 → /loja1
 *              OR x-store-subdomain header → /loja1
 *
 * Skips: /api/*, /_next/*, /images/*, /favicon.ico, static assets
 */

// Domains that serve the platform (subdomain-eligible)
const PLATFORM_DOMAINS = ['xdeals.online']

// Paths that should bypass subdomain rewriting
const SKIP_PREFIXES = ['/api', '/_next', '/images', '/favicon']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes, Next.js internals, and static assets
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Skip if already rewritten to a storeDomain route
  // (prevent infinite rewrites)
  if (pathname.startsWith('/[')) {
    return NextResponse.next()
  }

  let subdomain: string | null = null

  // ── Strategy 1: Extract from hostname ──
  const hostname = request.headers.get('host') ?? ''
  const cleanedHostname = hostname.split(':')[0] // Remove port

  for (const domain of PLATFORM_DOMAINS) {
    if (cleanedHostname.endsWith(`.${domain}`)) {
      subdomain = cleanedHostname.replace(`.${domain}`, '')
      break
    }
  }

  // ── Strategy 2: Localhost / dev overrides ──
  if (!subdomain && (cleanedHostname === 'localhost' || cleanedHostname === '127.0.0.1')) {
    // Check query param: ?__store=lovelyproportion
    const storeParam = request.nextUrl.searchParams.get('__store')
    if (storeParam) {
      subdomain = storeParam
    }

    // Check custom header: x-store-subdomain
    if (!subdomain) {
      const headerSubdomain = request.headers.get('x-store-subdomain')
      if (headerSubdomain) {
        subdomain = headerSubdomain
      }
    }
  }

  // ── Strategy 3: Custom header (works on any host) ──
  if (!subdomain) {
    const headerSubdomain = request.headers.get('x-store-subdomain')
    if (headerSubdomain) {
      subdomain = headerSubdomain
    }
  }

  // If no subdomain resolved, skip rewriting (root landing page or direct access)
  if (!subdomain) {
    return NextResponse.next()
  }

  // Don't rewrite the root path if it's already a store domain access
  // that would be handled by the [storeDomain] route
  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = `/${subdomain}${pathname === '/' ? '' : pathname}`

  // Add subdomain as a header so API routes can access it
  const response = NextResponse.rewrite(rewriteUrl)
  response.headers.set('x-store-subdomain', subdomain)
  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /api (API routes)
     * - /_next (Next.js internals)
     * - /images (static images)
     * - /favicon.ico
     * - Static files with extensions
     */
    '/((?!api|_next|images|favicon\\.ico|.*\\..*).*)',
  ],
}
