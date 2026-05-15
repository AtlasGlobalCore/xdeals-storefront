import { db } from '@/lib/db'
import { getStoreIdFromRequest } from '@/lib/store'
import { NextResponse } from 'next/server'

/**
 * GET /api/products/:slug
 * Store context is resolved from the subdomain in the Host header.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Resolve storeId from subdomain
    const storeResult = await getStoreIdFromRequest(request)
    if ('error' in storeResult) {
      return NextResponse.json({ error: storeResult.error }, { status: storeResult.status })
    }
    const { storeId } = storeResult

    const product = await db.product.findFirst({
      where: { slug, storeId },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
