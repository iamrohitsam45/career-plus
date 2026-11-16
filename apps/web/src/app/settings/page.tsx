'use client';

import * as React from 'react';
import Link from 'next/link';
import { Shield, Bell, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [jobMatchesDaily, setJobMatchesDaily] = React.useState(true);
  const [anonymousProfile, setAnonymousProfile] = React.useState(false);

  const handleSave = () => {
    toast.success('Settings and privacy preferences updated!');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="default" className="mb-2">User Preferences</Badge>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Account & Privacy Settings
            </h1>
          </div>
          <Button asChild variant="ghost" size="sm" className="rounded-xl gap-1 text-xs">
            <Link href="/dashboard"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
          </Button>
        </div>

        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          {/* Notification toggles */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-500" /> Notifications & Alerts
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Daily Today's Jobs Digest</span>
                <p className="text-slate-500 mt-0.5">Receive jobs published on the current date matching your skills</p>
              </div>
              <input
                type="checkbox"
                checked={jobMatchesDaily}
                onChange={(e) => setJobMatchesDaily(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Application Tracker Reminders</span>
                <p className="text-slate-500 mt-0.5">Follow-up notifications for interviews and assessment deadlines</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>
          </div>

          {/* Privacy */}
          <div className="space-y-4 pt-4">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" /> Privacy & Recruiter Visibility
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Incognito Candidate Profile</span>
                <p className="text-slate-500 mt-0.5">Hide your name and current employer from company recruiters until you apply</p>
              </div>
              <input
                type="checkbox"
                checked={anonymousProfile}
                onChange={(e) => setAnonymousProfile(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} variant="gradient" className="rounded-xl">
              Save Preferences
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
