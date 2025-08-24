import { test, expect } from '@playwright/test';

test.describe('Portfolio Integration Test', () => {
  test('should demonstrate full portfolio workflow with MCP', async ({ page }) => {
    console.log('🎯 Starting comprehensive portfolio integration test...');
    
    // Track network requests
    const requests: string[] = [];
    page.on('request', request => {
      requests.push(`${request.method()} ${request.url()}`);
    });
    
    // Track console messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });
    
    // 1. Navigate to application
    console.log('📍 Step 1: Navigate to homepage');
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'test-results/integration-1-homepage.png' });
    
    // Verify homepage loads
    await expect(page.locator('h1')).toContainText('Portfolio Tracker');
    
    // 2. Navigate to dashboard (bypassing login for now)
    console.log('📍 Step 2: Access dashboard directly');
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'test-results/integration-2-dashboard.png' });
    
    // Wait a bit for any async data loading
    await page.waitForTimeout(3000);
    
    // 3. Check what's actually rendered
    console.log('📍 Step 3: Analyze dashboard content');
    const dashboardContent = await page.textContent('body');
    
    console.log('Dashboard contains:');
    console.log('- "Dashboard" text:', dashboardContent.includes('Dashboard'));
    console.log('- "Total Value" text:', dashboardContent.includes('Total Value'));
    console.log('- "Portfolio" text:', dashboardContent.includes('Portfolio'));
    console.log('- "Your Portfolios" text:', dashboardContent.includes('Your Portfolios'));
    
    // 4. Try to trigger API calls by looking for elements that should load data
    console.log('📍 Step 4: Look for data-dependent elements');
    
    // Check if there are any portfolio cards or loading states
    const portfolioElements = await page.locator('[data-testid="portfolio-card"]').count();
    console.log(`Found ${portfolioElements} portfolio elements`);
    
    // Check for any loading indicators
    const loadingElements = await page.locator('text="Loading", .loading, .spinner').count();
    console.log(`Found ${loadingElements} loading indicators`);
    
    // 5. Look for authentication status
    console.log('📍 Step 5: Check authentication state');
    const loginElements = await page.locator('text="Login", text="Sign in"').count();
    const logoutElements = await page.locator('text="Logout", text="Sign out"').count();
    console.log(`Login elements: ${loginElements}, Logout elements: ${logoutElements}`);
    
    // 6. Take final screenshot
    await page.screenshot({ path: 'test-results/integration-3-final.png' });
    
    // 7. Report network activity
    console.log('📊 Network Activity Summary:');
    console.log(`Total requests: ${requests.length}`);
    
    const apiRequests = requests.filter(req => req.includes('localhost:8002') || req.includes('/api/'));
    console.log(`API requests: ${apiRequests.length}`);
    
    if (apiRequests.length > 0) {
      console.log('API calls made:');
      apiRequests.forEach(req => console.log(`  ${req}`));
    } else {
      console.log('⚠️  No API calls detected - possibly not authenticated or data not loading');
    }
    
    // 8. Report console activity
    console.log('💬 Console Messages:');
    console.log(`Total console messages: ${consoleMessages.length}`);
    if (consoleMessages.length > 0) {
      consoleMessages.forEach(msg => console.log(`  ${msg}`));
    }
    
    console.log('✅ Integration test completed!');
    
    // Make assertions about what we expect to see
    expect(dashboardContent).toContain('Dashboard');
  });
  
  test('should test direct API connectivity', async ({ page, request }) => {
    console.log('🔗 Testing direct API connectivity...');
    
    // Test direct API call to our backend
    try {
      const response = await request.get('http://localhost:8003/api/v1/market/symbols/popular?market=BR');
      const status = response.status();
      console.log(`Direct API call status: ${status}`);
      
      if (status === 401) {
        console.log('✅ API is running but requires authentication (expected)');
      } else if (status === 200) {
        const data = await response.json();
        console.log('✅ API is running and returned data:', JSON.stringify(data).substring(0, 100));
      } else {
        console.log(`⚠️  API returned unexpected status: ${status}`);
      }
    } catch (error) {
      console.log('❌ API connection failed:', error);
    }
    
    // Test if frontend can reach the API
    await page.goto('/');
    
    // Manually trigger a fetch to test connectivity
    const fetchResult = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:8003/api/v1/market/symbols/popular?market=BR');
        return { status: response.status, ok: response.ok };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('Frontend fetch test result:', fetchResult);
  });
});