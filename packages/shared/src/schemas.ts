import { z } from 'zod';
import {
  USER_ROLES,
  APPLICATION_STATUSES,
  WORK_MODES,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
} from './constants';

export const OnboardingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required (min 2 chars)'),
  headline: z.string().min(3, 'Professional headline is required'),
  experienceYears: z.number().min(0, 'Experience years cannot be negative').max(50),
  currentTitle: z.string().optional(),
  technicalSkills: z.array(z.string()).min(1, 'Please add at least one technical skill'),
  preferredRoles: z.array(z.string()).min(1, 'Please select at least one preferred role'),
  preferredLocations: z.array(z.string()).min(1, 'Please select at least one preferred location'),
  currentSalary: z.number().optional(),
  expectedSalary: z.number().optional(),
  salaryCurrency: z.string().default('INR'),
  noticePeriodDays: z.number().min(0).default(30),
  workModes: z.array(z.enum(WORK_MODES)).min(1, 'Select at least one work mode'),
  careerGoals: z.string().optional(),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  resumeFileName: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;

export const JobQuerySchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  isIndia: z.coerce.boolean().optional(),
  isBengaluru: z.coerce.boolean().optional(),
  workMode: z.enum(WORK_MODES).optional(),
  jobType: z.enum(JOB_TYPES).optional(),
  experienceLevel: z.enum(EXPERIENCE_LEVELS).optional(),
  minSalary: z.coerce.number().optional(),
  maxSalary: z.coerce.number().optional(),
  skills: z.string().optional(), // comma-separated
  company: z.string().optional(),
  sortBy: z.enum(['relevance', 'recent', 'salary']).default('recent'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(15),
});

export type JobQueryInput = z.input<typeof JobQuerySchema>;

export const CreateJobSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  company: z.string().min(2, 'Company name is required'),
  companyLogo: z.string().url().optional().or(z.literal('')),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(2, 'Location is required'),
  country: z.string().default('India'),
  workMode: z.enum(WORK_MODES),
  jobType: z.enum(JOB_TYPES),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().default('INR'),
  salaryInterval: z.enum(['yearly', 'monthly', 'hourly']).default('yearly'),
  requiredExperienceYearsMin: z.number().optional(),
  requiredExperienceYearsMax: z.number().optional(),
  requiredSkills: z.array(z.string()).min(1, 'Add at least one skill'),
  applicationUrl: z.string().url().optional().or(z.literal('')),
  isNative: z.boolean().default(true),
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;

export const CompanyReviewSchema = z.object({
  companySlug: z.string().min(1),
  jobTitle: z.string().min(2, 'Job title is required'),
  employmentStatus: z.enum(['current', 'former']),
  yearsAtCompany: z.number().min(0).max(40),
  overallRating: z.number().min(1).max(5),
  workLifeRating: z.number().min(1).max(5),
  cultureRating: z.number().min(1).max(5),
  compensationRating: z.number().min(1).max(5),
  careerGrowthRating: z.number().min(1).max(5),
  reviewTitle: z.string().min(4, 'Review headline must be at least 4 characters'),
  pros: z.string().min(15, 'Please provide detailed pros (min 15 characters)'),
  cons: z.string().min(15, 'Please provide detailed cons (min 15 characters)'),
  adviceToManagement: z.string().optional(),
  recommendToFriend: z.boolean().default(true),
  isAnonymous: z.boolean().default(true),
});

export type CompanyReviewInput = z.infer<typeof CompanyReviewSchema>;

export const SalarySubmissionSchema = z.object({
  jobTitle: z.string().min(2),
  company: z.string().min(2),
  location: z.string().min(2),
  yearsOfExperience: z.number().min(0).max(40),
  baseSalary: z.number().min(50000, 'Base salary must be realistic'),
  bonusSalary: z.number().optional(),
  currency: z.string().default('INR'),
});

export type SalarySubmissionInput = z.infer<typeof SalarySubmissionSchema>;

export const ResumeDataSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string(),
    location: z.string(),
    title: z.string(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
    summary: z.string(),
  }),
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string(),
      position: z.string(),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().optional(),
      current: z.boolean(),
      highlights: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string(),
      degree: z.string(),
      fieldOfStudy: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      grade: z.string().optional(),
    })
  ),
  skills: z.array(z.string()),
  projects: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      link: z.string().optional(),
    })
  ),
  certifications: z.array(z.string()),
  awards: z.array(z.string()),
});

export const ApplicationUpdateSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
  notes: z.string().optional(),
  interviewDate: z.string().optional(),
  followUpReminderDate: z.string().optional(),
});

export const MentorBookingSchema = z.object({
  mentorId: z.string().min(1),
  serviceType: z.enum(['resume_review', 'mock_interview', 'career_guidance', 'system_design']),
  bookingDate: z.string(),
  slotTime: z.string(),
  notes: z.string().optional(),
});
