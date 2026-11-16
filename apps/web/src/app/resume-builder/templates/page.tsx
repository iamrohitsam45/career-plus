'use client';

import * as React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ResumeTemplatesPage() {
  const templates = [
    {
      id: 'modern',
      title: 'Modern Tech Specialist',
      description: 'Clean indigo accents, prominent skills hierarchy, and high-density impact layout. Ideal for frontend, full stack, and mobile developers.',
      score: '96% ATS Score',
    },
    {
      id: 'minimalist',
      title: 'Minimalist Standard ATS',
      description: 'Single-column monochrome design built strictly to exceed screening parsers across Greenhouse, Lever, and Workday.',
      score: '98% ATS Score',
    },
    {
      id: 'executive',
      title: 'Executive Leadership',
      description: 'Tailored for Engineering Managers, Staff Architects, and Directors with emphasis on strategic projects and leadership scope.',
      score: '94% ATS Score',
    },
    {
      id: 'tech',
      title: 'Classic Silicon Valley',
      description: 'Timeless tech format favored by top US and Indian product companies. Straightforward bullet-point focus.',
      score: '97% ATS Score',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Badge variant="default" className="mb-2">Recruiter-Approved Layouts</Badge>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
            ATS-Friendly Resume Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Choose from parsed, compliant templates guaranteed to avoid scanner rendering artifacts or broken column flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="glow-card border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    {tpl.title}
                  </h3>
                  <Badge variant="today" className="text-xs">{tpl.score}</Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {tpl.description}
                </p>

                {/* Mini Visual Preview Mock */}
                <div className="h-32 rounded-xl bg-slate-100 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 space-y-2 opacity-80">
                  <div className="h-3 w-1/3 bg-indigo-500 rounded" />
                  <div className="h-2 w-1/2 bg-slate-300 dark:bg-slate-700 rounded" />
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-2 w-4/5 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button asChild variant="gradient" className="w-full rounded-xl gap-2">
                  <Link href="/resume-builder">Use This Template <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
