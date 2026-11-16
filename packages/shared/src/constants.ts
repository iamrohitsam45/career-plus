export const USER_ROLES = ['candidate', 'recruiter', 'mentor', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const APPLICATION_STATUSES = [
  'saved',
  'preparing',
  'applied',
  'assessment',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const WORK_MODES = ['remote', 'hybrid', 'on-site'] as const;
export type WorkMode = (typeof WORK_MODES)[number];

export const JOB_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'internship',
  'freelance',
] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const EXPERIENCE_LEVELS = [
  'entry',
  'mid',
  'senior',
  'lead',
  'executive',
] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const SUBSCRIPTION_PLANS = ['free', 'pro'] as const;
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export const TECH_HUBS_INDIA = [
  'Bengaluru, Karnataka',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Delhi NCR, Gurgaon & Noida',
  'Mumbai, Maharashtra',
  'Chennai, Tamil Nadu',
] as const;

export const BENGALURU_AREAS = [
  'Whitefield',
  'Electronic City',
  'Outer Ring Road (ORR) / Bellandur',
  'Indiranagar',
  'Koramangala',
  'HSR Layout',
  'Manyata Tech Park',
  'Marathahalli',
] as const;

export const POPULAR_ROLES = [
  'Full Stack Engineer',
  'Frontend Developer',
  'Backend Engineer',
  'AI / Machine Learning Engineer',
  'DevOps & Cloud Architect',
  'Product Manager',
  'Data Scientist',
  'UI/UX Designer',
  'Mobile App Developer',
  'Engineering Manager',
] as const;

export const TOP_SKILLS = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'MongoDB',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'GraphQL',
  'Tailwind CSS',
  'FastAPI',
  'PyTorch',
  'LangChain',
] as const;
