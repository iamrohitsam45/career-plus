'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  FileText,
  ExternalLink,
  ShieldCheck,
  Send,
  ArrowRight,
  Kanban,
  Edit,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { Job, Resume } from '@careerpulse/shared';
import { toast } from 'sonner';

function AIApplyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedJobId = searchParams.get('jobId') || '';

  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [resumes, setResumes] = React.useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = React.useState('');

  const [coverLetter, setCoverLetter] = React.useState('');
  const [generatingLetter, setGeneratingLetter] = React.useState(false);
  const [appliedLogged, setAppliedLogged] = React.useState(false);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [jobsRes, resRes] = await Promise.all([
          api.getJobs({ limit: 10 }),
          api.getResumes(),
        ]);

        if (jobsRes.success && jobsRes.jobs.length > 0) {
          setJobs(jobsRes.jobs);
          const found = preselectedJobId
            ? jobsRes.jobs.find((j) => j.id === preselectedJobId)
            : jobsRes.jobs[0];
          setSelectedJob(found || jobsRes.jobs[0]);
        }

        if (resRes.success && resRes.resumes.length > 0) {
          setResumes(resRes.resumes);
          setSelectedResumeId(resRes.resumes[0].id);
        }
      } catch (err: any) {
        console.warn('AI apply load error:', err.message);
      }
    }
    loadData();
  }, [preselectedJobId]);

  const handleGenerateCoverLetter = async () => {
    if (!selectedJob) return;
    setGeneratingLetter(true);
    try {
      const activeResume = resumes.find((r) => r.id === selectedResumeId);
      const resumeData = activeResume?.data || {
        personalInfo: {
          fullName: 'Kavya Sharma',
          email: 'kavya@careerpulse.ai',
          phone: '+91 98765 43210',
          title: 'Senior Software Engineer',
        },
        skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL'],
      };

      const res = await api.generateCoverLetter(resumeData, selectedJob);
      if (res.success && res.coverLetter) {
        setCoverLetter(res.coverLetter);
        toast.success('Tailored cover letter generated!');
      }
    } catch (err: any) {
      toast.error('Failed to generate cover letter');
    } finally {
      setGeneratingLetter(false);
    }
  };

  const handleLogAndOpenApplication = async () => {
    if (!selectedJob) return;
    try {
      // 1. Log to Kanban Tracker as "Applied"
      await api.trackApplication(
        selectedJob.id,
        'applied',
        'Initiated via AI Apply Studio',
        coverLetter
      );
      setAppliedLogged(true);
      toast.success('Application recorded in your Kanban Tracker!');

      // 2. Open official URL in new tab
      if (selectedJob.applicationUrl && selectedJob.applicationUrl !== '#') {
        window.open(selectedJob.applicationUrl, '_blank');
      }
    } catch (err: any) {
      toast.error('Failed to log application');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Badge variant="ai" className="mb-2">AI-Assisted Application Studio</Badge>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-indigo-500" /> Tailored Application Workflow
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your tailored resume alignment, generate a bespoke cover letter, and track your application in one seamless flow.
          </p>
        </div>

        {/* Step 1: Target Position & Resume Selection */}
        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            1. Select Opportunity & Attached Resume
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Role
              </label>
              <select
                value={selectedJob?.id || ''}
                onChange={(e) => {
                  const j = jobs.find((job) => job.id === e.target.value);
                  if (j) setSelectedJob(j);
                }}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} • {j.company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Attach Resume Version
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none"
              >
                {resumes.length === 0 ? (
                  <option value="">Default Technical Resume (ATS 92%)</option>
                ) : (
                  resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} (v{r.version} • {r.templateId})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </Card>

        {/* Step 2: Tailored Cover Letter Generator */}
        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              2. Tailored Cover Letter
            </h3>
            <Button
              onClick={handleGenerateCoverLetter}
              disabled={generatingLetter}
              variant="gradient"
              size="sm"
              className="rounded-xl text-xs gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {generatingLetter ? 'Generating...' : 'Generate with AI'}
            </Button>
          </div>

          <textarea
            rows={10}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Click 'Generate with AI' to draft a customized, authentic cover letter highlighting your relevant experience for this specific role..."
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-xs sm:text-sm focus:outline-none leading-relaxed font-sans"
          />

          {coverLetter && (
            <div className="flex justify-end gap-2 text-xs">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-1 text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(coverLetter);
                  toast.success('Cover letter copied to clipboard');
                }}
              >
                <Copy className="w-3.5 h-3.5" /> Copy Text
              </Button>
            </div>
          )}
        </Card>

        {/* Step 3: Review & Open Official Application */}
        <Card className="glass-panel border-indigo-500/50 p-6 sm:p-8 space-y-4 bg-gradient-to-r from-indigo-50/40 via-purple-50/20 to-blue-50/40 dark:from-indigo-950/30 dark:to-[#0B0F19]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                3. Review and Open Official Application Portal
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                CareerPulse AI respects employer platform boundaries. Clicking the button below opens the official employer portal and automatically creates a tracked card in your Kanban pipeline.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Target: <span className="text-slate-900 dark:text-white font-bold">{selectedJob?.company}</span> Careers Gateway
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {appliedLogged ? (
                <Button asChild variant="gradient" className="w-full sm:w-auto rounded-xl gap-2 font-semibold">
                  <Link href="/applications">
                    <Kanban className="w-4 h-4" /> View in Kanban Tracker
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={handleLogAndOpenApplication}
                  variant="gradient"
                  className="w-full sm:w-auto rounded-xl gap-2 font-semibold shadow-lg shadow-indigo-500/20"
                >
                  <span>Open Portal & Track Application</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AIApplyPage() {
  return (
    <React.Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center text-xs text-slate-500">Loading AI Apply Studio...</div>}>
      <AIApplyContent />
    </React.Suspense>
  );
}
