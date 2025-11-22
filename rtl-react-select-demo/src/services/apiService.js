/**
 * API Service Factory
 * Creates an async service method for form submission
 */

/**
 * Factory function to create an API service
 * @param {string} recaptchaToken - reCAPTCHA v3 token
 * @param {Object} formData - Form data to submit
 * @returns {Promise<Object>} API response
 */
export const createFormSubmissionService = async (recaptchaToken, formData) => {
  // Simulate API call - replace with actual API endpoint
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success response
      if (recaptchaToken && formData) {
        resolve({
          status: 200,
          data: {
            message: 'Form submitted successfully',
            formData,
            recaptchaToken,
          },
        });
      } else {
        reject({
          status: 400,
          message: 'Invalid form data or missing reCAPTCHA token',
        });
      }
    }, 100);
  });
};

