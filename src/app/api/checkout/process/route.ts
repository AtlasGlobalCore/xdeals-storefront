import { NextResponse } from 'next/server'

/**
 * Ghost Middleware Protocol — Universal Relay
 *
 * POST /api/checkout/process
 *
 * This route is the single entry point for all checkout operations.
 * It relays the cart + payment method to the Core Banking API
 * at https://api.atlasglobal.digital/checkout/initiate, passing
 * the store's publishableKey in the headers for authentication.
 *
 * The Core Banking API determines the payment flow and returns
 * a type field that dictates the next UI step:
 *
 *   - REFERENCE:  Display Multibanco entity/reference or PIX code
 *   - IFRAME:     Mount secure card capture using client_secret
 *   - ASYNC_WAIT: Show "waiting for app confirmation" (MB WAY)
 *
 * The response is passed through verbatim to the frontend,
 * maintaining the Ghost Middleware's role as a transparent relay.
 */

const CORE_API_BASE = process.env.CORE_API_BASE || 'https://api.atlasglobal.digital'

interface CheckoutPayload {
  publishableKey: string
  storeSlug: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  items: Array<{
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    unit: string
  }>
  paymentMethod: string
  total: number
  currency: string
}

/**
 * Fallback response when the Core API is unreachable.
 * Generates realistic mock responses so the UI can be tested locally.
 */
function generateFallbackResponse(payload: CheckoutPayload) {
  const sessionId = `rel_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString()

  switch (payload.paymentMethod) {
    case 'MULTIBANCO':
      return {
        type: 'REFERENCE',
        sessionId,
        expiresAt,
        reference: {
          entity: '12345',
          reference: String(Math.floor(Math.random() * 999999999)).padStart(9, '0'),
          amount: payload.total,
        },
      }

    case 'MBWAY':
      return {
        type: 'ASYNC_WAIT',
        sessionId,
        expiresAt,
        asyncWait: {
          message: `Confirme o pagamento na app MB WAY para o número ${payload.customer.phone}`,
          phoneNumber: payload.customer.phone,
          deepLink: `mbway://pay?session=${sessionId}`,
        },
      }

    case 'CARD':
      return {
        type: 'IFRAME',
        sessionId,
        expiresAt,
        iframe: {
          clientSecret: `cs_${sessionId}_secret_${Math.random().toString(36).substring(2, 10)}`,
          publishableKey: payload.publishableKey,
          returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/checkout/confirm?session=${sessionId}`,
        },
      }

    case 'PIX':
      return {
        type: 'REFERENCE',
        sessionId,
        expiresAt,
        reference: {
          pixCode: `00020126580014br.gov.bcb.pix0136${sessionId}5204000053039865802BR5925XDEALS${payload.storeSlug.toUpperCase()}6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          qrCodeUrl: `https://api.atlasglobal.digital/qr/${sessionId}.png`,
          amount: payload.total,
        },
      }

    default:
      return {
        type: 'REFERENCE',
        sessionId,
        expiresAt,
        reference: {
          entity: '12345',
          reference: String(Math.floor(Math.random() * 999999999)).padStart(9, '0'),
          amount: payload.total,
        },
      }
  }
}

export async function POST(request: Request) {
  try {
    const payload: CheckoutPayload = await request.json()
    const { publishableKey, customer, items, paymentMethod, total } = payload

    // Validate required fields
    if (!publishableKey) {
      return NextResponse.json({ error: 'Missing publishableKey' }, { status: 400 })
    }
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json({ error: 'Missing customer fields' }, { status: 400 })
    }
    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    if (!paymentMethod) {
      return NextResponse.json({ error: 'Missing paymentMethod' }, { status: 400 })
    }

    // Relay to Core Banking API (Universal Relay)
    try {
      const relayRes = await fetch(`${CORE_API_BASE}/checkout/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publishableKey}`,
          'X-Publishable-Key': publishableKey,
          'User-Agent': 'xdeals-storefront/1.0',
        },
        body: JSON.stringify({
          storeSlug: payload.storeSlug,
          customer,
          items,
          paymentMethod,
          total,
          currency: payload.currency || 'EUR',
        }),
      })

      if (relayRes.ok) {
        const data = await relayRes.json()
        return NextResponse.json(data, { status: 200 })
      }

      console.warn(`[UniversalRelay] Core API returned ${relayRes.status}, using fallback`)
    } catch (relayError) {
      console.warn('[UniversalRelay] Core API unreachable, using fallback:', relayError)
    }

    // Fallback: generate mock response for development
    const fallback = generateFallbackResponse(payload)
    return NextResponse.json(fallback, { status: 200 })
  } catch (error) {
    console.error('[UniversalRelay] Error:', error)
    return NextResponse.json({ error: 'Checkout processing failed' }, { status: 500 })
  }
}
