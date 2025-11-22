import { createFormSubmissionService } from '../apiService';

describe('API Service', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should resolve with 200 status when recaptchaToken and formData are provided', async () => {
    const recaptchaToken = 'test-token';
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
    };

    const promise = createFormSubmissionService(recaptchaToken, formData);
    jest.advanceTimersByTime(100);

    const response = await promise;

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Form submitted successfully');
    expect(response.data.formData).toEqual(formData);
    expect(response.data.recaptchaToken).toBe(recaptchaToken);
  });

  it('should reject when recaptchaToken is missing', async () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
    };

    const promise = createFormSubmissionService(null, formData);
    jest.advanceTimersByTime(100);

    await expect(promise).rejects.toEqual({
      status: 400,
      message: 'Invalid form data or missing reCAPTCHA token',
    });
  });

  it('should reject when formData is missing', async () => {
    const recaptchaToken = 'test-token';

    const promise = createFormSubmissionService(recaptchaToken, null);
    jest.advanceTimersByTime(100);

    await expect(promise).rejects.toEqual({
      status: 400,
      message: 'Invalid form data or missing reCAPTCHA token',
    });
  });

  it('should reject when both recaptchaToken and formData are missing', async () => {
    const promise = createFormSubmissionService(null, null);
    jest.advanceTimersByTime(100);

    await expect(promise).rejects.toEqual({
      status: 400,
      message: 'Invalid form data or missing reCAPTCHA token',
    });
  });

  it('should handle empty formData object', async () => {
    const recaptchaToken = 'test-token';
    const formData = {};

    const promise = createFormSubmissionService(recaptchaToken, formData);
    jest.advanceTimersByTime(100);

    const response = await promise;

    expect(response.status).toBe(200);
    expect(response.data.formData).toEqual({});
  });
});

