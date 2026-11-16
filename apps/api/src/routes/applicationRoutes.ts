import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { ApplicationUpdateSchema } from '@careerpulse/shared';
import { JobApplicationModel, JobModel } from '../models';

const router = Router();

// GET /api/v1/applications - Candidate applications for Kanban
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.auth!.userId;
    const applications = await JobApplicationModel.find({ userId })
      .sort({ updatedAt: -1 })
      .lean();

    const jobIds = applications.map((a) => a.jobId);
    const jobs = await JobModel.find({
      $or: [
        { _id: { $in: jobIds.filter((id) => id.match(/^[0-9a-fA-F]{24}$/)) } },
        { sourceJobId: { $in: jobIds } },
      ],
    }).lean();

    const jobMap = new Map<string, any>();
    jobs.forEach((j: any) => {
      jobMap.set(j._id.toString(), j);
      jobMap.set(j.sourceJobId, j);
    });

    const enriched = applications.map((app: any) => ({
      ...app,
      id: app._id.toString(),
      job: jobMap.get(app.jobId)
        ? { ...jobMap.get(app.jobId), id: jobMap.get(app.jobId)._id.toString() }
        : null,
    }));

    res.json({ success: true, applications: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/applications - Track new application
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.auth!.userId;
    const { jobId, status = 'applied', resumeId, notes, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, error: 'jobId is required' });
    }

    const application = await JobApplicationModel.findOneAndUpdate(
      { userId, jobId },
      {
        userId,
        jobId,
        status,
        resumeId,
        notes,
        coverLetter,
        appliedDate: new Date(),
        $push: {
          statusHistory: {
            status,
            changedAt: new Date(),
            note: 'Application initiated',
          },
        },
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
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

// PATCH /api/v1/applications/:id - Update status / drag-and-drop
router.patch(
  '/:id',
  requireAuth,
  validateBody(ApplicationUpdateSchema),
  async (req: Request, res: Response) => {
    try {
      const { status, notes, interviewDate, followUpReminderDate } = req.body;
      const application = await JobApplicationModel.findOne({
        _id: req.params.id,
        userId: req.auth!.userId,
      });

      if (!application) {
        return res.status(404).json({ success: false, error: 'Application not found' });
      }

      if (status && status !== application.status) {
        application.status = status;
        application.statusHistory.push({
          status,
          changedAt: new Date(),
          note: notes || `Moved to ${status}`,
        });
      }

      if (notes !== undefined) application.notes = notes;
      if (interviewDate) application.interviewDate = new Date(interviewDate);
      if (followUpReminderDate) application.followUpReminderDate = new Date(followUpReminderDate);

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
  }
);

// DELETE /api/v1/applications/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await JobApplicationModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth!.userId,
    });

    res.json({ success: true, message: 'Application deleted from tracker' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
