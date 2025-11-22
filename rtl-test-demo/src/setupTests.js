import '@testing-library/jest-dom';

// Mock window.grecaptcha for reCAPTCHA v3
global.grecaptcha = {
  ready: (callback) => {
    callback();
  },
  execute: jest.fn().mockResolvedValue('mock-token'),
};

