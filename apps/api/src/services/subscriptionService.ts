import crypto from 'crypto';
import Razorpay from 'razorpay';
import { ENV } from '../config/env';
import { SubscriptionModel, PaymentModel } from '../models';

export class SubscriptionService {
  private static getRazorpayClient(): Razorpay | null {
    if (!ENV.RAZORPAY_KEY_ID || ENV.RAZORPAY_KEY_ID.includes('placeholder')) {
      return null;
    }
    return new Razorpay({
      key_id: ENV.RAZORPAY_KEY_ID,
      key_secret: ENV.RAZORPAY_KEY_SECRET,
    });
  }

  /**
   * Create Razorpay order for Pro subscription (₹1,499 / mo)
   */
  static async createOrder(userId: string) {
    const amount = 149900; // in paise (₹1,499)
    const currency = 'INR';
    const receipt = `cp_sub_${userId.slice(-6)}_${Date.now()}`;

    const client = this.getRazorpayClient();
    if (!client) {
      // In sandbox/local test mode without active Razorpay keys
      const mockOrderId = `order_test_${crypto.randomBytes(6).toString('hex')}`;
      return {
        orderId: mockOrderId,
        amount,
        currency,
        keyId: 'rzp_test_mock_key',
        isSandbox: true,
      };
    }

    const order = await client.orders.create({
      amount,
      currency,
      receipt,
      notes: { userId, plan: 'pro' },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: ENV.RAZORPAY_KEY_ID,
      isSandbox: false,
    };
  }

  /**
   * Verify signed payment from Razorpay
   */
  static async verifyPayment(data: {
    userId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const { userId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = data;

    // Cryptographic signature check
    if (ENV.RAZORPAY_KEY_SECRET && !ENV.RAZORPAY_KEY_SECRET.includes('placeholder')) {
      const generatedSignature = crypto
        .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        throw new Error('Payment verification failed: Invalid cryptographic signature');
      }
    }

    // Persist verified payment in DB
    await PaymentModel.create({
      userId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      amount: 1499,
      currency: 'INR',
      status: 'captured',
    });

    // Upgrade user subscription to Pro
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const subscription = await SubscriptionModel.findOneAndUpdate(
      { userId },
      {
        userId,
        plan: 'pro',
        status: 'active',
        razorpayPaymentId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: expiresAt,
        amountInr: 1499,
      },
      { upsert: true, new: true }
    );

    return {
      success: true,
      subscription: {
        ...subscription.toObject(),
        id: subscription._id.toString(),
      },
    };
  }

  /**
   * Get subscription status for a user
   */
  static async getUserSubscription(userId: string) {
    const sub = await SubscriptionModel.findOne({ userId }).lean();
    if (!sub) {
      return {
        plan: 'free',
        status: 'active',
        isPro: false,
        expiresAt: null,
      };
    }

    const isPro = sub.plan === 'pro' && sub.status === 'active' && new Date(sub.currentPeriodEnd) > new Date();

    return {
      plan: isPro ? 'pro' : 'free',
      status: sub.status,
      isPro,
      currentPeriodEnd: sub.currentPeriodEnd,
      amountInr: sub.amountInr,
    };
  }

  /**
   * Backend entitlement check middleware helper
   */
  static async checkProEntitlement(userId: string): Promise<boolean> {
    const sub = await this.getUserSubscription(userId);
    return sub.isPro;
  }
}
