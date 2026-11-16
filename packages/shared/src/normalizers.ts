import { Job, WorkMode, JobType } from './types';

/**
 * Format salary in Indian style (LPA) or international currency
 */
export function formatSalary(
  min?: number,
  max?: number,
  currency: string = 'INR',
  interval: string = 'yearly'
): string {
  if (!min && !max) return 'Competitive / Undisclosed';

  const formatNumber = (num: number) => {
    if (currency === 'INR') {
      if (num >= 100000) {
        return `₹${(num / 100000).toFixed(1)} LPA`;
      }
      return `₹${(num / 1000).toFixed(0)}k`;
    }
    if (num >= 1000) {
      return `${currency === 'USD' ? '$' : currency + ' '}${(num / 1000).toFixed(0)}k`;
    }
    return `${currency} ${num}`;
  };

  if (min && max) {
    if (currency === 'INR' && min >= 100000 && max >= 100000) {
      return `₹${(min / 100000).toFixed(1)} - ₹${(max / 100000).toFixed(1)} LPA`;
    }
    return `${formatNumber(min)} - ${formatNumber(max)}${interval === 'monthly' ? '/mo' : ''}`;
  }

  if (min) return `From ${formatNumber(min)}`;
  if (max) return `Up to ${formatNumber(max)}`;
  return 'Competitive';
}

/**
 * Deduplicate jobs by composite key: canonical normalized title + company + location
 */
export function deduplicateJobs(jobs: Job[]): Job[] {
  const seen = new Set<string>();
  const result: Job[] = [];

  for (const job of jobs) {
    const key = `${job.title.toLowerCase().trim()}_${job.company.toLowerCase().trim()}_${job.location.toLowerCase().trim()}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(job);
    }
  }

  return result;
}

/**
 * Normalize Remotive API job item
 */
export function normalizeRemotiveJob(raw: any): Job {
  const isBengaluru =
    raw.candidate_required_location?.toLowerCase().includes('india') ||
    raw.candidate_required_location?.toLowerCase().includes('bengaluru') ||
    raw.candidate_required_location?.toLowerCase().includes('worldwide');

  return {
    id: `remotive_${raw.id}`,
    source: 'remotive',
    sourceJobId: String(raw.id),
    title: raw.title || 'Untitled Role',
    company: raw.company_name || 'Tech Company',
    companyLogo: raw.company_logo || undefined,
    companySlug: (raw.company_name || 'company').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: raw.description || '',
    location: raw.candidate_required_location || 'Remote',
    country: raw.candidate_required_location || 'Global',
    city: isBengaluru ? 'Bengaluru' : undefined,
    workMode: 'remote',
    salaryMin: raw.salary ? extractMinSalary(raw.salary) : undefined,
    salaryMax: raw.salary ? extractMaxSalary(raw.salary) : undefined,
    salaryCurrency: raw.salary?.includes('₹') ? 'INR' : 'USD',
    salaryInterval: 'yearly',
    requiredSkills: raw.tags || ['Remote', 'Software'],
    jobType: mapJobType(raw.job_type),
    publishedDate: raw.publication_date || new Date().toISOString(),
    lastVerifiedDate: new Date().toISOString(),
    applicationUrl: raw.url || '#',
    isNative: false,
    sourceAttribution: 'Remotive Public Feeds',
  };
}

/**
 * Normalize JSearch RapidAPI job item
 */
export function normalizeJSearchJob(raw: any): Job {
  const loc = `${raw.job_city || ''}, ${raw.job_state || ''}, ${raw.job_country || ''}`
    .replace(/^, |, $/g, '')
    .trim();

  return {
    id: `jsearch_${raw.job_id}`,
    source: 'jsearch',
    sourceJobId: raw.job_id,
    title: raw.job_title || 'Untitled Role',
    company: raw.employer_name || 'Organization',
    companyLogo: raw.employer_logo || undefined,
    companySlug: (raw.employer_name || 'company').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: raw.job_description || '',
    location: loc || (raw.job_is_remote ? 'Remote' : 'India'),
    country: raw.job_country || 'India',
    city: raw.job_city || undefined,
    workMode: raw.job_is_remote ? 'remote' : 'hybrid',
    salaryMin: raw.job_min_salary || undefined,
    salaryMax: raw.job_max_salary || undefined,
    salaryCurrency: raw.job_salary_currency || 'INR',
    salaryInterval: raw.job_salary_period?.toLowerCase() === 'month' ? 'monthly' : 'yearly',
    requiredSkills: raw.job_required_skills || ['Engineering'],
    jobType: raw.job_employment_type?.toLowerCase().includes('part') ? 'part-time' : 'full-time',
    publishedDate: raw.job_posted_at_datetime_utc || new Date().toISOString(),
    lastVerifiedDate: new Date().toISOString(),
    applicationUrl: raw.job_apply_link || '#',
    isNative: false,
    sourceAttribution: 'JSearch API',
  };
}

function extractMinSalary(str: string): number | undefined {
  const match = str.match(/(\d+[\d,]*)/);
  if (match) {
    const val = parseInt(match[1].replace(/,/g, ''), 10);
    return isNaN(val) ? undefined : val;
  }
  return undefined;
}

function extractMaxSalary(str: string): number | undefined {
  const matches = str.match(/(\d+[\d,]*)/g);
  if (matches && matches.length > 1) {
    const val = parseInt(matches[1].replace(/,/g, ''), 10);
    return isNaN(val) ? undefined : val;
  }
  return extractMinSalary(str);
}

function mapJobType(val?: string): JobType {
  if (!val) return 'full-time';
  const lower = val.toLowerCase();
  if (lower.includes('part')) return 'part-time';
  if (lower.includes('contract')) return 'contract';
  if (lower.includes('intern')) return 'internship';
  if (lower.includes('freelance')) return 'freelance';
  return 'full-time';
}
