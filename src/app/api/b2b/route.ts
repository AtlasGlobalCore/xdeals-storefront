import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

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

    const inquiry = await db.b2BInquiry.create({
      data: {
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
