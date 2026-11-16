'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Briefcase,
  Sparkles,
  Building2,
  TrendingUp,
  FileText,
  Kanban,
  Users2,
  Sun,
  Moon,
  Menu,
  X,
  Compass,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [currentRole, setCurrentRole] = React.useState<'candidate' | 'recruiter' | 'mentor'>('candidate');

  const navLinks = [
    { label: 'Jobs', href: '/jobs', icon: Briefcase },
    { label: 'Today', href: '/jobs/today', icon: Zap, badge: 'LIVE' },
    { label: 'Companies', href: '/companies', icon: Building2 },
    { label: 'Salaries', href: '/salaries', icon: TrendingUp },
    { label: 'Resume Builder', href: '/resume-builder', icon: FileText },
    { label: 'AI Match', href: '/ai/job-match', icon: Sparkles },
    { label: 'Tracker', href: '/applications', icon: Kanban },
    { label: 'Mentors', href: '/mentorship', icon: Users2 },
    { label: 'Pricing', href: '/pricing', icon: Compass },
  ];

  const handleRoleToggle = (role: 'candidate' | 'recruiter' | 'mentor') => {
    setCurrentRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cp_auth_token', `test_user_${role}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0B0F19]/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-950 via-indigo-900 to-indigo-600 dark:from-white dark:via-slate-100 dark:to-indigo-300 bg-clip-text text-transparent">
                  CareerPulse<span className="text-indigo-600 dark:text-indigo-400">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 -mt-1">
                  AI Career Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                    {link.badge && (
                      <Badge variant="today" className="px-1.5 py-0 text-[9px] h-4">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right actions: Role pill, Theme toggle, Dashboard CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Quick Demo Role Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
              <button
                onClick={() => handleRoleToggle('candidate')}
                className={cn(
                  'px-2.5 py-1 rounded-lg transition-all',
                  currentRole === 'candidate'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                Candidate
              </button>
              <button
                onClick={() => handleRoleToggle('recruiter')}
                className={cn(
                  'px-2.5 py-1 rounded-lg transition-all',
                  currentRole === 'recruiter'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                Recruiter
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl w-9 h-9"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
            </Button>

            {/* Recruiter link if role is recruiter */}
            {currentRole === 'recruiter' ? (
              <Button asChild size="sm" variant="outline" className="rounded-xl gap-1.5">
                <Link href="/recruiter/dashboard">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  Recruiter Portal
                </Link>
              </Button>
            ) : null}

            {/* Candidate Dashboard */}
            <Button asChild size="sm" variant="gradient" className="rounded-xl">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-xl"
            >
              <Sun className="h-4 w-4 dark:hidden text-amber-500" />
              <Moon className="h-4 w-4 hidden dark:block text-indigo-400" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B0F19]/95 px-4 pt-2 pb-6 space-y-2 backdrop-blur-lg">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-slate-100/70 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200"
                >
                  <Icon className="w-4 h-4 text-indigo-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <Button asChild variant="gradient" className="w-full rounded-xl">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
