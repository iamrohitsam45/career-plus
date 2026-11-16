# CareerPulse AI — Production Deployment Guide

## 1. Hosting Architecture

- **Frontend**: Next.js 15 deployed on **Vercel** (Edge network, global CDN, dynamic server-rendering).
- **Backend API**: Express.js TypeScript server deployed on **Railway**, **Render**, or **DigitalOcean App Platform**.
- **Database**: **MongoDB Atlas** (M0 Free Tier or Dedicated Cluster).
- **Authentication**: **Clerk** (Global user directory & OAuth).
- **AI Engine**: **OpenRouter** (Unified LLM inference).
- **Payments**: **Razorpay** (Test & Live modes).

---

## 2. Environment Variables Checklist

Ensure these variables are configured in production hosting environments:

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-careerpulse-domain.vercel.app
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/careerpulse?retryWrites=true&w=majority

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# AI Provider
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free

# Razorpay
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

---

## 3. Free-Tier Considerations & Workarounds

| Service | Free Tier Boundary | Operational Strategy |
|---|---|---|
| **Render / Railway Web** | Spins down after 15 min inactivity | Health-check pinger (`/api/v1/health`) via UptimeRobot every 10 minutes keeps container warm. |
| **MongoDB Atlas M0** | 512 MB storage, shared RAM | Efficient schemas with lean indexes; automated TTL on old audit logs. |
| **Clerk Auth** | 10,000 monthly active users | Sufficient for extensive production evaluation without cost. |
| **OpenRouter AI** | Free-tier models available (`meta-llama/llama-3.3-70b-instruct:free`) | High-quality fallback deterministic heuristics built-in so service never fails even when API quotas are reached. |
