'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users2,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { MentorProfile } from '@careerpulse/shared';

export default function MentorshipPage() {
  const [mentors, setMentors] = React.useState<MentorProfile[]>([]);
  const [service, setService] = React.useState('all');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getMentors(service);
        if (res.success) {
          setMentors(res.mentors);
        }
      } catch (err: any) {
        console.warn('Mentors load err:', err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [service]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="default" className="mb-2">1:1 Verified Tech Mentorship</Badge>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Connect With Principal Engineers & Leaders
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Book live mock technical interviews, architecture reviews, and career roadmap sessions.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
            <Link href="/mentorship/my-sessions">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" /> My Booked Sessions
            </Link>
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'All Services', value: 'all' },
            { label: 'Mock Interviews', value: 'mock_interview' },
            { label: 'System Design', value: 'system_design' },
            { label: 'Resume Review', value: 'resume_review' },
            { label: 'Career Guidance', value: 'career_guidance' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setService(item.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                service === item.value
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mentors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : mentors.length === 0 ? (
          <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
            <Users2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-semibold text-base">No mentors found for this filter</h3>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="glow-card border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={mentor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop'}
                      alt={mentor.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                    />
                    <div>
                      <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                        {mentor.fullName}
                      </h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                        {mentor.title}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{mentor.rating}</span>
                        <span className="text-slate-400 font-normal">({mentor.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {mentor.bio}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {mentor.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">1-hr Session</div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      ₹{mentor.sessionPriceInr.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <Button asChild size="sm" variant="gradient" className="rounded-xl text-xs gap-1">
                    <Link href={`/mentorship/${mentor.id}`}>
                      Book Slot <ArrowRight className="w-3.5 h-3.5" />
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
