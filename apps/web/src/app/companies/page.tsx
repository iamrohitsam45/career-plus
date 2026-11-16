'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Star,
  Users,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { Company } from '@careerpulse/shared';

export default function CompaniesPage() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [search, setSearch] = React.useState('');
  const [industry, setIndustry] = React.useState('all');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getCompanies(search, industry);
        if (res.success) {
          setCompanies(res.companies);
        }
      } catch (err: any) {
        console.warn('Companies fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, industry]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="default" className="mb-2">Verified Employer Intelligence</Badge>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
            Discover Top Tech Companies & Real Culture Ratings
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Community-verified reviews, work-life balance scores, compensation satisfaction, and open jobs across leading tech hubs.
          </p>

          {/* Search bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 flex-1">
              <Search className="w-4 h-4 text-indigo-500 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company by name (e.g. Razorpay, Google)..."
                className="w-full bg-transparent border-0 text-sm focus:outline-none text-slate-900 dark:text-white"
              />
            </div>

            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none text-slate-900 dark:text-white"
            >
              <option value="all">All Industries</option>
              <option value="fintech">FinTech & Payments</option>
              <option value="cloud">Cloud & Infrastructure</option>
              <option value="ecommerce">E-Commerce & Logistics</option>
            </select>
          </div>
        </div>

        {/* Company Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-48 border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-semibold text-base">No companies match your search</h3>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card
                key={company.id}
                className="glow-card border-slate-200 dark:border-slate-800 flex flex-col justify-between p-6"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <img
                      src={company.logo || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=96&h=96&fit=crop'}
                      alt={company.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{company.rating}</span>
                      <span className="text-slate-400 font-normal">({company.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="mt-4 font-heading font-semibold text-lg text-slate-900 dark:text-white">
                    {company.name}
                  </h3>

                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {company.industry}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {company.headquarters}
                  </div>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {company.overview}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400">Work-Life:</span>{' '}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {company.workLifeRating}/5
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Culture:</span>{' '}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {company.cultureRating}/5
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                  <Button asChild size="sm" variant="gradient" className="rounded-xl text-xs gap-1">
                    <Link href={`/companies/${company.slug}`}>
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
