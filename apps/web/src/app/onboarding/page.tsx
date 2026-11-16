'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import {
  TOP_SKILLS,
  POPULAR_ROLES,
  BENGALURU_AREAS,
  TECH_HUBS_INDIA,
  WorkMode,
} from '@careerpulse/shared';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  // Form State
  const [fullName, setFullName] = React.useState('Kavya Sharma');
  const [headline, setHeadline] = React.useState('Senior Full Stack Engineer | Next.js & Cloud');
  const [experienceYears, setExperienceYears] = React.useState<number>(4);
  const [currentTitle, setCurrentTitle] = React.useState('Senior Software Engineer');
  const [skills, setSkills] = React.useState<string[]>(['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB']);
  const [customSkill, setCustomSkill] = React.useState('');
  const [preferredRoles, setPreferredRoles] = React.useState<string[]>(['Full Stack Engineer', 'Frontend Developer']);
  const [preferredLocations, setPreferredLocations] = React.useState<string[]>([
    'Bengaluru, Karnataka',
    'Remote',
  ]);
  const [currentSalaryLpa, setCurrentSalaryLpa] = React.useState<number>(18);
  const [expectedSalaryLpa, setExpectedSalaryLpa] = React.useState<number>(28);
  const [noticePeriodDays, setNoticePeriodDays] = React.useState<number>(30);
  const [workModes, setWorkModes] = React.useState<WorkMode[]>(['hybrid', 'remote']);
  const [careerGoals, setCareerGoals] = React.useState(
    'Looking to join a tier-1 product engineering company in Bengaluru or remote-first US firm building high-scale distributed systems.'
  );

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const toggleRole = (role: string) => {
    if (preferredRoles.includes(role)) {
      setPreferredRoles(preferredRoles.filter((r) => r !== role));
    } else {
      setPreferredRoles([...preferredRoles, role]);
    }
  };

  const toggleLocation = (loc: string) => {
    if (preferredLocations.includes(loc)) {
      setPreferredLocations(preferredLocations.filter((l) => l !== loc));
    } else {
      setPreferredLocations([...preferredLocations, loc]);
    }
  };

  const toggleWorkMode = (mode: WorkMode) => {
    if (workModes.includes(mode)) {
      if (workModes.length > 1) setWorkModes(workModes.filter((m) => m !== mode));
    } else {
      setWorkModes([...workModes, mode]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        fullName,
        headline,
        experienceYears: Number(experienceYears),
        currentTitle,
        technicalSkills: skills,
        preferredRoles,
        preferredLocations,
        currentSalary: currentSalaryLpa * 100000,
        expectedSalary: expectedSalaryLpa * 100000,
        salaryCurrency: 'INR',
        noticePeriodDays: Number(noticePeriodDays),
        workModes,
        careerGoals,
        resumeUrl: 'https://careerpulse.ai/resumes/sample-candidate.pdf',
        resumeFileName: `${fullName.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`,
      };

      await api.submitOnboarding(payload).catch((err) => {
        console.warn('API onboarding call:', err.message);
      });

      toast.success('Onboarding complete! Welcome to CareerPulse AI');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Error completing onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-[#0B0F19]">
      <div className="max-w-2xl mx-auto">
        {/* Progress header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Profile Calibration • Step {step} of 3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
            Tell Us About Your Experience
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            CareerPulse will calibrate tailored recommendations, ATS matching scores, and salary benchmarks.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-10 bg-indigo-600' : s < step ? 'w-6 bg-indigo-400' : 'w-6 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="glass-panel border-slate-200 dark:border-slate-800 shadow-xl">
          <CardContent className="p-6 sm:p-8">
            {/* STEP 1: Basic Identity & Role */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kavya Sharma"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Professional Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Full Stack Engineer | Next.js & Cloud"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Current Job Title
                    </label>
                    <input
                      type="text"
                      value={currentTitle}
                      onChange={(e) => setCurrentTitle(e.target.value)}
                      placeholder="e.g. Software Engineer"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Years of Experience: <span className="text-indigo-600 font-bold">{experienceYears} yrs</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer mt-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Preferred Roles (Select at least one)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_ROLES.slice(0, 8).map((role) => {
                      const selected = preferredRoles.includes(role);
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => toggleRole(role)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            selected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="gradient"
                    onClick={() => setStep(2)}
                    className="rounded-xl gap-2 font-semibold"
                  >
                    Continue to Skills <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Technical Skills */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Your Technical Skills ({skills.length} selected)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-3">
                    These are matched directly with job descriptions for ATS analysis.
                  </p>

                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                    {TOP_SKILLS.map((skill) => {
                      const isSelected = skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Add Custom Skill
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="e.g. LangChain, Terraform, Redis"
                      className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button type="button" variant="outline" onClick={addCustomSkill} className="rounded-xl">
                      Add
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Work Mode Preferences
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['remote', 'hybrid', 'on-site'] as WorkMode[]).map((mode) => {
                      const active = workModes.includes(mode);
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => toggleWorkMode(mode)}
                          className={`p-3 rounded-xl border text-center text-xs font-semibold capitalize transition-all ${
                            active
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                              : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-600'
                          }`}
                        >
                          {mode}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)} className="rounded-xl gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button type="button" variant="gradient" onClick={() => setStep(3)} className="rounded-xl gap-2 font-semibold">
                    Next: Compensation <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Compensation, Location & Goals */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Current Salary (INR LPA)
                    </label>
                    <input
                      type="number"
                      value={currentSalaryLpa}
                      onChange={(e) => setCurrentSalaryLpa(parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 18"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Optional / Kept confidential</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Expected Salary (INR LPA)
                    </label>
                    <input
                      type="number"
                      value={expectedSalaryLpa}
                      onChange={(e) => setExpectedSalaryLpa(parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 28"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Notice Period (Days)
                    </label>
                    <select
                      value={noticePeriodDays}
                      onChange={(e) => setNoticePeriodDays(parseInt(e.target.value, 10))}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={0}>Immediate Joiner (0 days)</option>
                      <option value={15}>15 Days</option>
                      <option value={30}>30 Days (Standard)</option>
                      <option value={60}>60 Days</option>
                      <option value={90}>90 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Preferred Locations
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Bengaluru, Karnataka', 'Hyderabad, Telangana', 'Remote'].map((loc) => {
                        const active = preferredLocations.includes(loc);
                        return (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => toggleLocation(loc)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                              active
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {loc}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Career Goals & Target Role
                  </label>
                  <textarea
                    rows={3}
                    value={careerGoals}
                    onChange={(e) => setCareerGoals(e.target.value)}
                    placeholder="Describe your ideal role, target companies, or technology transitions..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)} className="rounded-xl gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button
                    type="button"
                    variant="gradient"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="rounded-xl gap-2 font-semibold shadow-lg shadow-indigo-500/20"
                  >
                    {loading ? 'Calibrating...' : 'Complete Profile'} <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
