import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { OnboardingSchema } from '@careerpulse/shared';
import { UserModel, CandidateProfileModel } from '../models';
import { SubscriptionService } from '../services/subscriptionService';

const router = Router();

// GET /api/v1/users/me
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.auth!.userId;
    const [user, profile, subscription] = await Promise.all([
      UserModel.findOne({ clerkId: userId }).lean(),
      CandidateProfileModel.findOne({ userId }).lean(),
      SubscriptionService.getUserSubscription(userId),
    ]);

    res.json({
      success: true,
      user: {
        id: userId,
        email: req.auth!.email || user?.email || `${userId}@careerpulse.ai`,
        role: req.auth!.role,
        isOnboarded: user?.isOnboarded ?? Boolean(profile),
        profile: profile ? { ...profile, id: (profile as any)._id.toString() } : null,
        subscription,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/users/onboarding
router.post(
  '/onboarding',
  requireAuth,
  validateBody(OnboardingSchema),
  async (req: Request, res: Response) => {
    try {
      const userId = req.auth!.userId;
      const data = req.body;

      // Upsert candidate profile
      const profile = await CandidateProfileModel.findOneAndUpdate(
        { userId },
        { ...data, userId },
        { upsert: true, new: true }
      );

      // Mark user as onboarded
      await UserModel.findOneAndUpdate(
        { clerkId: userId },
        { isOnboarded: true, role: 'candidate' },
        { upsert: true }
      );

      res.status(200).json({
        success: true,
        message: 'Onboarding completed successfully',
        profile: {
          ...profile.toObject(),
          id: profile._id.toString(),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// POST /api/v1/webhooks/clerk
router.post('/webhooks/clerk', async (req: Request, res: Response) => {
  try {
    const event = req.body;
    if (event?.type === 'user.created' || event?.type === 'user.updated') {
      const data = event.data;
      const email = data.email_addresses?.[0]?.email_address;
      await UserModel.findOneAndUpdate(
        { clerkId: data.id },
        {
          clerkId: data.id,
          email,
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
        },
        { upsert: true }
      );
    }
    res.json({ received: true });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
