/**
 * Validation utility functions for form fields
 */

export const validateFirstName = (firstName) => {
  if (!firstName || firstName.trim() === '') {
    return 'Please enter a valid first name.';
  }
  if (firstName.trim().length < 2) {
    return 'First name must be at least 2 characters.';
  }
  return '';
};

export const validateLastName = (lastName) => {
  if (!lastName || lastName.trim() === '') {
    return 'Please enter a valid last name.';
  }
  if (lastName.trim().length < 2) {
    return 'Last name must be at least 2 characters.';
  }
  return '';
};

export const validateZipCode = (zip) => {
  if (!zip || zip.trim() === '') {
    return 'Please enter a valid zip code.';
  }
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zip.trim())) {
    return 'Please enter a valid zip code.';
  }
  return '';
};

export const validatePhoneNumber = (phone) => {
  if (!phone || phone.trim() === '') {
    return 'Please enter a valid phone number.';
  }
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, '');
  if (!phoneRegex.test(phone.trim()) || digitsOnly.length < 10) {
    return 'Please enter a valid phone number.';
  }
  return '';
};

export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Please enter a valid email address.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  return '';
};

export const validateAge = (age) => {
  if (!age || age === '') {
    return 'Please enter a valid age.';
  }
  const ageNum = parseInt(age, 10);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 124) {
    return 'Please enter a valid age.';
  }
  return '';
};

export const validateGoal = (goal) => {
  if (!goal || goal.trim() === '') {
    return 'Please select a goal';
  }
  return '';
};

export const validateIncomeRange = (incomeRange) => {
  if (!incomeRange || incomeRange.trim() === '') {
    return 'Please select an income range.';
  }
  return '';
};

export const validatePolicyOwner = (policyOwner) => {
  if (!policyOwner || (policyOwner !== 'Yes' && policyOwner !== 'No')) {
    return 'Please select if you are currently working with this advisor.';
  }
  return '';
};

/**
 * Validates all form fields
 * @param {Object} formValues - Object containing all form field values
 * @returns {Object} Object with validation errors for each field
 */
export const validateForm = (formValues) => {
  const errors = {};

  errors.firstName = validateFirstName(formValues.firstName);
  errors.lastName = validateLastName(formValues.lastName);
  errors.zip = validateZipCode(formValues.zip);
  errors.phone = validatePhoneNumber(formValues.phone);
  errors.email = validateEmail(formValues.email);
  errors.age = validateAge(formValues.age);
  errors.goal = validateGoal(formValues.goal);
  errors.incomeRange = validateIncomeRange(formValues.incomeRange);
  errors.policyOwner = validatePolicyOwner(formValues.policyOwner);

  return errors;
};

/**
 * Checks if form has any validation errors
 * @param {Object} errors - Object containing validation errors
 * @returns {boolean} True if form has errors, false otherwise
 */
export const hasFormErrors = (errors) => {
  return Object.values(errors).some((error) => error !== '');
};

