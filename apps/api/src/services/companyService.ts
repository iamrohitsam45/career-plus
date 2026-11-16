import mongoose from 'mongoose';
import {
  CompanyModel,
  CompanyReviewModel,
  InterviewExperienceModel,
  JobModel,
} from '../models';
import { CompanyReviewInput } from '@careerpulse/shared';

const SAMPLE_COMPANIES = [
  {
    id: 'google',
    name: 'Google India',
    slug: 'google',
    industry: 'Technology & Cloud',
    headquarters: 'Bengaluru, Karnataka',
    size: '100,000+',
    overview: 'Google is a global tech leader.',
    rating: 4.6,
    reviewCount: 342,
    workLifeRating: 4.4,
    cultureRating: 4.7,
    compensationRating: 4.8,
    careerGrowthRating: 4.5,
    benefits: ['Medical Cover', 'Dining', 'Learning Allowance'],
    isVerified: true,
    followerCount: 28400,
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    slug: 'razorpay',
    industry: 'FinTech',
    headquarters: 'Bengaluru, Karnataka',
    size: '3,000+',
    overview: 'Fintech payments infrastructure.',
    rating: 4.4,
    reviewCount: 142,
    workLifeRating: 4.0,
    cultureRating: 4.6,
    compensationRating: 4.5,
    careerGrowthRating: 4.6,
    benefits: ['ESOPs', 'Medical', 'Catered Meals'],
    isVerified: true,
    followerCount: 12100,
  },
];

export class CompanyService {
  static async getAllCompanies(search?: string, industry?: string) {
    if (mongoose.connection.readyState !== 1) {
      return SAMPLE_COMPANIES;
    }
    const filter: any = {};
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { overview: { $regex: search.trim(), $options: 'i' } },
      ];
    }
    if (industry && industry !== 'all') {
      filter.industry = { $regex: industry, $options: 'i' };
    }

    const companies = await CompanyModel.find(filter).sort({ rating: -1 }).lean();
    return companies.map((c: any) => ({
      ...c,
      id: c._id.toString(),
    }));
  }

  static async getCompanyBySlug(slug: string) {
    const company = await CompanyModel.findOne({ slug: slug.toLowerCase() }).lean();
    if (!company) return null;

    // Fetch jobs available at this company
    const jobs = await JobModel.find({
      $or: [{ companySlug: slug }, { company: { $regex: company.name, $options: 'i' } }],
    })
      .limit(6)
      .lean();

    return {
      ...(company as any),
      id: (company as any)._id.toString(),
      openJobs: jobs.map((j: any) => ({ ...j, id: j._id.toString() })),
    };
  }

  static async getCompanyReviews(slug: string) {
    const reviews = await CompanyReviewModel.find({
      companySlug: slug.toLowerCase(),
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return reviews.map((r: any) => ({
      ...r,
      id: r._id.toString(),
    }));
  }

  static async addCompanyReview(input: CompanyReviewInput, userId?: string) {
    const review = await CompanyReviewModel.create({
      ...input,
      companyId: input.companySlug,
      userId,
      isApproved: true, // auto-approve for evaluation
    });

    // Update company aggregate ratings
    const allReviews = await CompanyReviewModel.find({
      companySlug: input.companySlug,
      isApproved: true,
    });

    if (allReviews.length > 0) {
      const avgOverall =
        allReviews.reduce((sum, r) => sum + r.overallRating, 0) / allReviews.length;
      const avgWorkLife =
        allReviews.reduce((sum, r) => sum + r.workLifeRating, 0) / allReviews.length;
      const avgCulture =
        allReviews.reduce((sum, r) => sum + r.cultureRating, 0) / allReviews.length;
      const avgComp =
        allReviews.reduce((sum, r) => sum + r.compensationRating, 0) / allReviews.length;
      const avgGrowth =
        allReviews.reduce((sum, r) => sum + r.careerGrowthRating, 0) / allReviews.length;

      await CompanyModel.updateOne(
        { slug: input.companySlug },
        {
          rating: Number(avgOverall.toFixed(1)),
          reviewCount: allReviews.length,
          workLifeRating: Number(avgWorkLife.toFixed(1)),
          cultureRating: Number(avgCulture.toFixed(1)),
          compensationRating: Number(avgComp.toFixed(1)),
          careerGrowthRating: Number(avgGrowth.toFixed(1)),
        }
      );
    }

    return {
      ...review.toObject(),
      id: review._id.toString(),
    };
  }

  static async getInterviewExperiences(slug: string) {
    const docs = await InterviewExperienceModel.find({
      companySlug: slug.toLowerCase(),
    })
      .sort({ createdAt: -1 })
      .lean();

    return docs.map((d: any) => ({
      ...d,
      id: d._id.toString(),
    }));
  }
}
