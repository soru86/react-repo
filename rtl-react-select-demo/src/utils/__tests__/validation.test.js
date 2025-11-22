import {
  validateFirstName,
  validateLastName,
  validateZipCode,
  validatePhoneNumber,
  validateEmail,
  validateAge,
  validateGoal,
  validateIncomeRange,
  validatePolicyOwner,
  validateForm,
  hasFormErrors,
} from '../validation';

describe('Validation Utilities', () => {
  describe('validateFirstName', () => {
    it('should return error for empty first name', () => {
      expect(validateFirstName('')).toBe('Please enter a valid first name.');
      expect(validateFirstName('   ')).toBe('Please enter a valid first name.');
      expect(validateFirstName(null)).toBe('Please enter a valid first name.');
      expect(validateFirstName(undefined)).toBe('Please enter a valid first name.');
    });

    it('should return error for first name less than 2 characters', () => {
      expect(validateFirstName('A')).toBe('First name must be at least 2 characters.');
    });

    it('should return empty string for valid first name', () => {
      expect(validateFirstName('John')).toBe('');
      expect(validateFirstName('Jo')).toBe('');
      expect(validateFirstName('  John  ')).toBe('');
    });
  });

  describe('validateLastName', () => {
    it('should return error for empty last name', () => {
      expect(validateLastName('')).toBe('Please enter a valid last name.');
      expect(validateLastName('   ')).toBe('Please enter a valid last name.');
      expect(validateLastName(null)).toBe('Please enter a valid last name.');
      expect(validateLastName(undefined)).toBe('Please enter a valid last name.');
    });

    it('should return error for last name less than 2 characters', () => {
      expect(validateLastName('D')).toBe('Last name must be at least 2 characters.');
    });

    it('should return empty string for valid last name', () => {
      expect(validateLastName('Doe')).toBe('');
      expect(validateLastName('Do')).toBe('');
      expect(validateLastName('  Doe  ')).toBe('');
    });
  });

  describe('validateZipCode', () => {
    it('should return error for empty zip code', () => {
      expect(validateZipCode('')).toBe('Please enter a valid zip code.');
      expect(validateZipCode('   ')).toBe('Please enter a valid zip code.');
      expect(validateZipCode(null)).toBe('Please enter a valid zip code.');
      expect(validateZipCode(undefined)).toBe('Please enter a valid zip code.');
    });

    it('should return error for invalid zip code format', () => {
      expect(validateZipCode('1234')).toBe('Please enter a valid zip code.');
      expect(validateZipCode('123456')).toBe('Please enter a valid zip code.');
      expect(validateZipCode('abcde')).toBe('Please enter a valid zip code.');
      expect(validateZipCode('12345-123')).toBe('Please enter a valid zip code.');
    });

    it('should return empty string for valid zip code', () => {
      expect(validateZipCode('12345')).toBe('');
      expect(validateZipCode('12345-6789')).toBe('');
      expect(validateZipCode('  12345  ')).toBe('');
    });
  });

  describe('validatePhoneNumber', () => {
    it('should return error for empty phone number', () => {
      expect(validatePhoneNumber('')).toBe('Please enter a valid phone number.');
      expect(validatePhoneNumber('   ')).toBe('Please enter a valid phone number.');
      expect(validatePhoneNumber(null)).toBe('Please enter a valid phone number.');
      expect(validatePhoneNumber(undefined)).toBe('Please enter a valid phone number.');
    });

    it('should return error for invalid phone number', () => {
      expect(validatePhoneNumber('123')).toBe('Please enter a valid phone number.');
      expect(validatePhoneNumber('abc')).toBe('Please enter a valid phone number.');
      expect(validatePhoneNumber('123456789')).toBe('Please enter a valid phone number.');
    });

    it('should return empty string for valid phone number', () => {
      expect(validatePhoneNumber('1234567890')).toBe('');
      expect(validatePhoneNumber('(123) 456-7890')).toBe('');
      expect(validatePhoneNumber('123-456-7890')).toBe('');
      expect(validatePhoneNumber('  1234567890  ')).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should return error for empty email', () => {
      expect(validateEmail('')).toBe('Please enter a valid email address.');
      expect(validateEmail('   ')).toBe('Please enter a valid email address.');
      expect(validateEmail(null)).toBe('Please enter a valid email address.');
      expect(validateEmail(undefined)).toBe('Please enter a valid email address.');
    });

    it('should return error for invalid email format', () => {
      expect(validateEmail('invalid')).toBe('Please enter a valid email address.');
      expect(validateEmail('invalid@')).toBe('Please enter a valid email address.');
      expect(validateEmail('@invalid.com')).toBe('Please enter a valid email address.');
      expect(validateEmail('invalid.com')).toBe('Please enter a valid email address.');
    });

    it('should return empty string for valid email', () => {
      expect(validateEmail('test@example.com')).toBe('');
      expect(validateEmail('user.name@example.co.uk')).toBe('');
      expect(validateEmail('  test@example.com  ')).toBe('');
    });
  });

  describe('validateAge', () => {
    it('should return error for empty age', () => {
      expect(validateAge('')).toBe('Please enter a valid age.');
      expect(validateAge(null)).toBe('Please enter a valid age.');
      expect(validateAge(undefined)).toBe('Please enter a valid age.');
    });

    it('should return error for invalid age', () => {
      expect(validateAge('0')).toBe('Please enter a valid age.');
      expect(validateAge('125')).toBe('Please enter a valid age.');
      expect(validateAge('abc')).toBe('Please enter a valid age.');
      expect(validateAge('-5')).toBe('Please enter a valid age.');
    });

    it('should return empty string for valid age', () => {
      expect(validateAge('1')).toBe('');
      expect(validateAge('25')).toBe('');
      expect(validateAge('124')).toBe('');
    });
  });

  describe('validateGoal', () => {
    it('should return error for empty goal', () => {
      expect(validateGoal('')).toBe('Please select a goal');
      expect(validateGoal(null)).toBe('Please select a goal');
      expect(validateGoal(undefined)).toBe('Please select a goal');
    });

    it('should return empty string for valid goal', () => {
      expect(validateGoal('retirement')).toBe('');
      expect(validateGoal('education')).toBe('');
    });
  });

  describe('validateIncomeRange', () => {
    it('should return error for empty income range', () => {
      expect(validateIncomeRange('')).toBe('Please select an income range.');
      expect(validateIncomeRange(null)).toBe('Please select an income range.');
      expect(validateIncomeRange(undefined)).toBe('Please select an income range.');
    });

    it('should return empty string for valid income range', () => {
      expect(validateIncomeRange('0-25000')).toBe('');
      expect(validateIncomeRange('150001+')).toBe('');
    });
  });

  describe('validatePolicyOwner', () => {
    it('should return error for empty policy owner', () => {
      expect(validatePolicyOwner('')).toBe('Please select if you are currently working with this advisor.');
      expect(validatePolicyOwner(null)).toBe('Please select if you are currently working with this advisor.');
      expect(validatePolicyOwner(undefined)).toBe('Please select if you are currently working with this advisor.');
    });

    it('should return empty string for valid policy owner', () => {
      expect(validatePolicyOwner('Yes')).toBe('');
      expect(validatePolicyOwner('No')).toBe('');
    });
  });

  describe('validateForm', () => {
    it('should validate all form fields and return errors object', () => {
      const formValues = {
        firstName: '',
        lastName: '',
        zip: '',
        phone: '',
        email: '',
        age: '',
        goal: '',
        incomeRange: '',
        policyOwner: '',
      };

      const errors = validateForm(formValues);

      expect(errors).toHaveProperty('firstName');
      expect(errors).toHaveProperty('lastName');
      expect(errors).toHaveProperty('zip');
      expect(errors).toHaveProperty('phone');
      expect(errors).toHaveProperty('email');
      expect(errors).toHaveProperty('age');
      expect(errors).toHaveProperty('goal');
      expect(errors).toHaveProperty('incomeRange');
      expect(errors).toHaveProperty('policyOwner');
    });

    it('should return empty errors for valid form values', () => {
      const formValues = {
        firstName: 'John',
        lastName: 'Doe',
        zip: '12345',
        phone: '1234567890',
        email: 'john@example.com',
        age: '30',
        goal: 'retirement',
        incomeRange: '50001-75000',
        policyOwner: 'Yes',
      };

      const errors = validateForm(formValues);

      expect(errors.firstName).toBe('');
      expect(errors.lastName).toBe('');
      expect(errors.zip).toBe('');
      expect(errors.phone).toBe('');
      expect(errors.email).toBe('');
      expect(errors.age).toBe('');
      expect(errors.goal).toBe('');
      expect(errors.incomeRange).toBe('');
      expect(errors.policyOwner).toBe('');
    });
  });

  describe('hasFormErrors', () => {
    it('should return true if form has errors', () => {
      const errors = {
        firstName: 'Error',
        lastName: '',
        zip: '',
      };

      expect(hasFormErrors(errors)).toBe(true);
    });

    it('should return false if form has no errors', () => {
      const errors = {
        firstName: '',
        lastName: '',
        zip: '',
      };

      expect(hasFormErrors(errors)).toBe(false);
    });

    it('should return false for empty errors object', () => {
      expect(hasFormErrors({})).toBe(false);
    });
  });
});

