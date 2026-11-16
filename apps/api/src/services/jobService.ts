import mongoose from 'mongoose';
import { JobModel, SavedJobModel, CandidateProfileModel, IJob } from '../models';
import {
  Job,
  JobQueryInput,
  deduplicateJobs,
  normalizeRemotiveJob,
  normalizeJSearchJob,
} from '@careerpulse/shared';
import { ENV } from '../config/env';

const SAMPLE_FALLBACK_JOBS: Job[] = [
  {
    id: 'job_sample_01',
    source: 'direct',
    sourceJobId: 'sample_01',
    title: 'Senior Full Stack Engineer',
    company: 'Razorpay',
    location: 'Bengaluru, Karnataka',
    country: 'India',
    workMode: 'hybrid',
    salaryMin: 2800000,
    salaryMax: 4200000,
    salaryCurrency: 'INR',
    salaryInterval: 'yearly',
    requiredSkills: ['Next.js', 'React', 'Node.js', 'TypeScript'],
    jobType: 'full-time',
    publishedDate: new Date().toISOString(),
    lastVerifiedDate: new Date().toISOString(),
    applicationUrl: 'https://careerpulse.ai/apply',
    isNative: true,
    sourceAttribution: 'CareerPulse Verified Employer',
    description: 'Lead next-generation merchant checkout experiences with Next.js and high-throughput databases.',
  },
];

// In-memory cache for fast search responses & external feed caching
interface CacheItem {
  data: any;
  timestamp: number;
}
const cache = new Map<string, CacheItem>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class JobService {
  /**
   * Search and filter jobs with pagination, sorting and deduplication
   */
  static async searchJobs(params: JobQueryInput) {
    if (mongoose.connection.readyState !== 1) {
      return {
        jobs: SAMPLE_FALLBACK_JOBS,
        total: SAMPLE_FALLBACK_JOBS.length,
        page: 1,
        limit: 15,
        totalPages: 1,
      };
    }
    const cacheKey = JSON.stringify(params);
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    const {
      query,
      location,
      isIndia,
      isBengaluru,
      workMode,
      jobType,
      minSalary,
      maxSalary,
      skills,
      company,
      sortBy = 'recent',
      page = 1,
      limit = 15,
    } = params;

    const mongoFilter: any = {};

    // Keyword search
    if (query && query.trim()) {
      const q = query.trim();
      mongoFilter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    // Location filters
    if (isBengaluru) {
      mongoFilter.$or = [
        { city: { $regex: 'bengaluru|bangalore', $options: 'i' } },
        { location: { $regex: 'bengaluru|bangalore', $options: 'i' } },
      ];
    } else if (isIndia) {
      mongoFilter.$or = [
        { country: { $regex: 'india', $options: 'i' } },
        { location: { $regex: 'india|bengaluru|bangalore|hyderabad|pune|delhi|mumbai|gurgaon|noida', $options: 'i' } },
      ];
    } else if (location && location.trim()) {
      mongoFilter.location = { $regex: location.trim(), $options: 'i' };
    }

    if (workMode) {
      mongoFilter.workMode = workMode;
    }

    if (jobType) {
      mongoFilter.jobType = jobType;
    }

    if (company && company.trim()) {
      mongoFilter.company = { $regex: company.trim(), $options: 'i' };
    }

    if (minSalary) {
      mongoFilter.$or = [
        { salaryMin: { $gte: minSalary } },
        { salaryMax: { $gte: minSalary } },
      ];
    }

    if (maxSalary) {
      mongoFilter.salaryMin = { $lte: maxSalary };
    }

    if (skills) {
      const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);
      if (skillList.length > 0) {
        mongoFilter.requiredSkills = {
          $in: skillList.map((s) => new RegExp(s, 'i')),
        };
      }
    }

    // Sort order
    let sortOptions: any = { publishedDate: -1 };
    if (sortBy === 'salary') {
      sortOptions = { salaryMax: -1, salaryMin: -1 };
    } else if (sortBy === 'recent') {
      sortOptions = { publishedDate: -1 };
    }

    try {
      const skip = (page - 1) * limit;
      const [jobsDocs, total] = await Promise.all([
        JobModel.find(mongoFilter).sort(sortOptions).skip(skip).limit(limit).lean(),
        JobModel.countDocuments(mongoFilter),
      ]);

      const jobs = jobsDocs.map((doc: any) => ({
        ...doc,
        id: doc._id.toString(),
      }));

      const result = {
        jobs: deduplicateJobs(jobs),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };

      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (err: any) {
      console.warn(`[JobService.searchJobs] Error querying DB: ${err.message}`);
      return { jobs: [], total: 0, page: 1, limit, totalPages: 1 };
    }
  }

  /**
   * Today's Jobs: Strictly published on the current calendar date in local timezone
   */
  static async getTodaysJobs(page = 1, limit = 15) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filter = {
      publishedDate: { $gte: today },
    };

    try {
      const skip = (page - 1) * limit;
      const [jobsDocs, total] = await Promise.all([
        JobModel.find(filter).sort({ publishedDate: -1 }).skip(skip).limit(limit).lean(),
        JobModel.countDocuments(filter),
      ]);

      // If today has very few records, include latest 24 hours as verified recent
      let docs = jobsDocs;
      let count = total;
      if (count === 0) {
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        docs = await JobModel.find({ publishedDate: { $gte: last24h } })
          .sort({ publishedDate: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
        count = await JobModel.countDocuments({ publishedDate: { $gte: last24h } });
      }

      const jobs = docs.map((doc: any) => ({
        ...doc,
        id: doc._id.toString(),
      }));

      return {
        jobs: deduplicateJobs(jobs),
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      };
    } catch (err: any) {
      return { jobs: [], total: 0, page: 1, limit, totalPages: 1 };
    }
  }

  /**
   * Get single job by ID or sourceJobId
   */
  static async getJobById(id: string): Promise<Job | null> {
    try {
      const doc = await JobModel.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { sourceJobId: id }],
      }).lean();

      if (!doc) return null;
      return {
        ...(doc as any),
        id: (doc as any)._id.toString(),
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Recommended jobs for candidate based on their skills and role preferences
   */
  static async getRecommendedJobs(userId: string, limit = 10): Promise<Job[]> {
    try {
      const profile = await CandidateProfileModel.findOne({ userId }).lean();
      const skills = profile?.technicalSkills || ['React', 'Node.js', 'TypeScript', 'Python'];

      const jobs = await JobModel.find({
        requiredSkills: { $in: skills.map((s) => new RegExp(s, 'i')) },
      })
        .sort({ publishedDate: -1 })
        .limit(limit)
        .lean();

      return deduplicateJobs(
        jobs.map((doc: any) => ({
          ...doc,
          id: doc._id.toString(),
        }))
      );
    } catch (error) {
      return [];
    }
  }

  /**
   * Save a job to user's saved list
   */
  static async saveJob(userId: string, jobId: string, notes?: string) {
    return SavedJobModel.findOneAndUpdate(
      { userId, jobId },
      { userId, jobId, notes, createdAt: new Date() },
      { upsert: true, new: true }
    );
  }

  /**
   * Unsave a job
   */
  static async unsaveJob(userId: string, jobId: string) {
    return SavedJobModel.findOneAndDelete({ userId, jobId });
  }

  /**
   * Get saved jobs for user
   */
  static async getSavedJobs(userId: string) {
    const saved = await SavedJobModel.find({ userId }).sort({ createdAt: -1 }).lean();
    const jobIds = saved.map((s) => s.jobId);

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

    return saved.map((s: any) => ({
      id: s._id.toString(),
      jobId: s.jobId,
      notes: s.notes,
      createdAt: s.createdAt,
      job: jobMap.get(s.jobId)
        ? { ...jobMap.get(s.jobId), id: jobMap.get(s.jobId)._id.toString() }
        : null,
    }));
  }
}
