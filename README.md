# CareerPulse AI — Production-Ready AI Job Portal & Career Intelligence Platform

CareerPulse AI is a complete, full-stack, enterprise-grade career discovery and AI intelligence platform combining the strengths of **Naukri**, **Glassdoor**, **LinkedIn Jobs**, and modern generative AI career tools.

Designed with a modern SaaS aesthetic, dark/light theme, micro-interactions, deterministic ATS heuristics, verified Indian tech compensation curves (INR LPA), and 1:1 engineering mentorship.

---

## 🌟 Key Product Capabilities

### 1. Job Discovery Engine (`/jobs`, `/jobs/today`, `/jobs/[id]`)
- **Multi-Feed Adapter Interface**: Normalizes JSearch, Adzuna, Remotive, and public Greenhouse/Lever feeds into one unified internal model.
- **Strict Today's Jobs Verification**: Categorizes jobs published on the current calendar date in local timezone (IST).
- **India & Bengaluru Tech Hub Focus**: 1-click filters for Whitefield, Bellandur, Electronic City, and Koramangala.
- **Save & Unsave Watchlist**: Persisted candidate watchlist.

### 2. Verified Company Intelligence (`/companies`, `/companies/[slug]`)
- Transparent company profiles for Google, Microsoft, Razorpay, Flipkart, Swiggy, and Zerodha.
- Community-submitted reviews with sub-ratings: Work-life balance, company culture, compensation, and career growth.
- Real interview questions and difficulty ratings.

### 3. Tech Salary Visualizer (`/salaries`, `/salaries/compare`)
- Interactive **Recharts** compensation curves.
- 25th percentile, Median market anchor, and 75th percentile tier-1 compensation in **INR LPA**.
- Cross-role side-by-side compensation comparisons.
- Anonymous salary submission.

### 4. ATS Resume Builder Studio (`/resume-builder`, `[id]/edit`, `templates`)
- 4 ATS-compliant templates: Modern, Minimalist, Executive, Tech.
- Real-time side-by-side live editor & A4 printable preview.
- **Laszlo Bock XYZ Bullet Optimizer**: Transforms passive bullets into Google-style quantified achievements: "Accomplished [X] as measured by [Y] by doing [Z]".
- AI professional summary generation.
- 1-click PDF export via browser print stylesheets.

### 5. AI Career Intelligence Suite
- **AI Job Match Radar (`/ai/job-match`)**: Deterministic baseline ranking + LLM analysis calculating match %, matching skills, missing skills, and a 30-day preparation roadmap.
- **AI Apply Studio (`/ai/apply`)**: Select job and resume, generate bespoke 3-paragraph cover letter, review details, open official application URL, and automatically track in Kanban.
- **24/7 AI Career Coach (`/ai/career-coach`)**: Interactive chatbot equipped with behavioral STAR frameworks, system design mock questions, and salary negotiation strategies.

### 6. Kanban Application Tracker (`/applications`)
- 8 drag-and-drop workflow stages: `Saved` → `Preparing` → `Applied` → `Assessment` → `Interview` → `Offer` → `Rejected` → `Withdrawn`.
- Live pipeline analytics: Total tracked, active interviews, offers, and conversion rate.

### 7. 1:1 Engineering Mentorship (`/mentorship`, `[mentorId]`, `my-sessions`)
- Verified mentors from Google Cloud, Microsoft, and Razorpay.
- Double-booking prevention and automated video meeting room links (Jitsi / Google Meet).

### 8. Recruiter Portal (`/recruiter/dashboard`, `jobs/new`)
- Native job posting with salary bands, skills, and work mode.
- Candidate screening pipeline with stage update actions.

### 9. Pro Subscriptions & Razorpay (`/pricing`, `/subscription/manage`)
- Razorpay test mode integration with signed cryptographic HMAC SHA-256 verification.
- Entitlement checks secured at the backend.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Radix UI, Framer Motion, Lucide React, Recharts, TanStack Query, Zustand, Sonner, next-themes |
| **Backend** | Node.js, Express.js, TypeScript, Mongoose ODM, Zod validation, Helmet, CORS, Express-Rate-Limit, Morgan |
| **Database** | MongoDB Atlas (21 indexed Mongoose schemas) |
| **Auth** | Clerk Authentication + Local demo evaluation profiles |
| **AI** | OpenRouter AI (`meta-llama/llama-3.3-70b-instruct:free`) + Deterministic Heuristics |
| **Payments** | Razorpay (India) with webhook signature verification |
| **Testing** | Vitest (Unit & Integration tests), Playwright (E2E) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 20
- pnpm >= 9 (or npm / corepack)

### 2. Installation
```bash
git clone <repo-url> careerpulse-ai
cd careerpulse-ai
pnpm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```
*(All defaults are configured with safe fallbacks and test keys for immediate out-of-the-box local evaluation).*

### 4. Build Shared Packages
```bash
pnpm run build:shared
```

### 5. Seed Database (Optional)
```bash
pnpm run seed
```

### 6. Start Development Servers
```bash
# Run both API and Web concurrently
pnpm run dev

# Or run separately:
pnpm run dev:api   # Express API on http://localhost:5000
pnpm run dev:web   # Next.js App on http://localhost:3000
```

---

## 🧪 Running Tests

```bash
# Run all unit and API integration tests with Vitest
pnpm --filter @careerpulse/api run test

# Typecheck all packages
pnpm run build
```

---

## 📂 Project Structure

```
career-pulse-ai/
├── apps/
│   ├── web/               # Next.js 15 Frontend
│   │   ├── src/app/       # App Router Pages & Layouts (29 Routes)
│   │   ├── src/components/# UI Components & Layouts
│   │   ├── src/lib/       # API client & helpers
│   │   └── e2e/           # Playwright E2E suites
│   └── api/               # Express Backend
│       ├── src/models/    # 21 Indexed Mongoose Models
│       ├── src/services/  # Business logic (Jobs, AI, Razorpay, Mentorship)
│       ├── src/routes/    # Modular REST API endpoints
│       └── src/__tests__/ # Vitest integration suites
├── packages/
│   ├── shared/            # Common domain types, Zod schemas, normalizers
│   └── ui/                # Shared UI utilities
├── docs/                  # Architecture, API Reference, Deployment
└── scripts/               # Seed scripts & tools
```

---

## 📜 License
MIT License. Built for tech professionals and engineering hiring managers.
# career-plus
