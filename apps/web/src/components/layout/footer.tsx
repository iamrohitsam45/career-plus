import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin, Heart, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-[#080B13] text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                CareerPulse<span className="text-indigo-600 dark:text-indigo-400">.ai</span>
              </span>
            </Link>
            <p className="text-sm max-w-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Next-generation career intelligence platform uniting real-time job discovery, ATS resume architecture, transparent Indian tech salary intelligence, and 1:1 engineering mentorship.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" /> 100% Free Tier Ready & Verified
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              Discovery
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/jobs" className="hover:text-indigo-500 transition-colors">Search All Jobs</Link></li>
              <li><Link href="/jobs/today" className="hover:text-indigo-500 transition-colors">Today's New Jobs</Link></li>
              <li><Link href="/companies" className="hover:text-indigo-500 transition-colors">Company Insights</Link></li>
              <li><Link href="/salaries" className="hover:text-indigo-500 transition-colors">Salary Benchmarks (INR)</Link></li>
              <li><Link href="/mentorship" className="hover:text-indigo-500 transition-colors">Book a Mentor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              AI Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/resume-builder" className="hover:text-indigo-500 transition-colors">ATS Resume Builder</Link></li>
              <li><Link href="/ai/job-match" className="hover:text-indigo-500 transition-colors">AI Job Match Engine</Link></li>
              <li><Link href="/ai/apply" className="hover:text-indigo-500 transition-colors">AI-Assisted Apply</Link></li>
              <li><Link href="/ai/career-coach" className="hover:text-indigo-500 transition-colors">Career Coach Chatbot</Link></li>
              <li><Link href="/applications" className="hover:text-indigo-500 transition-colors">Kanban Application Tracker</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              Recruiters & Pro
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/recruiter/dashboard" className="hover:text-indigo-500 transition-colors">Recruiter Dashboard</Link></li>
              <li><Link href="/recruiter/jobs/new" className="hover:text-indigo-500 transition-colors">Post a Tech Job</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-500 transition-colors">Pro Subscriptions</Link></li>
              <li><Link href="/onboarding" className="hover:text-indigo-500 transition-colors">Candidate Onboarding</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} CareerPulse AI. Engineered for tech professionals worldwide.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Bengaluru • Hyderabad • Pune • Global</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
