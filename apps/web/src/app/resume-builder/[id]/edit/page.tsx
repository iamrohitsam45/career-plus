'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  Printer,
  Save,
  ArrowLeft,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Wand2,
  ShieldCheck,
  FileDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { Resume, ResumeData } from '@careerpulse/shared';
import { toast } from 'sonner';

export default function ResumeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [resume, setResume] = React.useState<Resume | null>(null);
  const [data, setData] = React.useState<ResumeData | null>(null);
  const [title, setTitle] = React.useState('');
  const [templateId, setTemplateId] = React.useState<'modern' | 'minimalist' | 'executive' | 'tech'>('modern');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  // AI helper states
  const [optimizingBulletIdx, setOptimizingBulletIdx] = React.useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getResumeById(id);
        if (res.success && res.resume) {
          setResume(res.resume);
          setData(res.resume.data);
          setTitle(res.resume.title);
          setTemplateId(res.resume.templateId);
        }
      } catch (err: any) {
        toast.error('Failed to load resume');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await api.updateResume(id, {
        title,
        templateId,
        data,
      });
      toast.success('Resume saved successfully!');
    } catch (err: any) {
      toast.error('Error saving resume');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // AI: Optimize single bullet point with XYZ formula
  const handleOptimizeBullet = async (expIdx: number, bulletIdx: number) => {
    if (!data) return;
    const bullet = data.experience[expIdx].highlights[bulletIdx];
    const key = `${expIdx}_${bulletIdx}`;
    setOptimizingBulletIdx(key);

    try {
      const res = await api.optimizeBullet(bullet, data.experience[expIdx].position);
      if (res.success && res.result) {
        const nextExp = [...data.experience];
        nextExp[expIdx].highlights[bulletIdx] = res.result.improved;
        setData({ ...data, experience: nextExp });
        toast.success('Bullet rewritten with XYZ formula!');
      }
    } catch (err: any) {
      toast.error('AI optimization failed');
    } finally {
      setOptimizingBulletIdx(null);
    }
  };

  // AI: Generate summary
  const handleGenerateSummary = async () => {
    if (!data) return;
    setGeneratingSummary(true);
    try {
      const res = await api.generateSummary(
        data.personalInfo.title,
        data.skills,
        data.experience.length * 2
      );
      if (res.success && res.summary) {
        setData({
          ...data,
          personalInfo: { ...data.personalInfo, summary: res.summary },
        });
        toast.success('Professional summary generated!');
      }
    } catch (err: any) {
      toast.error('Failed to generate summary');
    } finally {
      setGeneratingSummary(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center animate-pulse">
        <p className="text-sm text-slate-500">Loading Resume Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-[#080B13] py-6">
      {/* Top Action Bar (no-print) */}
      <div className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="rounded-xl gap-1">
            <Link href="/resume-builder"><ArrowLeft className="w-4 h-4" /> Resumes</Link>
          </Button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-heading font-bold bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 px-2 py-0.5 focus:outline-none text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Template Switcher */}
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value as any)}
            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
          >
            <option value="modern">Modern Tech Template</option>
            <option value="minimalist">Minimalist ATS Template</option>
            <option value="executive">Executive Leadership Template</option>
            <option value="tech">Classic Silicon Valley Template</option>
          </select>

          <Button onClick={handleSave} disabled={saving} variant="outline" size="sm" className="rounded-xl gap-1 text-xs">
            <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}
          </Button>

          <Button onClick={handlePrint} variant="gradient" size="sm" className="rounded-xl gap-1.5 text-xs">
            <Printer className="w-3.5 h-3.5" /> Export PDF / Print
          </Button>
        </div>
      </div>

      {/* Main Studio: 2 Columns (Editor vs Live Preview) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Input Form Tabs (no-print) */}
        <div className="no-print lg:col-span-5 space-y-4">
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid grid-cols-4 w-full text-xs">
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            {/* TAB 1: Contact Details */}
            <TabsContent value="contact" className="space-y-3">
              <Card className="p-4 border-slate-200 dark:border-slate-800 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={data.personalInfo.fullName}
                    onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, fullName: e.target.value } })}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Target Title</label>
                  <input
                    type="text"
                    value={data.personalInfo.title}
                    onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, title: e.target.value } })}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={data.personalInfo.email}
                      onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, email: e.target.value } })}
                      className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Phone</label>
                    <input
                      type="text"
                      value={data.personalInfo.phone}
                      onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, phone: e.target.value } })}
                      className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={data.personalInfo.location}
                    onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, location: e.target.value } })}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent"
                  />
                </div>
              </Card>
            </TabsContent>

            {/* TAB 2: Summary */}
            <TabsContent value="summary" className="space-y-3">
              <Card className="p-4 border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Professional Summary</span>
                  <Button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={generatingSummary}
                    size="sm"
                    variant="gradient"
                    className="rounded-lg h-7 text-[11px] gap-1"
                  >
                    <Wand2 className="w-3 h-3" />
                    {generatingSummary ? 'Drafting...' : 'AI Generate'}
                  </Button>
                </div>
                <textarea
                  rows={6}
                  value={data.personalInfo.summary}
                  onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, summary: e.target.value } })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent leading-relaxed"
                />
              </Card>
            </TabsContent>

            {/* TAB 3: Experience */}
            <TabsContent value="experience" className="space-y-3 max-h-[70vh] overflow-y-auto">
              {data.experience.map((exp, expIdx) => (
                <Card key={exp.id || expIdx} className="p-4 border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const next = [...data.experience];
                          next[expIdx].company = e.target.value;
                          setData({ ...data, experience: next });
                        }}
                        className="w-full h-8 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block">Role</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => {
                          const next = [...data.experience];
                          next[expIdx].position = e.target.value;
                          setData({ ...data, experience: next });
                        }}
                        className="w-full h-8 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block mb-1">
                      Key Accomplishments (Click ✨ to apply Google XYZ Formula)
                    </label>
                    <div className="space-y-2">
                      {exp.highlights.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex gap-2 items-start">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => {
                              const next = [...data.experience];
                              next[expIdx].highlights[bulletIdx] = e.target.value;
                              setData({ ...data, experience: next });
                            }}
                            className="flex-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            title="Rewrite with XYZ Formula"
                            disabled={optimizingBulletIdx === `${expIdx}_${bulletIdx}`}
                            onClick={() => handleOptimizeBullet(expIdx, bulletIdx)}
                            className="h-8 w-8 p-0 rounded-lg shrink-0 text-indigo-500 hover:text-indigo-600"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* TAB 4: Skills */}
            <TabsContent value="skills" className="space-y-3">
              <Card className="p-4 border-slate-200 dark:border-slate-800 space-y-3">
                <label className="text-xs font-semibold block">Technical Skills (Comma Separated)</label>
                <textarea
                  rows={4}
                  value={data.skills.join(', ')}
                  onChange={(e) => {
                    const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    setData({ ...data, skills: list });
                  }}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent"
                />
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT COLUMN: Live A4 Printable Preview */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="resume-sheet w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 sm:p-10 shadow-2xl rounded-sm font-sans border border-slate-200/60 print:border-none print:shadow-none print:p-0">
            {/* Header */}
            <div className={`border-b pb-4 mb-4 ${templateId === 'minimalist' ? 'border-slate-400' : 'border-indigo-600'}`}>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
                {data.personalInfo.fullName}
              </h1>
              <div className="text-sm font-semibold text-indigo-700 mt-0.5">
                {data.personalInfo.title}
              </div>
              <div className="text-[11px] text-slate-600 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                <span>{data.personalInfo.email}</span>
                <span>•</span>
                <span>{data.personalInfo.phone}</span>
                <span>•</span>
                <span>{data.personalInfo.location}</span>
              </div>
            </div>

            {/* Summary */}
            {data.personalInfo.summary && (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 border-b border-slate-200 pb-0.5">
                  Professional Summary
                </h3>
                <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                  {data.personalInfo.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 border-b border-slate-200 pb-0.5">
                  Technical Proficiencies
                </h3>
                <p className="text-[11px] text-slate-700">
                  <span className="font-semibold">Core Technologies:</span> {data.skills.join(', ')}
                </p>
              </div>
            )}

            {/* Experience */}
            <div className="mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-200 pb-0.5">
                Professional Experience
              </h3>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-slate-900">{exp.position}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{exp.startDate} - {exp.endDate || 'Present'}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-indigo-700">
                      {exp.company} {exp.location && `— ${exp.location}`}
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700 mt-1 pl-1">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="leading-relaxed">{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 border-b border-slate-200 pb-0.5">
                  Education & Academic Credentials
                </h3>
                {data.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-baseline text-[11px] text-slate-700">
                    <div>
                      <span className="font-bold">{edu.degree} in {edu.fieldOfStudy}</span> • {edu.institution}
                    </div>
                    <span className="text-[10px] text-slate-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
