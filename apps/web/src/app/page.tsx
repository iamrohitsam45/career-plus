'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Search,
  MapPin,
  Briefcase,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Star,
  Users2,
  FileText,
  DollarSign,
  Bot,
  Building,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatSalary } from '@careerpulse/shared';

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchLocation, setSearchLocation] = React.useState('Bengaluru');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append('query', searchQuery);
    if (searchLocation) queryParams.append('location', searchLocation);
    router.push(`/jobs?${queryParams.toString()}`);
  };

  // Trending Categories Data
  const categories = [
    { title: 'Full Stack & Web', count: '1,420+ jobs', growth: '+24% this wk', icon: Briefcase, color: 'from-blue-500 to-indigo-600' },
    { title: 'AI & Machine Learning', count: '980+ jobs', growth: '+42% this wk', icon: Sparkles, color: 'from-purple-500 to-pink-600' },
    { title: 'Cloud & DevOps / SRE', count: '850+ jobs', growth: '+18% this wk', icon: Zap, color: 'from-cyan-500 to-blue-600' },
    { title: 'Product & Engineering Lead', count: '430+ jobs', growth: '+15% this wk', icon: TrendingUp, color: 'from-amber-500 to-orange-600' },
  ];

  // Today's latest featured jobs sample
  const sampleTodaysJobs = [
    {
      id: 'job_today_01',
      title: 'Senior Full Stack Engineer (Next.js & TypeScript)',
      company: 'Razorpay',
      companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=96&h=96&fit=crop',
      location: 'Koramangala, Bengaluru',
      workMode: 'Hybrid',
      salary: '₹28.0 - ₹42.0 LPA',
      skills: ['Next.js', 'React', 'TypeScript', 'Node.js'],
      publishedTime: '3h ago',
    },
    {
      id: 'job_today_02',
      title: 'AI / LLM Infrastructure Engineer',
      company: 'Google India',
      companyLogo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=96&h=96&fit=crop',
      location: 'Whitefield, Bengaluru',
      workMode: 'Hybrid',
      salary: '₹45.0 - ₹75.0 LPA',
      skills: ['Python', 'Kubernetes', 'PyTorch', 'GCP'],
      publishedTime: '6h ago',
    },
    {
      id: 'job_today_03',
      title: 'Staff Frontend Architect',
      company: 'Flipkart',
      companyLogo: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=96&h=96&fit=crop',
      location: 'Outer Ring Road, Bengaluru',
      workMode: 'Hybrid',
      salary: '₹50.0 - ₹80.0 LPA',
      skills: ['React', 'SSR', 'Web Performance'],
      publishedTime: 'Just now',
    },
  ];

  const featuredEmployers = [
    { name: 'Google', openRoles: '48 roles', logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=96&h=96&fit=crop' },
    { name: 'Microsoft', openRoles: '36 roles', logo: 'https://images.unsplash.com/photo-1642132652075-2b224e75877c?w=96&h=96&fit=crop' },
    { name: 'Razorpay', openRoles: '24 roles', logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=96&h=96&fit=crop' },
    { name: 'Flipkart', openRoles: '31 roles', logo: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=96&h=96&fit=crop' },
    { name: 'Zerodha', openRoles: '12 roles', logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=96&h=96&fit=crop' },
    { name: 'Swiggy', openRoles: '19 roles', logo: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=96&h=96&fit=crop' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: HERO & ANIMATED JOB SEARCH */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-radial-gradient">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800/80 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Next-Gen AI Career Discovery • Bengaluru & Global Hubs</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-slate-950 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Find Your Next Opportunity with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Precision
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Unite real-time job discovery across top tech employers with instant ATS resume optimization, transparent INR salary intelligence, and 1:1 engineering mentorship.
          </p>

          {/* Animated Search Bar Component */}
          <div className="mt-10 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="p-2 sm:p-3 rounded-2xl glass-panel shadow-2xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center gap-2"
            >
              {/* Role Query Input */}
              <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800">
                <Search className="w-5 h-5 text-indigo-500 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title, tech skill, or company (e.g. Next.js, AI, Google)..."
                  className="w-full bg-transparent border-0 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              {/* Location Input */}
              <div className="flex items-center gap-3 w-full sm:w-72 px-3 py-2">
                <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Location (Bengaluru, Remote...)"
                  className="w-full bg-transparent border-0 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              {/* Submit CTA Button */}
              <Button type="submit" variant="gradient" size="lg" className="w-full sm:w-auto shrink-0 rounded-xl gap-2 font-semibold shadow-indigo-500/25">
                <span>Search Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Trending Quick Filter Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-600 dark:text-slate-400">Popular:</span>
              {[
                { label: 'Bengaluru Tech', q: '', loc: 'Bengaluru' },
                { label: 'Next.js & React', q: 'Next.js', loc: '' },
                { label: 'AI Engineer', q: 'AI', loc: '' },
                { label: 'Remote Only', q: '', loc: 'Remote' },
                { label: 'Razorpay', q: 'Razorpay', loc: '' },
              ].map((pill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSearchQuery(pill.q);
                    setSearchLocation(pill.loc);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-200/80 dark:border-slate-800/80 text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">5,000+</div>
              <div className="text-xs text-slate-500 mt-1">Verified Tech Jobs</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">₹24.5 LPA</div>
              <div className="text-xs text-slate-500 mt-1">Median SDE II Bengaluru</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">94%</div>
              <div className="text-xs text-slate-500 mt-1">ATS Screening Pass Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">1:1 Mock</div>
              <div className="text-xs text-slate-500 mt-1">FAANG Tech Mentorship</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRENDING JOB CATEGORIES */}
      <section className="py-16 bg-white dark:bg-[#080B13]/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <Badge variant="default" className="mb-2">Market Pulse</Badge>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
                Trending Job Categories
              </h2>
            </div>
            <Link href="/jobs" className="mt-3 md:mt-0 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
              Browse All Categories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Card key={idx} className="glow-card group cursor-pointer border-slate-200 dark:border-slate-800">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-semibold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500">{cat.count}</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{cat.growth}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: TODAY'S LATEST JOBS (VERIFIED TIMESTAMP) */}
      <section className="py-20 bg-slate-50/50 dark:bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-bold mb-3">
                <Flame className="w-3.5 h-3.5" /> Published Today
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
                Fresh Opportunities Published in the Last 24 Hours
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Real publication dates verified strictly in Indian Standard Time (IST).
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0 rounded-xl gap-1">
              <Link href="/jobs/today">
                View All Today's Jobs <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleTodaysJobs.map((job) => (
              <Card key={job.id} className="glow-card flex flex-col justify-between border-slate-200 dark:border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                    <Badge variant="today" className="text-[10px]">
                      {job.publishedTime}
                    </Badge>
                  </div>

                  <h3 className="mt-4 font-heading font-semibold text-lg text-slate-900 dark:text-white line-clamp-1">
                    {job.title}
                  </h3>

                  <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
                    {job.company} • <span className="text-xs text-slate-400">{job.location}</span>
                  </div>

                  <div className="mt-4 text-base font-bold text-indigo-600 dark:text-indigo-400">
                    {job.salary}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <div className="p-6 pt-0 mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Verified Employer
                  </span>
                  <Button asChild size="sm" variant="gradient" className="rounded-xl">
                    <Link href={`/jobs/${job.id}`}>Apply Now</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURED EMPLOYERS */}
      <section className="py-16 bg-white dark:bg-[#080B13]/60 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
              Top Employers Hiring in Bengaluru & Across India
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Explore culture ratings, employee salary submissions, and active openings.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredEmployers.map((emp, idx) => (
              <Link
                key={idx}
                href={`/companies/${emp.name.toLowerCase()}`}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 hover:border-indigo-500/50 hover:shadow-lg transition-all flex flex-col items-center text-center group"
              >
                <img
                  src={emp.logo}
                  alt={emp.name}
                  className="w-12 h-12 rounded-xl object-cover mb-3 group-hover:scale-105 transition-transform"
                />
                <span className="font-semibold text-sm text-slate-900 dark:text-white">
                  {emp.name}
                </span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                  {emp.openRoles}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: AI-POWERED CAREER FEATURES PREVIEW */}
      <section className="py-24 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white dark:from-[#0B0F19] dark:via-indigo-950/10 dark:to-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="ai" className="mb-3">AI Intelligence Suite</Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
              Your Unfair Advantage in Tech Recruiting
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              Deterministic ATS heuristics combined with LLM power to optimize your resume, prepare interview answers, and decode salary offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-panel border-slate-200 dark:border-slate-800">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                  XYZ Resume Bullet Optimizer
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Transforms passive bullets into Laszlo Bock formula achievements: "Accomplished [X] as measured by [Y] by doing [Z]" with quantifiable metrics.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button asChild variant="outline" size="sm" className="rounded-xl w-full">
                    <Link href="/resume-builder">Try Resume Builder</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-slate-200 dark:border-slate-800 ring-2 ring-indigo-500/40 relative">
              <div className="absolute -top-3 right-6">
                <Badge variant="today" className="text-[10px]">MOST POPULAR</Badge>
              </div>
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                  Job Match & Keyword Radar
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Scores your resume against target JDs. Identifies critical missing skills, keyword gaps, and outlines a customized 30-day preparation roadmap.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button asChild variant="gradient" size="sm" className="rounded-xl w-full">
                    <Link href="/ai/job-match">Match With a Job</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-slate-200 dark:border-slate-800">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 flex items-center justify-center mb-6">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                  24/7 AI Career Coach
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Interactive behavioral STAR interview coach and salary negotiation assistant equipped with verified Indian tech compensation benchmarks.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button asChild variant="outline" size="sm" className="rounded-xl w-full">
                    <Link href="/ai/career-coach">Chat With Coach</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 6: SALARY BENCHMARKS PREVIEW */}
      <section className="py-20 bg-white dark:bg-[#080B13]/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="default" className="mb-3">Transparent Compensation</Badge>
              <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
                Real-Time Tech Salary Intelligence
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                Never accept an offer without knowing the market median. Our data separates verified employer-posted salary ranges from community-reported submissions across Bengaluru, Hyderabad, and Pune.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    25th, Median, and 75th percentile breakdowns in INR LPA
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Experience curves from Junior (0-2y) to Staff / Principal (10+y)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Company-specific compensation comparison (Google vs Razorpay vs Startups)
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <Button asChild variant="gradient" className="rounded-xl gap-2">
                  <Link href="/salaries">
                    <span>Explore Salary Visualizer</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Visual preview card */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Software Engineer II</h4>
                  <span className="text-xs text-slate-500">Bengaluru, Karnataka • 3-5 Years</span>
                </div>
                <Badge variant="today">Median ₹24.0 LPA</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-500">25th Percentile</span>
                    <span className="text-slate-900 dark:text-white font-semibold">₹16.5 LPA</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="w-[45%] h-full bg-blue-500 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-500">Median Market</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">₹24.0 LPA</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="w-[65%] h-full bg-indigo-600 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-500">75th Percentile (Top Tier)</span>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">₹36.0 LPA</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="w-[88%] h-full bg-purple-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: MENTORSHIP PREVIEW */}
      <section className="py-20 bg-slate-50 dark:bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="default" className="mb-3">1:1 Engineering Mentorship</Badge>
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
              Learn From Engineers Who Have Been There
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Book live mock interviews, system design teardowns, and career roadmap consultations with vetted tech leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Vikramaditya Sharma',
                title: 'Principal Engineer at Google Cloud',
                rating: 4.95,
                reviews: 88,
                price: '₹1,499 / session',
                skills: ['System Design', 'Go', 'GCP'],
                img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
              },
              {
                name: 'Pooja Narang',
                title: 'Senior Engineering Manager at Microsoft',
                rating: 4.92,
                reviews: 64,
                price: '₹1,299 / session',
                skills: ['STAR Method', 'Career Transitions'],
                img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop',
              },
              {
                name: 'Arjun Venkatesh',
                title: 'Staff Architect at Razorpay',
                rating: 4.88,
                reviews: 42,
                price: '₹999 / session',
                skills: ['Next.js', 'Web Performance'],
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
              },
            ].map((m, idx) => (
              <Card key={idx} className="glow-card border-slate-200 dark:border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={m.img} alt={m.name} className="w-14 h-14 rounded-2xl object-cover" />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-base">{m.name}</h4>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{m.title}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{m.rating}</span>
                        <span className="text-slate-400">({m.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {m.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{m.price}</span>
                    <Button asChild size="sm" variant="gradient" className="rounded-xl">
                      <Link href="/mentorship">Book Session</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: FREE VS PRO SUBSCRIPTION COMPARISON */}
      <section className="py-20 bg-white dark:bg-[#080B13]/60 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="default" className="mb-3">Transparent Plans</Badge>
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
              Choose the Plan That Accelerates Your Career
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Start free forever. Upgrade to Pro for unlimited AI optimizations and priority interview coaching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Tier Card */}
            <Card className="border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">Free Starter</h3>
                <p className="text-xs text-slate-500 mt-1">Essential tools for tech job seekers</p>
                <div className="mt-6 text-4xl font-extrabold text-slate-900 dark:text-white">
                  ₹0 <span className="text-sm font-normal text-slate-500">/ forever</span>
                </div>

                <div className="mt-8 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full job search & filters</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Today's verified jobs feed</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic ATS resume builder (1 resume)</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Kanban application tracker</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 5 AI requests / day</div>
                </div>
              </div>

              <div className="mt-8">
                <Button asChild variant="outline" className="w-full rounded-xl">
                  <Link href="/jobs">Get Started Free</Link>
                </Button>
              </div>
            </Card>

            {/* Pro Plan Card */}
            <Card className="border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 p-8 flex flex-col justify-between relative bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-950/20 dark:to-transparent">
              <div className="absolute -top-3 right-6">
                <Badge variant="today">RECOMMENDED</Badge>
              </div>
              <div>
                <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">CareerPulse Pro</h3>
                <p className="text-xs text-slate-500 mt-1">Full AI suite & deep market compensation</p>
                <div className="mt-6 text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  ₹1,499 <span className="text-sm font-normal text-slate-500">/ month</span>
                </div>

                <div className="mt-8 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Unlimited AI resume bullet rewrites (XYZ formula)</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Comprehensive ATS job matching & keyword gaps</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Unlimited custom cover letters & application answers</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 4 Premium ATS templates with instant PDF export</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Full salary percentile percentiles & company comparison</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Direct booking privileges with verified FAANG mentors</div>
                </div>
              </div>

              <div className="mt-8">
                <Button asChild variant="gradient" className="w-full rounded-xl shadow-lg">
                  <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 9: TESTIMONIALS (CLEARLY LABELED DEMO DATA) */}
      <section className="py-20 bg-slate-50 dark:bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-3">Community Success Stories</Badge>
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
              Engineers Hired at Leading Tech Companies
            </h2>
            <p className="text-xs text-slate-500 mt-2 italic">
              (Sample candidate success testimonials for evaluation purposes)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'The XYZ bullet optimizer turned my resume into an interview magnet. I landed SDE II interviews at Razorpay and Swiggy within 2 weeks of applying.',
                author: 'Rohan Deshmukh',
                role: 'SDE II at Razorpay',
                salaryJump: '+48% compensation increase',
              },
              {
                quote: 'Having the salary percentiles gave me immense confidence during HR negotiations. I secured the 75th percentile band for staff engineering in Bellandur.',
                author: 'Ananya Sen',
                role: 'Staff Frontend Engineer at Flipkart',
                salaryJump: 'Secured ₹48 LPA package',
              },
              {
                quote: 'The mock interview session with a Google Principal Mentor helped me identify critical blindspots in distributed concurrency. Worth 10x the price.',
                author: 'Kartik Nair',
                role: 'Cloud Architect at Microsoft',
                salaryJump: 'Transitioned from service to product firm',
              },
            ].map((t, idx) => (
              <Card key={idx} className="border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white">{t.author}</div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400">{t.role}</div>
                  <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">{t.salaryJump}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: FAQ */}
      <section className="py-20 bg-white dark:bg-[#080B13]/60 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-2">Frequently Asked Questions</Badge>
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
              Everything You Need to Know
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base font-semibold">
                How does CareerPulse AI verify "Today's Jobs"?
              </AccordionTrigger>
              <AccordionContent>
                We do not confuse the time a crawler ingested a job with its true publication date. Our provider adapters parse and normalize the official source publication timestamp in the job's local timezone. Jobs on `/jobs/today` are guaranteed to have been published during the current calendar date.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base font-semibold">
                Does the AI Job Match guarantee I will get hired?
              </AccordionTrigger>
              <AccordionContent>
                No platform can guarantee hiring decisions. CareerPulse AI provides transparent ATS heuristic estimates based on keyword density, verified technical skills, and years of relevant experience. We clearly outline missing requirements so you can take informed action.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-base font-semibold">
                Are salary insights accurate for Indian tech companies?
              </AccordionTrigger>
              <AccordionContent>
                Yes. We standardize compensation in Indian Rupees (INR) Lakhs Per Annum (LPA) and clearly separate employer-verified posted salary bands from anonymous self-reported submissions to ensure zero fabricated or deceptive figures.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-base font-semibold">
                Can recruiters post jobs directly on CareerPulse?
              </AccordionTrigger>
              <AccordionContent>
                Yes. Through the Recruiter Portal (`/recruiter/dashboard`), verified hiring managers can post native jobs, review candidate resumes, and manage applicant stages directly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
