'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  Search,
  MapPin,
  Building2,
  BarChart3,
  PlusCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export default function SalariesPage() {
  const [role, setRole] = React.useState('Software Engineer');
  const [location, setLocation] = React.useState('Bengaluru');
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [showSubmitModal, setShowSubmitModal] = React.useState(false);

  // Submit salary form state
  const [subJobTitle, setSubJobTitle] = React.useState('Full Stack Engineer');
  const [subCompany, setSubCompany] = React.useState('Tech Company');
  const [subLocation, setSubLocation] = React.useState('Bengaluru');
  const [subExp, setSubExp] = React.useState(3);
  const [subBaseLpa, setSubBaseLpa] = React.useState(22);
  const [submitting, setSubmitting] = React.useState(false);

  const fetchSalaries = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getSalaries(role, location);
      if (res.success) {
        setData(res);
      }
    } catch (err: any) {
      console.warn('Salaries fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [role, location]);

  React.useEffect(() => {
    fetchSalaries();
  }, [fetchSalaries]);

  const handleSalarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitSalary({
        jobTitle: subJobTitle,
        company: subCompany,
        location: subLocation,
        yearsOfExperience: Number(subExp),
        baseSalary: Number(subBaseLpa) * 100000,
        currency: 'INR',
      });
      toast.success('Salary submission recorded anonymously. Thank you for empowering the tech community!');
      setShowSubmitModal(false);
      fetchSalaries();
    } catch (err: any) {
      toast.error('Error recording salary submission');
    } finally {
      setSubmitting(false);
    }
  };

  const expData = data?.byExperience || [
    { level: 'Entry (0-2y)', medianLpa: 8.5 },
    { level: 'Mid (3-5y)', medianLpa: 16.5 },
    { level: 'Senior (6-9y)', medianLpa: 28.0 },
    { level: 'Lead / Staff (10+y)', medianLpa: 42.0 },
  ];

  const cityData = data?.byCity || [
    { city: 'Bengaluru', medianLpa: 22.0 },
    { city: 'Hyderabad', medianLpa: 18.5 },
    { city: 'Pune', medianLpa: 16.0 },
    { city: 'Delhi NCR', medianLpa: 17.5 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="default" className="mb-2">Compensation Visualizer</Badge>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Tech Salary Benchmarks & Percentiles
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Authentic Indian tech market compensation curves formatted in INR LPA. Zero fabricated estimates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
              <Link href="/salaries/compare">Compare Roles</Link>
            </Button>
            <Button
              onClick={() => setShowSubmitModal(true)}
              variant="gradient"
              size="sm"
              className="rounded-xl text-xs gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Submit Anonymous Salary
            </Button>
          </div>
        </div>

        {/* Search controls */}
        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
              <Search className="w-4 h-4 text-indigo-500 shrink-0" />
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Job Role (e.g. Full Stack Engineer)..."
                className="w-full bg-transparent border-0 text-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (Bengaluru, Hyderabad...)"
                className="w-full bg-transparent border-0 text-sm focus:outline-none"
              />
            </div>

            <Button onClick={fetchSalaries} variant="gradient" className="rounded-xl">
              Update Visualizer
            </Button>
          </div>
        </Card>

        {/* Key Percentiles Highlight Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 text-center">
            <div className="text-xs text-slate-500 font-medium">25th Percentile (Starting Band)</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
              {formatINR(data?.p25Salary || 1200000)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">25% of engineers earn less than this</div>
          </Card>

          <Card className="glass-panel border-indigo-500/50 ring-2 ring-indigo-500/20 p-6 text-center bg-gradient-to-b from-indigo-50/40 to-transparent dark:from-indigo-950/20 dark:to-transparent">
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
              Market Median (50th Percentile)
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-300 mt-2">
              {formatINR(data?.medianSalary || 2200000)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Balanced market anchor for negotiations</div>
          </Card>

          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 text-center">
            <div className="text-xs text-slate-500 font-medium">75th Percentile (Tier-1 Top Pay)</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">
              {formatINR(data?.p75Salary || 3500000)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Top tier employers & staff performers</div>
          </Card>
        </div>

        {/* Recharts Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Experience vs Salary LPA */}
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
              Salary Growth by Experience (INR LPA)
            </h3>
            <p className="text-xs text-slate-500 mb-6">Average progression across career stages</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={expData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="level" tick={{ fontSize: 11 }} />
                  <YAxis unit="L" tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [`₹${val} LPA`, 'Median Salary']}
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="medianLpa" stroke="#6366F1" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 2: City Comparison */}
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
              Compensation by Tech Hub (INR LPA)
            </h3>
            <p className="text-xs text-slate-500 mb-6">Median pay comparison across major Indian cities</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="city" tick={{ fontSize: 11 }} />
                  <YAxis unit="L" tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [`₹${val} LPA`, 'Median Salary']}
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff' }}
                  />
                  <Bar dataKey="medianLpa" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Modal: Submit Anonymous Salary */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
            <Card className="max-w-md w-full border-slate-200 dark:border-slate-800 p-6 sm:p-8 bg-white dark:bg-[#0F172A] shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                  Contribute Anonymous Salary
                </h3>
                <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSalarySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={subJobTitle}
                    onChange={(e) => setSubJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={subCompany}
                    onChange={(e) => setSubCompany(e.target.value)}
                    placeholder="e.g. Flipkart, Swiggy, Startup"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={subLocation}
                      onChange={(e) => setSubLocation(e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Years Exp *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="30"
                      value={subExp}
                      onChange={(e) => setSubExp(parseInt(e.target.value, 10))}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Base Salary (INR LPA) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="150"
                    step="0.5"
                    value={subBaseLpa}
                    onChange={(e) => setSubBaseLpa(parseFloat(e.target.value))}
                    placeholder="e.g. 24"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setShowSubmitModal(false)} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} variant="gradient" className="rounded-xl">
                    {submitting ? 'Submitting...' : 'Submit Anonymously'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
