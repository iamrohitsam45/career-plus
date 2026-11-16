import {
  Job,
  JobQueryInput,
  Company,
  CompanyReview,
  Resume,
  JobApplication,
  MentorProfile,
  MentorBooking,
  AIJobMatchResult,
} from '@careerpulse/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cp_auth_token');
      if (stored) return stored;
    }
    return 'dev_candidate_token'; // default dev token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `API request failed with status ${res.status}`);
      }

      return res.json();
    } catch (err: any) {
      console.warn(`[ApiClient] Request to ${endpoint} failed: ${err.message}.`);
      throw err;
    }
  }

  // Jobs
  async getJobs(params: Partial<JobQueryInput> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') query.append(k, String(v));
    });
    return this.request<{ success: boolean; jobs: Job[]; total: number; totalPages: number }>(
      `/jobs?${query.toString()}`
    );
  }

  async getTodaysJobs(page = 1, limit = 15) {
    return this.request<{ success: boolean; jobs: Job[]; total: number; totalPages: number }>(
      `/jobs/today?page=${page}&limit=${limit}`
    );
  }

  async getJobById(id: string) {
    return this.request<{ success: boolean; job: Job }>(`/jobs/${id}`);
  }

  async getRecommendedJobs() {
    return this.request<{ success: boolean; jobs: Job[] }>('/jobs/recommended');
  }

  async getSavedJobs() {
    return this.request<{ success: boolean; saved: any[] }>('/jobs/saved');
  }

  async saveJob(id: string, notes?: string) {
    return this.request<{ success: boolean }>(`/jobs/${id}/save`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async unsaveJob(id: string) {
    return this.request<{ success: boolean }>(`/jobs/${id}/save`, {
      method: 'DELETE',
    });
  }

  async createJob(data: any) {
    return this.request<{ success: boolean; job: Job }>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Companies
  async getCompanies(search?: string, industry?: string) {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (industry) query.append('industry', industry);
    return this.request<{ success: boolean; companies: Company[] }>(`/companies?${query.toString()}`);
  }

  async getCompanyBySlug(slug: string) {
    return this.request<{ success: boolean; company: Company & { openJobs: Job[] } }>(
      `/companies/${slug}`
    );
  }

  async getCompanyReviews(slug: string) {
    return this.request<{ success: boolean; reviews: CompanyReview[] }>(`/companies/${slug}/reviews`);
  }

  async submitCompanyReview(slug: string, review: any) {
    return this.request<{ success: boolean; review: CompanyReview }>(`/companies/${slug}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async getInterviewExperiences(slug: string) {
    return this.request<{ success: boolean; interviews: any[] }>(`/companies/${slug}/interviews`);
  }

  // Salaries
  async getSalaries(role?: string, location?: string) {
    const query = new URLSearchParams();
    if (role) query.append('role', role);
    if (location) query.append('location', location);
    return this.request<any>(`/salaries?${query.toString()}`);
  }

  async getSalaryComparisons() {
    return this.request<{ success: boolean; comparisons: any[] }>('/salaries/compare');
  }

  async submitSalary(data: any) {
    return this.request<any>('/salaries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Resumes
  async getResumes() {
    return this.request<{ success: boolean; resumes: Resume[] }>('/resumes');
  }

  async createResume(data: any) {
    return this.request<{ success: boolean; resume: Resume }>('/resumes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getResumeById(id: string) {
    return this.request<{ success: boolean; resume: Resume }>(`/resumes/${id}`);
  }

  async updateResume(id: string, updates: any) {
    return this.request<{ success: boolean; resume: Resume }>(`/resumes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteResume(id: string) {
    return this.request<{ success: boolean }>(`/resumes/${id}`, {
      method: 'DELETE',
    });
  }

  // AI Services
  async optimizeBullet(bullet: string, role?: string) {
    return this.request<{ success: boolean; result: { improved: string; explanation: string; powerVerbsUsed: string[] } }>(
      '/ai/resume-review',
      {
        method: 'POST',
        body: JSON.stringify({ action: 'optimize-bullet', bullet, role }),
      }
    );
  }

  async generateSummary(headline: string, skills: string[], experienceYears: number) {
    return this.request<{ success: boolean; summary: string }>('/ai/resume-review', {
      method: 'POST',
      body: JSON.stringify({ action: 'generate-summary', headline, skills, experienceYears }),
    });
  }

  async matchJob(jobId?: string, resumeData?: any, job?: any) {
    return this.request<{ success: boolean; match: AIJobMatchResult }>('/ai/job-match', {
      method: 'POST',
      body: JSON.stringify({ jobId, resumeData, job }),
    });
  }

  async generateCoverLetter(resumeData: any, job: any) {
    return this.request<{ success: boolean; coverLetter: string }>('/ai/cover-letter', {
      method: 'POST',
      body: JSON.stringify({ resumeData, job }),
    });
  }

  async careerChat(message: string, history: any[] = []) {
    return this.request<{ success: boolean; reply: string }>('/ai/career-chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
  }

  // Applications (Kanban)
  async getApplications() {
    return this.request<{ success: boolean; applications: JobApplication[] }>('/applications');
  }

  async trackApplication(jobId: string, status = 'applied', notes?: string, coverLetter?: string) {
    return this.request<{ success: boolean; application: JobApplication }>('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId, status, notes, coverLetter }),
    });
  }

  async updateApplication(id: string, updates: any) {
    return this.request<{ success: boolean; application: JobApplication }>(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteApplication(id: string) {
    return this.request<{ success: boolean }>(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  // Mentorship
  async getMentors(service?: string) {
    const q = service ? `?service=${service}` : '';
    return this.request<{ success: boolean; mentors: MentorProfile[] }>(`/mentors${q}`);
  }

  async getMentorById(id: string) {
    return this.request<{ success: boolean; mentor: MentorProfile }>(`/mentors/${id}`);
  }

  async bookMentorSession(data: any) {
    return this.request<{ success: boolean; booking: MentorBooking }>('/mentors/book', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyMentorSessions() {
    return this.request<{ success: boolean; sessions: MentorBooking[] }>('/mentors/my-sessions');
  }

  // Subscriptions
  async getSubscription() {
    return this.request<{ success: boolean; subscription: any }>('/subscriptions/me');
  }

  async createSubscriptionOrder() {
    return this.request<{
      success: boolean;
      orderId: string;
      amount: number;
      currency: string;
      keyId: string;
      isSandbox: boolean;
    }>('/subscriptions/create-order', {
      method: 'POST',
    });
  }

  async verifySubscriptionPayment(payload: any) {
    return this.request<{ success: boolean; subscription: any }>('/subscriptions/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Recruiter
  async getRecruiterJobs() {
    return this.request<{ success: boolean; jobs: any[] }>('/recruiter/jobs');
  }

  async getRecruiterApplicants() {
    return this.request<{ success: boolean; applicants: any[] }>('/recruiter/applicants');
  }

  async updateApplicantStatus(applicationId: string, status: string, notes?: string) {
    return this.request<{ success: boolean; application: any }>(
      `/recruiter/applicants/${applicationId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      }
    );
  }

  // Users & Onboarding
  async getCurrentUser() {
    return this.request<{ success: boolean; user: any }>('/users/me');
  }

  async submitOnboarding(data: any) {
    return this.request<{ success: boolean; profile: any }>('/users/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
