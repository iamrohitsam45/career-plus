import { Router, Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { requireAuth } from '../middleware/auth';
import crypto from 'crypto';
import { ENV } from '../config/env';

const router = Router();

// GET /api/v1/subscriptions/me
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const sub = await SubscriptionService.getUserSubscription(req.auth!.userId);
    res.json({ success: true, subscription: sub });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/subscriptions/create-order
router.post('/create-order', requireAuth, async (req: Request, res: Response) => {
  try {
    const order = await SubscriptionService.createOrder(req.auth!.userId);
    res.json({ success: true, ...order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/subscriptions/verify - Cryptographic signature check
router.post('/verify', requireAuth, async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        error: 'Missing razorpayOrderId or razorpayPaymentId',
      });
    }

    const result = await SubscriptionService.verifyPayment({
      userId: req.auth!.userId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: razorpaySignature || 'dev_sig',
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/v1/webhooks/razorpay
router.post('/webhooks/razorpay', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    if (ENV.RAZORPAY_WEBHOOK_SECRET && signature) {
      const expected = crypto
        .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expected !== signature) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    // Process event
    const event = req.body.event;
    console.log(`[Razorpay Webhook] Received event: ${event}`);

    res.json({ status: 'ok' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
