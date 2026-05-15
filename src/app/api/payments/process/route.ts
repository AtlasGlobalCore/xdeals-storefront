import { NextResponse } from 'next/server'

/**
 * Ghost Middleware — Internal Payment Proxy
 *
 * This route acts as an abstraction layer between the application
 * and any external payment provider. It receives a standardized payload,
 * routes it to the appropriate backend, and returns a unified response.
 *
 * Nomenclature is intentionally provider-agnostic (no Stripe, Easypay,
 * SIBS references). In production, this would dispatch to the actual
 * payment gateway based on the store's configuration.
 *
 * Payload:
 *   - walletReference: Store's core banking wallet reference
 *   - orderId: The order ID in our system
 *   - amount: Total amount in EUR
 *   - paymentMethod: "mbway" | "multibanco" | "cartao"
 *   - customerPhone: Required for MB WAY
 *   - customerEmail: For receipt notifications
 *
 * Response:
 *   - sessionId: Unique payment session identifier
 *   - paymentUrl: Redirect/link URL for the customer
 *   - expiresAt: ISO timestamp when the session expires
 *   - methodSpecific: Provider-specific details (MB WAY phone, MB ref, etc.)
 */

interface PaymentPayload {
  walletReference: string
  orderId: string
  amount: number
  paymentMethod: string
  customerPhone?: string
  customerEmail?: string
}

interface MethodSpecific {
  // MB WAY
  phoneNumber?: string
  // Multibanco
  entity?: string
  reference?: string
  // Card
  redirectUrl?: string
  last4?: string
}

interface PaymentResponse {
  success: boolean
  sessionId: string
  paymentUrl: string
  expiresAt: string
  methodSpecific: MethodSpecific
}

function generateSessionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `PS_${timestamp}_${random}`
}

function generateMultibancoReference(): { entity: string; reference: string } {
  // Standard Portuguese Multibanco entity (demo)
  const entity = '12345'
  // Generate a 9-digit reference with check digit
  const base = Math.floor(Math.random() * 99999999).toString().padStart(8, '0')
  const checkDigit = (parseInt(base) % 9).toString()
  const reference = `${base}${checkDigit}`
  return { entity, reference }
}

/**
 * Processes a payment request through the Ghost Middleware.
 *
 * In production, this function would:
 * 1. Route to the configured payment gateway per store
 * 2. Handle authentication with the provider
 * 3. Map our standard payload to the provider's schema
 * 4. Return a normalized response
 *
 * For now, it simulates the flow with realistic response structures.
 */
async function processPayment(payload: PaymentPayload): Promise<PaymentResponse> {
  const { walletReference, orderId, amount, paymentMethod, customerPhone, customerEmail } = payload
  const sessionId = generateSessionId()
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min

  // Build base response
  const response: PaymentResponse = {
    success: true,
    sessionId,
    paymentUrl: '',
    expiresAt,
    methodSpecific: {},
  }

  switch (paymentMethod) {
    case 'mbway': {
      // In production: call MB WAY / easypay API with walletReference
      response.paymentUrl = `https://pay.xdeals.online/session/${sessionId}`
      response.methodSpecific = {
        phoneNumber: customerPhone || '',
      }
      break
    }

    case 'multibanco': {
      // In production: generate reference via SIBS / easypay
      const { entity, reference } = generateMultibancoReference()
      response.paymentUrl = `https://pay.xdeals.online/session/${sessionId}`
      response.methodSpecific = {
        entity,
        reference,
      }
      break
    }

    case 'cartao': {
      // In production: create checkout session via Stripe/easypay
      response.paymentUrl = `https://pay.xdeals.online/checkout/${sessionId}`
      response.methodSpecific = {
        redirectUrl: `https://pay.xdeals.online/checkout/${sessionId}`,
      }
      break
    }

    default:
      throw new Error(`Unsupported payment method: ${paymentMethod}`)
  }

  // Log for audit trail (in production, use structured logging)
  console.log(`[GhostMiddleware] Payment processed: session=${sessionId} order=${orderId} wallet=${walletReference} amount=${amount} method=${paymentMethod}`)

  return response
}

export async function POST(request: Request) {
  try {
    const body: PaymentPayload = await request.json()
    const { walletReference, orderId, amount, paymentMethod } = body

    // Validate required fields
    if (!walletReference || !orderId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: walletReference, orderId, amount, paymentMethod' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than zero' },
        { status: 400 }
      )
    }

    if (!['mbway', 'multibanco', 'cartao'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: `Invalid payment method: ${paymentMethod}` },
        { status: 400 }
      )
    }

    // Process through Ghost Middleware
    const result = await processPayment(body)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('[GhostMiddleware] Error processing payment:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}
