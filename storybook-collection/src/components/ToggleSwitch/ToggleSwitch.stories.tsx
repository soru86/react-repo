import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

// Custom icons
const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const PowerIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UnlockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const meta = {
  title: 'Components/ToggleSwitch',
  component: ToggleSwitch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable toggle switch component with support for custom icons, multiple sizes, variants, and dark/light themes. Perfect for on/off settings, feature toggles, and preference controls.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below toggle',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
      description: 'Color variant',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Label position',
    },
    showIcons: {
      control: 'boolean',
      description: 'Show icons on toggle',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toggle switch
 */
export const Default: Story = {
  args: {
    label: 'Enable notifications',
  },
};

/**
 * Checked toggle
 */
export const Checked: Story = {
  args: {
    label: 'Dark mode',
    checked: true,
  },
};

/**
 * Unchecked toggle
 */
export const Unchecked: Story = {
  args: {
    label: 'Email notifications',
    checked: false,
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => {
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);

    return (
      <div className="space-y-6">
        <ToggleSwitch
          label="Small toggle"
          size="small"
          checked={checked1}
          onChange={(e) => setChecked1(e.target.checked)}
        />
        <ToggleSwitch
          label="Medium toggle"
          size="medium"
          checked={checked2}
          onChange={(e) => setChecked2(e.target.checked)}
        />
        <ToggleSwitch
          label="Large toggle"
          size="large"
          checked={checked3}
          onChange={(e) => setChecked3(e.target.checked)}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Different variants
 */
export const Variants: Story = {
  render: () => {
    const [states, setStates] = useState({
      default: false,
      primary: false,
      success: false,
      warning: false,
      danger: false,
    });

    return (
      <div className="space-y-4">
        <ToggleSwitch
          label="Default variant"
          variant="default"
          checked={states.default}
          onChange={(e) => setStates({ ...states, default: e.target.checked })}
        />
        <ToggleSwitch
          label="Primary variant"
          variant="primary"
          checked={states.primary}
          onChange={(e) => setStates({ ...states, primary: e.target.checked })}
        />
        <ToggleSwitch
          label="Success variant"
          variant="success"
          checked={states.success}
          onChange={(e) => setStates({ ...states, success: e.target.checked })}
        />
        <ToggleSwitch
          label="Warning variant"
          variant="warning"
          checked={states.warning}
          onChange={(e) => setStates({ ...states, warning: e.target.checked })}
        />
        <ToggleSwitch
          label="Danger variant"
          variant="danger"
          checked={states.danger}
          onChange={(e) => setStates({ ...states, danger: e.target.checked })}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * With icons
 */
export const WithIcons: Story = {
  render: () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [power, setPower] = useState(false);

    return (
      <div className="space-y-4">
        <ToggleSwitch
          label="Dark mode"
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
          showIcons
          checkedIcon={<MoonIcon />}
          uncheckedIcon={<SunIcon />}
        />
        <ToggleSwitch
          label="Notifications"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
          showIcons
          variant="success"
        />
        <ToggleSwitch
          label="Power"
          checked={power}
          onChange={(e) => setPower(e.target.checked)}
          showIcons
          checkedIcon={<PowerIcon />}
          uncheckedIcon={<PowerIcon />}
          variant="danger"
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Custom icons
 */
export const CustomIcons: Story = {
  render: () => {
    const [locked, setLocked] = useState(false);
    const [customCheckmark, setCustomCheckmark] = useState(true);

    return (
      <div className="space-y-4">
        <ToggleSwitch
          label="Lock/Unlock"
          checked={locked}
          onChange={(e) => setLocked(e.target.checked)}
          showIcons
          checkedIcon={<LockIcon />}
          uncheckedIcon={<UnlockIcon />}
          variant="primary"
        />
        <ToggleSwitch
          label="Custom checkmark"
          checked={customCheckmark}
          onChange={(e) => setCustomCheckmark(e.target.checked)}
          showIcons
          checkedIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          }
          uncheckedIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Label positions
 */
export const LabelPositions: Story = {
  render: () => {
    const [left, setLeft] = useState(false);
    const [right, setRight] = useState(false);

    return (
      <div className="space-y-6">
        <ToggleSwitch
          label="Label on the left"
          labelPosition="left"
          checked={left}
          onChange={(e) => setLeft(e.target.checked)}
        />
        <ToggleSwitch
          label="Label on the right"
          labelPosition="right"
          checked={right}
          onChange={(e) => setRight(e.target.checked)}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * With helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Enable two-factor authentication',
    helperText: 'Add an extra layer of security to your account',
    checked: false,
  },
};

/**
 * With error state
 */
export const WithError: Story = {
  args: {
    label: 'Accept terms',
    error: 'You must accept the terms to continue',
    checked: false,
  },
};

/**
 * Disabled states
 */
export const Disabled: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <ToggleSwitch label="Disabled unchecked" disabled checked={false} />
        <ToggleSwitch label="Disabled checked" disabled checked={true} />
        <ToggleSwitch
          label="Disabled with helper"
          disabled
          checked={false}
          helperText="This toggle is disabled"
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <ToggleSwitch label="Loading unchecked" isLoading checked={false} />
        <ToggleSwitch label="Loading checked" isLoading checked={true} />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Custom sizes
 */
export const CustomSizes: Story = {
  render: () => {
    const [custom1, setCustom1] = useState(false);
    const [custom2, setCustom2] = useState(false);

    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold mb-2">Custom: 60px x 30px</p>
          <ToggleSwitch
            label="Custom size toggle"
            checked={custom1}
            onChange={(e) => setCustom1(e.target.checked)}
            customWidth={60}
            customHeight={30}
          />
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Custom: 80px x 40px</p>
          <ToggleSwitch
            label="Large custom toggle"
            checked={custom2}
            onChange={(e) => setCustom2(e.target.checked)}
            customWidth={80}
            customHeight={40}
            showIcons
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Without label
 */
export const WithoutLabel: Story = {
  args: {
    checked: true,
  },
};

/**
 * Interactive toggle
 */
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="space-y-4">
        <ToggleSwitch
          label="Click me to toggle"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-semibold mb-2">Current State:</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {checked ? '✅ Enabled' : '❌ Disabled'}
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Toggle group example
 */
export const ToggleGroup: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      email: true,
      push: false,
      sms: false,
      darkMode: false,
    });

    return (
      <div className="space-y-4 w-80">
        <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
        <ToggleSwitch
          label="Email notifications"
          checked={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.checked })}
          variant="primary"
        />
        <ToggleSwitch
          label="Push notifications"
          checked={settings.push}
          onChange={(e) => setSettings({ ...settings, push: e.target.checked })}
          variant="success"
        />
        <ToggleSwitch
          label="SMS notifications"
          checked={settings.sms}
          onChange={(e) => setSettings({ ...settings, sms: e.target.checked })}
          variant="warning"
        />
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <ToggleSwitch
            label="Dark mode"
            checked={settings.darkMode}
            onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
            showIcons
            checkedIcon={<MoonIcon />}
            uncheckedIcon={<SunIcon />}
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * All variants showcase
 */
export const AllVariantsShowcase: Story = {
  render: () => {
    const [states, setStates] = useState({
      default: false,
      primary: true,
      success: false,
      warning: true,
      danger: false,
    });

    return (
      <div className="space-y-6 w-80">
        <div>
          <h3 className="text-sm font-semibold mb-4">Sizes</h3>
          <div className="space-y-3">
            <ToggleSwitch label="Small" size="small" checked={false} />
            <ToggleSwitch label="Medium" size="medium" checked={false} />
            <ToggleSwitch label="Large" size="large" checked={false} />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-4">Variants</h3>
          <div className="space-y-3">
            <ToggleSwitch
              label="Default"
              variant="default"
              checked={states.default}
              onChange={(e) => setStates({ ...states, default: e.target.checked })}
            />
            <ToggleSwitch
              label="Primary"
              variant="primary"
              checked={states.primary}
              onChange={(e) => setStates({ ...states, primary: e.target.checked })}
            />
            <ToggleSwitch
              label="Success"
              variant="success"
              checked={states.success}
              onChange={(e) => setStates({ ...states, success: e.target.checked })}
            />
            <ToggleSwitch
              label="Warning"
              variant="warning"
              checked={states.warning}
              onChange={(e) => setStates({ ...states, warning: e.target.checked })}
            />
            <ToggleSwitch
              label="Danger"
              variant="danger"
              checked={states.danger}
              onChange={(e) => setStates({ ...states, danger: e.target.checked })}
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-4">States</h3>
          <div className="space-y-3">
            <ToggleSwitch label="Unchecked" checked={false} />
            <ToggleSwitch label="Checked" checked={true} />
            <ToggleSwitch label="Disabled unchecked" disabled checked={false} />
            <ToggleSwitch label="Disabled checked" disabled checked={true} />
            <ToggleSwitch label="Loading" isLoading checked={false} />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dark theme
 */
export const DarkTheme: Story = {
  render: () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
      <ThemeWrapper theme="dark">
        <div className="space-y-6 p-6">
          <ToggleSwitch
            label="Dark mode"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            showIcons
            checkedIcon={<MoonIcon />}
            uncheckedIcon={<SunIcon />}
            variant="primary"
          />
          <ToggleSwitch
            label="Email notifications"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            variant="success"
            helperText="Receive email updates"
          />
          <ToggleSwitch
            label="Push notifications"
            checked={false}
            variant="warning"
          />
          <ToggleSwitch
            label="Delete account"
            checked={false}
            variant="danger"
            helperText="This action cannot be undone"
          />
        </div>
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Form example
 */
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      newsletter: true,
      marketing: false,
      analytics: true,
      cookies: false,
    });

    return (
      <form className="space-y-6 w-96" onSubmit={(e) => e.preventDefault()}>
        <h3 className="text-lg font-semibold">Privacy Settings</h3>
        <ToggleSwitch
          label="Subscribe to newsletter"
          checked={formData.newsletter}
          onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
          helperText="Receive weekly updates"
        />
        <ToggleSwitch
          label="Allow marketing emails"
          checked={formData.marketing}
          onChange={(e) => setFormData({ ...formData, marketing: e.target.checked })}
          helperText="We'll send you promotional content"
        />
        <ToggleSwitch
          label="Share analytics data"
          checked={formData.analytics}
          onChange={(e) => setFormData({ ...formData, analytics: e.target.checked })}
          helperText="Help us improve our service"
        />
        <ToggleSwitch
          label="Accept cookies"
          checked={formData.cookies}
          onChange={(e) => setFormData({ ...formData, cookies: e.target.checked })}
          error={!formData.cookies ? 'Cookies are required for this site' : undefined}
        />
      </form>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

