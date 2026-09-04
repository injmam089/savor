import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verifyRazorpayPayment, isRazorpayMockMode } from '@/lib/razorpay';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    await requireAuth();
    
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // In mock mode, auto-verify
    if (isRazorpayMockMode()) {
      await prisma.payment.update({
        where: { orderId },
        data: {
          status: 'COMPLETED',
          transactionId: `mock_pay_${Date.now()}`,
          paidAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        data: { verified: true, mockMode: true },
      });
    }

    // Real verification
    const isVerified = await verifyRazorpayPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (isVerified) {
      await prisma.payment.update({
        where: { orderId },
        data: {
          status: 'COMPLETED',
          transactionId: razorpay_payment_id,
          paidAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        data: { verified: true },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
