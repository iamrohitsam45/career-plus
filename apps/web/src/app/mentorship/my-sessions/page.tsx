'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Video,
  Clock,
  CheckCircle2,
  ExternalLink,
  Users2,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { MentorBooking } from '@careerpulse/shared';

export default function MyMentorshipSessionsPage() {
  const [sessions, setSessions] = React.useState<MentorBooking[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getMyMentorSessions();
        if (res.success) {
          setSessions(res.sessions || []);
        }
      } catch (err: any) {
        console.warn('My sessions error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="default" className="mb-2">My Appointments</Badge>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-500" /> Booked Mentorship Sessions
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Join your video meeting rooms and review preparation notes.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs gap-1">
            <Link href="/mentorship"><ArrowLeft className="w-4 h-4" /> Book New Session</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse p-6 h-32 border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
            <Users2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-semibold text-base">No active mentorship bookings</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Schedule a 1:1 session with Google, Microsoft, and Razorpay engineering mentors.
            </p>
            <Button asChild variant="gradient" size="sm" className="mt-4 rounded-xl">
              <Link href="/mentorship">Find a Mentor</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((s) => (
              <Card
                key={s.id}
                className="glass-panel border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                      {s.mentorName}
                    </h3>
                    <Badge variant="success" className="text-[10px] uppercase">
                      {s.status}
                    </Badge>
                  </div>

                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold capitalize mt-0.5">
                    Focus: {s.serviceType.replace(/_/g, ' ')}
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(s.bookingDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {s.slotTime}
                    </span>
                  </div>

                  {s.notes && (
                    <p className="text-xs text-slate-400 mt-2 italic bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                      "{s.notes}"
                    </p>
                  )}
                </div>

                <div className="shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <Button asChild variant="gradient" size="sm" className="rounded-xl gap-2 font-semibold">
                    <a href={s.meetingUrl} target="_blank" rel="noopener noreferrer">
                      <Video className="w-4 h-4" /> Join Video Meeting
                    </a>
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
