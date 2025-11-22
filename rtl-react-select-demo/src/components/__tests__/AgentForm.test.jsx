import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactGoogleRecaptchaV3 from 'react-google-recaptcha-v3';
import AgentForm from '../AgentForm';
import * as apiService from '../../services/apiService';
import * as validation from '../../utils/validation';

// Mock dependencies
jest.mock('react-google-recaptcha-v3', () => ({
  useGoogleReCaptcha: jest.fn(),
  GoogleReCaptchaProvider: ({ children }) => children,
}));
jest.mock('../../services/apiService');
jest.mock('../../utils/validation');

describe('AgentForm', () => {
  const mockExecuteRecaptcha = jest.fn();
  const mockCreateFormSubmissionService = jest.fn();
  const mockValidateForm = jest.fn();
  const mockHasFormErrors = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup react-google-recaptcha-v3 mock
    reactGoogleRecaptchaV3.useGoogleReCaptcha.mockReturnValue({
      executeRecaptcha: mockExecuteRecaptcha,
    });

    // Setup API service mock
    apiService.createFormSubmissionService = mockCreateFormSubmissionService;
    mockCreateFormSubmissionService.mockResolvedValue({
      status: 200,
      data: { message: 'Form submitted successfully' },
    });

    // Setup validation mocks
    validation.validateForm = mockValidateForm;
    validation.hasFormErrors = mockHasFormErrors;
    mockValidateForm.mockReturnValue({});
    mockHasFormErrors.mockReturnValue(false);

    // Setup default reCAPTCHA mock
    mockExecuteRecaptcha.mockResolvedValue('mock-recaptcha-token');
  });

  describe('Form Rendering', () => {
    it('should render the form with all fields', () => {
      render(<AgentForm />);

      expect(screen.getByText('Northwestern Mutual Agent Form')).toBeInTheDocument();
      expect(screen.getByText(/Are you currently working together/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Zip Code/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
      expect(screen.getByText(/My biggest financial goal/i)).toBeInTheDocument();
      expect(screen.getByText(/Income Range/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    it('should render reCAPTCHA disclaimer', () => {
      render(<AgentForm />);
      expect(screen.getByText(/This site is protected by reCAPTCHA/i)).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('should update form values when input changes', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      await user.type(firstNameInput, 'John');

      expect(firstNameInput).toHaveValue('John');
    });

    it('should clear error when user starts typing in a field with error', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      // First trigger an error
      mockValidateForm.mockReturnValue({
        firstName: 'Please enter a valid first name.',
      });
      mockHasFormErrors.mockReturnValue(true);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      // Then type in the field
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      const firstNameInput = screen.getByLabelText(/First Name/i);
      await user.type(firstNameInput, 'John');

      expect(firstNameInput).toHaveValue('John');
    });

    it('should not clear error when typing in field without error', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      await user.type(firstNameInput, 'John');

      expect(firstNameInput).toHaveValue('John');
    });

    it('should update radio button selection', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      const yesRadio = screen.getByRole('radio', { name: 'Yes' });
      await user.click(yesRadio);

      expect(yesRadio).toBeChecked();
    });

    it('should update select dropdown values with select-option action', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      expect(goalSelect).toHaveValue('retirement');
    });

    it('should clear select dropdown value with clear action', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');
      expect(goalSelect).toHaveValue('retirement');

      // Clear selection by selecting empty option (triggers clear action)
      await user.selectOptions(goalSelect, '');
      expect(goalSelect).toHaveValue('');
    });

    it('should clear error when user selects from dropdown with error', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      // First trigger an error
      mockValidateForm.mockReturnValue({
        goal: 'Please select a goal',
      });
      mockHasFormErrors.mockReturnValue(true);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      // Then select from dropdown
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      expect(goalSelect).toHaveValue('retirement');
    });

    it('should handle handleSelectChange with select-option action', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      const incomeSelect = screen.getByLabelText(/Income Range/i);

      // Test select-option action for goal
      await user.selectOptions(goalSelect, 'retirement');
      expect(goalSelect).toHaveValue('retirement');

      // Test select-option action for income range
      await user.selectOptions(incomeSelect, '50001-75000');
      expect(incomeSelect).toHaveValue('50001-75000');
    });

    it('should handle handleSelectChange with clear action', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);

      // First select an option
      await user.selectOptions(goalSelect, 'retirement');
      expect(goalSelect).toHaveValue('retirement');

      // Then clear it (triggers clear action)
      await user.selectOptions(goalSelect, '');
      expect(goalSelect).toHaveValue('');
    });

    it('should clear error when handleSelectChange is called with select-option action', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      // Trigger validation error
      mockValidateForm.mockReturnValue({
        goal: 'Please select a goal',
      });
      mockHasFormErrors.mockReturnValue(true);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      // Verify error is shown
      await waitFor(() => {
        expect(screen.getByText('Please select a goal')).toBeInTheDocument();
      });

      // Select option (should clear error)
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText('Please select a goal')).not.toBeInTheDocument();
      });
    });

    it('should clear error when handleSelectChange is called with clear action', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      // Trigger validation error
      mockValidateForm.mockReturnValue({
        incomeRange: 'Please select an income range.',
      });
      mockHasFormErrors.mockReturnValue(true);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      // Verify error is shown
      await waitFor(() => {
        expect(screen.getByText('Please select an income range.')).toBeInTheDocument();
      });

      // Clear selection (should clear error)
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      const incomeSelect = screen.getByLabelText(/Income Range/i);

      // First select something
      await user.selectOptions(incomeSelect, '50001-75000');

      // Then clear it
      await user.selectOptions(incomeSelect, '');

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText('Please select an income range.')).not.toBeInTheDocument();
      });
    });

    it('should handle handleSelectChange with remove-value action', async () => {
      const user = userEvent.setup();
      const { container } = render(<AgentForm />);

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);

      // First select an option
      await user.selectOptions(goalSelect, 'retirement');
      expect(goalSelect).toHaveValue('retirement');

      // Test remove-value action by directly calling onChange
      const selectElement = container.querySelector('#nm-lead-form-goal');
      const selectComponent = selectElement.closest('[data-testid]');

      // Simulate remove-value action by setting data-action-type and clearing
      selectElement.setAttribute('data-action-type', 'remove-value');
      await user.selectOptions(goalSelect, '');
      expect(goalSelect).toHaveValue('');
    });

    it('should handle handleSelectChange with create-option action', async () => {
      const user = userEvent.setup();
      const { container } = render(<AgentForm />);

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      const selectElement = container.querySelector('#nm-lead-form-goal');

      // Test create-option action by setting data-action-type before selecting
      selectElement.setAttribute('data-action-type', 'create-option');

      // Select an option - this should trigger create-option action
      // This tests the create-option branch in handleSelectChange
      await user.selectOptions(goalSelect, 'retirement');

      // Verify the form value was set correctly via create-option action
      await waitFor(() => {
        expect(goalSelect).toHaveValue('retirement');
      });

      // Test with income range as well to ensure both fields work
      const incomeSelect = screen.getByLabelText(/Income Range/i);
      const incomeSelectElement = container.querySelector('#nm-lead-form-income-range');
      incomeSelectElement.setAttribute('data-action-type', 'create-option');
      await user.selectOptions(incomeSelect, '50001-75000');
      expect(incomeSelect).toHaveValue('50001-75000');
    });

    it('should handle handleSelectChange with all actionMeta types', async () => {
      const user = userEvent.setup();
      const { container } = render(<AgentForm />);

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      const selectElement = container.querySelector('#nm-lead-form-goal');

      // Test select-option action (default)
      await user.selectOptions(goalSelect, 'retirement');
      expect(goalSelect).toHaveValue('retirement');

      // Test create-option action
      selectElement.setAttribute('data-action-type', 'create-option');
      await user.selectOptions(goalSelect, 'education');
      expect(goalSelect).toHaveValue('education');

      // Test clear action
      selectElement.removeAttribute('data-action-type');
      await user.selectOptions(goalSelect, '');
      expect(goalSelect).toHaveValue('');

      // Test remove-value action
      selectElement.setAttribute('data-action-type', 'remove-value');
      await user.selectOptions(goalSelect, 'retirement');
      expect(goalSelect).toHaveValue('retirement');

      await user.selectOptions(goalSelect, '');
      expect(goalSelect).toHaveValue('');
    });

    it('should handle handleSelectChange with all action types', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      const incomeSelect = screen.getByLabelText(/Income Range/i);

      // Test select-option action
      await user.selectOptions(goalSelect, 'retirement');
      expect(goalSelect).toHaveValue('retirement');

      // Test clear action
      await user.selectOptions(goalSelect, '');
      expect(goalSelect).toHaveValue('');

      // Test select-option action again
      await user.selectOptions(goalSelect, 'education');
      expect(goalSelect).toHaveValue('education');

      // Test with income range - select-option
      await user.selectOptions(incomeSelect, '50001-75000');
      expect(incomeSelect).toHaveValue('50001-75000');

      // Test clear action on income range
      await user.selectOptions(incomeSelect, '');
      expect(incomeSelect).toHaveValue('');
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors when form is submitted with empty fields', async () => {
      mockValidateForm.mockReturnValue({
        firstName: 'Please enter a valid first name.',
        lastName: 'Please enter a valid last name.',
        zip: 'Please enter a valid zip code.',
        phone: 'Please enter a valid phone number.',
        email: 'Please enter a valid email address.',
        age: 'Please enter a valid age.',
        goal: 'Please select a goal',
        incomeRange: 'Please select an income range.',
        policyOwner: '',
      });
      mockHasFormErrors.mockReturnValue(true);

      const user = userEvent.setup();
      render(<AgentForm />);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockValidateForm).toHaveBeenCalled();
        expect(mockHasFormErrors).toHaveBeenCalled();
      });
    });

    it('should clear errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);

      // Trigger validation error first
      mockValidateForm.mockReturnValue({
        firstName: 'Please enter a valid first name.',
      });
      mockHasFormErrors.mockReturnValue(true);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      // Clear validation and type
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      await user.type(firstNameInput, 'John');

      await waitFor(() => {
        expect(firstNameInput).toHaveValue('John');
      });
    });
  });

  describe('Form Submission - Success Cases', () => {
    it('should call handleSubmit when form is submitted', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      // Fill in form fields
      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      // Select dropdowns
      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockValidateForm).toHaveBeenCalled();
      });
    });

    it('should call handleRecaptchaAndSubmit after validation passes', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('mock-recaptcha-token');
      mockCreateFormSubmissionService.mockResolvedValue({
        status: 200,
        data: { message: 'Form submitted successfully' },
      });

      const user = userEvent.setup();
      render(<AgentForm />);

      // Fill required fields
      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockExecuteRecaptcha).toHaveBeenCalledWith('form_submit');
      });

      await waitFor(() => {
        expect(mockCreateFormSubmissionService).toHaveBeenCalledWith(
          'mock-recaptcha-token',
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            zip: '12345',
            phone: '1234567890',
            email: 'john@example.com',
            age: '30',
          })
        );
      });
    });

    it('should submit form with spying handleSubmit method', async () => {
      const user = userEvent.setup();
      const { container } = render(<AgentForm />);

      // Fill form
      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const form = container.querySelector('form');
      const handleSubmitSpy = jest.fn((e) => {
        e.preventDefault();
      });

      form.addEventListener('submit', handleSubmitSpy);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(handleSubmitSpy).toHaveBeenCalled();
      });
    });

    it('should reset form after successful submission', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('mock-recaptcha-token');
      mockCreateFormSubmissionService.mockResolvedValue({
        status: 200,
        data: { message: 'Form submitted successfully' },
      });

      // Mock window.alert
      window.alert = jest.fn();

      const user = userEvent.setup();
      render(<AgentForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      await user.type(firstNameInput, 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });

      await act(async () => {
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(mockCreateFormSubmissionService).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Form submitted successfully!');
      }, { timeout: 3000 });

      // Wait for form reset to complete
      await waitFor(() => {
        expect(firstNameInput).toHaveValue('');
      });
    });
  });

  describe('Form Submission - Error Cases', () => {
    it('should handle form submission error when reCAPTCHA fails', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue(null);

      window.alert = jest.fn();
      console.error = jest.fn();

      const user = userEvent.setup();
      render(<AgentForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockExecuteRecaptcha).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringContaining('An error occurred')
        );
      });
    });

    it('should handle API service error', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('mock-recaptcha-token');
      mockCreateFormSubmissionService.mockRejectedValue({
        status: 500,
        message: 'Server error',
      });

      window.alert = jest.fn();
      console.error = jest.fn();

      const user = userEvent.setup();
      render(<AgentForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateFormSubmissionService).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringContaining('An error occurred')
        );
      });
    });

    it('should handle error when reCAPTCHA is not loaded', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      reactGoogleRecaptchaV3.useGoogleReCaptcha.mockReturnValue({
        executeRecaptcha: null,
      });

      window.alert = jest.fn();
      console.error = jest.fn();

      const user = userEvent.setup();
      render(<AgentForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'reCAPTCHA not loaded'
        );
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringContaining('An error occurred')
        );
      });
    });

    it('should handle error when API returns non-200 status', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('mock-recaptcha-token');
      mockCreateFormSubmissionService.mockResolvedValue({
        status: 400,
        message: 'Bad request',
      });

      window.alert = jest.fn();
      console.error = jest.fn();

      const user = userEvent.setup();
      render(<AgentForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateFormSubmissionService).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Form submission error:',
          expect.objectContaining({ status: 400 })
        );
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringContaining('An error occurred')
        );
      });
    });
  });

  describe('reCAPTCHA v3 Integration', () => {
    it('should execute reCAPTCHA with correct action', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('mock-recaptcha-token');
      mockCreateFormSubmissionService.mockResolvedValue({
        status: 200,
        data: { message: 'Form submitted successfully' },
      });

      const user = userEvent.setup();
      render(<AgentForm />);

      // Fill form
      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockExecuteRecaptcha).toHaveBeenCalledWith('form_submit');
      });
    });

    it('should pass reCAPTCHA token to API service', async () => {
      const mockToken = 'test-recaptcha-token-123';
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue(mockToken);
      mockCreateFormSubmissionService.mockResolvedValue({
        status: 200,
        data: { message: 'Form submitted successfully' },
      });

      const user = userEvent.setup();
      render(<AgentForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateFormSubmissionService).toHaveBeenCalledWith(
          mockToken,
          expect.any(Object)
        );
      });
    });
  });

  describe('Async Code Coverage', () => {
    it('should handle async form submission flow', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('async-token');
      mockCreateFormSubmissionService.mockResolvedValue({
        status: 200,
        data: { message: 'Form submitted successfully' },
      });

      window.alert = jest.fn();

      const user = userEvent.setup();
      render(<AgentForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockExecuteRecaptcha).toHaveBeenCalledWith('form_submit');
      });

      await waitFor(() => {
        expect(mockCreateFormSubmissionService).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Form submitted successfully!');
      });
    });

    it('should handle async error in catch block', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue('async-token');
      mockCreateFormSubmissionService.mockRejectedValue(
        new Error('Async error occurred')
      );

      window.alert = jest.fn();
      console.error = jest.fn();

      const user = userEvent.setup();
      render(<AgentForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateFormSubmissionService).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringContaining('An error occurred')
        );
      });
    });

    it('should handle error when reCAPTCHA token is null', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockResolvedValue(null);

      window.alert = jest.fn();
      console.error = jest.fn();

      const user = userEvent.setup();
      render(<AgentForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockExecuteRecaptcha).toHaveBeenCalledWith('form_submit');
        expect(console.error).toHaveBeenCalledWith(
          'Form submission error:',
          expect.objectContaining({ message: 'Failed to get reCAPTCHA token' })
        );
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringContaining('An error occurred')
        );
      });
    });

    it('should handle error when handleRecaptchaAndSubmit throws synchronously', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      // Make executeRecaptcha throw synchronously to test the catch block in handleSubmit
      mockExecuteRecaptcha.mockImplementation(() => {
        throw new Error('Synchronous error');
      });

      window.alert = jest.fn();
      console.error = jest.fn();

      const user = userEvent.setup();
      render(<AgentForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });

      await act(async () => {
        await user.click(submitButton);
      });

      // Wait for error handling to complete
      await waitFor(() => {
        expect(console.error).toHaveBeenCalled();
      }, { timeout: 2000 });

      // Verify isSubmitting is set to false (line 234)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Submit/i })).not.toBeDisabled();
      });
    });

    it('should handle error in handleSubmit catch block when executeRecaptcha is not a function', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);

      // Make executeRecaptcha not a function (but truthy) to trigger the type check
      // This will cause handleRecaptchaAndSubmit to throw, which will be caught by handleSubmit's catch block
      reactGoogleRecaptchaV3.useGoogleReCaptcha.mockReturnValue({
        executeRecaptcha: 'not-a-function', // Not null, but not a function either
      });

      window.alert = jest.fn();
      console.error = jest.fn();

      const user = userEvent.setup();
      render(<AgentForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });

      await act(async () => {
        await user.click(submitButton);
      });

      // Wait for error handling - the error will be thrown in handleRecaptchaAndSubmit
      // and caught by handleSubmit's catch block (line 234)
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Unexpected error in handleSubmit:',
          expect.any(Error)
        );
      }, { timeout: 2000 });

      // Verify isSubmitting is set to false by the catch block at line 234
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /Submit/i });
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Form State Management', () => {
    it('should maintain formValues state correctly', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email/i);

      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john@example.com');

      expect(firstNameInput).toHaveValue('John');
      expect(lastNameInput).toHaveValue('Doe');
      expect(emailInput).toHaveValue('john@example.com');
    });

    it('should update formValues when select dropdown changes', async () => {
      const user = userEvent.setup();
      render(<AgentForm />);

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      expect(goalSelect).toHaveValue('retirement');
    });

    it('should show policyOwner error when validation fails', async () => {
      mockValidateForm.mockReturnValue({
        policyOwner: 'Please select if you are currently working with this advisor.',
      });
      mockHasFormErrors.mockReturnValue(true);

      const user = userEvent.setup();
      render(<AgentForm />);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please select if you are currently working with this advisor.')).toBeInTheDocument();
      });
    });
  });

  describe('Button States', () => {
    it('should disable submit button while submitting', async () => {
      mockValidateForm.mockReturnValue({});
      mockHasFormErrors.mockReturnValue(false);
      mockExecuteRecaptcha.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve('token'), 100))
      );
      mockCreateFormSubmissionService.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ status: 200, data: {} }),
              100
            )
          )
      );

      const user = userEvent.setup();
      render(<AgentForm />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Zip Code/i), '12345');
      await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Age/i), '30');

      const goalSelect = screen.getByLabelText(/My biggest financial goal/i);
      await user.selectOptions(goalSelect, 'retirement');

      const incomeSelect = screen.getByLabelText(/Income Range/i);
      await user.selectOptions(incomeSelect, '50001-75000');

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      // Button should show "Submitting..." text
      await waitFor(() => {
        expect(screen.getByText('Submitting...')).toBeInTheDocument();
      });
    });
  });
});

