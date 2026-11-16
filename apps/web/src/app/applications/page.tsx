'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Kanban,
  PlusCircle,
  Clock,
  Calendar,
  Building2,
  Trash2,
  MoreVertical,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { JobApplication, ApplicationStatus, APPLICATION_STATUSES } from '@careerpulse/shared';
import { toast } from 'sonner';

export default function ApplicationTrackerPage() {
  const [applications, setApplications] = React.useState<JobApplication[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedApp, setSelectedApp] = React.useState<JobApplication | null>(null);
  const [editingNotes, setEditingNotes] = React.useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.getApplications();
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err: any) {
      console.warn('Apps fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      await api.updateApplication(appId, { status: newStatus });
      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
      toast.success(`Application updated to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error('Failed to update application status');
    }
  };

  const handleDelete = async (appId: string) => {
    try {
      await api.deleteApplication(appId);
      setApplications(applications.filter((a) => a.id !== appId));
      toast.info('Application removed from tracker');
    } catch (err: any) {
      toast.error('Error removing application');
    }
  };

  // Pipeline Metrics
  const total = applications.length;
  const inInterview = applications.filter((a) => a.status === 'interview').length;
  const offers = applications.filter((a) => a.status === 'offer').length;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="default" className="mb-1 text-[10px]">CAREER PIPELINE</Badge>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Kanban className="w-6 h-6 text-indigo-500" /> Kanban Application Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Organize and track your active interview stages and offers across tech employers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="gradient" size="sm" className="rounded-xl text-xs gap-1.5">
              <Link href="/jobs">
                <PlusCircle className="w-3.5 h-3.5" /> Find More Jobs
              </Link>
            </Button>
          </div>
        </div>

        {/* Pipeline Metrics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-4">
            <div className="text-xs text-slate-500 font-medium">Total Tracked</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{total}</div>
          </Card>
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-4">
            <div className="text-xs text-slate-500 font-medium">In Interview</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{inInterview}</div>
          </Card>
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-4">
            <div className="text-xs text-slate-500 font-medium">Offers Received</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{offers}</div>
          </Card>
          <Card className="glass-panel border-slate-200 dark:border-slate-800 p-4">
            <div className="text-xs text-slate-500 font-medium">Conversion Rate</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {total > 0 ? `${Math.round((offers / total) * 100)}%` : '0%'}
            </div>
          </Card>
        </div>

        {/* Kanban Board Horizontal Scroll */}
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-[1200px]">
            {APPLICATION_STATUSES.map((columnStatus) => {
              const colApps = applications.filter((a) => a.status === columnStatus);
              return (
                <div
                  key={columnStatus}
                  className="w-72 shrink-0 rounded-2xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-3.5 flex flex-col"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {columnStatus}
                    </span>
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-bold">
                      {colApps.length}
                    </Badge>
                  </div>

                  {/* Column Cards */}
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[65vh]">
                    {colApps.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400">
                        No applications in {columnStatus}
                      </div>
                    ) : (
                      colApps.map((app) => {
                        const job = app.job;
                        return (
                          <Card
                            key={app.id}
                            className="p-3.5 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all shadow-xs space-y-2 bg-white dark:bg-slate-900/90"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                                {job?.title || 'Software Opportunity'}
                              </h4>
                              <button
                                onClick={() => handleDelete(app.id)}
                                className="text-slate-400 hover:text-red-500 p-0.5"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-[11px] text-slate-500">
                              {job?.company || 'Company'} • {job?.location || 'Bengaluru'}
                            </div>

                            {app.notes && (
                              <p className="text-[10px] text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-lg italic">
                                "{app.notes}"
                              </p>
                            )}

                            {/* Move Status Selector */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                              <span className="text-slate-400">Move to:</span>
                              <select
                                value={app.status}
                                onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                                className="bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 focus:outline-none"
                              >
                                {APPLICATION_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
