import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

/**
 * GET /api/products/:slug
 * Query params: storeId
 * In production, storeId is resolved from subdomain.
 * For local dev, defaults to the first store if not provided.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')

    // Resolve storeId
    let storeId = storeIdParam
    if (!storeId) {
      const firstStore = await db.store.findFirst()
      if (!firstStore) {
        return NextResponse.json({ error: 'No store found' }, { status: 404 })
      }
      storeId = firstStore.id
    }

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
