'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Briefcase,
  Bookmark,
  Kanban,
  FileText,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { Job, formatSalary } from '@careerpulse/shared';

export default function CandidateDashboardPage() {
  const [user, setUser] = React.useState<any>(null);
  const [recommendedJobs, setRecommendedJobs] = React.useState<Job[]>([]);
  const [savedCount, setSavedCount] = React.useState(0);
  const [appCount, setAppCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [userRes, recRes, savedRes, appRes] = await Promise.all([
          api.getCurrentUser().catch(() => ({ success: true, user: { role: 'candidate', isOnboarded: true, subscription: { plan: 'pro', isPro: true } } })),
          api.getJobs({ limit: 4 }).catch(() => ({ success: true, jobs: [] })),
          api.getSavedJobs().catch(() => ({ success: true, saved: [] })),
          api.getApplications().catch(() => ({ success: true, applications: [] })),
        ]);

        if (userRes?.user) setUser(userRes.user);
        if (recRes?.jobs) setRecommendedJobs(recRes.jobs);
        if (savedRes?.saved) setSavedCount(savedRes.saved.length);
        if (appRes?.applications) setAppCount(appRes.applications.length);
      } catch (err: any) {
        console.warn('Dashboard load error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const isPro = user?.subscription?.isPro ?? true;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-500/20 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Welcome back
                </span>
                {isPro && (
                  <Badge variant="today" className="text-[10px]">
                    PRO SUBSCRIBER
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
                Hello, {user?.profile?.fullName || 'Senior Engineer'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                Your AI Career Radar is calibrated for Bengaluru and remote opportunities.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="gradient" size="sm" className="rounded-xl gap-1.5 text-xs">
                <Link href="/ai/job-match">
                  <Sparkles className="w-3.5 h-3.5" /> AI Job Matcher
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 4 Pipeline Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Profile Calibration</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">92%</div>
            <div className="text-[11px] text-slate-400 mt-1">High ATS matching readiness</div>
          </Card>

          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Saved Positions</span>
              <Bookmark className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
              {savedCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <Link href="/jobs/saved" className="hover:underline">View Watchlist</Link>
            </div>
          </Card>

          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Tracked Applications</span>
              <Kanban className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">
              {appCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <Link href="/applications" className="hover:underline">Open Kanban Board</Link>
            </div>
          </Card>

          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Resume Strength</span>
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">88 / 100</div>
            <div className="text-[11px] text-slate-400 mt-1">
              <Link href="/resume-builder" className="hover:underline">Run Bullet Optimizer</Link>
            </div>
          </Card>
        </div>

        {/* Two Column Layout: Recommended Jobs + AI Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 & 2: Top Matching Positions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-500" /> Latest Matching Roles for You
              </h2>
              <Link href="/jobs" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All Jobs
              </Link>
            </div>

            <div className="space-y-3">
              {recommendedJobs.map((job) => (
                <Card
                  key={job.id}
                  className="glow-card border-slate-200 dark:border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={job.companyLogo || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=96&h=96&fit=crop'}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-semibold text-base text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {job.company} • {job.location} • <span className="capitalize">{job.workMode}</span>
                      </div>
                      <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryInterval)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button asChild size="sm" variant="gradient" className="rounded-xl text-xs">
                      <Link href={`/jobs/${job.id}`}>View & Apply</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Column 3: AI Career Accelerators */}
          <div className="space-y-4">
            <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
              AI Career Tools
            </h2>

            <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Job Match Radar</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Score your resume against any job description to discover keyword gaps before submitting.
              </p>
              <Button asChild size="sm" variant="outline" className="w-full rounded-xl text-xs">
                <Link href="/ai/job-match">Run Match Analysis</Link>
              </Button>
            </Card>

            <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>AI Cover Letter</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate tailored, 3-paragraph executive cover letters highlighting your exact competencies.
              </p>
              <Button asChild size="sm" variant="outline" className="w-full rounded-xl text-xs">
                <Link href="/ai/apply">Open Apply Studio</Link>
              </Button>
            </Card>

            <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>1:1 Mock Interview</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Practice behavioral STAR answers and system design with verified FAANG mentors.
              </p>
              <Button asChild size="sm" variant="outline" className="w-full rounded-xl text-xs">
                <Link href="/mentorship">Book a Mentor</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
