import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerName, email, phone, address, city, postalCode, paymentMethod, items } = body

    if (!customerName || !email || !phone || !address || !city || !postalCode || !paymentMethod || !items?.length) {
      return NextResponse.json(
        { error: 'Campos obrigatórios em falta' },
        { status: 400 }
      )
    }

    const total = items.reduce((sum: number, item: { unitPrice: number; quantity: number }) => sum + item.unitPrice * item.quantity, 0)

    // Generate a payment reference based on method
    const paymentRef = paymentMethod === 'multibanco'
      ? `MB${Date.now().toString().slice(-9)}`
      : paymentMethod === 'mbway'
      ? `MW${Date.now().toString().slice(-9)}`
      : `CC${Date.now().toString().slice(-9)}`

    const order = await db.order.create({
      data: {
        customerName,
        email,
        phone,
        address,
        city,
        postalCode,
        total,
        paymentMethod,
        paymentRef,
        items: {
          create: items.map((item: { productId: string; productName: string; quantity: number; unitPrice: number; unit: string }) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            unit: item.unit,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Erro ao criar encomenda' }, { status: 500 })
  }
}
