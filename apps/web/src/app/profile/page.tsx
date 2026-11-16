'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  Edit,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { formatINR } from '@/lib/utils';

export default function ProfilePage() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getCurrentUser().catch(() => ({
          success: true,
          user: {
            email: 'engineer@careerpulse.ai',
            role: 'candidate',
            profile: {
              fullName: 'Kavya Sharma',
              headline: 'Senior Full Stack Engineer | Next.js, Node.js & Cloud',
              experienceYears: 4,
              currentTitle: 'Senior Software Engineer',
              technicalSkills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'AWS'],
              preferredRoles: ['Full Stack Engineer', 'Frontend Architect'],
              preferredLocations: ['Bengaluru, Karnataka', 'Remote'],
              currentSalary: 1800000,
              expectedSalary: 2800000,
              noticePeriodDays: 30,
              workModes: ['hybrid', 'remote'],
              careerGoals: 'Lead web platform initiatives at high-growth tech firms in Bengaluru.',
            },
          },
        }));

        if (res.user) setUser(res.user);
      } catch (err: any) {
        console.warn('Profile fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const p = user?.profile || {};

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="default" className="mb-2">Candidate Profile</Badge>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Professional Credentials
            </h1>
          </div>

          <Button asChild variant="gradient" size="sm" className="rounded-xl text-xs gap-1.5">
            <Link href="/onboarding">
              <Edit className="w-3.5 h-3.5" /> Edit Profile
            </Link>
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              {p.fullName ? p.fullName.charAt(0) : 'E'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white">
                  {p.fullName || 'Software Professional'}
                </h2>
                <Badge variant="today" className="text-[10px]">VERIFIED</Badge>
              </div>
              <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                {p.headline || 'Full Stack Engineer'}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {user?.email || 'user@careerpulse.ai'}
                </span>
                <span>•</span>
                <span>{p.experienceYears || 3} Years Experience</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Current Salary</span>
              <p className="font-bold text-slate-900 dark:text-white mt-1">
                {formatINR(p.currentSalary)}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Expected Salary</span>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {formatINR(p.expectedSalary)}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Notice Period</span>
              <p className="font-bold text-slate-900 dark:text-white mt-1">
                {p.noticePeriodDays || 30} Days
              </p>
            </div>
            <div>
              <span className="text-slate-400">Work Mode</span>
              <p className="font-bold text-slate-900 dark:text-white capitalize mt-1">
                {p.workModes?.join(', ') || 'Hybrid'}
              </p>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Verified Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {(p.technicalSkills || ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB']).map((s: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 text-xs font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Career Goals */}
          {p.careerGoals && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Career Goals
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {p.careerGoals}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
