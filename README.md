# Dolomed Test Automation

This repository contains automated tests for the Dolomed website using Playwright.

## Project Structure

- `src/pages/`: Page object models for different pages
  - `Home Page/`: Page objects for the Home page
  - `bewegungsapparatHelpers/`: Page objects for the Bewegungsapparat page
  - `schmerzenInnererOrganeHelpers/`: Page objects for the Schmerzen Innerer Organe page
- `src/tests/`: Test specifications
  - `Home Page Tests/`: Tests for the Home page functionality
  - `bewegungsapparat/`: Tests for the Bewegungsapparat page
  - `schmerzenInnererOrgane/`: Tests for the Schmerzen Innerer Organe page
- `src/utils/`: Utility functions for testing

## Features

- Page Object Model pattern for maintainable test code
- Functional tests for page interactions
- Visual regression tests for UI comparisons
- Multi-language support (DE/FR)
- Mobile and desktop responsive testing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/BekaEn/Dolomed.git
   cd Dolomed
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install Playwright browsers:
   ```
   npx playwright install
   ```

### Running Tests

Run all tests:
```
npx playwright test
```

Run tests for a specific page:
```
npx playwright test src/tests/Home\ Page\ Tests/
npx playwright test src/tests/bewegungsapparat/
npx playwright test src/tests/schmerzenInnererOrgane/
```

Run tests with UI:
```
npx playwright test --headed
```

## Test Reports

After running tests, you can view the HTML report:
```
npx playwright show-report
``` 