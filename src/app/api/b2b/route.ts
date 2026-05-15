import { db } from '@/lib/db'
import { getStoreIdFromRequest } from '@/lib/store'
import { NextResponse } from 'next/server'

/**
 * POST /api/b2b
 * Store context is resolved from the subdomain in the Host header.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyName, contactName, email, phone, nif, businessType, products, quantity, message } = body

    if (!companyName || !contactName || !email || !businessType || !quantity) {
      return NextResponse.json(
        { error: 'Campos obrigatórios em falta' },
        { status: 400 }
      )
    }

    // Resolve storeId from subdomain
    const storeResult = await getStoreIdFromRequest(request)
    if ('error' in storeResult) {
      return NextResponse.json({ error: storeResult.error }, { status: storeResult.status })
    }
    const { storeId } = storeResult

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
