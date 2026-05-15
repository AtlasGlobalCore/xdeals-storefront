import { db } from '@/lib/db'
import { getStoreIdFromRequest } from '@/lib/store'
import { NextResponse } from 'next/server'

/**
 * POST /api/orders
 *
 * Flow:
 * 1. Extract subdomain from Host header → resolve Store → get storeId + walletReference
 * 2. Create Order with status AWAITING_PAYMENT
 * 3. Build payment payload and POST to Ghost Middleware (/api/payments/process)
 * 4. Update Order with paymentSessionId and paymentUrl from Ghost Middleware response
 * 5. Return order + payment info to frontend
 */
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

    // ── Step 1: Resolve Store from subdomain ──
    const storeResult = await getStoreIdFromRequest(request)
    if ('error' in storeResult) {
      return NextResponse.json({ error: storeResult.error }, { status: storeResult.status })
    }
    const { storeId, walletReference } = storeResult

    // ── Step 2: Create Order with AWAITING_PAYMENT ──
    const total = items.reduce(
      (sum: number, item: { unitPrice: number; quantity: number }) => sum + item.unitPrice * item.quantity,
      0
    )

    const order = await db.order.create({
      data: {
        storeId,
        customerName,
        email,
        phone,
        address,
        city,
        postalCode,
        total,
        status: 'AWAITING_PAYMENT',
        paymentMethod,
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

    // ── Step 3: Call Ghost Middleware for payment ──
    let paymentData: {
      sessionId?: string
      paymentUrl?: string
      methodSpecific?: Record<string, unknown>
      expiresAt?: string
    } = {}

    try {
      // Build the internal URL for the Ghost Middleware
      // Use direct function call pattern to avoid external HTTP in same server
      const protocol = request.headers.get('x-forwarded-proto') || 'http'
      const host = request.headers.get('host') || 'localhost:3000'
      const ghostMiddlewareUrl = `${protocol}://${host}/api/payments/process`

      const paymentPayload = {
        walletReference,
        orderId: order.id,
        amount: total,
        paymentMethod,
        customerPhone: phone,
        customerEmail: email,
      }

      const paymentResponse = await fetch(ghostMiddlewareUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload),
      })

      if (paymentResponse.ok) {
        paymentData = await paymentResponse.json()
      } else {
        console.error('[Orders] Ghost Middleware returned non-OK:', paymentResponse.status)
        // Order is still created but payment session failed
      }
    } catch (paymentError) {
      console.error('[Orders] Failed to reach Ghost Middleware:', paymentError)
      // Order is still created, but payment session is pending
    }

    // ── Step 4: Update Order with payment session data ──
    let updatedOrder = order
    if (paymentData.sessionId) {
      updatedOrder = await db.order.update({
        where: { id: order.id },
        data: {
          paymentSessionId: paymentData.sessionId,
          paymentUrl: paymentData.paymentUrl || null,
          paymentRef: paymentData.sessionId, // Backwards compat
        },
        include: { items: true },
      })
    }

    // ── Step 5: Return unified response ──
    return NextResponse.json({
      success: true,
      order: updatedOrder,
      payment: {
        sessionId: paymentData.sessionId || null,
        paymentUrl: paymentData.paymentUrl || null,
        expiresAt: paymentData.expiresAt || null,
        methodSpecific: paymentData.methodSpecific || null,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Erro ao criar encomenda' }, { status: 500 })
  }
}
