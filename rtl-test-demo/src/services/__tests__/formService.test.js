import { createFormSubmissionService } from '../formService';

// Mock fetch globally
global.fetch = jest.fn();

describe('Form Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should create a service function that makes POST request with correct data', async () => {
    const recaptchaToken = 'test-recaptcha-token';
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    };

    fetch.mockResolvedValue(mockResponse);

    const submitService = createFormSubmissionService(recaptchaToken, formData);
    const response = await submitService();

    expect(fetch).toHaveBeenCalledWith('/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        recaptcha_response: recaptchaToken,
      }),
    });

    expect(response).toEqual(mockResponse);
  });

  it('should throw error on non-ok response', async () => {
    const recaptchaToken = 'test-token';
    const formData = { firstName: 'John' };

    const mockResponse = {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    };

    fetch.mockResolvedValue(mockResponse);

    const submitService = createFormSubmissionService(recaptchaToken, formData);

    await expect(submitService()).rejects.toThrow('API Error: 400 Bad Request');
  });

  it('should include recaptcha_response in request body', async () => {
    const recaptchaToken = 'token-123';
    const formData = {
      firstName: 'Jane',
      lastName: 'Smith',
    };

    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    };

    fetch.mockResolvedValue(mockResponse);

    const submitService = createFormSubmissionService(recaptchaToken, formData);
    await submitService();

    const callArgs = fetch.mock.calls[0];
    const requestBody = JSON.parse(callArgs[1].body);

    expect(requestBody.recaptcha_response).toBe(recaptchaToken);
    expect(requestBody.firstName).toBe('Jane');
    expect(requestBody.lastName).toBe('Smith');
  });
});

