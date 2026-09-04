/**
 * Razorpay Integration Layer
 * 
 * This module provides a clean integration layer for Razorpay payments.
 * In development mode (without real API keys), it operates in mock mode
 * and simulates payment flows.
 * 
 * To enable real payments:
 * 1. Set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env
 * 2. Set RAZORPAY_KEY_SECRET in .env
 * 3. The system will automatically use real Razorpay APIs
 */

const IS_MOCK_MODE = !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'your-razorpay-key-secret';

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

interface RazorpayVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Create a Razorpay order (server-side)
 */
export async function createRazorpayOrder(
  amount: number, // in INR (will be converted to paise)
  receipt: string
): Promise<RazorpayOrder> {
  if (IS_MOCK_MODE) {
    // Mock mode: return a simulated order
    return {
      id: `order_mock_${Date.now()}`,
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt,
      status: 'created',
    };
  }

  // Real Razorpay integration
  const Razorpay = (await import('razorpay')).default;
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'INR',
    receipt,
  });

  return order as unknown as RazorpayOrder;
}

/**
 * Verify Razorpay payment signature (server-side)
 */
export async function verifyRazorpayPayment(
  verification: RazorpayVerification
): Promise<boolean> {
  if (IS_MOCK_MODE) {
    // Mock mode: always verify successfully
    return true;
  }

  // Real verification using HMAC SHA256
  const crypto = await import('crypto');
  const body = `${verification.razorpay_order_id}|${verification.razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  return expectedSignature === verification.razorpay_signature;
}

/**
 * Check if Razorpay is in mock mode
 */
export function isRazorpayMockMode(): boolean {
  return IS_MOCK_MODE;
}
