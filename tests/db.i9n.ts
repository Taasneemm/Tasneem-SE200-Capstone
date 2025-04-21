import { db } from '@/db';
import { test, expect } from '@playwright/test';

test('db connection', async () => {
    const user = await db.user.findFirst();
    await expect(user).not.toBeNull();
  });