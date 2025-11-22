# RTL React Select Demo

A React form component built with:
- React Select for dropdowns
- Styled Components for styling
- reCAPTCHA v3 for bot protection
- Tailwind CSS (via utility classes)
- Comprehensive unit tests with React Testing Library and Jest

## Features

- Two-column responsive form layout
- Form validation utilities
- reCAPTCHA v3 integration
- Async API service factory
- 100% test coverage

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

## Running Tests

```bash
npm test
```

To run tests with coverage:

```bash
npm test -- --coverage
```

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

If not provided, the app will use a test key (for development only).

## Project Structure

```
src/
  components/
    AgentForm.jsx          # Main form component
    __tests__/
      AgentForm.test.jsx   # Comprehensive unit tests
  services/
    apiService.js          # API service factory
  utils/
    validation.js          # Form validation utilities
  App.jsx                  # App component with reCAPTCHA provider
  index.js                 # Entry point
```

## Form Fields

- Policy Owner (Radio: Yes/No)
- First Name (Text, required)
- Last Name (Text, required)
- Zip Code (Text, required)
- Phone Number (Text, required)
- Email (Email, required)
- Age (Number, required, max 124)
- Financial Goal (Select dropdown, required)
- Income Range (Select dropdown, required)

## Test Coverage

The test suite covers:
- Form rendering
- Input handling
- Form validation
- Form submission (with and without mocking)
- Error handling
- reCAPTCHA v3 integration
- Async code paths
- Form state management
- Button states

