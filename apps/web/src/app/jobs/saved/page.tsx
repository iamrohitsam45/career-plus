'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bookmark, Trash2, ArrowRight, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatSalary } from '@careerpulse/shared';
import { toast } from 'sonner';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await api.getSavedJobs();
      if (res.success) {
        setSavedJobs(res.saved || []);
      }
    } catch (err: any) {
      console.warn('Saved jobs warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (jobId: string) => {
    try {
      await api.unsaveJob(jobId);
      setSavedJobs(savedJobs.filter((s) => s.jobId !== jobId));
      toast.info('Removed from saved list');
    } catch (err: any) {
      toast.error('Failed to remove saved job');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-indigo-500" /> Saved Opportunities
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Keep track of roles you want to evaluate and apply to later.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href="/jobs">Browse More Jobs</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse p-6 h-28 border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
            <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              No saved jobs yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Click the bookmark icon on any job card to save it to your personal watchlist.
            </p>
            <Button asChild variant="gradient" size="sm" className="mt-4 rounded-xl">
              <Link href="/jobs">Discover Jobs</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((item) => {
              const job = item.job;
              if (!job) return null;
              return (
                <Card
                  key={item.id}
                  className="glow-card border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between gap-4"
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
                        className="font-heading font-semibold text-base text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
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
                    <Button asChild size="sm" variant="gradient" className="rounded-xl">
                      <Link href={`/jobs/${job.id}`}>View & Apply</Link>
                    </Button>
                    <button
                      onClick={() => handleRemove(item.jobId)}
                      className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
