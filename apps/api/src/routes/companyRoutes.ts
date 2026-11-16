import { Router, Request, Response } from 'express';
import { CompanyService } from '../services/companyService';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { CompanyReviewSchema } from '@careerpulse/shared';

const router = Router();

// GET /api/v1/companies - List companies
router.get('/', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const industry = req.query.industry as string;
    const companies = await CompanyService.getAllCompanies(search, industry);
    res.json({ success: true, companies });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/companies/:slug - Single company detail
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const company = await CompanyService.getCompanyBySlug(slug);
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }
    res.json({ success: true, company });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/companies/:slug/reviews - Company reviews
router.get('/:slug/reviews', async (req: Request, res: Response) => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const reviews = await CompanyService.getCompanyReviews(slug);
    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/companies/:slug/reviews - Submit review
router.post(
  '/:slug/reviews',
  optionalAuth,
  validateBody(CompanyReviewSchema),
  async (req: Request, res: Response) => {
    try {
      const review = await CompanyService.addCompanyReview(
        req.body,
        req.auth?.userId
      );
      res.status(201).json({ success: true, review });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// GET /api/v1/companies/:slug/interviews - Interview experiences
router.get('/:slug/interviews', async (req: Request, res: Response) => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const interviews = await CompanyService.getInterviewExperiences(slug);
    res.json({ success: true, interviews });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
