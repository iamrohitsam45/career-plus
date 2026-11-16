'use client';

import * as React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowLeft, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function SalaryComparePage() {
  const [comparisons, setComparisons] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getSalaryComparisons();
        if (res.success) {
          setComparisons(res.comparisons);
        }
      } catch (err: any) {
        console.warn('Salary compare err:', err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="default" className="mb-2">Cross-Role Intelligence</Badge>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Tech Role Compensation Comparison
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Side-by-side median and 75th percentile salary benchmarks across software disciplines.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="rounded-xl gap-1">
            <Link href="/salaries"><ArrowLeft className="w-4 h-4" /> Back</Link>
          </Button>
        </div>

        {/* Chart */}
        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6">
          <h3 className="font-heading font-bold text-base mb-4">Median Salary (INR LPA)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisons} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="role" tick={{ fontSize: 11 }} />
                <YAxis unit="L" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`₹${val} LPA`, 'Median Salary']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="medianLpa" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {comparisons.map((c, idx) => (
            <Card key={idx} className="glass-panel border-slate-200 dark:border-slate-800 p-5 space-y-2">
              <h4 className="font-semibold text-base text-slate-900 dark:text-white">{c.role}</h4>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Median Pay:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">₹{c.medianLpa} LPA</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">25th Percentile:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{formatINR(c.p25Salary)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">75th Percentile:</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">{formatINR(c.p75Salary)}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
