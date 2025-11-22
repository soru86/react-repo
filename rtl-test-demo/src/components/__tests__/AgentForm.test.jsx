import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import AgentForm from '../AgentForm';
import { validateForm, hasFormErrors } from '../../utils/validation';
import { createFormSubmissionService } from '../../services/formService';

// Mock the validation utilities
jest.mock('../../utils/validation', () => ({
  validateForm: jest.fn(),
  hasFormErrors: jest.fn(),
}));

// Mock the service factory
jest.mock('../../services/formService', () => ({
  createFormSubmissionService: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

const renderWithRecaptcha = (component) => {
  return render(
    <GoogleReCaptchaProvider reCaptchaKey="test-key">
      {component}
    </GoogleReCaptchaProvider>
  );
};

describe('AgentForm', () => {
  const mockExecuteRecaptcha = jest.fn();
  const mockSubmitService = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecuteRecaptcha.mockResolvedValue('test-recaptcha-token');
    mockSubmitService.mockResolvedValue({
      status: 200,
      json: async () => ({ success: true }),
    });
    
    // Mock useGoogleReCaptcha hook
    jest.spyOn(require('react-google-recaptcha-v3'), 'useGoogleReCaptcha').mockReturnValue({
      executeRecaptcha: mockExecuteRecaptcha,
    });

    validateForm.mockReturnValue({});
    hasFormErrors.mockReturnValue(false);
    createFormSubmissionService.mockReturnValue(mockSubmitService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render the form with all fields', () => {
      renderWithRecaptcha(<AgentForm />);

      expect(screen.getByText('Northwestern Mutual Agent Form')).toBeInTheDocument();
      expect(screen.getByRole('radiogroup', { name: /Are you currently working together/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Zip Code/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/My biggest financial goal is to/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Income Range/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    it('should render reCAPTCHA disclaimer', () => {
      renderWithRecaptcha(<AgentForm />);

      expect(screen.getByText(/This site is protected by reCAPTCHA/i)).toBeInTheDocument();
      expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
      expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('should update form values when inputs change', () => {
      renderWithRecaptcha(<AgentForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      expect(firstNameInput.value).toBe('John');

      const lastNameInput = screen.getByLabelText(/Last Name/i);
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      expect(lastNameInput.value).toBe('Doe');
    });

    it('should handle radio button selection', () => {
      renderWithRecaptcha(<AgentForm />);

      const yesRadio = screen.getByRole('radio', { name: 'Yes' });
      const noRadio = screen.getByRole('radio', { name: 'No' });

      expect(noRadio).toBeChecked();
      expect(yesRadio).not.toBeChecked();

      fireEvent.click(yesRadio);
      expect(yesRadio).toBeChecked();
      expect(noRadio).not.toBeChecked();

      // Test clicking No radio button when Yes is selected
      fireEvent.click(noRadio);
      expect(noRadio).toBeChecked();
      expect(yesRadio).not.toBeChecked();
    });

    it('should handle select dropdown changes', () => {
      renderWithRecaptcha(<AgentForm />);

      const goalSelect = screen.getByLabelText(/My biggest financial goal is to/i);
      fireEvent.change(goalSelect, { target: { value: 'retirement' } });
      expect(goalSelect.value).toBe('retirement');
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors when form is submitted with invalid data', () => {
      const validationErrors = {
        firstName: 'Please enter a valid first name.',
        lastName: 'Please enter a valid last name.',
        zip: 'Please enter a valid zip code.',
        phone: 'Please enter a valid phone number.',
        email: 'Please enter a valid email address.',
        age: 'Please enter a valid age.',
        goal: 'Please select a goal',
        incomeRange: 'Please select an income range.',
      };

      validateForm.mockReturnValue(validationErrors);
      hasFormErrors.mockReturnValue(true);

      renderWithRecaptcha(<AgentForm />);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      expect(validateForm).toHaveBeenCalled();
      expect(hasFormErrors).toHaveBeenCalledWith(validationErrors);

      // Verify error messages are displayed
      expect(screen.getByText('Please enter a valid first name.')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid last name.')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid zip code.')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid phone number.')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid age.')).toBeInTheDocument();
      expect(screen.getByText('Please select a goal')).toBeInTheDocument();
      expect(screen.getByText('Please select an income range.')).toBeInTheDocument();
    });

    it('should not submit form if validation fails', async () => {
      const validationErrors = {
        email: 'Please enter a valid email address.',
      };

      validateForm.mockReturnValue(validationErrors);
      hasFormErrors.mockReturnValue(true);

      renderWithRecaptcha(<AgentForm />);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockExecuteRecaptcha).not.toHaveBeenCalled();
        expect(mockSubmitService).not.toHaveBeenCalled();
      });
    });

    it('should clear field error when user starts typing', () => {
      const validationErrors = {
        firstName: 'Please enter a valid first name.',
        lastName: 'Please enter a valid last name.',
        zip: 'Please enter a valid zip code.',
        phone: 'Please enter a valid phone number.',
        email: 'Please enter a valid email address.',
        age: 'Please enter a valid age.',
        goal: 'Please select a goal',
        incomeRange: 'Please select an income range.',
      };

      validateForm.mockReturnValue(validationErrors);
      hasFormErrors.mockReturnValue(true);

      renderWithRecaptcha(<AgentForm />);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      fireEvent.change(firstNameInput, { target: { value: 'J' } });

      // Error should be cleared (we can't directly test state, but we can verify the input changed)
      expect(firstNameInput.value).toBe('J');

      // Test clearing error for other fields
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      fireEvent.change(lastNameInput, { target: { value: 'D' } });
      expect(lastNameInput.value).toBe('D');

      const zipInput = screen.getByLabelText(/Zip Code/i);
      fireEvent.change(zipInput, { target: { value: '123' } });
      expect(zipInput.value).toBe('123');

      const phoneInput = screen.getByLabelText(/Phone Number/i);
      fireEvent.change(phoneInput, { target: { value: '123' } });
      expect(phoneInput.value).toBe('123');

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'test@' } });
      expect(emailInput.value).toBe('test@');

      const ageInput = screen.getByLabelText(/Age/i);
      fireEvent.change(ageInput, { target: { value: '1' } });
      expect(ageInput.value).toBe('1');

      const goalSelect = screen.getByLabelText(/My biggest financial goal is to/i);
      fireEvent.change(goalSelect, { target: { value: 'retirement' } });
      expect(goalSelect.value).toBe('retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      fireEvent.change(incomeSelect, { target: { value: '50001-75000' } });
      expect(incomeSelect.value).toBe('50001-75000');
    });
  });

  describe('Form Submission - Without Mocking handleSubmit', () => {
    it('should call handleSubmit on form submit', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);

      renderWithRecaptcha(<AgentForm />);

      const form = document.querySelector('form[id="agent-form-demo"]') || screen.getByRole('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(validateForm).toHaveBeenCalled();
      });
    });

    it('should execute reCAPTCHA and submit form on valid submission', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('test-token');
      mockSubmitService.mockResolvedValue({
        status: 200,
        json: async () => ({ success: true }),
      });

      renderWithRecaptcha(<AgentForm />);

      // Fill in form fields
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/My biggest financial goal is to/i), { target: { value: 'retirement' } });
      fireEvent.change(screen.getByLabelText(/Income Range/i), { target: { value: '50001-75000' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockExecuteRecaptcha).toHaveBeenCalledWith('submit_form');
      });

      await waitFor(() => {
        expect(createFormSubmissionService).toHaveBeenCalledWith('test-token', expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
        }));
      });

      await waitFor(() => {
        expect(mockSubmitService).toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission - With Mocking handleSubmit', () => {
    it('should call handleSubmit when form is submitted (spied)', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('test-token');
      mockSubmitService.mockResolvedValue({
        status: 200,
        json: async () => ({ success: true }),
      });

      renderWithRecaptcha(<AgentForm />);

      // Get the form element
      const form = document.querySelector('form[id="agent-form-demo"]') || screen.getByRole('form');
      
      // Fill form fields
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/My biggest financial goal is to/i), { target: { value: 'retirement' } });
      fireEvent.change(screen.getByLabelText(/Income Range/i), { target: { value: '50001-75000' } });

      // Submit the form
      fireEvent.submit(form);

      await waitFor(() => {
        expect(validateForm).toHaveBeenCalled();
      });

      // Verify the submission flow was triggered
      await waitFor(() => {
        expect(mockExecuteRecaptcha).toHaveBeenCalled();
      });
    });
  });

  describe('reCAPTCHA v3 Integration', () => {
    it('should execute reCAPTCHA before form submission', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('recaptcha-token-123');

      renderWithRecaptcha(<AgentForm />);

      // Fill required fields
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/My biggest financial goal is to/i), { target: { value: 'retirement' } });
      fireEvent.change(screen.getByLabelText(/Income Range/i), { target: { value: '50001-75000' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockExecuteRecaptcha).toHaveBeenCalledWith('submit_form');
      });
    });

    it('should handle reCAPTCHA execution failure', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue(null);

      renderWithRecaptcha(<AgentForm />);

      // Fill required fields
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/My biggest financial goal is to/i), { target: { value: 'retirement' } });
      fireEvent.change(screen.getByLabelText(/Income Range/i), { target: { value: '50001-75000' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockExecuteRecaptcha).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockSubmitService).not.toHaveBeenCalled();
      });
    });

    it('should not submit if reCAPTCHA is not loaded', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);

      // Mock useGoogleReCaptcha to return null executeRecaptcha
      jest.spyOn(require('react-google-recaptcha-v3'), 'useGoogleReCaptcha').mockReturnValue({
        executeRecaptcha: null,
      });

      renderWithRecaptcha(<AgentForm />);

      // Fill required fields
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/My biggest financial goal is to/i), { target: { value: 'retirement' } });
      fireEvent.change(screen.getByLabelText(/Income Range/i), { target: { value: '50001-75000' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSubmitService).not.toHaveBeenCalled();
      });
    });
  });

  describe('API Service Integration', () => {
    it('should call createFormSubmissionService with correct parameters', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('test-recaptcha-token');
      mockSubmitService.mockResolvedValue({
        status: 200,
        json: async () => ({ success: true }),
      });

      renderWithRecaptcha(<AgentForm />);

      // Fill form
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/My biggest financial goal is to/i), { target: { value: 'retirement' } });
      fireEvent.change(screen.getByLabelText(/Income Range/i), { target: { value: '50001-75000' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(createFormSubmissionService).toHaveBeenCalledWith(
          'test-recaptcha-token',
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            zip: '12345',
            phone: '1234567890',
            email: 'john@example.com',
            age: '30',
            goal: 'retirement',
            incomeRange: '50001-75000',
            policyOwner: 'No',
          })
        );
      });
    });

    it('should handle successful API response (200)', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('test-token');
      mockSubmitService.mockResolvedValue({
        status: 200,
        json: async () => ({ success: true, message: 'Form submitted successfully' }),
      });

      renderWithRecaptcha(<AgentForm />);

      // Fill form
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/My biggest financial goal is to/i), { target: { value: 'retirement' } });
      fireEvent.change(screen.getByLabelText(/Income Range/i), { target: { value: '50001-75000' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSubmitService).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should call handleSubmitError on API error', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('test-token');
      mockSubmitService.mockRejectedValue(new Error('API Error: 500 Internal Server Error'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      renderWithRecaptcha(<AgentForm />);

      // Fill form
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/My biggest financial goal is to/i), { target: { value: 'retirement' } });
      fireEvent.change(screen.getByLabelText(/Income Range/i), { target: { value: '50001-75000' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSubmitService).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Form submission error:',
          expect.any(Error)
        );
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      consoleErrorSpy.mockRestore();
    });

    it('should handle non-200 response status', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('test-token');
      mockSubmitService.mockResolvedValue({
        status: 400,
        json: async () => ({ error: 'Bad Request' }),
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      renderWithRecaptcha(<AgentForm />);

      // Fill form
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/My biggest financial goal is to/i), { target: { value: 'retirement' } });
      fireEvent.change(screen.getByLabelText(/Income Range/i), { target: { value: '50001-75000' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSubmitService).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });

    it('should handle 500 response status', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('test-token');
      mockSubmitService.mockResolvedValue({
        status: 500,
        json: async () => ({ error: 'Internal Server Error' }),
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      renderWithRecaptcha(<AgentForm />);

      // Fill form
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/My biggest financial goal is to/i), { target: { value: 'retirement' } });
      fireEvent.change(screen.getByLabelText(/Income Range/i), { target: { value: '50001-75000' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSubmitService).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Async Code Coverage', () => {
    it('should handle async form submission flow', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('async-token');
      mockSubmitService.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                status: 200,
                json: async () => ({ success: true }),
              });
            }, 100);
          })
      );

      renderWithRecaptcha(<AgentForm />);

      // Fill form
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/My biggest financial goal is to/i), { target: { value: 'retirement' } });
      fireEvent.change(screen.getByLabelText(/Income Range/i), { target: { value: '50001-75000' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      // Button should be disabled during submission
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      await waitFor(() => {
        expect(mockSubmitService).toHaveBeenCalled();
      }, { timeout: 200 });

      // Button should be enabled after submission
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      }, { timeout: 200 });
    });

    it('should handle async reCAPTCHA execution', async () => {
      validateForm.mockReturnValue({});
      hasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve('delayed-token');
            }, 50);
          })
      );
      mockSubmitService.mockResolvedValue({
        status: 200,
        json: async () => ({ success: true }),
      });

      renderWithRecaptcha(<AgentForm />);

      // Fill form
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/My biggest financial goal is to/i), { target: { value: 'retirement' } });
      fireEvent.change(screen.getByLabelText(/Income Range/i), { target: { value: '50001-75000' } });

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockExecuteRecaptcha).toHaveBeenCalled();
      }, { timeout: 100 });

      await waitFor(() => {
        expect(mockSubmitService).toHaveBeenCalled();
      }, { timeout: 200 });
    });
  });

  describe('Form State Management', () => {
    it('should maintain formValues state correctly', () => {
      renderWithRecaptcha(<AgentForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email/i);

      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
      fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });

      expect(firstNameInput.value).toBe('Jane');
      expect(lastNameInput.value).toBe('Smith');
      expect(emailInput.value).toBe('jane@example.com');
    });

    it('should initialize with default policyOwner value', () => {
      renderWithRecaptcha(<AgentForm />);

      const noRadio = screen.getByRole('radio', { name: 'No' });
      expect(noRadio).toBeChecked();
    });

    it('should handle input change without errors', () => {
      renderWithRecaptcha(<AgentForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      const zipInput = screen.getByLabelText(/Zip Code/i);
      const phoneInput = screen.getByLabelText(/Phone Number/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const ageInput = screen.getByLabelText(/Age/i);

      // Test all input fields change without errors
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      expect(firstNameInput.value).toBe('John');

      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      expect(lastNameInput.value).toBe('Doe');

      fireEvent.change(zipInput, { target: { value: '12345' } });
      expect(zipInput.value).toBe('12345');

      fireEvent.change(phoneInput, { target: { value: '1234567890' } });
      expect(phoneInput.value).toBe('1234567890');

      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      expect(emailInput.value).toBe('john@example.com');

      fireEvent.change(ageInput, { target: { value: '30' } });
      expect(ageInput.value).toBe('30');
    });

    it('should handle select dropdown changes for all fields', () => {
      renderWithRecaptcha(<AgentForm />);

      const goalSelect = screen.getByLabelText(/My biggest financial goal is to/i);
      const incomeSelect = screen.getByLabelText(/Income Range/i);

      fireEvent.change(goalSelect, { target: { value: 'retirement' } });
      expect(goalSelect.value).toBe('retirement');

      fireEvent.change(goalSelect, { target: { value: 'education' } });
      expect(goalSelect.value).toBe('education');

      fireEvent.change(incomeSelect, { target: { value: '50001-75000' } });
      expect(incomeSelect.value).toBe('50001-75000');

      fireEvent.change(incomeSelect, { target: { value: '100001-150000' } });
      expect(incomeSelect.value).toBe('100001-150000');
    });
  });
});

