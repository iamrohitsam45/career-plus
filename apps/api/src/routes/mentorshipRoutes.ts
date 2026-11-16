import { Router, Request, Response } from 'express';
import { MentorshipService } from '../services/mentorshipService';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { MentorBookingSchema } from '@careerpulse/shared';
import { CandidateProfileModel } from '../models';

const router = Router();

// GET /api/v1/mentors - List mentors
router.get('/', async (req: Request, res: Response) => {
  try {
    const serviceType = req.query.service as string;
    const mentors = await MentorshipService.getAllMentors(serviceType);
    res.json({ success: true, mentors });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/mentors/:id - Single mentor profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const mentor = await MentorshipService.getMentorById(id);
    if (!mentor) {
      return res.status(404).json({ success: false, error: 'Mentor not found' });
    }
    res.json({ success: true, mentor });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/mentors/book - Book session
router.post('/book', requireAuth, validateBody(MentorBookingSchema), async (req: Request, res: Response) => {
  try {
    const userId = req.auth!.userId;
    const profile = await CandidateProfileModel.findOne({ userId }).lean();
    const candidateName = profile?.fullName || req.auth!.email?.split('@')[0] || 'Candidate';

    const booking = await MentorshipService.bookSession({
      mentorId: req.body.mentorId,
      candidateId: userId,
      candidateName,
      serviceType: req.body.serviceType,
      bookingDate: req.body.bookingDate,
      slotTime: req.body.slotTime,
      notes: req.body.notes,
    });

    res.status(201).json({ success: true, booking });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/v1/mentors/my-sessions - Current candidate's booked sessions
router.get('/my-sessions', requireAuth, async (req: Request, res: Response) => {
  try {
    const sessions = await MentorshipService.getCandidateBookings(req.auth!.userId);
    res.json({ success: true, sessions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
