'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Building2,
  MapPin,
  Globe,
  Star,
  Users,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  PlusCircle,
  MessageSquare,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { Company, CompanyReview, Job, formatSalary } from '@careerpulse/shared';
import { toast } from 'sonner';

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string);

  const [company, setCompany] = React.useState<(Company & { openJobs: Job[] }) | null>(null);
  const [reviews, setReviews] = React.useState<CompanyReview[]>([]);
  const [interviews, setInterviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showReviewModal, setShowReviewModal] = React.useState(false);

  // Review Form State
  const [jobTitle, setJobTitle] = React.useState('Software Engineer');
  const [overallRating, setOverallRating] = React.useState(5);
  const [workLifeRating, setWorkLifeRating] = React.useState(4);
  const [cultureRating, setCultureRating] = React.useState(5);
  const [compensationRating, setCompensationRating] = React.useState(5);
  const [careerGrowthRating, setCareerGrowthRating] = React.useState(5);
  const [reviewTitle, setReviewTitle] = React.useState('');
  const [pros, setPros] = React.useState('');
  const [cons, setCons] = React.useState('');
  const [submittingReview, setSubmittingReview] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [compRes, revRes, intRes] = await Promise.all([
          api.getCompanyBySlug(slug),
          api.getCompanyReviews(slug),
          api.getInterviewExperiences(slug),
        ]);

        if (compRes.success && compRes.company) {
          setCompany(compRes.company);
        }
        if (revRes.success) {
          setReviews(revRes.reviews);
        }
        if (intRes.success) {
          setInterviews(intRes.interviews);
        }
      } catch (err: any) {
        toast.error('Failed to load company insights');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const payload = {
        companySlug: slug,
        jobTitle,
        employmentStatus: 'current' as const,
        yearsAtCompany: 2,
        overallRating: Number(overallRating),
        workLifeRating: Number(workLifeRating),
        cultureRating: Number(cultureRating),
        compensationRating: Number(compensationRating),
        careerGrowthRating: Number(careerGrowthRating),
        reviewTitle,
        pros,
        cons,
        recommendToFriend: true,
        isAnonymous: true,
      };

      const res = await api.submitCompanyReview(slug, payload);
      if (res.success) {
        toast.success('Review submitted successfully!');
        setReviews([res.review, ...reviews]);
        setShowReviewModal(false);
        setReviewTitle('');
        setPros('');
        setCons('');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <h2 className="text-xl font-bold">Company Not Found</h2>
        <Button asChild variant="outline" className="mt-4 rounded-xl">
          <Link href="/companies">Return to Directory</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Company Header Banner */}
        <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <img
                src={company.logo || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=96&h=96&fit=crop'}
                alt={company.name}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
                    {company.name}
                  </h1>
                  <Badge variant="success" className="text-[11px] gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Profile
                  </Badge>
                </div>

                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{company.industry}</span>
                  <span>•</span>
                  <span>{company.headquarters}</span>
                  <span>•</span>
                  <span>{company.size}</span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{company.rating}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    ({company.reviewCount} community reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
              <Button onClick={() => setShowReviewModal(true)} variant="gradient" className="rounded-xl text-xs gap-1.5">
                <PlusCircle className="w-4 h-4" /> Write a Review
              </Button>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" /> Official Careers Site
                </a>
              )}
            </div>
          </div>
        </Card>

        {/* Multi-Tab Sections */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="interviews">Interviews ({interviews.length})</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({company.openJobs?.length || 0})</TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="glass-panel border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
                  About {company.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {company.overview}
                </p>
              </div>

              {/* Sub-Ratings */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-heading font-semibold text-sm text-slate-900 dark:text-white mb-4">
                  Employee Rating Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 text-center">
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {company.workLifeRating} / 5
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Work-Life Balance</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 text-center">
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {company.cultureRating} / 5
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Company Culture</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 text-center">
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {company.compensationRating} / 5
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Compensation</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 text-center">
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {company.careerGrowthRating} / 5
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Career Growth</div>
                  </div>
                </div>
              </div>

              {/* Verified Perks */}
              {company.benefits && company.benefits.length > 0 && (
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="font-heading font-semibold text-sm text-slate-900 dark:text-white mb-3">
                    Perks & Benefits Reported by Employees
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {company.benefits.map((b, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-medium flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* TAB 2: REVIEWS */}
          <TabsContent value="reviews" className="space-y-4">
            {reviews.length === 0 ? (
              <Card className="p-8 text-center border-slate-200 dark:border-slate-800">
                <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">No reviews yet for {company.name}</p>
                <Button onClick={() => setShowReviewModal(true)} variant="gradient" size="sm" className="mt-3 rounded-xl">
                  Be the first to review
                </Button>
              </Card>
            ) : (
              reviews.map((rev) => (
                <Card key={rev.id} className="glass-panel border-slate-200 dark:border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                        {rev.reviewTitle}
                      </h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {rev.jobTitle} • {rev.employmentStatus === 'current' ? 'Current Employee' : 'Former Employee'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{rev.overallRating}.0</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs leading-relaxed">
                    <div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Pros:</span>{' '}
                      <span className="text-slate-600 dark:text-slate-300">{rev.pros}</span>
                    </div>
                    <div>
                      <span className="font-bold text-red-500">Cons:</span>{' '}
                      <span className="text-slate-600 dark:text-slate-300">{rev.cons}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* TAB 3: INTERVIEWS */}
          <TabsContent value="interviews" className="space-y-4">
            {interviews.length === 0 ? (
              <Card className="p-8 text-center border-slate-200 dark:border-slate-800">
                <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">No interview reports shared yet</p>
              </Card>
            ) : (
              interviews.map((item, idx) => (
                <Card key={idx} className="glass-panel border-slate-200 dark:border-slate-800 p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                      {item.jobTitle}
                    </h4>
                    <Badge variant={item.difficulty === 'hard' ? 'destructive' : 'default'} className="uppercase text-[10px]">
                      {item.difficulty} Difficulty
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.processSummary}
                  </p>

                  {item.questions && item.questions.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Sample Questions Asked:
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        {item.questions.map((q: string, qIdx: number) => (
                          <li key={qIdx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))
            )}
          </TabsContent>

          {/* TAB 4: OPEN JOBS */}
          <TabsContent value="jobs" className="space-y-4">
            {(!company.openJobs || company.openJobs.length === 0) ? (
              <Card className="p-8 text-center border-slate-200 dark:border-slate-800">
                <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">No active openings listed right now</p>
              </Card>
            ) : (
              company.openJobs.map((job) => (
                <Card key={job.id} className="glow-card border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between">
                  <div>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="font-semibold text-base text-slate-900 dark:text-white hover:text-indigo-600"
                    >
                      {job.title}
                    </Link>
                    <div className="text-xs text-slate-500 mt-1">
                      {job.location} • <span className="capitalize">{job.workMode}</span> •{' '}
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryInterval)}
                      </span>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="gradient" className="rounded-xl">
                    <Link href={`/jobs/${job.id}`}>Apply</Link>
                  </Button>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Modal: Add Review */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
            <Card className="max-w-xl w-full border-slate-200 dark:border-slate-800 p-6 sm:p-8 bg-white dark:bg-[#0F172A] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Submit Anonymous Review for {company.name}
                </h3>
                <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Your Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Overall Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={overallRating}
                      onChange={(e) => setOverallRating(parseInt(e.target.value, 10))}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Work-Life Balance (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={workLifeRating}
                      onChange={(e) => setWorkLifeRating(parseInt(e.target.value, 10))}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Review Headline *</label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Collaborative culture with huge technical scale"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Pros (min 15 chars) *</label>
                  <textarea
                    required
                    rows={2}
                    value={pros}
                    onChange={(e) => setPros(e.target.value)}
                    placeholder="What are the best parts of working here?"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Cons (min 15 chars) *</label>
                  <textarea
                    required
                    rows={2}
                    value={cons}
                    onChange={(e) => setCons(e.target.value)}
                    placeholder="What could be improved?"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setShowReviewModal(false)} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submittingReview} variant="gradient" className="rounded-xl">
                    {submittingReview ? 'Submitting...' : 'Post Anonymous Review'}
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
