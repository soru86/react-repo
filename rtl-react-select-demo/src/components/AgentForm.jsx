import React, { useState, useCallback } from 'react';
import Select from 'react-select';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import styled from 'styled-components';
import { validateForm, hasFormErrors } from '../utils/validation';
import { createFormSubmissionService } from '../services/apiService';

// Styled Components with Tailwind CSS classes
const FormContainer = styled.div.attrs({
  className: 'max-w-6xl mx-auto p-8',
})``;

const FormStyled = styled.form.attrs({
  className: 'bg-white rounded-lg p-8 shadow-sm',
})``;

const LegendStyled = styled.legend.attrs({
  className: 'text-2xl font-bold mb-6 block w-full',
})``;

const Container = styled.div.attrs({
  className: 'w-full',
})``;

const Row = styled.div.attrs({
  className: 'flex flex-wrap mb-4 gap-4',
})``;

const Col = styled.div.attrs({
  className: 'flex-1 min-w-[250px] md:flex-[1_1_calc(50%-0.5rem)]',
})``;

const FullWidthCol = styled.div.attrs({
  className: 'flex-1 w-full',
})``;

const FieldSet = styled.fieldset.attrs({
  className: 'border-0 p-0 m-0',
})``;

const LegendFieldSet = styled.legend.attrs({
  className: 'text-base font-semibold mb-2 block w-full',
})``;

const RadioGroup = styled.div.attrs({
  className: 'flex gap-4 mb-2',
})``;

const RadioLabel = styled.label.attrs({
  className: 'flex items-center cursor-pointer text-base',
})``;

const RadioInput = styled.input.attrs({
  className: 'mr-2',
})``;

const Label = styled.label.attrs({
  className: 'flex flex-col mb-4 text-sm',
})``;

const LabelText = styled.span.attrs({
  className: 'mb-2 font-medium',
})``;

const RequiredIndicator = styled.span.attrs({
  className: 'text-red-600 ml-1',
})``;

const Input = styled.input.attrs({
  className: 'px-3 py-3 border border-gray-300 rounded text-base w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 invalid:border-red-500',
})``;

const SelectContainer = styled.div.attrs({
  className: 'mb-2',
})``;

const HelperText = styled.small.attrs({
  className: 'text-red-600 text-sm mt-1 block',
})``;

const Button = styled.button.attrs({
  className: 'bg-blue-600 text-white px-8 py-3 border-none rounded text-base font-semibold cursor-pointer transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed',
})``;

const Disclaimer = styled.div.attrs({
  className: 'my-4 text-sm text-gray-600',
})`
  a {
    color: #2563eb;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Paragraph = styled.p.attrs({
  className: 'mb-4 text-gray-700',
})``;

// Dropdown options
const goalOptions = [
  { value: 'retirement', label: 'Plan for retirement' },
  { value: 'education', label: 'Save for education' },
  { value: 'home', label: 'Buy a home' },
  { value: 'debt', label: 'Pay off debt' },
  { value: 'invest', label: 'Invest for growth' },
  { value: 'other', label: 'Other' },
];

const incomeRangeOptions = [
  { value: '0-25000', label: '$0 - $25,000' },
  { value: '25001-50000', label: '$25,001 - $50,000' },
  { value: '50001-75000', label: '$50,001 - $75,000' },
  { value: '75001-100000', label: '$75,001 - $100,000' },
  { value: '100001-150000', label: '$100,001 - $150,000' },
  { value: '150001+', label: '$150,001+' },
];

const AgentForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formValues, setFormValues] = useState({
    policyOwner: 'No',
    firstName: '',
    lastName: '',
    zip: '',
    phone: '',
    email: '',
    age: '',
    goal: '',
    incomeRange: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handles select dropdown changes following react-select's standard onChange contract
   * @param {string} name - The field name
   * @param {Object|null} option - The selected option or null
   * @param {Object} actionMeta - Action metadata from react-select
   */
  const handleSelectChange = (name) => (option, actionMeta) => {
    // Handle different action types from react-select
    if (actionMeta.action === 'clear' || actionMeta.action === 'remove-value') {
      setFormValues((prev) => ({
        ...prev,
        [name]: '',
      }));
    } else if (actionMeta.action === 'select-option') {
      setFormValues((prev) => ({
        ...prev,
        [name]: option ? option.value : '',
      }));
    } else if (actionMeta.action === 'create-option') {
      setFormValues((prev) => ({
        ...prev,
        [name]: option ? option.value : '',
      }));
    }

    // Clear error when user selects or clears
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmitError = (error) => {
    console.error('Form submission error:', error);
    setIsSubmitting(false);
    // You can add error handling UI here
    alert('An error occurred while submitting the form. Please try again.');
  };

  const handleRecaptchaAndSubmit = useCallback(async () => {
    if (!executeRecaptcha) {
      console.error('reCAPTCHA not loaded');
      handleSubmitError({ message: 'reCAPTCHA not loaded' });
      return;
    }

    // If executeRecaptcha is not a function, throw before try-catch
    // so it can be caught by handleSubmit's catch block (line 234)
    if (typeof executeRecaptcha !== 'function') {
      throw new Error('executeRecaptcha is not a function');
    }

    try {
      const recaptchaToken = await executeRecaptcha('form_submit');

      if (!recaptchaToken) {
        handleSubmitError({ message: 'Failed to get reCAPTCHA token' });
        return;
      }

      const response = await createFormSubmissionService(recaptchaToken, formValues);

      if (response.status === 200) {
        setIsSubmitting(false);
        alert('Form submitted successfully!');
        // Reset form
        setFormValues({
          policyOwner: 'No',
          firstName: '',
          lastName: '',
          zip: '',
          phone: '',
          email: '',
          age: '',
          goal: '',
          incomeRange: '',
        });
        setErrors({});
      } else {
        handleSubmitError(response);
      }
    } catch (error) {
      handleSubmitError(error);
    }
  }, [executeRecaptcha, formValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const validationErrors = validateForm(formValues);
    setErrors(validationErrors);

    if (hasFormErrors(validationErrors)) {
      setIsSubmitting(false);
      return;
    }

    // Proceed with reCAPTCHA and submit
    try {
      await handleRecaptchaAndSubmit();
    } catch (error) {
      // Error is already handled in handleRecaptchaAndSubmit
      // This catch block is a safety net for unexpected errors
      console.error('Unexpected error in handleSubmit:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormStyled id="agent-form-demo" onSubmit={handleSubmit}>
        <LegendStyled>Northwestern Mutual Agent Form</LegendStyled>

        <Container>
          <Row>
            <FullWidthCol>
              <FieldSet role="radiogroup">
                <LegendFieldSet>Are you currently working together?</LegendFieldSet>
                <RadioGroup>
                  <RadioLabel aria-label="Yes">
                    <RadioInput
                      type="radio"
                      name="policyOwner"
                      id="nm-agent-form-policy-owner-Yes"
                      value="Yes"
                      checked={formValues.policyOwner === 'Yes'}
                      onChange={handleInputChange}
                    />
                    Yes
                  </RadioLabel>
                  <RadioLabel aria-label="No">
                    <RadioInput
                      type="radio"
                      name="policyOwner"
                      id="nm-agent-form-policy-owner-No"
                      value="No"
                      checked={formValues.policyOwner === 'No'}
                      onChange={handleInputChange}
                    />
                    No
                  </RadioLabel>
                </RadioGroup>
                {errors.policyOwner && <HelperText>{errors.policyOwner}</HelperText>}
              </FieldSet>
            </FullWidthCol>
          </Row>

          <Row>
            <FullWidthCol>
              <Paragraph>
                Answer some questions so I'll have a better idea of how I can help you.
              </Paragraph>
            </FullWidthCol>
          </Row>

          <Row>
            <Col>
              <Label>
                <LabelText>
                  First Name
                  <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
                </LabelText>
                <Input
                  type="text"
                  id="nm-agent-form-first-name"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  aria-required="true"
                />
                {errors.firstName && <HelperText>{errors.firstName}</HelperText>}
              </Label>
            </Col>

            <Col>
              <Label>
                <LabelText>
                  Last Name
                  <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
                </LabelText>
                <Input
                  type="text"
                  id="nm-agent-form-last-name"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  aria-required="true"
                />
                {errors.lastName && <HelperText>{errors.lastName}</HelperText>}
              </Label>
            </Col>
          </Row>

          <Row>
            <Col>
              <Label>
                <LabelText>
                  Zip Code
                  <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
                </LabelText>
                <Input
                  type="text"
                  id="nm-agent-form-zip"
                  name="zip"
                  value={formValues.zip}
                  onChange={handleInputChange}
                  aria-required="true"
                />
                {errors.zip && <HelperText>{errors.zip}</HelperText>}
              </Label>
            </Col>

            <Col>
              <Label>
                <LabelText>
                  Phone Number
                  <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
                </LabelText>
                <Input
                  type="text"
                  id="nm-agent-form-phone"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleInputChange}
                  aria-required="true"
                />
                {errors.phone && <HelperText>{errors.phone}</HelperText>}
              </Label>
            </Col>
          </Row>

          <Row>
            <Col>
              <Label>
                <LabelText>
                  Email
                  <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
                </LabelText>
                <Input
                  type="email"
                  id="nm-agent-form-email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  aria-required="true"
                />
                {errors.email && <HelperText>{errors.email}</HelperText>}
              </Label>
            </Col>

            <Col>
              <Label>
                <LabelText>
                  Age
                  <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
                </LabelText>
                <Input
                  type="number"
                  id="nm-lead-form-age"
                  name="age"
                  max="124"
                  value={formValues.age}
                  onChange={handleInputChange}
                  aria-required="true"
                />
                {errors.age && <HelperText>{errors.age}</HelperText>}
              </Label>
            </Col>
          </Row>

          <Row>
            <Col>
              <Label htmlFor="nm-lead-form-goal">
                <LabelText>
                  My biggest financial goal is to:
                  <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
                </LabelText>
                <SelectContainer>
                  <Select
                    inputId="nm-lead-form-goal"
                    name="goal"
                    options={goalOptions}
                    value={goalOptions.find((option) => option.value === formValues.goal) || null}
                    onChange={handleSelectChange('goal')}
                    placeholder="Please select a goal..."
                    isSearchable
                    aria-required="true"
                  />
                </SelectContainer>
                {errors.goal && <HelperText>{errors.goal}</HelperText>}
              </Label>
            </Col>

            <Col>
              <Label htmlFor="nm-lead-form-income-range">
                <LabelText>
                  Income Range:
                  <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
                </LabelText>
                <SelectContainer>
                  <Select
                    inputId="nm-lead-form-income-range"
                    name="incomeRange"
                    options={incomeRangeOptions}
                    value={incomeRangeOptions.find((option) => option.value === formValues.incomeRange) || null}
                    onChange={handleSelectChange('incomeRange')}
                    placeholder="Please select a range..."
                    isSearchable
                    aria-required="true"
                  />
                </SelectContainer>
                {errors.incomeRange && <HelperText>{errors.incomeRange}</HelperText>}
              </Label>
            </Col>
          </Row>

          <Row>
            <FullWidthCol>
              <Disclaimer>
                <p>
                  <small>
                    This site is protected by reCAPTCHA and the Google{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      rel="nofollow noopener noreferrer"
                      target="_blank"
                    >
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://policies.google.com/terms"
                      rel="nofollow noopener noreferrer"
                      target="_blank"
                    >
                      Terms of Service
                    </a>{' '}
                    apply.
                  </small>
                </p>
              </Disclaimer>
            </FullWidthCol>
          </Row>

          <Row>
            <FullWidthCol>
              <Button
                type="submit"
                id="profile-pages-nm-agent-form-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </FullWidthCol>
          </Row>
        </Container>
      </FormStyled>
    </FormContainer>
  );
};

export default AgentForm;

