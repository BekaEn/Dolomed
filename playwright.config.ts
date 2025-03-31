import { defineConfig, devices } from '@playwright/test';
import CustomReporter from './src/utils/customReport';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// Determine if running in CI environment
const isCI = !!process.env.CI;

// Adjust timeouts for CI environment
const ciTimeouts = {
  timeout: 120000,            // 2 minutes for test timeout
  navigationTimeout: 60000,   // 1 minute for navigations
  expect: {
    timeout: 30000            // 30 seconds for expect operations
  }
};

// Local timeouts (faster)
const localTimeouts = {
  timeout: 80000,             // 1 minute for test timeout
  navigationTimeout: 30000,   // 30 seconds for navigations
  expect: {
    timeout: 15000            // 15 seconds for expect operations
  }
};

// Select timeouts based on environment
const timeouts = isCI ? ciTimeouts : localTimeouts;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/tests',
  snapshotDir: './src/tests/screenshots',
  
  // Test and navigation timeouts
  timeout: timeouts.timeout,
  
  expect: {
    timeout: timeouts.expect.timeout,
    toHaveScreenshot: {
      // Adjust threshold and max diff pixels for CI to be more tolerant
      maxDiffPixels: isCI ? 1000 : 100,  // More tolerant in CI
      threshold: isCI ? 0.5 : 0.2,       // Higher threshold in CI
    }
  },
  
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 0 : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 5 : 5,  // Use fewer workers in CI for stability
  
  /* Enhanced Reporter Configuration */
  reporter: isCI 
    ? [
        ['html', {
          outputFolder: 'playwright-report',
          open: 'on-failure',
        }],
        ['json', { outputFile: 'test-results/test-results.json' }],
        ['junit', { outputFile: 'test-results/junit-results.xml' }],
        ['list']
      ] 
    : [
        ['html', {
          outputFolder: 'playwright-report',
          open: 'on-failure',
          attachmentsDirectory: 'playwright-report/attachments',
          // Custom HTML report configuration
          testGroups: [
            {
              name: 'Desktop Tests',
              pattern: /Desktop view/
            },
            {
              name: 'Mobile Tests',
              pattern: /Mobile view/
            }
          ],
          // Customize report metadata
          metadata: {
            'App Version': process.env.APP_VERSION || 'dev',
            'Environment': process.env.TEST_ENV || 'staging',
            'Execution Time': new Date().toLocaleString(),
            'CI': 'No'
          }
        }],
        ['json', { outputFile: 'test-results/test-results.json' }],
        ['junit', { outputFile: 'test-results/junit-results.xml' }],
        ['./src/utils/customReport.ts']
      ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://dolomed.ch/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: isCI ? 'on' : 'retain-on-failure',
    screenshot: isCI ? 'on' : 'only-on-failure',
    // video: isCI ? 'on' : 'retain-on-failure',
    
    // Set navigation timeout
    navigationTimeout: timeouts.navigationTimeout,
    
    // Additional test metadata
    testIdAttribute: 'data-testid',
  },

  /* Configure projects for different viewports */
  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        browserName: 'chromium',
        viewport: { width: 1600, height: 1080 },
        screenshot: 'on',
        // Add more stable browser configuration for CI
        launchOptions: {
          args: isCI ? [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-sandbox',
            '--headless=new',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
          ] : []
        }
      },
    },
    
    // {
    //   name: 'Mobile Chrome',
    //   use: { 
    //     ...devices['Pixel 5'],
    //     screenshot: 'on',
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { 
    //     ...devices['iPhone 12'],
    //     screenshot: 'on',
    //   },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
