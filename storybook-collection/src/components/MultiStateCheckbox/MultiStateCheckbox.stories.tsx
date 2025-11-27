import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { MultiStateCheckbox } from './MultiStateCheckbox';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/MultiStateCheckbox',
  component: MultiStateCheckbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A checkbox component that cycles through multiple states. Click to toggle between unchecked and various checked states. Perfect for permissions, access levels, and multi-state selections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether checkbox is disabled',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether checkbox is invalid',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof MultiStateCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Icons
const PublicIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PrivateIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UnlockIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

/**
 * Basic multi-state checkbox with public/private states
 */
export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState(null);

    const options = [
      { value: 'public', icon: <PublicIcon />, label: 'Public' },
      { value: 'private', icon: <PrivateIcon />, label: 'Private' },
    ];

    return (
      <div className="flex flex-col items-center gap-4">
        <MultiStateCheckbox
          value={value}
          onChange={(e) => setValue(e.value)}
          options={options}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current value: {value === null ? 'Unchecked' : value}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Click to cycle: Unchecked → Public → Private → Unchecked
        </p>
      </div>
    );
  },
};

/**
 * Multi-state checkbox with three states
 */
export const ThreeStates: Story = {
  render: () => {
    const [value, setValue] = useState(null);

    const options = [
      { value: 'read', icon: <EyeIcon />, label: 'Read' },
      { value: 'write', icon: <LockIcon />, label: 'Write' },
      { value: 'admin', icon: <UnlockIcon />, label: 'Admin' },
    ];

    return (
      <div className="flex flex-col items-center gap-4">
        <MultiStateCheckbox
          value={value}
          onChange={(e) => setValue(e.value)}
          options={options}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current value: {value === null ? 'Unchecked' : value}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Click to cycle: Unchecked → Read → Write → Admin → Unchecked
        </p>
      </div>
    );
  },
};

/**
 * Using optionValue, optionIcon, and optionLabel with object options
 */
export const WithObjectOptions: Story = {
  render: () => {
    const [value, setValue] = useState(null);

    const options = [
      { id: 1, name: 'Public', icon: <PublicIcon />, description: 'Visible to everyone' },
      { id: 2, name: 'Private', icon: <PrivateIcon />, description: 'Visible to me only' },
      { id: 3, name: 'Shared', icon: <EyeIcon />, description: 'Visible to selected users' },
    ];

    return (
      <div className="flex flex-col items-center gap-4">
        <MultiStateCheckbox
          value={value}
          onChange={(e) => setValue(e.value)}
          options={options}
          optionValue="id"
          optionIcon="icon"
          optionLabel="name"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current value: {value === null ? 'Unchecked' : JSON.stringify(value)}
        </p>
        {value && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {options.find((opt) => opt.id === value)?.description}
          </p>
        )}
      </div>
    );
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => {
    const [value1, setValue1] = useState(null);
    const [value2, setValue2] = useState(null);
    const [value3, setValue3] = useState(null);

    const options = [
      { value: 'on', icon: <EyeIcon />, label: 'On' },
      { value: 'off', icon: <EyeOffIcon />, label: 'Off' },
    ];

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <MultiStateCheckbox
            value={value1}
            onChange={(e) => setValue1(e.value)}
            options={options}
            size="small"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400">Small</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MultiStateCheckbox
            value={value2}
            onChange={(e) => setValue2(e.value)}
            options={options}
            size="medium"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400">Medium</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MultiStateCheckbox
            value={value3}
            onChange={(e) => setValue3(e.value)}
            options={options}
            size="large"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400">Large</p>
        </div>
      </div>
    );
  },
};

/**
 * Invalid state
 */
export const Invalid: Story = {
  render: () => {
    const [value, setValue] = useState(null);

    const options = [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ];

    return (
      <div className="flex flex-col items-center gap-4">
        <MultiStateCheckbox
          value={value}
          onChange={(e) => setValue(e.value)}
          options={options}
          invalid
        />
        <p className="text-sm text-red-600 dark:text-red-400">
          This checkbox is in an invalid state
        </p>
      </div>
    );
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => {
    const options = [
      { value: 'enabled', icon: <EyeIcon />, label: 'Enabled' },
      { value: 'disabled', icon: <EyeOffIcon />, label: 'Disabled' },
    ];

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <MultiStateCheckbox options={options} disabled value={null} />
          <p className="text-xs text-gray-600 dark:text-gray-400">Disabled (unchecked)</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MultiStateCheckbox options={options} disabled value="enabled" />
          <p className="text-xs text-gray-600 dark:text-gray-400">Disabled (checked)</p>
        </div>
      </div>
    );
  },
};

/**
 * Access control example
 */
export const AccessControl: Story = {
  render: () => {
    const [access, setAccess] = useState(null);

    const accessOptions = [
      { value: 'public', icon: <PublicIcon />, label: 'Public' },
      { value: 'private', icon: <PrivateIcon />, label: 'Private' },
      { value: 'restricted', icon: <LockIcon />, label: 'Restricted' },
    ];

    return (
      <div className="space-y-4 p-6 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-2">Access Level</label>
          <div className="flex items-center gap-3">
            <MultiStateCheckbox
              value={access}
              onChange={(e) => setAccess(e.value)}
              options={accessOptions}
              aria-label="Access level"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {access === null
                ? 'No access'
                : accessOptions.find((opt) => opt.value === access)?.label}
            </span>
          </div>
        </div>
        {access && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Access level set to: <strong>{access}</strong>
            </p>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Permission levels example
 */
export const PermissionLevels: Story = {
  render: () => {
    const [read, setRead] = useState(null);
    const [write, setWrite] = useState(null);
    const [deletePermission, setDeletePermission] = useState(null);

    const permissionOptions = [
      { value: 'allowed', icon: <EyeIcon />, label: 'Allowed' },
      { value: 'denied', icon: <EyeOffIcon />, label: 'Denied' },
    ];

    return (
      <div className="space-y-4 p-6 max-w-md">
        <h3 className="text-lg font-semibold mb-4">Permissions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Read</label>
            <MultiStateCheckbox
              value={read}
              onChange={(e) => setRead(e.value)}
              options={permissionOptions}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Write</label>
            <MultiStateCheckbox
              value={write}
              onChange={(e) => setWrite(e.value)}
              options={permissionOptions}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Delete</label>
            <MultiStateCheckbox
              value={deletePermission}
              onChange={(e) => setDeletePermission(e.value)}
              options={permissionOptions}
            />
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs font-semibold mb-2">Current Permissions:</p>
          <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
            <li>Read: {read === null ? 'Unset' : read}</li>
            <li>Write: {write === null ? 'Unset' : write}</li>
            <li>Delete: {deletePermission === null ? 'Unset' : deletePermission}</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dark theme showcase
 */
export const DarkTheme: Story = {
  render: () => {
    const [value1, setValue1] = useState(null);
    const [value2, setValue2] = useState(null);

    const options1 = [
      { value: 'on', icon: <EyeIcon />, label: 'On' },
      { value: 'off', icon: <EyeOffIcon />, label: 'Off' },
    ];

    const options2 = [
      { value: 'public', icon: <PublicIcon />, label: 'Public' },
      { value: 'private', icon: <PrivateIcon />, label: 'Private' },
    ];

    return (
      <ThemeWrapper theme="dark">
        <div className="p-8 min-h-screen bg-gray-900 space-y-8">
          <h2 className="text-2xl font-bold text-white">Multi-State Checkbox (Dark Theme)</h2>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <MultiStateCheckbox
                value={value1}
                onChange={(e) => setValue1(e.value)}
                options={options1}
              />
              <p className="text-sm text-gray-400">On/Off Toggle</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MultiStateCheckbox
                value={value2}
                onChange={(e) => setValue2(e.value)}
                options={options2}
              />
              <p className="text-sm text-gray-400">Public/Private Toggle</p>
            </div>
          </div>
        </div>
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Form integration example
 */
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      visibility: null,
      notifications: null,
    });

    const visibilityOptions = [
      { value: 'public', icon: <PublicIcon />, label: 'Public' },
      { value: 'private', icon: <PrivateIcon />, label: 'Private' },
    ];

    const notificationOptions = [
      { value: 'enabled', icon: <EyeIcon />, label: 'Enabled' },
      { value: 'disabled', icon: <EyeOffIcon />, label: 'Disabled' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Visibility: ${formData.visibility}\nNotifications: ${formData.notifications}`);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6 p-6 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-2">Visibility</label>
          <MultiStateCheckbox
            value={formData.visibility}
            onChange={(e) => setFormData({ ...formData, visibility: e.value })}
            options={visibilityOptions}
            aria-label="Visibility setting"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Notifications</label>
          <MultiStateCheckbox
            value={formData.notifications}
            onChange={(e) => setFormData({ ...formData, notifications: e.value })}
            options={notificationOptions}
            aria-label="Notification setting"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * All states showcase
 */
export const AllStates: Story = {
  render: () => {
    const [values, setValues] = useState<Record<string, any>>({
      two: null,
      three: null,
      four: null,
    });

    const twoStates = [
      { value: 'on', icon: <EyeIcon />, label: 'On' },
      { value: 'off', icon: <EyeOffIcon />, label: 'Off' },
    ];

    const threeStates = [
      { value: 'read', icon: <EyeIcon />, label: 'Read' },
      { value: 'write', icon: <LockIcon />, label: 'Write' },
      { value: 'admin', icon: <UnlockIcon />, label: 'Admin' },
    ];

    const fourStates = [
      { value: 'none', label: 'None' },
      { value: 'read', icon: <EyeIcon />, label: 'Read' },
      { value: 'write', icon: <LockIcon />, label: 'Write' },
      { value: 'admin', icon: <UnlockIcon />, label: 'Admin' },
    ];

    return (
      <div className="space-y-8 p-8">
        <div className="flex flex-col items-center gap-4">
          <h3 className="font-semibold">2 States</h3>
          <MultiStateCheckbox
            value={values.two}
            onChange={(e) => setValues({ ...values, two: e.value })}
            options={twoStates}
          />
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Value: {values.two === null ? 'Unchecked' : values.two}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <h3 className="font-semibold">3 States</h3>
          <MultiStateCheckbox
            value={values.three}
            onChange={(e) => setValues({ ...values, three: e.value })}
            options={threeStates}
          />
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Value: {values.three === null ? 'Unchecked' : values.three}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <h3 className="font-semibold">4 States</h3>
          <MultiStateCheckbox
            value={values.four}
            onChange={(e) => setValues({ ...values, four: e.value })}
            options={fourStates}
          />
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Value: {values.four === null ? 'Unchecked' : values.four}
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

