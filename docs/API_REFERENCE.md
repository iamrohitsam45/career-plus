# CareerPulse AI — REST API Reference

Base URL: `http://localhost:5000/api/v1`

All authenticated endpoints require an `Authorization: Bearer <token>` header.

---

## 1. Authentication & Users

### `GET /users/me`
Returns currently authenticated user profile, onboarded state, and subscription status.

### `POST /users/onboarding`
Saves candidate onboarding information into MongoDB.
**Body:**
```json
{
  "fullName": "Kavya Sharma",
  "headline": "Senior Full Stack Engineer",
  "experienceYears": 4,
  "technicalSkills": ["React", "Next.js", "TypeScript", "Node.js"],
  "preferredRoles": ["Full Stack Engineer"],
  "preferredLocations": ["Bengaluru, Karnataka"],
  "currentSalary": 1800000,
  "expectedSalary": 2800000,
  "noticePeriodDays": 30,
  "workModes": ["hybrid", "remote"]
}
```

---

## 2. Jobs Discovery

### `GET /jobs`
Search and filter jobs with server-side pagination and deduplication.
**Query Parameters:**
- `query`: Keyword search across titles, skills, and companies
- `location`: City or region filter
- `isBengaluru`: Boolean toggle for Bengaluru tech hubs
- `workMode`: `remote` | `hybrid` | `on-site`
- `jobType`: `full-time` | `contract` | `internship`
- `skills`: Comma-separated technical skills
- `sortBy`: `recent` | `salary` | `relevance`
- `page`: Page index (default: 1)
- `limit`: Items per page (default: 15)

### `GET /jobs/today`
Returns jobs published strictly during the current calendar date in local timezone.

### `GET /jobs/:id`
Returns full job description and requirements.

### `POST /jobs/:id/save` & `DELETE /jobs/:id/save`
Save or unsave a job to the user's watchlist.

---

## 3. Companies & Culture

### `GET /companies`
List companies with filter by industry and search query.

### `GET /companies/:slug`
Company profile, overview, work-life balance rating, benefits, and open positions.

### `POST /companies/:slug/reviews`
Submit anonymous employee review with 1-5 star ratings for work-life, culture, compensation, and career growth.

---

## 4. Salary Insights

### `GET /salaries`
Role and location salary distribution (25th, median, 75th percentiles, experience curve).

### `GET /salaries/compare`
Side-by-side compensation comparison across engineering disciplines.

### `POST /salaries`
Anonymous salary submission.

---

## 5. ATS Resume Builder

### `GET /resumes`
List user's resumes.

### `POST /resumes`
Create a new resume with ATS-friendly default structure.

### `PATCH /resumes/:id`
Update resume sections with automatic snapshot versioning.

---

## 6. AI Career Intelligence

### `POST /ai/resume-review`
- `action: "optimize-bullet"`: Rewrites bullet with Google Laszlo Bock XYZ formula.
- `action: "generate-summary"`: Generates professional ATS summary.

### `POST /ai/job-match`
Calculates deterministic ATS match score (%), matching skills, missing skills, and 30-day preparation roadmap.

### `POST /ai/cover-letter`
Generates customized, 3-paragraph executive cover letter for target role.

### `POST /ai/career-chat`
Interactive career coaching chatbot with interview prep and salary negotiation insights.

---

## 7. Kanban Application Tracker

### `GET /applications`
Returns applications across Kanban stages (`saved`, `preparing`, `applied`, `assessment`, `interview`, `offer`, `rejected`, `withdrawn`).

### `POST /applications`
Track new application.

### `PATCH /applications/:id`
Move status or add notes.

---

## 8. Mentorship Platform

### `GET /mentors`
Catalog of verified engineering leaders.

### `POST /mentors/book`
Reserve 1:1 session with double-booking prevention and dynamic meeting URL generation.

### `GET /mentors/my-sessions`
List candidate's confirmed sessions.

---

## 9. Subscriptions & Payments

### `GET /subscriptions/me`
Current subscription plan and entitlements.

### `POST /subscriptions/create-order`
Creates Razorpay subscription order (₹1,499/mo).

### `POST /subscriptions/verify`
Validates cryptographic HMAC SHA-256 signature and upgrades account to Pro.
