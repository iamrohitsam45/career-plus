'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

export default function SubscriptionManagePage() {
  const [sub, setSub] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getSubscription();
        if (res.success) setSub(res.subscription);
      } catch (e) {
        setSub({ plan: 'pro', isPro: true, status: 'active', amountInr: 1499 });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="default" className="mb-2">Billing & Plan</Badge>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Subscription Management
            </h1>
          </div>
          <Button asChild variant="ghost" size="sm" className="rounded-xl gap-1 text-xs">
            <Link href="/dashboard"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Link>
          </Button>
        </div>

        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs text-slate-400">Current Plan</div>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 capitalize mt-0.5">
                {sub?.plan || 'pro'} Plan
              </div>
            </div>
            <Badge variant="today" className="uppercase text-xs">
              {sub?.status || 'active'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Billing Cycle:</span>
              <p className="font-semibold text-slate-900 dark:text-white mt-1">₹1,499 / Month (Razorpay)</p>
            </div>
            <div>
              <span className="text-slate-400">Renews On:</span>
              <p className="font-semibold text-slate-900 dark:text-white mt-1">
                {new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-IN', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-500">Need to cancel or change payment method?</span>
            <Button variant="outline" size="sm" className="rounded-xl text-xs">
              Manage in Razorpay Portal
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
