import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TextInput } from './TextInput';
import { ThemeWrapper } from '../../utils/ThemeWrapper';
import {
    UserIcon,
    MailIcon,
    LockIcon,
    SearchIcon,
    CheckCircleIcon,
    XCircleIcon,
} from './icons';

const meta = {
    title: 'Components/TextInput',
    component: TextInput,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A versatile text input component with label, helper text, error states, and icon support. Perfect for forms and user input throughout your application.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        label: {
            control: 'text',
            description: 'Label text displayed above the input',
        },
        helperText: {
            control: 'text',
            description: 'Helper text displayed below the input',
        },
        error: {
            control: 'text',
            description: 'Error message displayed below the input',
        },
        success: {
            control: 'text',
            description: 'Success message displayed below the input',
        },
        warning: {
            control: 'text',
            description: 'Warning message displayed below the input',
        },
        required: {
            control: 'boolean',
            description: 'Whether the field is required',
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: 'Size of the input',
        },
        variant: {
            control: 'select',
            options: ['default', 'error', 'success', 'warning'],
            description: 'Variant style of the input',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the input is disabled',
        },
        fullWidth: {
            control: 'boolean',
            description: 'Whether the input should take full width',
        },
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
            description: 'Input type',
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text',
        },
        onChange: {
            action: 'changed',
            description: 'Callback function when input value changes',
        },
    },
    args: {
        onChange: fn(),
    },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default text input with label
 */
export const Default: Story = {
    args: {
        label: 'Username',
        placeholder: 'Enter your username',
    },
};

/**
 * Text input with helper text example
 */
export const HelperTextExample: Story = {
    args: {
        label: 'Username',
        placeholder: 'Enter your username',
        helperText: 'Choose a unique username for your account',
    },
};

/**
 * Required field with asterisk indicator
 */
export const Required: Story = {
    args: {
        label: 'Email Address',
        type: 'email',
        placeholder: 'you@example.com',
        required: true,
        helperText: 'We will never share your email',
    },
};

/**
 * Error state with error message
 */
export const Error: Story = {
    args: {
        label: 'Email Address',
        type: 'email',
        placeholder: 'you@example.com',
        error: 'Please enter a valid email address',
        defaultValue: 'invalid-email',
    },
};

/**
 * Success state with success message
 */
export const Success: Story = {
    args: {
        label: 'Email Address',
        type: 'email',
        placeholder: 'you@example.com',
        success: 'Email address is valid',
        defaultValue: 'user@example.com',
    },
};

/**
 * Warning state with warning message
 */
export const Warning: Story = {
    args: {
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
        warning: 'Password should be at least 8 characters',
        defaultValue: '123',
    },
};

/**
 * Disabled input state
 */
export const Disabled: Story = {
    args: {
        label: 'Username',
        placeholder: 'Enter your username',
        disabled: true,
        defaultValue: 'john_doe',
    },
};

/**
 * Read-only input state
 */
export const ReadOnly: Story = {
    args: {
        label: 'User ID',
        defaultValue: 'USR-12345',
        readOnly: true,
        helperText: 'This field cannot be modified',
    },
};

/**
 * Small size input
 */
export const Small: Story = {
    args: {
        label: 'Search',
        size: 'small',
        placeholder: 'Search...',
    },
};

/**
 * Medium size input (default)
 */
export const Medium: Story = {
    args: {
        label: 'Search',
        size: 'medium',
        placeholder: 'Search...',
    },
};

/**
 * Large size input
 */
export const Large: Story = {
    args: {
        label: 'Search',
        size: 'large',
        placeholder: 'Search...',
    },
};

/**
 * Input with left icon
 */
export const WithLeftIcon: Story = {
    args: {
        label: 'Username',
        placeholder: 'Enter your username',
        leftIcon: <UserIcon />,
    },
};

/**
 * Input with right icon
 */
export const WithRightIcon: Story = {
    args: {
        label: 'Search',
        type: 'search',
        placeholder: 'Search...',
        rightIcon: <SearchIcon />,
    },
};

/**
 * Input with both left and right icons
 */
export const WithBothIcons: Story = {
    args: {
        label: 'Email',
        type: 'email',
        placeholder: 'you@example.com',
        leftIcon: <MailIcon />,
        rightIcon: <CheckCircleIcon className="text-green-500" />,
        success: 'Email format is valid',
    },
};

/**
 * Email input type
 */
export const EmailInput: Story = {
    args: {
        label: 'Email Address',
        type: 'email',
        placeholder: 'you@example.com',
        leftIcon: <MailIcon />,
        required: true,
    },
};

/**
 * Password input type
 */
export const PasswordInput: Story = {
    args: {
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
        leftIcon: <LockIcon />,
        helperText: 'Must be at least 8 characters',
        required: true,
    },
};

/**
 * Number input type
 */
export const NumberInput: Story = {
    args: {
        label: 'Age',
        type: 'number',
        placeholder: 'Enter your age',
        helperText: 'Must be between 18 and 100',
        min: 18,
        max: 100,
    },
};

/**
 * Tel input type
 */
export const TelInput: Story = {
    args: {
        label: 'Phone Number',
        type: 'tel',
        placeholder: '+1 (555) 123-4567',
        helperText: 'Include country code',
    },
};

/**
 * URL input type
 */
export const UrlInput: Story = {
    args: {
        label: 'Website',
        type: 'url',
        placeholder: 'https://example.com',
        leftIcon: <SearchIcon />,
    },
};

/**
 * Search input type
 */
export const SearchInput: Story = {
    args: {
        label: 'Search',
        type: 'search',
        placeholder: 'Search products...',
        leftIcon: <SearchIcon />,
    },
};

/**
 * Full width input
 */
export const FullWidth: Story = {
    args: {
        label: 'Full Width Input',
        placeholder: 'This input takes full width',
        fullWidth: true,
        helperText: 'Full width variant',
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
    render: () => (
        <div className="space-y-6 w-96">
            <TextInput label="Small" size="small" placeholder="Small input" />
            <TextInput label="Medium" size="medium" placeholder="Medium input" />
            <TextInput label="Large" size="large" placeholder="Large input" />
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
    render: () => (
        <div className="space-y-6 w-96">
            <TextInput label="Default" placeholder="Default variant" />
            <TextInput label="Error" placeholder="Error variant" error="This field has an error" />
            <TextInput label="Success" placeholder="Success variant" success="This field is valid" />
            <TextInput label="Warning" placeholder="Warning variant" warning="Please check this field" />
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Form example with multiple inputs
 */
export const FormExample: Story = {
    render: () => (
        <form className="space-y-4 w-96" onSubmit={(e) => e.preventDefault()}>
            <TextInput
                label="Full Name"
                placeholder="John Doe"
                leftIcon={<UserIcon />}
                required
                helperText="Enter your full legal name"
            />
            <TextInput
                label="Email"
                type="email"
                placeholder="john@example.com"
                leftIcon={<MailIcon />}
                required
                helperText="We'll never share your email"
            />
            <TextInput
                label="Password"
                type="password"
                placeholder="Create a password"
                leftIcon={<LockIcon />}
                required
                helperText="Must be at least 8 characters"
            />
            <TextInput
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                helperText="Optional"
            />
        </form>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Error states with icons
 */
export const ErrorStates: Story = {
    render: () => (
        <div className="space-y-6 w-96">
            <TextInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                leftIcon={<MailIcon />}
                rightIcon={<XCircleIcon className="text-red-500" />}
                error="Invalid email format"
                defaultValue="invalid-email"
            />
            <TextInput
                label="Password"
                type="password"
                placeholder="Enter password"
                leftIcon={<LockIcon />}
                error="Password must be at least 8 characters"
                defaultValue="123"
            />
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Success states with icons
 */
export const SuccessStates: Story = {
    render: () => (
        <div className="space-y-6 w-96">
            <TextInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                leftIcon={<MailIcon />}
                rightIcon={<CheckCircleIcon className="text-green-500" />}
                success="Email format is valid"
                defaultValue="user@example.com"
            />
            <TextInput
                label="Username"
                placeholder="username"
                leftIcon={<UserIcon />}
                rightIcon={<CheckCircleIcon className="text-green-500" />}
                success="Username is available"
                defaultValue="john_doe"
            />
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Standard text input - outlined style with label above
 */
export const StandardTextInput: Story = {
    args: {
        label: 'Username',
        placeholder: 'Enter your username',
        styleVariant: 'outlined',
    },
};

/**
 * Filled text input - filled background with underline
 */
export const FilledTextInput: Story = {
    args: {
        label: 'Email Address',
        placeholder: 'you@example.com',
        type: 'email',
        styleVariant: 'filled',
    },
};

/**
 * Multiple filled inputs for comparison
 */
export const FilledInputs: Story = {
    render: () => (
        <div className="space-y-6 w-96">
            <TextInput label="Username" placeholder="Enter username" styleVariant="filled" />
            <TextInput label="Email" type="email" placeholder="you@example.com" styleVariant="filled" />
            <TextInput label="Password" type="password" placeholder="Enter password" styleVariant="filled" />
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Text input with floating label - label inside the input outline
 */
export const FloatingLabelInput: Story = {
    args: {
        label: 'Username',
        placeholder: 'Enter your username',
        styleVariant: 'floating-label',
    },
};

/**
 * Multiple floating label inputs
 */
export const FloatingLabelInputs: Story = {
    render: () => (
        <div className="space-y-6 w-96">
            <TextInput label="First Name" placeholder="John" styleVariant="floating-label" />
            <TextInput label="Last Name" placeholder="Doe" styleVariant="floating-label" />
            <TextInput label="Email" type="email" placeholder="john@example.com" styleVariant="floating-label" />
            <TextInput label="Password" type="password" placeholder="••••••••" styleVariant="floating-label" />
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Floating label with value
 */
export const FloatingLabelWithValue: Story = {
    args: {
        label: 'Username',
        placeholder: 'Enter your username',
        styleVariant: 'floating-label',
        defaultValue: 'john_doe',
    },
};

/**
 * Floating label with error state
 */
export const FloatingLabelError: Story = {
    args: {
        label: 'Email',
        type: 'email',
        placeholder: 'you@example.com',
        styleVariant: 'floating-label',
        error: 'Invalid email format',
        defaultValue: 'invalid-email',
    },
};

/**
 * Text input with helper text
 */
export const WithHelperText: Story = {
    args: {
        label: 'Username',
        placeholder: 'Enter your username',
        helperText: 'Choose a unique username for your account. It can contain letters, numbers, and underscores.',
    },
};

/**
 * Helper text with different variants
 */
export const HelperTextVariants: Story = {
    render: () => (
        <div className="space-y-6 w-96">
            <TextInput
                label="Default"
                placeholder="Enter text"
                helperText="This is a default helper text"
            />
            <TextInput
                label="With Error"
                placeholder="Enter text"
                error="This field has an error"
            />
            <TextInput
                label="With Success"
                placeholder="Enter text"
                success="This field is valid"
            />
            <TextInput
                label="With Warning"
                placeholder="Enter text"
                warning="Please check this field"
            />
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Multiline text input (textarea)
 */
export const MultilineTextInput: Story = {
    args: {
        label: 'Description',
        placeholder: 'Enter your description here...',
        multiline: true,
        rows: 4,
    },
};

/**
 * Multiline with different sizes
 */
export const MultilineSizes: Story = {
    render: () => (
        <div className="space-y-6 w-96">
            <TextInput label="Small Textarea" multiline rows={3} size="small" placeholder="Small textarea" />
            <TextInput label="Medium Textarea" multiline rows={4} size="medium" placeholder="Medium textarea" />
            <TextInput label="Large Textarea" multiline rows={5} size="large" placeholder="Large textarea" />
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Multiline with helper text
 */
export const MultilineWithHelperText: Story = {
    args: {
        label: 'Message',
        placeholder: 'Type your message here...',
        multiline: true,
        rows: 6,
        helperText: 'Maximum 500 characters',
    },
};

/**
 * Multiline with error state
 */
export const MultilineError: Story = {
    args: {
        label: 'Description',
        placeholder: 'Enter description...',
        multiline: true,
        rows: 4,
        error: 'Description must be at least 10 characters',
        defaultValue: 'Short',
    },
};

/**
 * All style variants comparison
 */
export const AllStyleVariants: Story = {
    render: () => (
        <div className="space-y-8 w-96">
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700">Outlined (Standard)</h3>
                <TextInput label="Username" placeholder="Enter username" styleVariant="outlined" />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700">Filled</h3>
                <TextInput label="Email" placeholder="you@example.com" styleVariant="filled" />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700">Floating Label</h3>
                <TextInput label="Password" type="password" placeholder="••••••••" styleVariant="floating-label" />
            </div>
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Interactive example with controls
 */
export const Interactive: Story = {
    args: {
        label: 'Text Input',
        placeholder: 'Type something...',
        helperText: 'This is a helper text',
    },
};

/**
 * Dark theme - Text input variants
 */
export const DarkTheme: Story = {
    render: () => (
        <ThemeWrapper theme="dark">
            <div className="space-y-6 max-w-md">
                <TextInput label="Standard Input" placeholder="Enter text..." />
                <TextInput label="Filled Input" styleVariant="filled" placeholder="Enter text..." />
                <TextInput label="Floating Label" styleVariant="floating-label" placeholder="Enter text..." />
                <TextInput label="With Helper Text" helperText="This is helpful information" />
                <TextInput label="With Error" error="This field is required" />
                <TextInput label="Disabled" disabled value="Disabled value" />
            </div>
        </ThemeWrapper>
    ),
    parameters: {
        layout: 'fullscreen',
    },
};

