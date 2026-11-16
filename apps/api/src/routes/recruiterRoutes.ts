import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { JobModel, JobApplicationModel, CandidateProfileModel, UserModel } from '../models';

const router = Router();

// Require recruiter or admin role
router.use(requireAuth);
router.use(requireRole('recruiter', 'admin'));

// GET /api/v1/recruiter/jobs - List recruiter's jobs
router.get('/jobs', async (req: Request, res: Response) => {
  try {
    const jobs = await JobModel.find({ recruiterId: req.auth!.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Attach applicant count to each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (j: any) => {
        const count = await JobApplicationModel.countDocuments({ jobId: j._id.toString() });
        return {
          ...j,
          id: j._id.toString(),
          applicantCount: count,
        };
      })
    );

    res.json({ success: true, jobs: jobsWithCounts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/recruiter/applicants - List applicants across recruiter's jobs
router.get('/applicants', async (req: Request, res: Response) => {
  try {
    const recruiterJobs = await JobModel.find({ recruiterId: req.auth!.userId }).select('_id title').lean();
    const jobIds = recruiterJobs.map((j) => j._id.toString());

    const applications = await JobApplicationModel.find({
      jobId: { $in: jobIds },
    })
      .sort({ appliedDate: -1 })
      .lean();

    const userIds = applications.map((a) => a.userId);
    const profiles = await CandidateProfileModel.find({ userId: { $in: userIds } }).lean();
    const profileMap = new Map<string, any>();
    profiles.forEach((p: any) => profileMap.set(p.userId, p));

    const enriched = applications.map((app: any) => {
      const job = recruiterJobs.find((j) => j._id.toString() === app.jobId);
      const profile = profileMap.get(app.userId);
      return {
        ...app,
        id: app._id.toString(),
        jobTitle: job?.title || 'Unknown Role',
        candidate: profile
          ? {
              fullName: profile.fullName,
              headline: profile.headline,
              experienceYears: profile.experienceYears,
              skills: profile.technicalSkills,
              resumeUrl: profile.resumeUrl,
            }
          : { fullName: 'Candidate', headline: 'Applicant' },
      };
    });

    res.json({ success: true, applicants: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/recruiter/applicants/:id/status
router.patch('/applicants/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const application = await JobApplicationModel.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      note: notes || `Recruiter updated status to ${status}`,
    });

    await application.save();

    res.json({
      success: true,
      application: {
        ...application.toObject(),
        id: application._id.toString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
