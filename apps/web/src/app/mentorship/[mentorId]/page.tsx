'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Users2,
  Calendar,
  Clock,
  Star,
  ShieldCheck,
  Video,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { MentorProfile } from '@careerpulse/shared';
import { toast } from 'sonner';

export default function MentorBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mentorId = Array.isArray(params.mentorId) ? params.mentorId[0] : (params.mentorId as string);

  const [mentor, setMentor] = React.useState<MentorProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedService, setSelectedService] = React.useState<'mock_interview' | 'system_design' | 'resume_review' | 'career_guidance'>('mock_interview');
  const [selectedDate, setSelectedDate] = React.useState('2026-11-20');
  const [selectedSlot, setSelectedSlot] = React.useState('14:00 - 15:00');
  const [notes, setNotes] = React.useState('');
  const [booking, setBooking] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getMentorById(mentorId);
        if (res.success && res.mentor) {
          setMentor(res.mentor);
        }
      } catch (err: any) {
        toast.error('Failed to load mentor details');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [mentorId]);

  const handleBook = async () => {
    if (!mentor) return;
    setBooking(true);
    try {
      const res = await api.bookMentorSession({
        mentorId: mentor.id,
        serviceType: selectedService,
        bookingDate: selectedDate,
        slotTime: selectedSlot,
        notes,
      });

      if (res.success) {
        toast.success('Mentorship session confirmed! Meeting room generated.');
        router.push('/mentorship/my-sessions');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to book slot');
    } finally {
      setBooking(false);
    }
  };

  const availableSlots = [
    '10:00 - 11:00 AM',
    '14:00 - 15:00 PM',
    '16:30 - 17:30 PM',
    '19:00 - 20:00 PM',
  ];

  if (loading || !mentor) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center animate-pulse">
        <p className="text-sm text-slate-500">Loading mentor profile & calendar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="rounded-xl gap-1 text-xs">
            <Link href="/mentorship"><ArrowLeft className="w-4 h-4" /> Back to Mentors</Link>
          </Button>
        </div>

        {/* Mentor Header Profile */}
        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <img
              src={mentor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop'}
              alt={mentor.fullName}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
                  {mentor.fullName}
                </h1>
                <Badge variant="success" className="text-[10px]">VERIFIED MENTOR</Badge>
              </div>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                {mentor.title}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{mentor.rating}</span>
                <span className="text-slate-400 font-normal">({mentor.reviewsCount} verified reviews)</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {mentor.bio}
          </p>
        </Card>

        {/* Booking Card */}
        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" /> Reserve Your 1:1 Session
          </h2>

          {/* 1. Service Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Session Focus
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'mock_interview', label: 'Mock Interview' },
                { id: 'system_design', label: 'System Design' },
                { id: 'resume_review', label: 'Resume Teardown' },
                { id: 'career_guidance', label: 'Career Strategy' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedService(s.id as any)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedService === s.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Date & Available Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Session Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Available Time Slots (IST)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedSlot === slot
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Topics or Target Companies for this session (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Preparing for Razorpay SDE II system design round. Want feedback on idempotency and Kafka architecture..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-xs focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] text-slate-400">Total Investment</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                ₹{mentor.sessionPriceInr.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">/ 60 mins</span>
              </div>
            </div>

            <Button
              onClick={handleBook}
              disabled={booking}
              variant="gradient"
              className="rounded-xl gap-2 font-semibold shadow-lg shadow-indigo-500/20"
            >
              <Video className="w-4 h-4" />
              {booking ? 'Reserving...' : 'Confirm & Generate Meeting Room'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
