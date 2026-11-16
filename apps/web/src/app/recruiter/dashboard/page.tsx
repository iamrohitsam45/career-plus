'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Building2,
  PlusCircle,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { formatSalary } from '@careerpulse/shared';
import { toast } from 'sonner';

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [applicants, setApplicants] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchRecruiterData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appRes] = await Promise.all([
        api.getRecruiterJobs().catch(() => ({ success: true, jobs: [] })),
        api.getRecruiterApplicants().catch(() => ({ success: true, applicants: [] })),
      ]);

      if (jobsRes.success) setJobs(jobsRes.jobs || []);
      if (appRes.success) setApplicants(appRes.applicants || []);
    } catch (err: any) {
      console.warn('Recruiter dashboard error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRecruiterData();
  }, []);

  const handleStatusUpdate = async (appId: string, status: string) => {
    try {
      await api.updateApplicantStatus(appId, status);
      setApplicants(
        applicants.map((a) => (a.id === appId ? { ...a, status } : a))
      );
      toast.success(`Candidate status moved to ${status.toUpperCase()}`);
    } catch (err: any) {
      toast.error('Failed to update candidate status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" /> RECRUITER TALENT GATEWAY
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Hiring Manager Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Post verified openings, screen candidates, and track interview pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="gradient" size="sm" className="rounded-xl text-xs gap-1.5">
              <Link href="/recruiter/jobs/new">
                <PlusCircle className="w-3.5 h-3.5" /> Post a New Tech Job
              </Link>
            </Button>
          </div>
        </div>

        {/* Recruiter Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5">
            <div className="text-xs text-slate-500 font-medium">Active Postings</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{jobs.length}</div>
          </Card>
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5">
            <div className="text-xs text-slate-500 font-medium">Total Applicants</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{applicants.length}</div>
          </Card>
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5">
            <div className="text-xs text-slate-500 font-medium">In Interview</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
              {applicants.filter((a) => a.status === 'interview').length}
            </div>
          </Card>
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5">
            <div className="text-xs text-slate-500 font-medium">Offers Extended</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {applicants.filter((a) => a.status === 'offer').length}
            </div>
          </Card>
        </div>

        {/* Candidates Screening Table */}
        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h2 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" /> Candidate Applicant Pool ({applicants.length})
          </h2>

          {applicants.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No applicants received yet for your active postings.
            </div>
          ) : (
            <div className="space-y-3">
              {applicants.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {app.candidate?.fullName || 'Candidate'}
                      </span>
                      <Badge variant="default" className="text-[10px] uppercase">
                        {app.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                      Applied for: {app.jobTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {app.candidate?.headline} • {app.candidate?.experienceYears || 3} yrs exp
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                      className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                    >
                      <option value="applied">Applied</option>
                      <option value="assessment">Assessment</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    {app.candidate?.resumeUrl && (
                      <Button asChild size="sm" variant="outline" className="rounded-lg h-8 text-xs gap-1">
                        <a href={app.candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="w-3.5 h-3.5" /> Resume
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
