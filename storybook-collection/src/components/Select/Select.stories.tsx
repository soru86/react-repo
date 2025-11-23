import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Select } from './Select';
import { Combobox } from './Combobox';
import { MultiSelectWithChips } from './MultiSelectWithChips';
import { ThemeWrapper } from '../../utils/ThemeWrapper';
import { CustomOptionSelect } from './CustomOptionSelect';
import { UserIcon, MailIcon, LockIcon, CheckCircleIcon, XCircleIcon } from '../TextInput/icons';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile select component with label, helper text, error states, and icon support. Perfect for dropdown selections in forms throughout your application.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the select',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the select',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the select',
    },
    success: {
      control: 'text',
      description: 'Success message displayed below the select',
    },
    warning: {
      control: 'text',
      description: 'Warning message displayed below the select',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the select',
    },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'Variant style of the select',
    },
    styleVariant: {
      control: 'select',
      options: ['outlined', 'filled', 'floating-label'],
      description: 'Style variant of the select',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the select should take full width',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function when select value changes',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions = [
  { value: '', label: 'Choose an option...' },
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
];

const countryOptions = [
  { value: '', label: 'Select a country...' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'in', label: 'India' },
];

/**
 * Default select with basic options
 */
export const Default: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Choose an option...',
  },
};

/**
 * Select with label
 */
export const WithLabel: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
  },
};

/**
 * Select with helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    helperText: 'Please select your country of residence',
  },
};

/**
 * Required field with asterisk indicator
 */
export const Required: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    required: true,
    helperText: 'This field is required',
  },
};

/**
 * Error state with error message
 */
export const Error: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    error: 'Please select a valid country',
  },
};

/**
 * Success state with success message
 */
export const Success: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    success: 'Country selected successfully',
    defaultValue: 'us',
  },
};

/**
 * Warning state with warning message
 */
export const Warning: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    warning: 'Please verify your country selection',
    defaultValue: 'us',
  },
};

/**
 * Disabled select state
 */
export const Disabled: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    disabled: true,
    defaultValue: 'us',
  },
};

/**
 * Small size select
 */
export const Small: Story = {
  args: {
    label: 'Option',
    size: 'small',
    options: basicOptions,
    placeholder: 'Choose...',
  },
};

/**
 * Medium size select (default)
 */
export const Medium: Story = {
  args: {
    label: 'Option',
    size: 'medium',
    options: basicOptions,
    placeholder: 'Choose...',
  },
};

/**
 * Large size select
 */
export const Large: Story = {
  args: {
    label: 'Option',
    size: 'large',
    options: basicOptions,
    placeholder: 'Choose...',
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <Select label="Small" size="small" options={basicOptions} placeholder="Choose..." />
      <Select label="Medium" size="medium" options={basicOptions} placeholder="Choose..." />
      <Select label="Large" size="large" options={basicOptions} placeholder="Choose..." />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Select with left icon
 */
export const WithLeftIcon: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    leftIcon: <UserIcon />,
  },
};

/**
 * Select with different icons
 */
export const WithIcons: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <Select
        label="User Type"
        options={basicOptions}
        placeholder="Select user type..."
        leftIcon={<UserIcon />}
      />
      <Select
        label="Email Domain"
        options={[
          { value: '', label: 'Select domain...' },
          { value: 'gmail', label: 'gmail.com' },
          { value: 'yahoo', label: 'yahoo.com' },
          { value: 'outlook', label: 'outlook.com' },
        ]}
        placeholder="Select domain..."
        leftIcon={<MailIcon />}
      />
      <Select
        label="Security Level"
        options={[
          { value: '', label: 'Select level...' },
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ]}
        placeholder="Select level..."
        leftIcon={<LockIcon />}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Full width select
 */
export const FullWidth: Story = {
  args: {
    label: 'Full Width Select',
    options: basicOptions,
    placeholder: 'Choose an option...',
    fullWidth: true,
    helperText: 'Full width variant',
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Select with grouped options
 */
export const WithGroups: Story = {
  args: {
    label: 'Category',
    groups: [
      {
        label: 'Fruits',
        options: [
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
          { value: 'orange', label: 'Orange' },
        ],
      },
      {
        label: 'Vegetables',
        options: [
          { value: 'carrot', label: 'Carrot' },
          { value: 'broccoli', label: 'Broccoli' },
          { value: 'spinach', label: 'Spinach' },
        ],
      },
      {
        label: 'Grains',
        options: [
          { value: 'rice', label: 'Rice' },
          { value: 'wheat', label: 'Wheat' },
          { value: 'oats', label: 'Oats' },
        ],
      },
    ],
    placeholder: 'Select a category...',
  },
};

/**
 * Multiple grouped selects
 */
export const MultipleGroups: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <Select
        label="Product Category"
        groups={[
          {
            label: 'Electronics',
            options: [
              { value: 'phone', label: 'Phone' },
              { value: 'laptop', label: 'Laptop' },
              { value: 'tablet', label: 'Tablet' },
            ],
          },
          {
            label: 'Clothing',
            options: [
              { value: 'shirt', label: 'Shirt' },
              { value: 'pants', label: 'Pants' },
              { value: 'shoes', label: 'Shoes' },
            ],
          },
        ]}
        placeholder="Select category..."
      />
      <Select
        label="Region"
        groups={[
          {
            label: 'North America',
            options: [
              { value: 'us', label: 'United States' },
              { value: 'ca', label: 'Canada' },
              { value: 'mx', label: 'Mexico' },
            ],
          },
          {
            label: 'Europe',
            options: [
              { value: 'uk', label: 'United Kingdom' },
              { value: 'de', label: 'Germany' },
              { value: 'fr', label: 'France' },
            ],
          },
        ]}
        placeholder="Select region..."
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Select with disabled options
 */
export const WithDisabledOptions: Story = {
  args: {
    label: 'Plan',
    options: [
      { value: '', label: 'Select a plan...' },
      { value: 'free', label: 'Free Plan' },
      { value: 'basic', label: 'Basic Plan', disabled: true },
      { value: 'pro', label: 'Pro Plan' },
      { value: 'enterprise', label: 'Enterprise Plan', disabled: true },
    ],
    placeholder: 'Select a plan...',
    helperText: 'Some plans are currently unavailable',
  },
};

/**
 * Standard outlined select
 */
export const StandardSelect: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    styleVariant: 'outlined',
  },
};

/**
 * Filled select - filled background with underline
 */
export const FilledSelect: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    styleVariant: 'filled',
  },
};

/**
 * Multiple filled selects
 */
export const FilledSelects: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <Select label="Country" options={countryOptions} placeholder="Select..." styleVariant="filled" />
      <Select label="State" options={basicOptions} placeholder="Select..." styleVariant="filled" />
      <Select label="City" options={basicOptions} placeholder="Select..." styleVariant="filled" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Floating label select - label inside the select outline
 */
export const FloatingLabelSelect: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    styleVariant: 'floating-label',
  },
};

/**
 * Multiple floating label selects
 */
export const FloatingLabelSelects: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <Select label="Country" options={countryOptions} placeholder="Select..." styleVariant="floating-label" />
      <Select label="State" options={basicOptions} placeholder="Select..." styleVariant="floating-label" />
      <Select label="City" options={basicOptions} placeholder="Select..." styleVariant="floating-label" />
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
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    styleVariant: 'floating-label',
    defaultValue: 'us',
  },
};

/**
 * Floating label with error state
 */
export const FloatingLabelError: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    styleVariant: 'floating-label',
    error: 'Please select a valid country',
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
        <Select label="Country" options={countryOptions} placeholder="Select..." styleVariant="outlined" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Filled</h3>
        <Select label="Country" options={countryOptions} placeholder="Select..." styleVariant="filled" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Floating Label</h3>
        <Select label="Country" options={countryOptions} placeholder="Select..." styleVariant="floating-label" />
      </div>
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
      <Select label="Default" options={basicOptions} placeholder="Select..." />
      <Select label="Error" options={basicOptions} placeholder="Select..." error="This field has an error" />
      <Select label="Success" options={basicOptions} placeholder="Select..." success="This field is valid" defaultValue="option1" />
      <Select label="Warning" options={basicOptions} placeholder="Select..." warning="Please check this field" defaultValue="option1" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Form example with multiple selects
 */
export const FormExample: Story = {
  render: () => (
    <form className="space-y-4 w-96" onSubmit={(e) => e.preventDefault()}>
      <Select
        label="Country"
        options={countryOptions}
        placeholder="Select country..."
        leftIcon={<UserIcon />}
        required
        helperText="Select your country of residence"
      />
      <Select
        label="State/Province"
        options={basicOptions}
        placeholder="Select state..."
        required
        helperText="Select your state or province"
      />
      <Select
        label="City"
        options={basicOptions}
        placeholder="Select city..."
        helperText="Optional"
      />
    </form>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Long list of options
 */
export const LongList: Story = {
  args: {
    label: 'Select from long list',
    options: [
      { value: '', label: 'Choose an option...' },
      ...Array.from({ length: 50 }, (_, i) => ({
        value: `option${i + 1}`,
        label: `Option ${i + 1}`,
      })),
    ],
    placeholder: 'Choose an option...',
    helperText: 'Scroll to see all options',
  },
};

/**
 * Select with left and right icons
 */
export const WithLeftAndRightIcons: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    leftIcon: <UserIcon />,
    rightIcon: <CheckCircleIcon className="text-green-500" />,
  },
};

/**
 * Multiple selects with icons
 */
export const WithIconsLeftRight: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <Select
        label="User Type"
        options={basicOptions}
        placeholder="Select..."
        leftIcon={<UserIcon />}
        rightIcon={<CheckCircleIcon className="text-blue-500" />}
      />
      <Select
        label="Email Domain"
        options={[
          { value: '', label: 'Select domain...' },
          { value: 'gmail', label: 'gmail.com' },
          { value: 'yahoo', label: 'yahoo.com' },
        ]}
        placeholder="Select..."
        leftIcon={<MailIcon />}
        rightIcon={<XCircleIcon className="text-red-500" />}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Multi-select - allows multiple selections
 */
export const MultiSelect: Story = {
  args: {
    label: 'Select Multiple Options',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
      { value: 'option4', label: 'Option 4' },
      { value: 'option5', label: 'Option 5' },
    ],
    multiple: true,
    helperText: 'Hold Ctrl/Cmd to select multiple options',
  },
};

/**
 * Multi-select with pre-selected values
 */
export const MultiSelectWithValues: Story = {
  args: {
    label: 'Selected Categories',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'books', label: 'Books' },
      { value: 'toys', label: 'Toys' },
      { value: 'sports', label: 'Sports' },
    ],
    multiple: true,
    defaultValue: ['electronics', 'clothing'],
    helperText: 'Multiple selections allowed',
  },
};

/**
 * Select with horizontal separators
 */
export const WithSeparators: Story = {
  args: {
    label: 'Category',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3', separator: true },
      { value: 'option4', label: 'Option 4' },
      { value: 'option5', label: 'Option 5' },
      { value: 'option6', label: 'Option 6', separator: true },
      { value: 'option7', label: 'Option 7' },
    ],
    placeholder: 'Select an option...',
    helperText: 'Options are separated by horizontal lines',
  },
};

/**
 * Select with automatic separators
 */
export const WithAutoSeparators: Story = {
  args: {
    label: 'Options',
    options: [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
      { value: 'opt3', label: 'Option 3' },
      { value: 'opt4', label: 'Option 4' },
      { value: 'opt5', label: 'Option 5' },
      { value: 'opt6', label: 'Option 6' },
      { value: 'opt7', label: 'Option 7' },
      { value: 'opt8', label: 'Option 8' },
      { value: 'opt9', label: 'Option 9' },
    ],
    showSeparator: true,
    placeholder: 'Select an option...',
    helperText: 'Separators appear every 3 options',
  },
};

/**
 * Combobox - searchable select dropdown
 */
export const ComboboxExample: Story = {
  render: () => (
    <Combobox
      label="Search Country"
      options={countryOptions.filter((opt) => opt.value !== '')}
      placeholder="Type to search..."
      helperText="Start typing to filter options"
    />
  ),
};

/**
 * Combobox with pre-selected value
 */
export const ComboboxWithValue: Story = {
  render: () => (
    <Combobox
      label="Country"
      options={countryOptions.filter((opt) => opt.value !== '')}
      value="us"
      placeholder="Type to search..."
    />
  ),
};

/**
 * Multiple comboboxes
 */
export const MultipleComboboxes: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <Combobox
        label="Country"
        options={countryOptions.filter((opt) => opt.value !== '')}
        placeholder="Search country..."
      />
      <Combobox
        label="City"
        options={[
          { value: 'ny', label: 'New York' },
          { value: 'la', label: 'Los Angeles' },
          { value: 'ch', label: 'Chicago' },
          { value: 'sf', label: 'San Francisco' },
        ]}
        placeholder="Search city..."
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Custom option select with icons
 */
export const CustomOptionsWithIcons: Story = {
  render: () => (
    <CustomOptionSelect
      label="Account Type"
      options={[
        {
          value: 'personal',
          label: 'Personal Account',
          icon: <UserIcon />,
          description: 'For individual use',
        },
        {
          value: 'business',
          label: 'Business Account',
          icon: <MailIcon />,
          description: 'For business use',
        },
        {
          value: 'enterprise',
          label: 'Enterprise Account',
          icon: <LockIcon />,
          description: 'For large organizations',
        },
      ]}
      placeholder="Select account type..."
    />
  ),
};

/**
 * Custom options with checkboxes
 */
export const CustomOptionsWithCheckboxes: Story = {
  render: () => (
    <CustomOptionSelect
      label="Notification Method"
      options={[
        {
          value: 'email',
          label: 'Email Notifications',
          icon: <MailIcon />,
          description: 'Receive updates via email',
          showCheckbox: true,
        },
        {
          value: 'sms',
          label: 'SMS Notifications',
          icon: <UserIcon />,
          description: 'Receive updates via SMS',
          showCheckbox: true,
        },
        {
          value: 'push',
          label: 'Push Notifications',
          icon: <CheckCircleIcon />,
          description: 'Receive push notifications',
          showCheckbox: true,
        },
      ]}
      placeholder="Select notification method..."
    />
  ),
};

/**
 * Multi-select with chips
 */
export const MultiSelectChips: Story = {
  render: () => (
    <MultiSelectWithChips
      label="Select Tags"
      options={[
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue.js' },
        { value: 'angular', label: 'Angular' },
        { value: 'svelte', label: 'Svelte' },
        { value: 'next', label: 'Next.js' },
        { value: 'nuxt', label: 'Nuxt.js' },
      ]}
      placeholder="Select technologies..."
      helperText="Selected items appear as chips"
    />
  ),
};

/**
 * Multi-select chips with pre-selected values
 */
export const MultiSelectChipsWithValues: Story = {
  render: () => (
    <MultiSelectWithChips
      label="Selected Skills"
      options={[
        { value: 'javascript', label: 'JavaScript' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'go', label: 'Go' },
        { value: 'rust', label: 'Rust' },
      ]}
      value={['javascript', 'typescript', 'python']}
      placeholder="Select skills..."
    />
  ),
};

/**
 * Multi-select chips with error state
 */
export const MultiSelectChipsError: Story = {
  render: () => (
    <MultiSelectWithChips
      label="Select Categories"
      options={[
        { value: 'cat1', label: 'Category 1' },
        { value: 'cat2', label: 'Category 2' },
        { value: 'cat3', label: 'Category 3' },
      ]}
      error="Please select at least one category"
      placeholder="Select categories..."
    />
  ),
};

/**
 * All advanced variants comparison
 */
export const AllAdvancedVariants: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">With Icons (Left & Right)</h3>
        <Select
          label="Country"
          options={countryOptions}
          placeholder="Select..."
          leftIcon={<UserIcon />}
          rightIcon={<CheckCircleIcon className="text-green-500" />}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Multi-Select</h3>
        <Select
          label="Options"
          options={[
            { value: 'opt1', label: 'Option 1' },
            { value: 'opt2', label: 'Option 2' },
            { value: 'opt3', label: 'Option 3' },
          ]}
          multiple
          helperText="Hold Ctrl/Cmd to select multiple"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Combobox</h3>
        <Combobox
          label="Search"
          options={countryOptions.filter((opt) => opt.value !== '')}
          placeholder="Type to search..."
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Custom Options</h3>
        <CustomOptionSelect
          label="Account"
          options={[
            {
              value: 'personal',
              label: 'Personal',
              icon: <UserIcon />,
              description: 'Individual account',
            },
            {
              value: 'business',
              label: 'Business',
              icon: <MailIcon />,
              description: 'Business account',
            },
          ]}
          placeholder="Select..."
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Multi-Select with Chips</h3>
        <MultiSelectWithChips
          label="Tags"
          options={[
            { value: 'tag1', label: 'Tag 1' },
            { value: 'tag2', label: 'Tag 2' },
            { value: 'tag3', label: 'Tag 3' },
          ]}
          placeholder="Select tags..."
        />
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
    label: 'Select Option',
    options: basicOptions,
    placeholder: 'Choose an option...',
    helperText: 'This is a helper text',
  },
};

/**
 * Dark theme - Select variants
 */
export const DarkTheme: Story = {
  render: () => (
    <ThemeWrapper theme="dark">
      <div className="space-y-6 max-w-md">
        <Select label="Standard Select" options={basicOptions} placeholder="Choose..." />
        <Select label="Filled Select" styleVariant="filled" options={basicOptions} placeholder="Choose..." />
        <Select label="With Helper Text" options={basicOptions} helperText="Select an option" />
        <Select label="With Error" options={basicOptions} error="This field is required" />
        <Select label="Disabled" options={basicOptions} disabled value="option1" />
      </div>
    </ThemeWrapper>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

