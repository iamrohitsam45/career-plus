'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, ArrowLeft, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { WorkMode, JobType } from '@careerpulse/shared';
import { toast } from 'sonner';

export default function NewJobPostPage() {
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [location, setLocation] = React.useState('Bengaluru, Karnataka');
  const [workMode, setWorkMode] = React.useState<WorkMode>('hybrid');
  const [jobType, setJobType] = React.useState<JobType>('full-time');
  const [salaryMinLpa, setSalaryMinLpa] = React.useState(24);
  const [salaryMaxLpa, setSalaryMaxLpa] = React.useState(38);
  const [skillsStr, setSkillsStr] = React.useState('React, Next.js, TypeScript, Node.js');
  const [description, setDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title,
        company,
        location,
        country: 'India',
        workMode,
        jobType,
        salaryMin: salaryMinLpa * 100000,
        salaryMax: salaryMaxLpa * 100000,
        salaryCurrency: 'INR',
        salaryInterval: 'yearly' as const,
        requiredSkills: skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
        description,
        isNative: true,
        applicationUrl: 'https://careerpulse.ai/apply',
      };

      const res = await api.createJob(payload);
      if (res.success) {
        toast.success('Job listing published successfully!');
        router.push('/recruiter/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error posting job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="default" className="mb-2">Verified Employer</Badge>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Create New Job Listing
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your opening will immediately be distributed across our search indices and Today's feed.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="rounded-xl gap-1 text-xs">
            <Link href="/recruiter/dashboard"><ArrowLeft className="w-4 h-4" /> Back</Link>
          </Button>
        </div>

        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Razorpay, Flipkart"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Location *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, Karnataka"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                >
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                  <option value="on-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as JobType)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                >
                  <option value="full-time">Full-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Min Salary (INR LPA)</label>
                <input
                  type="number"
                  value={salaryMinLpa}
                  onChange={(e) => setSalaryMinLpa(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Max Salary (INR LPA)</label>
                <input
                  type="number"
                  value={salaryMaxLpa}
                  onChange={(e) => setSalaryMaxLpa(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Required Skills (Comma separated) *</label>
              <input
                type="text"
                required
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="e.g. React, Next.js, TypeScript, PostgreSQL"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Job Description * (min 20 characters)</label>
              <textarea
                required
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail role responsibilities, team structure, tech stack, and qualifications..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none leading-relaxed"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading} variant="gradient" className="rounded-xl gap-2 font-semibold">
                {loading ? 'Publishing...' : 'Publish Job Listing'} <CheckCircle2 className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
