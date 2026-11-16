import { describe, it, expect, beforeAll } from 'vitest';
import { createApp } from '../app';
import http from 'http';

describe('Express REST API Integration Tests', () => {
  let app: any;
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address: any = server.address();
        baseUrl = `http://127.0.0.1:${address.port}/api/v1`;
        resolve();
      });
    });
  });

  it('GET /api/v1/health returns status 200 with service metadata', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('healthy');
    expect(json.service).toBe('CareerPulse AI Backend');
  });

  it('GET /api/v1/jobs returns jobs with pagination envelope', async () => {
    const res = await fetch(`${baseUrl}/jobs`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.jobs)).toBe(true);
  });

  it('GET /api/v1/companies returns registered companies list', async () => {
    const res = await fetch(`${baseUrl}/companies`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.companies)).toBe(true);
  });

  it('GET /api/v1/salaries/compare returns side-by-side benchmark data', async () => {
    const res = await fetch(`${baseUrl}/salaries/compare`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.comparisons)).toBe(true);
    expect(json.comparisons.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/ai/career-chat returns intelligent career coaching response', async () => {
    const res = await fetch(`${baseUrl}/ai/career-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'How do I negotiate my salary in Bengaluru?' }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.reply).toContain('salary');
  });

  it('Protects private endpoints when unauthenticated token is provided', async () => {
    const res = await fetch(`${baseUrl}/applications`);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
  });
});
