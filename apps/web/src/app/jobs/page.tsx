'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  DollarSign,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  X,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Job, formatSalary, WorkMode, JobType, TOP_SKILLS } from '@careerpulse/shared';
import { toast } from 'sonner';

function JobsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const initialLocation = searchParams.get('location') || '';

  const [query, setQuery] = React.useState(initialQuery);
  const [location, setLocation] = React.useState(initialLocation);
  const [isBengaluru, setIsBengaluru] = React.useState(false);
  const [workMode, setWorkMode] = React.useState<WorkMode | ''>('');
  const [jobType, setJobType] = React.useState<JobType | ''>('');
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<'recent' | 'salary' | 'relevance'>('recent');
  const [page, setPage] = React.useState(1);

  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [savedJobIds, setSavedJobIds] = React.useState<Set<string>>(new Set());
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  const fetchJobs = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getJobs({
        query: query || undefined,
        location: location || undefined,
        isBengaluru: isBengaluru || undefined,
        workMode: (workMode as WorkMode) || undefined,
        jobType: (jobType as JobType) || undefined,
        skills: selectedSkills.length ? selectedSkills.join(',') : undefined,
        sortBy,
        page,
        limit: 12,
      });

      if (res.success) {
        setJobs(res.jobs);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (err: any) {
      console.warn('Jobs search warning:', err.message);
    } finally {
      setLoading(false);
    }
  }, [query, location, isBengaluru, workMode, jobType, selectedSkills, sortBy, page]);

  React.useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSaveToggle = async (jobId: string) => {
    try {
      if (savedJobIds.has(jobId)) {
        await api.unsaveJob(jobId);
        const next = new Set(savedJobIds);
        next.delete(jobId);
        setSavedJobIds(next);
        toast.info('Job removed from saved list');
      } else {
        await api.saveJob(jobId);
        const next = new Set(savedJobIds);
        next.add(jobId);
        setSavedJobIds(next);
        toast.success('Job saved to your tracker');
      }
    } catch (err: any) {
      toast.error('Sign in to save jobs');
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setPage(1);
  };

  const isJobPublishedToday = (dateStr: string) => {
    const jobDate = new Date(dateStr);
    const today = new Date();
    return (
      jobDate.getDate() === today.getDate() &&
      jobDate.getMonth() === today.getMonth() &&
      jobDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Search Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
                Find Your Next Tech Opportunity
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {total} verified roles across India, Bengaluru, and remote tech hubs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs">
                <Link href="/jobs/today">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  Today's Jobs
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs">
                <Link href="/jobs/saved">
                  <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
                  Saved ({savedJobIds.size})
                </Link>
              </Button>
            </div>
          </div>

          {/* Search Inputs */}
          <div className="p-2 sm:p-3 rounded-2xl glass-panel shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-2">
            <div className="flex items-center gap-2.5 w-full px-3 py-2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
              <Search className="w-4 h-4 text-indigo-500 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search job title, skill (e.g. Next.js, Python), or company..."
                className="w-full bg-transparent border-0 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-80 px-3 py-2">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setIsBengaluru(false);
                  setPage(1);
                }}
                placeholder="City (Bengaluru, Remote...)"
                className="w-full bg-transparent border-0 text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <Button
              onClick={() => {
                setPage(1);
                fetchJobs();
              }}
              variant="gradient"
              className="w-full md:w-auto shrink-0 rounded-xl"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block space-y-6">
            <Card className="glass-panel border-slate-200 dark:border-slate-800 p-5 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-heading font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-500" /> Filters
                </span>
                {(workMode || jobType || isBengaluru || selectedSkills.length > 0) && (
                  <button
                    onClick={() => {
                      setWorkMode('');
                      setJobType('');
                      setIsBengaluru(false);
                      setSelectedSkills([]);
                      setPage(1);
                    }}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* Bengaluru Quick Focus */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Hub Focus
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsBengaluru(!isBengaluru);
                    if (!isBengaluru) setLocation('Bengaluru');
                    setPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    isBengaluru
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  🚀 Bengaluru Tech Corridors
                </button>
              </div>

              {/* Work Mode Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Work Mode
                </label>
                <div className="space-y-1.5">
                  {[
                    { label: 'All Modes', value: '' },
                    { label: 'Remote', value: 'remote' },
                    { label: 'Hybrid', value: 'hybrid' },
                    { label: 'On-site', value: 'on-site' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setWorkMode(item.value as WorkMode);
                        setPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        workMode === item.value
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Job Type
                </label>
                <div className="space-y-1.5">
                  {[
                    { label: 'All Types', value: '' },
                    { label: 'Full-time', value: 'full-time' },
                    { label: 'Contract', value: 'contract' },
                    { label: 'Internship', value: 'internship' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setJobType(item.value as JobType);
                        setPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        jobType === item.value
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills Multi-select */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Popular Tech Skills
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TOP_SKILLS.slice(0, 10).map((skill) => {
                    const active = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                          active
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Jobs Listing Column */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sorting Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500">
              <span>Showing Page {page} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="recent">Most Recent</option>
                  <option value="salary">Highest Salary</option>
                  <option value="relevance">Relevance</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse p-6 h-40 border-slate-200 dark:border-slate-800" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  No matching jobs found
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search keywords, clearing location filters, or resetting skills.
                </p>
                <Button
                  onClick={() => {
                    setQuery('');
                    setLocation('');
                    setIsBengaluru(false);
                    setWorkMode('');
                    setSelectedSkills([]);
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-xl"
                >
                  Clear All Filters
                </Button>
              </Card>
            ) : (
              jobs.map((job) => {
                const isToday = isJobPublishedToday(job.publishedDate);
                const isSaved = savedJobIds.has(job.id);
                const formattedSalary = formatSalary(
                  job.salaryMin,
                  job.salaryMax,
                  job.salaryCurrency,
                  job.salaryInterval
                );

                return (
                  <Card
                    key={job.id}
                    className="glow-card border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all p-5 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={job.companyLogo || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=96&h=96&fit=crop'}
                          alt={job.company}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/jobs/${job.id}`}
                              className="font-heading font-semibold text-base sm:text-lg text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              {job.title}
                            </Link>
                            {isToday && (
                              <Badge variant="today" className="text-[10px]">
                                TODAY
                              </Badge>
                            )}
                            {job.isNative && (
                              <Badge variant="ai" className="text-[10px]">
                                DIRECT APPLY
                              </Badge>
                            )}
                          </div>

                          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {job.company}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {job.location}
                            </span>
                            <span>•</span>
                            <span className="capitalize">{job.workMode}</span>
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => handleSaveToggle(job.id)}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors"
                        title={isSaved ? 'Unsave' : 'Save Job'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Salary & Skills */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                      <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {formattedSalary}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {job.requiredSkills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.requiredSkills.length > 4 && (
                          <span className="text-[10px] text-slate-400">
                            +{job.requiredSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 flex items-center justify-between pt-2">
                      <span className="text-[11px] text-slate-400">
                        Source: {job.sourceAttribution}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button asChild size="sm" variant="ghost" className="rounded-xl text-xs">
                          <Link href={`/jobs/${job.id}`}>View Details</Link>
                        </Button>
                        <Button asChild size="sm" variant="gradient" className="rounded-xl text-xs">
                          <Link href={`/jobs/${job.id}`}>Apply</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-6 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-xl text-xs"
                >
                  Previous
                </Button>
                <span className="text-xs text-slate-500 font-medium px-2">
                  {page} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-xl text-xs"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <React.Suspense fallback={<div className="max-w-7xl mx-auto py-20 text-center text-xs text-slate-500">Loading Job Discovery...</div>}>
      <JobsContent />
    </React.Suspense>
  );
}
