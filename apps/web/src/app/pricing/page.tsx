'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleUpgradePro = async () => {
    setLoading(true);
    try {
      const order = await api.createSubscriptionOrder();
      if (!order.success) {
        throw new Error('Order creation failed');
      }

      // If in sandbox mode without active Razorpay secret keys
      if (order.isSandbox) {
        toast.info('Razorpay Test Mode: Simulating signed payment verification...');
        await api.verifySubscriptionPayment({
          razorpayOrderId: order.orderId,
          razorpayPaymentId: `pay_test_${Date.now()}`,
          razorpaySignature: 'test_hmac_sha256_sig',
        });
        toast.success('Upgraded to CareerPulse Pro successfully!');
        router.push('/subscription/success');
        return;
      }

      // Live Razorpay Script Flow
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'CareerPulse AI',
        description: 'Pro Career Intelligence Plan',
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            await api.verifySubscriptionPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment verified & Pro plan activated!');
            router.push('/subscription/success');
          } catch (err: any) {
            toast.error('Payment verification failed');
          }
        },
        theme: { color: '#6366F1' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Error processing upgrade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="default" className="mb-3">Accelerate Your Search</Badge>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Free forever for search and tracking. Upgrade to Pro for unlimited AI optimizations and priority interview coaching.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Starter (Free Forever)
              </h3>
              <p className="text-xs text-slate-500 mt-1">Core job discovery and tracker</p>
              <div className="mt-6 text-4xl font-extrabold text-slate-900 dark:text-white">
                ₹0 <span className="text-sm font-normal text-slate-500">/ forever</span>
              </div>

              <div className="mt-8 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full job search across India & remote</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Today's verified jobs feed</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic ATS resume builder (1 resume)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Kanban application tracker</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 5 AI prompts per day</div>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href="/dashboard">Current Plan</Link>
              </Button>
            </div>
          </Card>

          {/* Pro Plan */}
          <Card className="glass-panel border-indigo-500 ring-2 ring-indigo-500/30 p-8 flex flex-col justify-between relative bg-gradient-to-b from-indigo-50/40 to-transparent dark:from-indigo-950/20 dark:to-transparent">
            <div className="absolute -top-3 right-6">
              <Badge variant="today">MOST POPULAR</Badge>
            </div>

            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                CareerPulse Pro
              </h3>
              <p className="text-xs text-slate-500 mt-1">Full AI suite & deep market compensation</p>
              <div className="mt-6 text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                ₹1,499 <span className="text-sm font-normal text-slate-500">/ month</span>
              </div>

              <div className="mt-8 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Unlimited AI resume bullet rewrites (XYZ formula)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Instant ATS Job Match & keyword gap radar</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Unlimited bespoke cover letters</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 4 Premium ATS templates with PDF export</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Full salary percentile distributions (25th, Median, 75th)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Direct privileges for 1:1 FAANG mentor bookings</div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={handleUpgradePro}
                disabled={loading}
                variant="gradient"
                className="w-full rounded-xl gap-2 font-semibold shadow-lg shadow-indigo-500/25"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Processing...' : 'Upgrade with Razorpay'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Security / Razorpay notice */}
        <div className="text-center text-xs text-slate-500 max-w-md mx-auto flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured with 256-bit encrypted Razorpay checkout. Cancel anytime.</span>
        </div>
      </div>
    </div>
  );
}
