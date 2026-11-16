'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
  Search,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { AIJobMatchResult, Job } from '@careerpulse/shared';
import { toast } from 'sonner';

function AIJobMatchContent() {
  const searchParams = useSearchParams();
  const targetJobId = searchParams.get('jobId') || '';

  const [jobId, setJobId] = React.useState(targetJobId);
  const [jobList, setJobList] = React.useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [matchResult, setMatchResult] = React.useState<AIJobMatchResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Resume state
  const [userSkills, setUserSkills] = React.useState('React, Next.js, TypeScript, Node.js, MongoDB, Tailwind CSS');
  const [userTitle, setUserTitle] = React.useState('Full Stack Engineer');

  React.useEffect(() => {
    async function loadJobs() {
      try {
        const res = await api.getJobs({ limit: 10 });
        if (res.success && res.jobs.length > 0) {
          setJobList(res.jobs);
          if (targetJobId) {
            const found = res.jobs.find((j) => j.id === targetJobId);
            if (found) setSelectedJob(found);
          } else {
            setSelectedJob(res.jobs[0]);
          }
        }
      } catch (err: any) {
        console.warn('Jobs load error:', err.message);
      }
    }
    loadJobs();
  }, [targetJobId]);

  const handleRunMatch = async () => {
    if (!selectedJob) return;
    setLoading(true);
    try {
      const resumeData = {
        personalInfo: {
          fullName: 'Candidate',
          email: 'candidate@careerpulse.ai',
          phone: '+91 98765 43210',
          location: 'Bengaluru, India',
          title: userTitle,
          summary: 'Experienced developer building modern web applications.',
        },
        skills: userSkills.split(',').map((s) => s.trim()).filter(Boolean),
        experience: [
          {
            id: 'exp1',
            company: 'Tech Solutions',
            position: userTitle,
            startDate: '2022-01',
            current: true,
            highlights: ['Delivered features using ' + userSkills.slice(0, 30)],
          },
        ],
        education: [],
        projects: [],
        certifications: [],
        awards: [],
      };

      const res = await api.matchJob(selectedJob.id, resumeData, selectedJob);
      if (res.success && res.match) {
        setMatchResult(res.match);
        toast.success('Job Match analysis complete!');
      }
    } catch (err: any) {
      toast.error('Failed to run AI match analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Badge variant="ai" className="mb-2">ATS Keyword Radar</Badge>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-indigo-500" /> AI Resume & Job Match Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Evaluate your resume against target technical job descriptions. Discover matched competencies, missing keywords, and an actionable 30-day bridge roadmap.
          </p>
        </div>

        {/* Input Parameters Card */}
        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Role to Evaluate
              </label>
              <select
                value={selectedJob?.id || ''}
                onChange={(e) => {
                  const j = jobList.find((job) => job.id === e.target.value);
                  if (j) setSelectedJob(j);
                }}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none"
              >
                {jobList.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} at {j.company} ({j.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Professional Title
              </label>
              <input
                type="text"
                value={userTitle}
                onChange={(e) => setUserTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Skills on Resume (Comma Separated)
            </label>
            <input
              type="text"
              value={userSkills}
              onChange={(e) => setUserSkills(e.target.value)}
              placeholder="e.g. React, Next.js, Node.js, Python, PostgreSQL, AWS"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleRunMatch}
              disabled={loading}
              variant="gradient"
              className="rounded-xl gap-2 font-semibold shadow-lg shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Evaluating Match...' : 'Calculate Estimated Match'}
            </Button>
          </div>
        </Card>

        {/* Results Presentation */}
        {matchResult && (
          <div className="space-y-6 animate-fade-in">
            {/* Score Banner */}
            <Card className="glass-panel border-indigo-500/50 p-6 sm:p-8 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-blue-50/50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-blue-950/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <Badge variant="today" className="mb-2">ATS ESTIMATED COMPATIBILITY</Badge>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                    {matchResult.jobTitle} at {matchResult.company}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-xl leading-relaxed">
                    {matchResult.summaryExplanation}
                  </p>
                </div>

                <div className="text-center sm:text-right shrink-0">
                  <div className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {matchResult.matchPercentage}%
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">
                    Estimated Match Score
                  </div>
                </div>
              </div>
            </Card>

            {/* Matched vs Missing Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Matching Verified Skills ({matchResult.matchingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchResult.matchingSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-semibold capitalize"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Identified Keyword Gaps ({matchResult.missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchResult.missingSkills.length > 0 ? (
                    matchResult.missingSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-semibold capitalize"
                      >
                        + {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">Zero critical skill gaps detected!</span>
                  )}
                </div>
              </Card>
            </div>

            {/* 30-Day Skill Roadmap */}
            <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 font-heading font-bold text-base text-slate-900 dark:text-white">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <span>Custom Skill Bridge Roadmap</span>
              </div>
              <div className="space-y-3">
                {matchResult.skillImprovementRoadmap.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <Button asChild variant="gradient" className="rounded-xl gap-2">
                  <Link href={`/ai/apply?jobId=${matchResult.jobId}`}>
                    Continue to AI Apply Studio <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIJobMatchPage() {
  return (
    <React.Suspense fallback={<div className="max-w-5xl mx-auto py-20 text-center text-xs text-slate-500">Loading AI Job Match...</div>}>
      <AIJobMatchContent />
    </React.Suspense>
  );
}
