import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

/**
 * GET /api/products
 * Query params: storeId, category, format, featured, inStock
 * In production, storeId is resolved from subdomain (middleware).
 * For local dev, defaults to the first store if not provided.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const category = searchParams.get('category')
    const format = searchParams.get('format')
    const featured = searchParams.get('featured')
    const inStock = searchParams.get('inStock')

    // Resolve storeId: use provided value or fall back to first store
    let storeId = storeIdParam
    if (!storeId) {
      const firstStore = await db.store.findFirst()
      if (!firstStore) {
        return NextResponse.json({ error: 'No store found' }, { status: 404 })
      }
      storeId = firstStore.id
    }

    const where: Record<string, unknown> = { storeId }

    if (category && category !== 'todos') {
      where.category = category
    }
    if (format && format !== 'todos') {
      where.format = format
    }
    if (featured === 'true') {
      where.isFeatured = true
    }
    if (inStock === 'true') {
      where.inStock = true
    }

    const products = await db.product.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
