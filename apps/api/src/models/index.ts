import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  UserRole,
  ApplicationStatus,
  WorkMode,
  JobType,
  SubscriptionPlan,
  USER_ROLES,
  APPLICATION_STATUSES,
  WORK_MODES,
  JOB_TYPES,
  SUBSCRIPTION_PLANS,
} from '@careerpulse/shared';

// ==========================================
// 1. User Schema
// ==========================================
export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: UserRole;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    imageUrl: { type: String },
    role: { type: String, enum: USER_ROLES, default: 'candidate', index: true },
    isOnboarded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// ==========================================
// 2. CandidateProfile Schema
// ==========================================
export interface ICandidateProfile extends Document {
  userId: string; // Clerk ID or Mongo User ID
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
  createdAt: Date;
  updatedAt: Date;
}

const CandidateProfileSchema = new Schema<ICandidateProfile>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    headline: { type: String, required: true, trim: true },
    experienceYears: { type: Number, default: 0, min: 0 },
    currentTitle: { type: String, trim: true },
    technicalSkills: [{ type: String, trim: true, index: true }],
    preferredRoles: [{ type: String, trim: true, index: true }],
    preferredLocations: [{ type: String, trim: true, index: true }],
    currentSalary: { type: Number },
    expectedSalary: { type: Number },
    salaryCurrency: { type: String, default: 'INR' },
    noticePeriodDays: { type: Number, default: 30 },
    workModes: [{ type: String, enum: WORK_MODES }],
    careerGoals: { type: String },
    resumeUrl: { type: String },
    resumeFileName: { type: String },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    portfolioUrl: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

CandidateProfileSchema.index({ technicalSkills: 1, preferredLocations: 1 });

export const CandidateProfileModel: Model<ICandidateProfile> =
  mongoose.models.CandidateProfile ||
  mongoose.model<ICandidateProfile>('CandidateProfile', CandidateProfileSchema);

// ==========================================
// 3. RecruiterProfile Schema
// ==========================================
export interface IRecruiterProfile extends Document {
  userId: string;
  companyName: string;
  companyId?: string;
  designation: string;
  verified: boolean;
  workEmail: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterProfileSchema = new Schema<IRecruiterProfile>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    companyName: { type: String, required: true, trim: true },
    companyId: { type: String, index: true },
    designation: { type: String, required: true },
    verified: { type: Boolean, default: false },
    workEmail: { type: String, required: true, trim: true },
    phone: { type: String },
  },
  { timestamps: true }
);

export const RecruiterProfileModel: Model<IRecruiterProfile> =
  mongoose.models.RecruiterProfile ||
  mongoose.model<IRecruiterProfile>('RecruiterProfile', RecruiterProfileSchema);

// ==========================================
// 4. MentorProfile Schema
// ==========================================
export interface IMentorProfile extends Document {
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
  servicesOffered: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MentorProfileSchema = new Schema<IMentorProfile>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    avatarUrl: { type: String },
    bio: { type: String, required: true },
    skills: [{ type: String, index: true }],
    yearsExperience: { type: Number, default: 5 },
    sessionPriceInr: { type: Number, default: 999 },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    servicesOffered: [{ type: String }],
  },
  { timestamps: true }
);

export const MentorProfileModel: Model<IMentorProfile> =
  mongoose.models.MentorProfile ||
  mongoose.model<IMentorProfile>('MentorProfile', MentorProfileSchema);

// ==========================================
// 5. Company Schema
// ==========================================
export interface ICompany extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    logo: { type: String },
    website: { type: String },
    industry: { type: String, required: true, index: true },
    headquarters: { type: String, required: true },
    size: { type: String, default: '500-1000' },
    overview: { type: String, required: true },
    rating: { type: Number, default: 4.0 },
    reviewCount: { type: Number, default: 0 },
    workLifeRating: { type: Number, default: 4.0 },
    cultureRating: { type: Number, default: 4.0 },
    compensationRating: { type: Number, default: 4.0 },
    careerGrowthRating: { type: Number, default: 4.0 },
    benefits: [{ type: String }],
    isVerified: { type: Boolean, default: true },
    followerCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CompanyModel: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

// ==========================================
// 6. CompanyReview Schema
// ==========================================
export interface ICompanyReview extends Document {
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
  createdAt: Date;
}

const CompanyReviewSchema = new Schema<ICompanyReview>(
  {
    companyId: { type: String, required: true, index: true },
    companySlug: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    isAnonymous: { type: Boolean, default: true },
    jobTitle: { type: String, required: true },
    employmentStatus: { type: String, enum: ['current', 'former'], required: true },
    yearsAtCompany: { type: Number, default: 1 },
    overallRating: { type: Number, min: 1, max: 5, required: true },
    workLifeRating: { type: Number, min: 1, max: 5, required: true },
    cultureRating: { type: Number, min: 1, max: 5, required: true },
    compensationRating: { type: Number, min: 1, max: 5, required: true },
    careerGrowthRating: { type: Number, min: 1, max: 5, required: true },
    reviewTitle: { type: String, required: true },
    pros: { type: String, required: true },
    cons: { type: String, required: true },
    adviceToManagement: { type: String },
    recommendToFriend: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const CompanyReviewModel: Model<ICompanyReview> =
  mongoose.models.CompanyReview ||
  mongoose.model<ICompanyReview>('CompanyReview', CompanyReviewSchema);

// ==========================================
// 7. SalarySubmission Schema
// ==========================================
export interface ISalarySubmission extends Document {
  jobTitle: string;
  company: string;
  companySlug?: string;
  location: string;
  yearsOfExperience: number;
  baseSalary: number;
  bonusSalary?: number;
  currency: string;
  isVerifiedEmployer: boolean;
  sourceType: 'employer_posted' | 'self_reported' | 'modeled_estimate';
  sampleSize?: number;
  createdAt: Date;
}

const SalarySubmissionSchema = new Schema<ISalarySubmission>(
  {
    jobTitle: { type: String, required: true, index: true },
    company: { type: String, required: true, index: true },
    companySlug: { type: String, index: true },
    location: { type: String, required: true, index: true },
    yearsOfExperience: { type: Number, required: true, index: true },
    baseSalary: { type: Number, required: true },
    bonusSalary: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    isVerifiedEmployer: { type: Boolean, default: false },
    sourceType: {
      type: String,
      enum: ['employer_posted', 'self_reported', 'modeled_estimate'],
      default: 'self_reported',
    },
    sampleSize: { type: Number, default: 1 },
  },
  { timestamps: true }
);

SalarySubmissionSchema.index({ jobTitle: 1, location: 1 });

export const SalarySubmissionModel: Model<ISalarySubmission> =
  mongoose.models.SalarySubmission ||
  mongoose.model<ISalarySubmission>('SalarySubmission', SalarySubmissionSchema);

// ==========================================
// 8. InterviewExperience Schema
// ==========================================
export interface IInterviewExperience extends Document {
  companySlug: string;
  jobTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  experienceRating: 'positive' | 'neutral' | 'negative';
  rounds: number;
  questions: string[];
  processSummary: string;
  outcome: 'offer' | 'rejected' | 'pending';
  createdAt: Date;
}

const InterviewExperienceSchema = new Schema<IInterviewExperience>(
  {
    companySlug: { type: String, required: true, index: true },
    jobTitle: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    experienceRating: { type: String, enum: ['positive', 'neutral', 'negative'], required: true },
    rounds: { type: Number, default: 3 },
    questions: [{ type: String }],
    processSummary: { type: String, required: true },
    outcome: { type: String, enum: ['offer', 'rejected', 'pending'], default: 'pending' },
  },
  { timestamps: true }
);

export const InterviewExperienceModel: Model<IInterviewExperience> =
  mongoose.models.InterviewExperience ||
  mongoose.model<IInterviewExperience>('InterviewExperience', InterviewExperienceSchema);

// ==========================================
// 9. Job Schema
// ==========================================
export interface IJob extends Document {
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
  salaryCurrency: string;
  salaryInterval: 'yearly' | 'monthly' | 'hourly';
  requiredExperienceYearsMin?: number;
  requiredExperienceYearsMax?: number;
  requiredSkills: string[];
  jobType: JobType;
  publishedDate: Date;
  lastVerifiedDate: Date;
  applicationUrl: string;
  isNative: boolean;
  isFeatured: boolean;
  recruiterId?: string;
  sourceAttribution: string;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    source: {
      type: String,
      enum: ['direct', 'jsearch', 'adzuna', 'remotive', 'greenhouse', 'lever'],
      default: 'direct',
      index: true,
    },
    sourceJobId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, index: true },
    company: { type: String, required: true, trim: true, index: true },
    companyLogo: { type: String },
    companySlug: { type: String, index: true },
    description: { type: String, required: true },
    location: { type: String, required: true, index: true },
    country: { type: String, default: 'India', index: true },
    city: { type: String, index: true },
    workMode: { type: String, enum: WORK_MODES, default: 'hybrid', index: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryCurrency: { type: String, default: 'INR' },
    salaryInterval: { type: String, enum: ['yearly', 'monthly', 'hourly'], default: 'yearly' },
    requiredExperienceYearsMin: { type: Number, default: 0 },
    requiredExperienceYearsMax: { type: Number },
    requiredSkills: [{ type: String, index: true }],
    jobType: { type: String, enum: JOB_TYPES, default: 'full-time', index: true },
    publishedDate: { type: Date, default: Date.now, index: true },
    lastVerifiedDate: { type: Date, default: Date.now },
    applicationUrl: { type: String, required: true },
    isNative: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    recruiterId: { type: String, index: true },
    sourceAttribution: { type: String, default: 'CareerPulse Direct' },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

JobSchema.index({ source: 1, sourceJobId: 1 }, { unique: true });
JobSchema.index({ title: 'text', description: 'text', company: 'text' });
JobSchema.index({ publishedDate: -1 });

export const JobModel: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

// ==========================================
// 10. SavedJob Schema
// ==========================================
export interface ISavedJob extends Document {
  userId: string;
  jobId: string;
  notes?: string;
  createdAt: Date;
}

const SavedJobSchema = new Schema<ISavedJob>(
  {
    userId: { type: String, required: true, index: true },
    jobId: { type: String, required: true, index: true },
    notes: { type: String },
  },
  { timestamps: true }
);

SavedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const SavedJobModel: Model<ISavedJob> =
  mongoose.models.SavedJob || mongoose.model<ISavedJob>('SavedJob', SavedJobSchema);

// ==========================================
// 11. JobApplication Schema (Kanban)
// ==========================================
export interface IJobApplication extends Document {
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  resumeId?: string;
  resumeVersion?: string;
  appliedDate: Date;
  notes?: string;
  interviewDate?: Date;
  followUpReminderDate?: Date;
  coverLetter?: string;
  statusHistory: {
    status: ApplicationStatus;
    changedAt: Date;
    note?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    userId: { type: String, required: true, index: true },
    jobId: { type: String, required: true, index: true },
    status: { type: String, enum: APPLICATION_STATUSES, default: 'applied', index: true },
    resumeId: { type: String },
    resumeVersion: { type: String },
    appliedDate: { type: Date, default: Date.now },
    notes: { type: String },
    interviewDate: { type: Date },
    followUpReminderDate: { type: Date },
    coverLetter: { type: String },
    statusHistory: [
      {
        status: { type: String, enum: APPLICATION_STATUSES },
        changedAt: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

JobApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const JobApplicationModel: Model<IJobApplication> =
  mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);

// ==========================================
// 12 & 13. Resume & ResumeVersion Schemas
// ==========================================
export interface IResume extends Document {
  userId: string;
  title: string;
  templateId: 'modern' | 'minimalist' | 'executive' | 'tech';
  data: any;
  atsScoreEstimate: number;
  atsFeedback: string[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, default: 'My Resume' },
    templateId: {
      type: String,
      enum: ['modern', 'minimalist', 'executive', 'tech'],
      default: 'modern',
    },
    data: { type: Schema.Types.Mixed, required: true },
    atsScoreEstimate: { type: Number, default: 85 },
    atsFeedback: [{ type: String }],
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const ResumeModel: Model<IResume> =
  mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);

export interface IResumeVersion extends Document {
  resumeId: string;
  version: number;
  data: any;
  createdAt: Date;
}

const ResumeVersionSchema = new Schema<IResumeVersion>(
  {
    resumeId: { type: String, required: true, index: true },
    version: { type: Number, required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const ResumeVersionModel: Model<IResumeVersion> =
  mongoose.models.ResumeVersion ||
  mongoose.model<IResumeVersion>('ResumeVersion', ResumeVersionSchema);

// ==========================================
// 14. JobAlert Schema
// ==========================================
export interface IJobAlert extends Document {
  userId: string;
  title: string;
  keywords: string[];
  location?: string;
  workMode?: WorkMode;
  frequency: 'daily' | 'weekly';
  isActive: boolean;
  createdAt: Date;
}

const JobAlertSchema = new Schema<IJobAlert>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    keywords: [{ type: String }],
    location: { type: String },
    workMode: { type: String, enum: WORK_MODES },
    frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const JobAlertModel: Model<IJobAlert> =
  mongoose.models.JobAlert || mongoose.model<IJobAlert>('JobAlert', JobAlertSchema);

// ==========================================
// 15. Notification Schema
// ==========================================
export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  type: 'application' | 'mentorship' | 'job_alert' | 'system';
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['application', 'mentorship', 'job_alert', 'system'],
      default: 'system',
    },
  },
  { timestamps: true }
);

export const NotificationModel: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);

// ==========================================
// 16 & 17. Subscription & Payment Schemas
// ==========================================
export interface ISubscription extends Document {
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'past_due' | 'expired';
  razorpaySubscriptionId?: string;
  razorpayPaymentId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  amountInr: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    plan: { type: String, enum: SUBSCRIPTION_PLANS, default: 'free', index: true },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'past_due', 'expired'],
      default: 'active',
    },
    razorpaySubscriptionId: { type: String },
    razorpayPaymentId: { type: String },
    currentPeriodStart: { type: Date, default: Date.now },
    currentPeriodEnd: { type: Date, default: () => new Date(Date.now() + 30 * 86400000) },
    amountInr: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SubscriptionModel: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export interface IPayment extends Document {
  userId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  amount: number;
  currency: string;
  status: 'captured' | 'failed' | 'refunded';
  notes?: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String, required: true, unique: true, index: true },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpaySignature: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['captured', 'failed', 'refunded'], default: 'captured' },
    notes: { type: String },
  },
  { timestamps: true }
);

export const PaymentModel: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

// ==========================================
// 18 & 19. MentorAvailability & MentorBooking
// ==========================================
export interface IMentorAvailability extends Document {
  mentorId: string;
  dayOfWeek: number; // 0-6 (Sun-Sat)
  startTime: string; // "10:00"
  endTime: string; // "18:00"
  isActive: boolean;
}

const MentorAvailabilitySchema = new Schema<IMentorAvailability>(
  {
    mentorId: { type: String, required: true, index: true },
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MentorAvailabilityModel: Model<IMentorAvailability> =
  mongoose.models.MentorAvailability ||
  mongoose.model<IMentorAvailability>('MentorAvailability', MentorAvailabilitySchema);

export interface IMentorBooking extends Document {
  mentorId: string;
  mentorName: string;
  candidateId: string;
  candidateName: string;
  serviceType: string;
  bookingDate: Date;
  slotTime: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  meetingUrl: string;
  notes?: string;
  priceInr: number;
  paymentStatus: 'paid' | 'pending';
  createdAt: Date;
}

const MentorBookingSchema = new Schema<IMentorBooking>(
  {
    mentorId: { type: String, required: true, index: true },
    mentorName: { type: String, required: true },
    candidateId: { type: String, required: true, index: true },
    candidateName: { type: String, required: true },
    serviceType: {
      type: String,
      enum: ['resume_review', 'mock_interview', 'career_guidance', 'system_design'],
      required: true,
    },
    bookingDate: { type: Date, required: true, index: true },
    slotTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
      index: true,
    },
    meetingUrl: { type: String, required: true },
    notes: { type: String },
    priceInr: { type: Number, default: 999 },
    paymentStatus: { type: String, enum: ['paid', 'pending'], default: 'paid' },
  },
  { timestamps: true }
);

MentorBookingSchema.index({ mentorId: 1, bookingDate: 1, slotTime: 1 }, { unique: true });

export const MentorBookingModel: Model<IMentorBooking> =
  mongoose.models.MentorBooking ||
  mongoose.model<IMentorBooking>('MentorBooking', MentorBookingSchema);

// ==========================================
// 20. AIUsage Schema
// ==========================================
export interface IAIUsage extends Document {
  userId: string;
  feature: 'resume_review' | 'job_match' | 'cover_letter' | 'career_chat';
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  date: string; // YYYY-MM-DD
  createdAt: Date;
}

const AIUsageSchema = new Schema<IAIUsage>(
  {
    userId: { type: String, required: true, index: true },
    feature: {
      type: String,
      enum: ['resume_review', 'job_match', 'cover_letter', 'career_chat'],
      required: true,
    },
    promptTokens: { type: Number, default: 0 },
    completionTokens: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
    date: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const AIUsageModel: Model<IAIUsage> =
  mongoose.models.AIUsage || mongoose.model<IAIUsage>('AIUsage', AIUsageSchema);

// ==========================================
// 21. AuditLog Schema
// ==========================================
export interface IAuditLog extends Document {
  userId?: string;
  action: string;
  resource: string;
  details?: any;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: String, index: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export const AuditLogModel: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
