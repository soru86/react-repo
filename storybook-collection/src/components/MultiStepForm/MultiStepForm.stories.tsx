import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { MultiStepForm, FormStep } from './MultiStepForm';
import { ThemeWrapper } from '../../utils/ThemeWrapper';
import { TextInput } from '../TextInput/TextInput';
import { Checkbox } from '../Checkbox/Checkbox';
import { Button } from '../Button/Button';

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Sample form steps
const createBasicSteps = (): FormStep[] => [
  {
    id: 'step1',
    title: 'Personal Information',
    description: 'Enter your personal details',
    icon: <UserIcon />,
    content: (
      <div className="space-y-4">
        <TextInput label="First Name" required placeholder="John" />
        <TextInput label="Last Name" required placeholder="Doe" />
        <TextInput label="Email" type="email" required placeholder="john.doe@example.com" />
        <TextInput label="Phone" type="tel" placeholder="+1 234 567 8900" />
      </div>
    ),
  },
  {
    id: 'step2',
    title: 'Account Setup',
    description: 'Create your account credentials',
    icon: <LockIcon />,
    content: (
      <div className="space-y-4">
        <TextInput label="Username" required placeholder="johndoe" />
        <TextInput label="Password" type="password" required placeholder="••••••••" />
        <TextInput label="Confirm Password" type="password" required placeholder="••••••••" />
        <Checkbox label="I agree to the terms and conditions" required />
      </div>
    ),
  },
  {
    id: 'step3',
    title: 'Payment Information',
    description: 'Add your payment details',
    icon: <CreditCardIcon />,
    content: (
      <div className="space-y-4">
        <TextInput label="Card Number" placeholder="1234 5678 9012 3456" />
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Expiry Date" placeholder="MM/YY" />
          <TextInput label="CVV" placeholder="123" />
        </div>
        <TextInput label="Cardholder Name" placeholder="John Doe" />
      </div>
    ),
  },
  {
    id: 'step4',
    title: 'Review & Submit',
    description: 'Review your information and submit',
    icon: <CheckCircleIcon />,
    content: (
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">Review your information</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please review all the information you've entered before submitting.
          </p>
        </div>
        <Checkbox label="I confirm that all information is correct" required />
      </div>
    ),
  },
];

const createValidationSteps = (): FormStep[] => [
  {
    id: 'step1',
    title: 'Email',
    description: 'Enter your email address',
    content: (
      <div className="space-y-4">
        <TextInput
          label="Email"
          type="email"
          required
          placeholder="john.doe@example.com"
          helperText="We'll never share your email"
        />
      </div>
    ),
    validate: () => {
      // Simulate validation
      return true;
    },
  },
  {
    id: 'step2',
    title: 'Password',
    description: 'Create a strong password',
    content: (
      <div className="space-y-4">
        <TextInput label="Password" type="password" required placeholder="••••••••" />
        <TextInput label="Confirm Password" type="password" required placeholder="••••••••" />
      </div>
    ),
    validate: () => {
      // Simulate validation
      return true;
    },
  },
];

const meta = {
  title: 'Components/MultiStepForm',
  component: MultiStepForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive multi-step form component with step navigation, progress tracking, validation, and customizable UI. Supports horizontal and vertical orientations, multiple variants, and dark/light themes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of step indicator',
    },
    variant: {
      control: 'select',
      options: ['default', 'numbered', 'dots', 'tabs'],
      description: 'Visual variant of step indicator',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
    showStepNumbers: {
      control: 'boolean',
      description: 'Show step numbers',
    },
    showProgress: {
      control: 'boolean',
      description: 'Show progress bar',
    },
    allowBackNavigation: {
      control: 'boolean',
      description: 'Allow navigation to previous steps',
    },
    allowSkip: {
      control: 'boolean',
      description: 'Allow skipping steps',
    },
    validateOnNext: {
      control: 'boolean',
      description: 'Validate before moving to next step',
    },
    buttonPlacement: {
      control: 'select',
      options: ['left', 'center', 'right', 'space-between'],
      description: 'Button placement',
    },
  },
  args: {
    onStepChange: fn(),
    onSubmit: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof MultiStepForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default multi-step form
 */
export const Default: Story = {
  args: {
    steps: createBasicSteps(),
    defaultStep: 0,
  },
};

/**
 * Horizontal orientation
 */
export const Horizontal: Story = {
  args: {
    steps: createBasicSteps(),
    orientation: 'horizontal',
    defaultStep: 0,
  },
};

/**
 * Vertical orientation
 */
export const Vertical: Story = {
  args: {
    steps: createBasicSteps(),
    orientation: 'vertical',
    defaultStep: 0,
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Numbered variant
 */
export const Numbered: Story = {
  args: {
    steps: createBasicSteps(),
    variant: 'numbered',
    defaultStep: 0,
  },
};

/**
 * Dots variant
 */
export const Dots: Story = {
  args: {
    steps: createBasicSteps(),
    variant: 'dots',
    defaultStep: 0,
  },
};

/**
 * Tabs variant
 */
export const Tabs: Story = {
  args: {
    steps: createBasicSteps(),
    variant: 'tabs',
    defaultStep: 0,
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => {
    const steps = createBasicSteps();
    return (
      <div className="space-y-12">
        <div>
          <h3 className="text-sm font-semibold mb-4">Small</h3>
          <MultiStepForm steps={steps} size="small" defaultStep={0} />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-4">Medium</h3>
          <MultiStepForm steps={steps} size="medium" defaultStep={0} />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-4">Large</h3>
          <MultiStepForm steps={steps} size="large" defaultStep={0} />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Without step numbers
 */
export const WithoutStepNumbers: Story = {
  args: {
    steps: createBasicSteps(),
    showStepNumbers: false,
    defaultStep: 0,
  },
};

/**
 * Without progress bar
 */
export const WithoutProgress: Story = {
  args: {
    steps: createBasicSteps(),
    showProgress: false,
    defaultStep: 0,
  },
};

/**
 * No back navigation
 */
export const NoBackNavigation: Story = {
  args: {
    steps: createBasicSteps(),
    allowBackNavigation: false,
    defaultStep: 0,
  },
};

/**
 * With skip option
 */
export const WithSkip: Story = {
  args: {
    steps: createBasicSteps(),
    allowSkip: true,
    defaultStep: 0,
  },
};

/**
 * With validation
 */
export const WithValidation: Story = {
  args: {
    steps: createValidationSteps(),
    validateOnNext: true,
    defaultStep: 0,
  },
};

/**
 * With cancel button
 */
export const WithCancelButton: Story = {
  args: {
    steps: createBasicSteps(),
    showCancelButton: true,
    defaultStep: 0,
  },
};

/**
 * Different button placements
 */
export const ButtonPlacements: Story = {
  render: () => {
    const steps = createBasicSteps().slice(0, 2);
    return (
      <div className="space-y-12">
        <div>
          <h3 className="text-sm font-semibold mb-4">Left</h3>
          <MultiStepForm steps={steps} buttonPlacement="left" defaultStep={0} />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-4">Center</h3>
          <MultiStepForm steps={steps} buttonPlacement="center" defaultStep={0} />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-4">Right</h3>
          <MultiStepForm steps={steps} buttonPlacement="right" defaultStep={0} />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-4">Space Between</h3>
          <MultiStepForm steps={steps} buttonPlacement="space-between" showCancelButton defaultStep={0} />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Custom button texts
 */
export const CustomButtonTexts: Story = {
  args: {
    steps: createBasicSteps(),
    nextButtonText: 'Continue',
    previousButtonText: 'Go Back',
    submitButtonText: 'Complete Registration',
    cancelButtonText: 'Exit',
    showCancelButton: true,
    defaultStep: 0,
  },
};

/**
 * With optional steps
 */
export const WithOptionalSteps: Story = {
  args: {
    steps: [
      {
        id: 'step1',
        title: 'Required Information',
        description: 'This step is required',
        content: (
          <div className="space-y-4">
            <TextInput label="Name" required placeholder="John Doe" />
            <TextInput label="Email" type="email" required placeholder="john@example.com" />
          </div>
        ),
      },
      {
        id: 'step2',
        title: 'Optional Information',
        description: 'This step is optional',
        optional: true,
        content: (
          <div className="space-y-4">
            <TextInput label="Phone" type="tel" placeholder="+1 234 567 8900" />
            <TextInput label="Company" placeholder="Acme Inc." />
          </div>
        ),
      },
      {
        id: 'step3',
        title: 'Review',
        description: 'Review and submit',
        content: (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Review your information</p>
          </div>
        ),
      },
    ],
    defaultStep: 0,
  },
};

/**
 * Controlled step
 */
export const Controlled: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = createBasicSteps();

    return (
      <div>
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Current Step: {currentStep + 1} of {steps.length}
          </p>
          <div className="mt-2 flex gap-2">
            {steps.map((_, index) => (
              <Button
                key={index}
                size="small"
                variant={index === currentStep ? 'primary' : 'secondary'}
                onClick={() => setCurrentStep(index)}
              >
                Step {index + 1}
              </Button>
            ))}
          </div>
        </div>
        <MultiStepForm
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          defaultStep={0}
        />
      </div>
    );
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    steps: createBasicSteps(),
    isLoading: true,
    defaultStep: 0,
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    steps: createBasicSteps(),
    disabled: true,
    defaultStep: 0,
  },
};

/**
 * Complex example with many steps
 */
export const ComplexExample: Story = {
  args: {
    steps: [
      {
        id: 'step1',
        title: 'Account Type',
        description: 'Choose your account type',
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400">
                <h4 className="font-semibold mb-2">Personal</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">For personal use</p>
              </div>
              <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400">
                <h4 className="font-semibold mb-2">Business</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">For business use</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'step2',
        title: 'Personal Details',
        description: 'Tell us about yourself',
        content: (
          <div className="space-y-4">
            <TextInput label="Full Name" required placeholder="John Doe" />
            <TextInput label="Email" type="email" required placeholder="john@example.com" />
            <TextInput label="Date of Birth" type="date" />
            <TextInput label="Phone" type="tel" placeholder="+1 234 567 8900" />
          </div>
        ),
      },
      {
        id: 'step3',
        title: 'Address',
        description: 'Enter your address',
        content: (
          <div className="space-y-4">
            <TextInput label="Street Address" placeholder="123 Main St" />
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="City" placeholder="New York" />
              <TextInput label="State" placeholder="NY" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="ZIP Code" placeholder="10001" />
              <TextInput label="Country" placeholder="United States" />
            </div>
          </div>
        ),
      },
      {
        id: 'step4',
        title: 'Preferences',
        description: 'Set your preferences',
        optional: true,
        content: (
          <div className="space-y-4">
            <Checkbox label="Receive marketing emails" />
            <Checkbox label="Receive newsletter" />
            <Checkbox label="Enable notifications" />
          </div>
        ),
      },
      {
        id: 'step5',
        title: 'Review',
        description: 'Review and submit',
        content: (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Review your information</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please review all the information before submitting.
              </p>
            </div>
            <Checkbox label="I confirm that all information is correct" required />
          </div>
        ),
      },
    ],
    defaultStep: 0,
    showCancelButton: true,
    allowSkip: true,
  },
};

/**
 * Dark theme
 */
export const DarkTheme: Story = {
  render: () => {
    return (
      <ThemeWrapper theme="dark">
        <MultiStepForm steps={createBasicSteps()} defaultStep={0} />
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Light theme
 */
export const LightTheme: Story = {
  render: () => {
    return (
      <ThemeWrapper theme="light">
        <MultiStepForm steps={createBasicSteps()} defaultStep={0} />
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * All features combined
 */
export const AllFeatures: Story = {
  args: {
    steps: createBasicSteps(),
    orientation: 'horizontal',
    variant: 'numbered',
    size: 'medium',
    showStepNumbers: true,
    showProgress: true,
    allowBackNavigation: true,
    allowSkip: true,
    validateOnNext: false,
    showCancelButton: true,
    buttonPlacement: 'space-between',
    defaultStep: 0,
  },
};

