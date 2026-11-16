'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-radial-gradient">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              CareerPulse<span className="text-indigo-600 dark:text-indigo-400">.ai</span>
            </span>
          </Link>
          <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Set up your profile to unlock personalized job recommendations and AI tools.
          </p>
        </div>

        <Card className="glass-panel border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Get Started with CareerPulse</CardTitle>
            <CardDescription className="text-xs">
              Complete your candidate onboarding to generate your AI match radar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => router.push('/onboarding')}
              variant="gradient"
              className="w-full rounded-xl gap-2 font-semibold h-11"
            >
              Start Candidate Onboarding <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/sign-in" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
