import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

/**
 * POST /api/b2b
 * Body must include storeId (or it defaults to first store).
 * In production, storeId is resolved from subdomain (middleware).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { storeId: storeIdParam, companyName, contactName, email, phone, nif, businessType, products, quantity, message } = body

    if (!companyName || !contactName || !email || !businessType || !quantity) {
      return NextResponse.json(
        { error: 'Campos obrigatórios em falta' },
        { status: 400 }
      )
    }

    // Resolve storeId
    let storeId = storeIdParam
    if (!storeId) {
      const firstStore = await db.store.findFirst()
      if (!firstStore) {
        return NextResponse.json({ error: 'No store found' }, { status: 404 })
      }
      storeId = firstStore.id
    }

    // Verify store exists
    const store = await db.store.findUnique({ where: { id: storeId } })
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const inquiry = await db.b2BInquiry.create({
      data: {
        storeId,
        companyName,
        contactName,
        email,
        phone: phone || null,
        nif: nif || null,
        businessType,
        products: products || '',
        quantity,
        message: message || null,
      },
    })

    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating B2B inquiry:', error)
    return NextResponse.json({ error: 'Erro ao enviar pedido' }, { status: 500 })
  }
}
