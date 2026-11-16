import { Router, Request, Response } from 'express';
import { SalaryService } from '../services/salaryService';
import { validateBody } from '../middleware/validate';
import { SalarySubmissionSchema } from '@careerpulse/shared';

const router = Router();

// GET /api/v1/salaries
router.get('/', async (req: Request, res: Response) => {
  try {
    const role = req.query.role as string;
    const location = req.query.location as string;
    const data = await SalaryService.getSalaryOverview(role, location);
    res.json({ success: true, ...data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/salaries/compare
router.get('/compare', async (req: Request, res: Response) => {
  try {
    const roles = ['Software Engineer', 'Frontend Developer', 'Data Scientist', 'Product Manager'];
    const comparisons = await Promise.all(
      roles.map(async (role) => {
        const stats = await SalaryService.getSalaryOverview(role);
        return {
          role,
          medianSalary: stats.medianSalary,
          medianLpa: Number((stats.medianSalary / 100000).toFixed(1)),
          p25Salary: stats.p25Salary,
          p75Salary: stats.p75Salary,
          sampleSize: stats.sampleSize,
        };
      })
    );

    res.json({ success: true, comparisons });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/salaries - Anonymous salary submission
router.post('/', validateBody(SalarySubmissionSchema), async (req: Request, res: Response) => {
  try {
    const result = await SalaryService.submitSalary(req.body);
    res.status(201).json({ success: true, submission: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
