/**
 * Service factory for form submission API calls
 */

/**
 * Creates and returns a service function for submitting form data
 * @param {string} recaptchaToken - reCAPTCHA v3 token
 * @param {Object} formData - Form data to submit
 * @returns {Promise<Response>} Promise that resolves to the API response
 */
export const createFormSubmissionService = (recaptchaToken, formData) => {
  return async () => {
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        recaptcha_response: recaptchaToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response;
  };
};

