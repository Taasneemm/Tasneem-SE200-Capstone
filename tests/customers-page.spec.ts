import { test, expect } from '@playwright/test';

test('login and verify redirect to exact /dashboard URL', async ({ page }) => {
  // Navigate to login page
  await page.goto('http://localhost:3001');

  // Fill in the email and password fields
  await page.getByLabel('Email').fill('nuda@gmail.com');
  await page.getByLabel('Password').fill('333333');

  // Click the login button
  await page.getByRole('button', { name: 'Login' }).click();

  // Expect the page to be redirected to the exact dashboard URL
  await expect(page).toHaveURL('http://localhost:3001/dashboard');
});
