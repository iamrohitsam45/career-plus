'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Building2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Job, formatSalary } from '@careerpulse/shared';
import { toast } from 'sonner';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [job, setJob] = React.useState<Job | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isSaved, setIsSaved] = React.useState(false);
  const [similarJobs, setSimilarJobs] = React.useState<Job[]>([]);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getJobById(id);
        if (res.success && res.job) {
          setJob(res.job);

          // Fetch similar jobs by skills
          const sim = await api.getJobs({
            skills: res.job.requiredSkills.slice(0, 2).join(','),
            limit: 4,
          });
          if (sim.success) {
            setSimilarJobs(sim.jobs.filter((j) => j.id !== res.job.id));
          }
        }
      } catch (err: any) {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSaveToggle = async () => {
    if (!job) return;
    try {
      if (isSaved) {
        await api.unsaveJob(job.id);
        setIsSaved(false);
        toast.info('Job removed from saved list');
      } else {
        await api.saveJob(job.id);
        setIsSaved(true);
        toast.success('Job saved to your tracker');
      }
    } catch (err: any) {
      toast.error('Sign in to save jobs');
    }
  };

  const handleApply = async () => {
    if (!job) return;
    try {
      // Record in application tracker
      await api.trackApplication(job.id, 'applied').catch(() => {});
      toast.success('Application logged in your Kanban Tracker!');
      if (job.applicationUrl && job.applicationUrl !== '#') {
        window.open(job.applicationUrl, '_blank');
      }
    } catch (err: any) {
      toast.error('Error initiating application');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4" />
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-60 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Job Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested listing may have expired or was removed.</p>
        <Button asChild variant="outline" className="mt-4 rounded-xl">
          <Link href="/jobs">Return to Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Body */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              {/* Top Meta */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={job.companyLogo || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=96&h=96&fit=crop'}
                    alt={job.company}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                  />
                  <div>
                    <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
                      {job.title}
                    </h1>
                    <div className="mt-1 flex items-center gap-2 flex-wrap text-sm">
                      <Link
                        href={`/companies/${job.companySlug || 'company'}`}
                        className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {job.company}
                      </Link>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveToggle}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Key Highlights Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                <div>
                  <div className="text-slate-400">Compensation</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryInterval)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Work Mode</div>
                  <div className="font-bold text-slate-900 dark:text-white capitalize mt-0.5">
                    {job.workMode}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Job Type</div>
                  <div className="font-bold text-slate-900 dark:text-white capitalize mt-0.5">
                    {job.jobType}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Experience</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {job.requiredExperienceYearsMin ? `${job.requiredExperienceYearsMin}+ years` : 'Flexible'}
                  </div>
                </div>
              </div>

              {/* Skills Chips */}
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Required Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Full Description */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
                <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white mb-3">
                  Job Description & Scope
                </h3>
                <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              {/* Verification & Source */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" /> Authenticated Job Posting
                </span>
                <span>Source: {job.sourceAttribution}</span>
              </div>
            </Card>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply Card */}
            <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Ready to Apply?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apply directly or use the AI Apply studio to generate a customized cover letter and tailored bullet points.
              </p>

              <Button onClick={handleApply} variant="gradient" className="w-full rounded-xl gap-2 font-semibold">
                <span>Direct Apply</span>
                <ExternalLink className="w-4 h-4" />
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl gap-2 font-medium text-xs text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
              >
                <Link href={`/ai/apply?jobId=${job.id}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Assisted Application Studio
                </Link>
              </Button>
            </Card>

            {/* AI Match Radar Shortcut */}
            <Card className="p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/80 dark:border-indigo-800/80 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>AI Resume Match Check</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                How well does your resume match this role?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Run our instant ATS matcher to discover missing skills and keyword gaps for this specific position.
              </p>
              <Button asChild size="sm" variant="gradient" className="w-full rounded-xl">
                <Link href={`/ai/job-match?jobId=${job.id}`}>Calculate Match Score</Link>
              </Button>
            </Card>

            {/* Similar Jobs Sidebar */}
            {similarJobs.length > 0 && (
              <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-slate-400">
                  Similar Opportunities
                </h4>
                <div className="space-y-3">
                  {similarJobs.map((sim) => (
                    <Link
                      key={sim.id}
                      href={`/jobs/${sim.id}`}
                      className="block p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <div className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                        {sim.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {sim.company} • {sim.location}
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
