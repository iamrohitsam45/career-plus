'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  FileText,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Edit,
  Trash2,
  Copy,
  Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { Resume } from '@careerpulse/shared';
import { toast } from 'sonner';

export default function ResumeBuilderOverviewPage() {
  const [resumes, setResumes] = React.useState<Resume[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await api.getResumes();
      if (res.success) {
        setResumes(res.resumes);
      }
    } catch (err: any) {
      console.warn('Resumes fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteResume(id);
      setResumes(resumes.filter((r) => r.id !== id));
      toast.success('Resume deleted');
    } catch (err: any) {
      toast.error('Error deleting resume');
    }
  };

  const handleCreateDefault = async () => {
    try {
      const res = await api.createResume({ title: 'Full Stack Engineer Resume' });
      if (res.success) {
        toast.success('New resume created!');
        fetchResumes();
      }
    } catch (err: any) {
      toast.error('Failed to create resume');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="ai" className="mb-2">ATS Architecture Studio</Badge>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              ATS-Optimized Resume Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Create clean, recruiter-approved resumes with live XYZ bullet point enhancement and instant PDF generation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
              <Link href="/resume-builder/templates">Templates Gallery</Link>
            </Button>
            <Button onClick={handleCreateDefault} variant="gradient" size="sm" className="rounded-xl text-xs gap-1.5">
              <PlusCircle className="w-3.5 h-3.5" /> Create New Resume
            </Button>
          </div>
        </div>

        {/* ATS Quality Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                Laszlo Bock XYZ Bullet Formula Built-In
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-xl">
                Every work experience item can be rewritten instantly with Google's formula: "Accomplished [X] as measured by [Y] by doing [Z]" to maximize interview shortlists.
              </p>
            </div>
          </div>
        </div>

        {/* Resumes List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse p-6 h-32 border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">No resumes created yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Start with a pre-configured, ATS-friendly technical template with 1 click.
            </p>
            <Button onClick={handleCreateDefault} variant="gradient" size="sm" className="mt-4 rounded-xl">
              Create My First Resume
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="glow-card border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                        {resume.title}
                      </h3>
                      <div className="text-xs text-slate-500 capitalize mt-0.5">
                        Template: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{resume.templateId}</span> • v{resume.version}
                      </div>
                    </div>
                    <Badge variant="today" className="text-xs">
                      ATS: {resume.atsScoreEstimate}%
                    </Badge>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">{resume.data?.personalInfo?.fullName || 'Candidate'}</span> •{' '}
                    <span>{resume.data?.personalInfo?.title || 'Engineer'}</span>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">
                      {resume.data?.skills?.slice(0, 5).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="gradient" className="rounded-xl gap-1.5 text-xs">
                      <Link href={`/resume-builder/${resume.id}/edit`}>
                        <Edit className="w-3.5 h-3.5" /> Edit & Optimize
                      </Link>
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
