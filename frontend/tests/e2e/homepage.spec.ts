import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the portfolio tracker homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main heading is visible
    await expect(page.locator('h1')).toContainText('Portfolio Tracker');
    
    // Check if the success message is visible
    await expect(page.locator('text=Homepage funcionando')).toBeVisible();
    
    // Check if the navigation buttons are present
    await expect(page.locator('text=Entrar na App')).toBeVisible();
    await expect(page.locator('text=Login')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Click on login button
    await page.click('text=Login');
    
    // Check if we're on the login page
    await expect(page.locator('h2')).toContainText('Login');
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should navigate to app dashboard', async ({ page }) => {
    await page.goto('/');
    
    // Click on "Entrar na App" button
    await page.click('text=Entrar na App');
    
    // Check if we're on the dashboard - use more specific selector
    await expect(page.locator('main h1:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('text=Total Value')).toBeVisible();
    await expect(page.locator('text=Your Portfolios')).toBeVisible();
  });
});