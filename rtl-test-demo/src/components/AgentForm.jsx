import React, { useState, useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { validateForm, hasFormErrors } from '../utils/validation';
import { createFormSubmissionService } from '../services/formService';

const GOAL_OPTIONS = [
    { value: 'retirement', label: 'Plan for retirement' },
    { value: 'education', label: 'Save for education' },
    { value: 'home', label: 'Buy a home' },
    { value: 'debt', label: 'Pay off debt' },
    { value: 'investment', label: 'Build wealth through investments' },
];

const INCOME_RANGE_OPTIONS = [
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

    const handleInputChange = useCallback((field, value) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    }, [errors]);

    const handleSubmitError = useCallback((error) => {
        console.error('Form submission error:', error);
        setIsSubmitting(false);
        // You can add error handling logic here, e.g., show error message to user
    }, []);

    const handleRecaptchaAndSubmit = useCallback(async (recaptchaToken) => {
        try {
            setIsSubmitting(true);
            const submitService = createFormSubmissionService(recaptchaToken, formValues);
            const response = await submitService();

            if (response.status === 200) {
                const data = await response.json();
                setIsSubmitting(false);
                return data;
            } else {
                throw new Error(`Unexpected status: ${response.status}`);
            }
        } catch (error) {
            handleSubmitError(error);
            throw error;
        }
    }, [formValues, handleSubmitError]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        // Validate form
        const validationErrors = validateForm(formValues);
        setErrors(validationErrors);

        if (hasFormErrors(validationErrors)) {
            return;
        }

        // Check if reCAPTCHA is loaded
        if (!executeRecaptcha) {
            console.error('reCAPTCHA not loaded');
            return;
        }

        try {
            // Execute reCAPTCHA v3
            const recaptchaToken = await executeRecaptcha('submit_form');

            if (!recaptchaToken) {
                throw new Error('Failed to get reCAPTCHA token');
            }

            // Submit form with reCAPTCHA token
            await handleRecaptchaAndSubmit(recaptchaToken);
        } catch (error) {
            handleSubmitError(error);
        }
    }, [formValues, executeRecaptcha, handleRecaptchaAndSubmit, handleSubmitError]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <form
                    id="agent-form-demo"
                    onSubmit={handleSubmit}
                    role="form"
                    className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
                >
                    <legend className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-indigo-500">
                        Northwestern Mutual Agent Form
                    </legend>

                    <div className="space-y-6">
                        {/* Radio Group Section - Full Width */}
                        <div className="w-full">
                            <fieldset role="radiogroup" className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                <legend className="text-lg font-semibold text-gray-700 mb-4 px-2">
                                    Are you currently working together?
                                </legend>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label
                                        aria-label="Yes"
                                        className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-white transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            id="nm-agent-form-policy-owner-Yes"
                                            name="policy_owner"
                                            value="Yes"
                                            checked={formValues.policyOwner === 'Yes'}
                                            onChange={(e) => handleInputChange('policyOwner', e.target.value)}
                                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                                        />
                                        <span className="text-gray-700 font-medium">Yes</span>
                                    </label>
                                    <label
                                        aria-label="No"
                                        className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-white transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            id="nm-agent-form-policy-owner-No"
                                            name="policy_owner"
                                            value="No"
                                            checked={formValues.policyOwner === 'No'}
                                            onChange={(e) => handleInputChange('policyOwner', e.target.value)}
                                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                                        />
                                        <span className="text-gray-700 font-medium">No</span>
                                    </label>
                                </div>
                                <small className="block mt-3 text-sm text-gray-500 px-2">
                                    Please select if you are currently working with this advisor.
                                </small>
                            </fieldset>
                        </div>

                        {/* Info Text Section */}
                        <div className="w-full">
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Answer some questions so I'll have a better idea of how I can help you.
                            </p>
                        </div>

                        {/* Two Column Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div className="space-y-2">
                                <label htmlFor="nm-agent-form-first-name" className="block">
                                    <span className="text-sm font-semibold text-gray-700">
                                        First Name
                                        <span aria-hidden="true" className="text-red-500 ml-1">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="nm-agent-form-first-name"
                                        name="first_name"
                                        aria-required="true"
                                        value={formValues.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className={`mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.firstName && (
                                        <small className="block text-red-500 text-sm mt-1">{errors.firstName}</small>
                                    )}
                                </label>
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <label htmlFor="nm-agent-form-last-name" className="block">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Last Name
                                        <span aria-hidden="true" className="text-red-500 ml-1">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="nm-agent-form-last-name"
                                        name="last_name"
                                        aria-required="true"
                                        value={formValues.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className={`mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.lastName && (
                                        <small className="block text-red-500 text-sm mt-1">{errors.lastName}</small>
                                    )}
                                </label>
                            </div>

                            {/* Zip Code */}
                            <div className="space-y-2">
                                <label htmlFor="nm-agent-form-zip" className="block">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Zip Code
                                        <span aria-hidden="true" className="text-red-500 ml-1">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="nm-agent-form-zip"
                                        name="zip"
                                        aria-required="true"
                                        value={formValues.zip}
                                        onChange={(e) => handleInputChange('zip', e.target.value)}
                                        className={`mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.zip ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.zip && (
                                        <small className="block text-red-500 text-sm mt-1">{errors.zip}</small>
                                    )}
                                </label>
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label htmlFor="nm-agent-form-phone" className="block">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Phone Number
                                        <span aria-hidden="true" className="text-red-500 ml-1">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="nm-agent-form-phone"
                                        name="phone"
                                        aria-required="true"
                                        value={formValues.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className={`mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.phone && (
                                        <small className="block text-red-500 text-sm mt-1">{errors.phone}</small>
                                    )}
                                </label>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="nm-agent-form-email" className="block">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Email
                                        <span aria-hidden="true" className="text-red-500 ml-1">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="nm-agent-form-email"
                                        name="email"
                                        aria-required="true"
                                        value={formValues.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.email && (
                                        <small className="block text-red-500 text-sm mt-1">{errors.email}</small>
                                    )}
                                </label>
                            </div>

                            {/* Age */}
                            <div className="space-y-2">
                                <label htmlFor="nm-lead-form-age" className="block">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Age
                                        <span aria-hidden="true" className="text-red-500 ml-1">*</span>
                                    </span>
                                    <input
                                        type="number"
                                        id="nm-lead-form-age"
                                        name="age"
                                        max="124"
                                        aria-required="true"
                                        value={formValues.age}
                                        onChange={(e) => handleInputChange('age', e.target.value)}
                                        className={`mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.age ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.age && (
                                        <small className="block text-red-500 text-sm mt-1">{errors.age}</small>
                                    )}
                                </label>
                            </div>

                            {/* Goal */}
                            <div className="space-y-2">
                                <label htmlFor="nm-lead-form-goal" className="block">
                                    <span className="text-sm font-semibold text-gray-700">
                                        My biggest financial goal is to:
                                        <span aria-hidden="true" className="text-red-500 ml-1">*</span>
                                    </span>
                                    <select
                                        id="nm-lead-form-goal"
                                        name="goal"
                                        value={formValues.goal}
                                        onChange={(e) => handleInputChange('goal', e.target.value)}
                                        aria-required="true"
                                        className={`mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white ${errors.goal ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Please select a goal...</option>
                                        {GOAL_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.goal && (
                                        <small className="block text-red-500 text-sm mt-1">{errors.goal}</small>
                                    )}
                                </label>
                            </div>

                            {/* Income Range */}
                            <div className="space-y-2">
                                <label htmlFor="nm-lead-form-income-range" className="block">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Income Range:
                                        <span aria-hidden="true" className="text-red-500 ml-1">*</span>
                                    </span>
                                    <select
                                        id="nm-lead-form-income-range"
                                        name="income_range"
                                        value={formValues.incomeRange}
                                        onChange={(e) => handleInputChange('incomeRange', e.target.value)}
                                        aria-required="true"
                                        className={`mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white ${errors.incomeRange ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Please select a range...</option>
                                        {INCOME_RANGE_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.incomeRange && (
                                        <small className="block text-red-500 text-sm mt-1">{errors.incomeRange}</small>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Disclaimer Section */}
                        <div className="w-full pt-4">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-xs text-gray-600">
                                    <small>
                                        This site is protected by reCAPTCHA and the Google{' '}
                                        <a
                                            href="https://policies.google.com/privacy"
                                            rel="nofollow noopener noreferrer"
                                            target="_blank"
                                            className="text-indigo-600 hover:text-indigo-800 underline"
                                        >
                                            <small>Privacy Policy</small>
                                        </a>{' '}
                                        and{' '}
                                        <a
                                            href="https://policies.google.com/terms"
                                            rel="nofollow noopener noreferrer"
                                            target="_blank"
                                            className="text-indigo-600 hover:text-indigo-800 underline"
                                        >
                                            <small>Terms of Service</small>
                                        </a>{' '}
                                        apply.
                                    </small>
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="w-full pt-4">
                            <button
                                type="submit"
                                id="profile-pages-nm-agent-form-submit-button"
                                disabled={isSubmitting}
                                className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </form>
                <input className="hidden" name="recaptcha_response" type="hidden" />
            </div>
        </div>
    );
};

export default AgentForm;
