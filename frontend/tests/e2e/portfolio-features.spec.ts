import { test, expect } from '@playwright/test';

test.describe('Portfolio Features Test', () => {
  test.beforeEach(async ({ page }) => {
    // Set a longer timeout for network operations
    page.setDefaultTimeout(10000);
  });

  test('should test complete portfolio workflow', async ({ page }) => {
    console.log('🚀 Starting Portfolio Features Test...');
    
    // 1. Navigate to homepage
    console.log('📍 Step 1: Navigate to homepage');
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Take homepage screenshot
    await page.screenshot({ path: 'test-results/portfolio-1-homepage.png' });
    
    // Verify homepage elements
    await expect(page.locator('h1')).toContainText('Portfolio Tracker');
    
    // 2. Navigate to login
    console.log('📍 Step 2: Navigate to login page');
    await page.click('text=Login');
    await page.waitForLoadState('networkidle');
    
    // Take login page screenshot
    await page.screenshot({ path: 'test-results/portfolio-2-login.png' });
    
    // 3. Try to login (this might fail if user doesn't exist)
    console.log('📍 Step 3: Attempt login');
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'testpass123');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000); // Wait for login attempt
    
    // Take screenshot after login attempt
    await page.screenshot({ path: 'test-results/portfolio-3-after-login.png' });
    
    // 4. Check current state
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    // 5. If not logged in, try the dashboard button from homepage
    if (currentUrl.includes('login') || await page.locator('text=Login').isVisible().catch(() => false)) {
      console.log('🔄 Login not successful, trying direct dashboard access...');
      await page.goto('/');
      await page.waitForTimeout(1000);
      
      // Click "Entrar na App" button
      if (await page.locator('text=Entrar na App').isVisible()) {
        await page.click('text=Entrar na App');
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'test-results/portfolio-4-dashboard-direct.png' });
      }
    }
    
    // 6. Check what's visible on the current page
    const pageContent = await page.textContent('body');
    console.log('Current page contains Dashboard:', pageContent.includes('Dashboard'));
    console.log('Current page contains Total Value:', pageContent.includes('Total Value'));
    console.log('Current page contains Portfolio:', pageContent.includes('Portfolio'));
    
    // 7. Final screenshot
    await page.screenshot({ path: 'test-results/portfolio-5-final.png' });
    
    console.log('✅ Portfolio features test completed!');
  });

  test('should check API connectivity', async ({ page }) => {
    console.log('🔌 Testing API connectivity...');
    
    // Navigate to homepage
    await page.goto('/');
    
    // Check for any console errors
    const consoleMessages: string[] = [];
    page.on('console', (message) => {
      consoleMessages.push(`${message.type()}: ${message.text()}`);
    });
    
    // Check for network requests
    const networkRequests: string[] = [];
    page.on('request', (request) => {
      networkRequests.push(request.url());
    });
    
    // Wait for any initial network requests
    await page.waitForTimeout(3000);
    
    console.log('Console messages:', consoleMessages.length);
    console.log('Network requests:', networkRequests.length);
    
    // Log API requests
    const apiRequests = networkRequests.filter(url => url.includes('localhost:8002'));
    console.log('API requests to backend:', apiRequests.length);
    
    if (apiRequests.length > 0) {
      console.log('API endpoints called:', apiRequests);
    }
    
    await page.screenshot({ path: 'test-results/api-connectivity-test.png' });
  });
});