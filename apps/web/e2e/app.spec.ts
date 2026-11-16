import { test, expect } from '@playwright/test';

test.describe('CareerPulse AI E2E Suite', () => {
  test('Landing page renders hero, headline, and search bar', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CareerPulse AI/);
    await expect(page.locator('h1')).toContainText('Find Your Next Opportunity with');
    await expect(page.locator('text=Next-Gen AI Career Discovery')).toBeVisible();
  });

  test('Navigate to Jobs Discovery page', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page.locator('h1')).toContainText('Find Your Next Tech Opportunity');
    await expect(page.locator('text=Bengaluru Tech Corridors')).toBeVisible();
  });

  test('Navigate to Today’s Jobs feed', async ({ page }) => {
    await page.goto('/jobs/today');
    await expect(page.locator('text=TODAY\'S LIVE FEED')).toBeVisible();
  });

  test('Navigate to Salary Benchmarks visualizer', async ({ page }) => {
    await page.goto('/salaries');
    await expect(page.locator('text=Tech Salary Benchmarks & Percentiles')).toBeVisible();
    await expect(page.locator('text=Market Median')).toBeVisible();
  });

  test('Navigate to Resume Builder studio', async ({ page }) => {
    await page.goto('/resume-builder');
    await expect(page.locator('text=ATS-Optimized Resume Builder')).toBeVisible();
  });

  test('Navigate to AI Job Match Radar', async ({ page }) => {
    await page.goto('/ai/job-match');
    await expect(page.locator('text=AI Resume & Job Match Engine')).toBeVisible();
  });

  test('Navigate to Kanban Application Tracker', async ({ page }) => {
    await page.goto('/applications');
    await expect(page.locator('text=Kanban Application Tracker')).toBeVisible();
    await expect(page.locator('text=SAVED')).toBeVisible();
    await expect(page.locator('text=APPLIED')).toBeVisible();
  });
});
