# React Form with reCAPTCHA v3 and RTL Tests

This project contains a React form component based on the Northwestern Mutual Agent Form structure, with comprehensive testing using React Testing Library (RTL) and Jest.

## Features

- React form component with Tailwind CSS styling
- Two-column responsive layout
- Modern, beautiful UI with gradient backgrounds
- reCAPTCHA v3 integration
- Form validation utilities
- Service factory for API calls
- Comprehensive test coverage (100%)

## Project Structure

```
src/
  components/
    AgentForm.jsx          # Main form component (with Tailwind CSS)
    __tests__/
      AgentForm.test.jsx   # Comprehensive test suite
  utils/
    validation.js          # Form validation utilities
  services/
    formService.js        # API service factory
  App.jsx                 # App component with reCAPTCHA provider
  index.css               # Tailwind CSS imports
  setupTests.js           # Jest setup file
```

## Installation

```bash
npm install
```

## Running the Application

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Running Tests

```bash
# Run tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run tests in CI mode
npm run test:ci
```

## Environment Variables

Create a `.env` file with your reCAPTCHA site key:

```
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

**Note:** In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

If not provided, the component will use a default test key.

## Test Coverage

The test suite covers:
- Form rendering and all fields
- Form input handling
- Form validation
- Form submission (with and without mocking)
- reCAPTCHA v3 integration
- API service integration
- Error handling
- Async code coverage
- Form state management

All tests are designed to achieve 100% code coverage of the component and utility files.

