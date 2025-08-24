import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard before each test
    await page.goto('/app');
  });

  test('should display dashboard metrics', async ({ page }) => {
    // Check if all metric cards are visible
    await expect(page.locator('text=Total Value')).toBeVisible();
    await expect(page.locator('text=Total Invested')).toBeVisible();
    await expect(page.locator('text=Total P&L')).toBeVisible();
    await expect(page.locator('p:has-text("Portfolios")')).toBeVisible();
    
    // Check if the values are displayed
    await expect(page.locator('text=R$ 10.000,00')).toBeVisible();
    await expect(page.locator('text=R$ 8.500,00')).toBeVisible();
    await expect(page.locator('text=R$ 1.500,00')).toBeVisible();
  });

  test('should display portfolios section', async ({ page }) => {
    // Check if portfolios section is visible
    await expect(page.locator('text=Your Portfolios')).toBeVisible();
    await expect(page.locator('text=View All')).toBeVisible();
    
    // Check if portfolio items are displayed
    await expect(page.locator('text=Conservative Portfolio')).toBeVisible();
    await expect(page.locator('text=Growth Portfolio')).toBeVisible();
    await expect(page.locator('text=International Portfolio')).toBeVisible();
  });

  test('should have working sidebar navigation', async ({ page }) => {
    // Check if sidebar logo is visible
    await expect(page.locator('span:has-text("Portfolio Tracker")')).toBeVisible();
    
    // Test navigation links - use more specific selectors for links
    await expect(page.locator('nav a:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Portfolios")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Transactions")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Add Transaction")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Settings")')).toBeVisible();
  });

  test('should navigate to different pages', async ({ page }) => {
    // Navigate to portfolios page
    await page.click('nav a:has-text("Portfolios")');
    await expect(page.locator('text=Portfolios Page Coming Soon')).toBeVisible();
    
    // Navigate to transactions page
    await page.click('nav a:has-text("Transactions")');
    await expect(page.locator('text=Transactions Page Coming Soon')).toBeVisible();
    
    // Navigate back to dashboard
    await page.click('nav a:has-text("Dashboard")');
    await expect(page.locator('p:has-text("Total Value")')).toBeVisible();
  });
});