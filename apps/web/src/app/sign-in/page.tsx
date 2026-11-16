'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleDemoLogin = (role: 'candidate' | 'recruiter' | 'mentor') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cp_auth_token', `test_user_${role}`);
    }
    toast.success(`Signed in as Demo ${role.toUpperCase()}`);
    if (role === 'recruiter') {
      router.push('/recruiter/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('cp_auth_token', `user_${email.split('@')[0] || 'candidate'}`);
    }
    toast.success('Signed in successfully');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-radial-gradient">
      <div className="max-w-md w-full space-y-8">
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
            Welcome Back
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Sign in to access your AI Career Studio and saved opportunities.
          </p>
        </div>

        <Card className="glass-panel border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Account Login</CardTitle>
            <CardDescription className="text-xs">
              Use your credentials or pick a 1-click test profile
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Quick 1-Click Evaluation Profiles */}
            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
              <div className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Instant Demo Evaluation:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoLogin('candidate')}
                  className="rounded-lg text-xs h-8 justify-start"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500 mr-1.5" /> Candidate
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoLogin('recruiter')}
                  className="rounded-lg text-xs h-8 justify-start"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-500 mr-1.5" /> Recruiter
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@careerpulse.ai"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <Button type="submit" variant="gradient" className="w-full rounded-xl gap-2 font-semibold">
                Sign In <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2">
              Don't have an account?{' '}
              <Link href="/onboarding" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Complete Onboarding
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
