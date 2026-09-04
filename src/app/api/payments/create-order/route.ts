import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createRazorpayOrder, isRazorpayMockMode } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    await requireAuth();
    
    const { amount, orderId } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const receipt = `savor_${orderId || Date.now()}`;
    const order = await createRazorpayOrder(amount, receipt);

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'mock_key',
        mockMode: isRazorpayMockMode(),
      },
    });
  } catch (error) {
    console.error('Payment order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
