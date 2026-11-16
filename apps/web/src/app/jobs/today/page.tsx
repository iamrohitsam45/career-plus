'use client';

import * as React from 'react';
import Link from 'next/link';
import { Flame, Clock, MapPin, Bookmark, BookmarkCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Job, formatSalary } from '@careerpulse/shared';
import { toast } from 'sonner';

export default function TodaysJobsPage() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getTodaysJobs();
        if (res.success) {
          setJobs(res.jobs);
          setTotal(res.total);
        }
      } catch (err: any) {
        console.warn('Today jobs error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const todayDateFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-indigo-500/10 border border-orange-500/20 mb-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold mb-3 shadow-sm">
                <Flame className="w-3.5 h-3.5" /> TODAY'S LIVE FEED
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
                Jobs Published on {todayDateFormatted}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                Strictly jobs published today in local Indian Standard Time (IST). Never confused with ingestion time.
              </p>
            </div>

            <div className="text-right">
              <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">
                {total}
              </div>
              <div className="text-xs text-slate-500 font-medium">Verified New Positions</div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse p-6 h-36 border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              No new jobs published in this specific hour yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Check back shortly as feeds update throughout the morning, or explore all active roles.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4 rounded-xl">
              <Link href="/jobs">Browse All Active Jobs</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="glow-card border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={job.companyLogo || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=96&h=96&fit=crop'}
                    alt={job.company}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-heading font-semibold text-base sm:text-lg text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <Badge variant="today" className="text-[10px]">
                        PUBLISHED TODAY
                      </Badge>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {job.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{job.workMode}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.requiredSkills.slice(0, 5).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
                  <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                    {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryInterval)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Source: {job.sourceAttribution}
                  </div>
                  <div className="mt-3 flex sm:justify-end gap-2">
                    <Button asChild size="sm" variant="gradient" className="rounded-xl">
                      <Link href={`/jobs/${job.id}`}>Apply Now</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
