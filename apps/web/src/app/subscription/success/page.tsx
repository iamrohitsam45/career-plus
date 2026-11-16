'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowRight, Kanban, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-radial-gradient">
      <Card className="max-w-md w-full glass-panel border-indigo-500/50 p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
            Welcome to Pro!
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Your subscription has been verified and all Pro features are now unlocked on your account.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-left space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Unlocked Pro Capabilities:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
            <li>Unlimited AI bullet point rewrites (XYZ formula)</li>
            <li>ATS job matching and missing keyword radar</li>
            <li>Full compensation percentile curves</li>
            <li>Priority 1:1 engineering mentorship access</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Button asChild variant="gradient" className="w-full rounded-xl gap-2 font-semibold">
            <Link href="/dashboard">
              Go to Candidate Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-xl text-xs">
            <Link href="/resume-builder">Optimize Resume</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
