import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const format = searchParams.get('format')
    const featured = searchParams.get('featured')
    const inStock = searchParams.get('inStock')

    const where: Record<string, unknown> = {}

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
