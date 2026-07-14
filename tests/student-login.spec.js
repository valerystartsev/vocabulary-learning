import { test, expect } from '@playwright/test';

const STUDENT_EMAIL = process.env.E2E_STUDENT_EMAIL || 'demo@example.com';
const STUDENT_PASSWORD = process.env.E2E_STUDENT_PASSWORD || 'q1w2e3r4';

test.describe('Student authentication', () => {
  test('logs in as demo student and opens the dashboard', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('adaptation_onboarding_done', '1');
    });

    await page.goto('/login');

    await page.locator("input[type='email']").fill(STUDENT_EMAIL);
    await page.locator("input[type='password']").fill(STUDENT_PASSWORD);

    await Promise.all([
      page.waitForURL('**/dashboard', { timeout: 30_000 }),
      page.locator("button[type='submit']").click(),
    ]);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: /Course Dashboard/i })).toBeVisible();
    await expect(page.getByText(/Business English — Adaptation/i)).toBeVisible();
  });
});
