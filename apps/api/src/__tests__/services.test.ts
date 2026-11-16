import { describe, it, expect } from 'vitest';
import {
  formatSalary,
  deduplicateJobs,
  normalizeRemotiveJob,
  normalizeJSearchJob,
} from '@careerpulse/shared';
import { AIService } from '../services/aiService';

describe('Job Normalization & Deduplication Unit Tests', () => {
  it('correctly formats INR salaries in Lakhs Per Annum (LPA)', () => {
    expect(formatSalary(1800000, 2800000, 'INR')).toBe('₹18.0 - ₹28.0 LPA');
    expect(formatSalary(4500000, undefined, 'INR')).toBe('From ₹45.0 LPA');
    expect(formatSalary(undefined, 7500000, 'INR')).toBe('Up to ₹75.0 LPA');
  });

  it('correctly formats USD and international salaries', () => {
    expect(formatSalary(90000, 140000, 'USD')).toBe('$90k - $140k');
  });

  it('deduplicates identical jobs by canonical composite key', () => {
    const rawJobs: any[] = [
      { id: '1', title: 'Senior Engineer', company: 'Razorpay', location: 'Bengaluru' },
      { id: '2', title: 'Senior Engineer ', company: 'Razorpay', location: 'Bengaluru' },
      { id: '3', title: 'Staff Engineer', company: 'Razorpay', location: 'Bengaluru' },
    ];
    const deduplicated = deduplicateJobs(rawJobs);
    expect(deduplicated.length).toBe(2);
    expect(deduplicated[0].id).toBe('1');
    expect(deduplicated[1].id).toBe('3');
  });

  it('normalizes Remotive API payloads into unified Job model', () => {
    const remotiveItem = {
      id: 991,
      title: 'Full Stack Developer',
      company_name: 'Stripe',
      candidate_required_location: 'India / Remote',
      salary: '$100k - $130k',
      job_type: 'full_time',
      publication_date: '2026-11-16T08:00:00Z',
      url: 'https://stripe.com/jobs/991',
    };
    const normalized = normalizeRemotiveJob(remotiveItem);
    expect(normalized.id).toBe('remotive_991');
    expect(normalized.source).toBe('remotive');
    expect(normalized.company).toBe('Stripe');
    expect(normalized.salaryMin).toBe(100);
    expect(normalized.workMode).toBe('remote');
  });
});

describe('AI Career Engine Heuristic Tests', () => {
  it('optimizes resume bullet points using the Google Laszlo Bock XYZ formula', async () => {
    const inputBullet = 'responsible for database queries and frontend features';
    const result = await AIService.optimizeBulletPoint(inputBullet, 'Senior Full Stack Engineer');

    expect(result).toBeDefined();
    expect(result.improved).toContain('database queries');
    expect(result.explanation).toContain('action verbs');
    expect(result.powerVerbsUsed.length).toBeGreaterThan(0);
  });

  it('calculates deterministic ATS job match score and detects missing skills', async () => {
    const resumeData: any = {
      personalInfo: { fullName: 'Candidate', title: 'Full Stack Engineer' },
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js'],
      experience: [{ highlights: ['Built features'] }],
    };

    const job: any = {
      id: 'job_test',
      title: 'Full Stack Engineer',
      company: 'Razorpay',
      requiredSkills: ['React', 'TypeScript', 'Docker', 'Kubernetes'],
      requiredExperienceYearsMin: 3,
      description: 'Senior Full Stack Engineer role.',
    };

    const match = await AIService.matchJobWithResume(resumeData, job);
    expect(match.matchPercentage).toBeGreaterThanOrEqual(40);
    expect(match.matchPercentage).toBeLessThanOrEqual(100);
    expect(match.matchingSkills).toContain('react');
    expect(match.matchingSkills).toContain('typescript');
    expect(match.missingSkills).toContain('docker');
    expect(match.missingSkills).toContain('kubernetes');
    expect(match.skillImprovementRoadmap.length).toBeGreaterThan(0);
  });
});
