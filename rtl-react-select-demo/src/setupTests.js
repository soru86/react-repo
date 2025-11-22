import '@testing-library/jest-dom';

// Suppress act() warnings and jsdom "Not implemented" errors
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Suppress React act() warnings (false positives from event handlers)
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to') &&
      args[0].includes('was not wrapped in act(...)')
    ) {
      return;
    }

    // Suppress jsdom "Not implemented" errors (window.alert, etc. are mocked in tests)
    if (
      args[0] &&
      typeof args[0] === 'object' &&
      args[0].type === 'not implemented'
    ) {
      return;
    }

    // Suppress jsdom "Not implemented" errors in string format
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Error: Not implemented:')
    ) {
      return;
    }

    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock react-select
jest.mock('react-select', () => {
  const React = require('react');
  return function Select({ options, value, onChange, placeholder, inputId, name, 'aria-required': ariaRequired, 'data-action-type': actionType }) {
    return (
      <div data-testid={`select-${name || inputId}`}>
        <select
          id={inputId}
          name={name}
          value={value?.value || ''}
          data-action-type={actionType}
          onChange={(e) => {
            const selectedValue = e.target.value;
            // Get action type from data attribute, or determine from value
            let action = e.target.getAttribute('data-action-type');
            if (!action) {
              action = selectedValue === '' ? 'clear' : 'select-option';
            }

            if (selectedValue === '') {
              // Clear or remove-value action
              onChange(null, { action: action === 'remove-value' ? 'remove-value' : 'clear' });
            } else {
              // Select option or create-option action
              const selectedOption = options.find(opt => opt.value === selectedValue);
              onChange(selectedOption || null, { action: action === 'create-option' ? 'create-option' : 'select-option' });
            }
          }}
          aria-required={ariaRequired}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

