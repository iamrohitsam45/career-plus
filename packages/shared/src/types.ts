import {
  UserRole,
  ApplicationStatus,
  WorkMode,
  JobType,
  ExperienceLevel,
  SubscriptionPlan,
} from './constants';

export type {
  UserRole,
  ApplicationStatus,
  WorkMode,
  JobType,
  ExperienceLevel,
  SubscriptionPlan,
};

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: UserRole;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  headline: string;
  experienceYears: number;
  currentTitle?: string;
  technicalSkills: string[];
  preferredRoles: string[];
  preferredLocations: string[];
  currentSalary?: number;
  expectedSalary?: number;
  salaryCurrency: string;
  noticePeriodDays: number;
  workModes: WorkMode[];
  careerGoals?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string;
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  companyName: string;
  companyId?: string;
  designation: string;
  verified: boolean;
  workEmail: string;
  phone?: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  company: string;
  avatarUrl?: string;
  bio: string;
  skills: string[];
  yearsExperience: number;
  sessionPriceInr: number;
  rating: number;
  reviewsCount: number;
  servicesOffered: ('resume_review' | 'mock_interview' | 'career_guidance' | 'system_design')[];
}

export interface Job {
  id: string;
  source: 'direct' | 'jsearch' | 'adzuna' | 'remotive' | 'greenhouse' | 'lever';
  sourceJobId: string;
  title: string;
  company: string;
  companyLogo?: string;
  companySlug?: string;
  description: string;
  location: string;
  country: string;
  city?: string;
  workMode: WorkMode;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string; // e.g., 'INR', 'USD'
  salaryInterval: 'yearly' | 'monthly' | 'hourly';
  requiredExperienceYearsMin?: number;
  requiredExperienceYearsMax?: number;
  requiredSkills: string[];
  jobType: JobType;
  publishedDate: string; // ISO 8601 string
  lastVerifiedDate: string;
  applicationUrl: string;
  isNative: boolean; // if true, can apply directly on CareerPulse
  isFeatured?: boolean;
  recruiterId?: string;
  sourceAttribution: string;
  expiryDate?: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  job?: Job;
  createdAt: string;
  notes?: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  job?: Job;
  status: ApplicationStatus;
  resumeId?: string;
  resumeVersion?: string;
  appliedDate: string;
  updatedAt: string;
  notes?: string;
  interviewDate?: string;
  followUpReminderDate?: string;
  coverLetter?: string;
  statusHistory: {
    status: ApplicationStatus;
    changedAt: string;
    note?: string;
  }[];
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  industry: string;
  headquarters: string;
  size: string;
  overview: string;
  rating: number;
  reviewCount: number;
  workLifeRating: number;
  cultureRating: number;
  compensationRating: number;
  careerGrowthRating: number;
  benefits: string[];
  isVerified: boolean;
  followerCount: number;
}

export interface CompanyReview {
  id: string;
  companyId: string;
  companySlug: string;
  userId?: string;
  isAnonymous: boolean;
  jobTitle: string;
  employmentStatus: 'current' | 'former';
  yearsAtCompany: number;
  overallRating: number;
  workLifeRating: number;
  cultureRating: number;
  compensationRating: number;
  careerGrowthRating: number;
  reviewTitle: string;
  pros: string;
  cons: string;
  adviceToManagement?: string;
  recommendToFriend: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface SalarySubmission {
  id: string;
  jobTitle: string;
  company: string;
  companySlug?: string;
  location: string;
  yearsOfExperience: number;
  baseSalary: number; // in INR LPA or absolute
  bonusSalary?: number;
  currency: string;
  isVerifiedEmployer: boolean;
  sourceType: 'employer_posted' | 'self_reported' | 'modeled_estimate';
  sampleSize?: number;
  createdAt: string;
}

export interface InterviewExperience {
  id: string;
  companySlug: string;
  jobTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  experienceRating: 'positive' | 'neutral' | 'negative';
  rounds: number;
  questions: string[];
  processSummary: string;
  outcome: 'offer' | 'rejected' | 'pending';
  createdAt: string;
}

export interface ResumeWorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  highlights: string[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  grade?: string;
}

export interface ResumeProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    linkedin?: string;
    github?: string;
    website?: string;
    summary: string;
  };
  experience: ResumeWorkExperience[];
  education: ResumeEducation[];
  skills: string[];
  projects: ResumeProject[];
  certifications: string[];
  awards: string[];
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: 'modern' | 'minimalist' | 'executive' | 'tech';
  data: ResumeData;
  atsScoreEstimate: number;
  atsFeedback: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface MentorBooking {
  id: string;
  mentorId: string;
  mentorName: string;
  candidateId: string;
  candidateName: string;
  serviceType: 'resume_review' | 'mock_interview' | 'career_guidance' | 'system_design';
  bookingDate: string; // ISO
  slotTime: string; // e.g. "14:00 - 15:00"
  status: 'confirmed' | 'completed' | 'cancelled';
  meetingUrl: string;
  notes?: string;
  priceInr: number;
  paymentStatus: 'paid' | 'pending';
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'past_due' | 'expired';
  razorpaySubscriptionId?: string;
  razorpayPaymentId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amountInr: number;
}

export interface AIJobMatchResult {
  jobId: string;
  jobTitle: string;
  company: string;
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  experienceMatch: boolean;
  suggestedImprovements: string[];
  recommendedKeywords: string[];
  skillImprovementRoadmap: string[];
  summaryExplanation: string;
}
