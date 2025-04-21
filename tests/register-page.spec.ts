import { test, expect } from '@playwright/test';

test('shows validation errors when all fields are empty', async ({ page }) => {
  // Go to the register page directly
  await page.goto('http://localhost:3000/register');

  // Click the Register button without entering any data
  await page.getByRole('button', { name: 'Register' }).click();

  // Check for expected error messages
  await expect(page.getByText('Name is required')).toBeVisible();
  await expect(page.getByText('Email is required')).toBeVisible();
  await expect(page.getByText('Minimum 6 characters required')).toBeVisible();
});
