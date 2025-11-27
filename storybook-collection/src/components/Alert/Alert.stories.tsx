import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Alert } from './Alert';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

// Custom icons
const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible alert component for displaying important messages to users. Supports multiple variants, sizes, styles, icons, actions, and dismissible functionality. Perfect for notifications, warnings, errors, and informational messages.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Alert title',
    },
    children: {
      control: 'text',
      description: 'Alert content/description',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      description: 'Color variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
    style: {
      control: 'select',
      options: ['solid', 'outlined', 'soft'],
      description: 'Style variant',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show default icon based on variant',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether alert can be dismissed',
    },
    visible: {
      control: 'boolean',
      description: 'Whether alert is visible (controlled)',
    },
  },
  args: {
    onDismiss: fn(),
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default alert with title and content
 */
export const Default: Story = {
  args: {
    title: 'Alert Title',
    children: 'This is a default alert message with some information for the user.',
  },
};

/**
 * Alert with only content (no title)
 */
export const ContentOnly: Story = {
  args: {
    children: 'This is an alert with only content and no title.',
  },
};

/**
 * Alert with only title (no content)
 */
export const TitleOnly: Story = {
  args: {
    title: 'Important Notice',
  },
};

/**
 * All variants showcase
 */
export const Variants: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <Alert variant="default" title="Default Alert">
          This is a default alert message.
        </Alert>
        <Alert variant="success" title="Success Alert">
          Your changes have been saved successfully!
        </Alert>
        <Alert variant="info" title="Info Alert">
          Here is some useful information for you.
        </Alert>
        <Alert variant="warning" title="Warning Alert">
          Please review your input before submitting.
        </Alert>
        <Alert variant="error" title="Error Alert">
          Something went wrong. Please try again.
        </Alert>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <Alert variant="info" size="small" title="Small Alert">
          This is a small alert message.
        </Alert>
        <Alert variant="info" size="medium" title="Medium Alert">
          This is a medium alert message.
        </Alert>
        <Alert variant="info" size="large" title="Large Alert">
          This is a large alert message with more content to demonstrate the size difference.
        </Alert>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Different styles
 */
export const Styles: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <Alert variant="success" style="solid" title="Solid Style">
          This is a solid style alert with a filled background.
        </Alert>
        <Alert variant="success" style="outlined" title="Outlined Style">
          This is an outlined style alert with a border.
        </Alert>
        <Alert variant="success" style="soft" title="Soft Style">
          This is a soft style alert with a subtle background.
        </Alert>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dismissible alerts
 */
export const Dismissible: Story = {
  render: () => {
    const [visible1, setVisible1] = useState(true);
    const [visible2, setVisible2] = useState(true);
    const [visible3, setVisible3] = useState(true);

    return (
      <div className="space-y-4">
        <Alert
          variant="info"
          title="Dismissible Alert"
          dismissible
          visible={visible1}
          onDismiss={() => setVisible1(false)}
        >
          Click the X button to dismiss this alert.
        </Alert>
        <Alert
          variant="warning"
          title="Warning Alert"
          dismissible
          visible={visible2}
          onDismiss={() => setVisible2(false)}
        >
          This warning can be dismissed.
        </Alert>
        <Alert
          variant="error"
          title="Error Alert"
          dismissible
          visible={visible3}
          onDismiss={() => setVisible3(false)}
        >
          This error alert can also be dismissed.
        </Alert>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Alerts with actions
 */
export const WithActions: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <Alert
          variant="info"
          title="Action Required"
          actions={[
            { label: 'View Details', onClick: () => alert('View Details clicked'), variant: 'primary' },
            { label: 'Dismiss', onClick: () => alert('Dismiss clicked') },
          ]}
        >
          This alert has action buttons. Click them to perform actions.
        </Alert>
        <Alert
          variant="warning"
          title="Unsaved Changes"
          actions={[
            { label: 'Save', onClick: () => alert('Save clicked'), variant: 'success' },
            { label: 'Discard', onClick: () => alert('Discard clicked'), variant: 'danger' },
          ]}
        >
          You have unsaved changes. Would you like to save them?
        </Alert>
        <Alert
          variant="error"
          title="Connection Error"
          actions={[
            { label: 'Retry', onClick: () => alert('Retry clicked'), variant: 'primary' },
            { label: 'Cancel', onClick: () => alert('Cancel clicked') },
          ]}
        >
          Failed to connect to the server. Please try again.
        </Alert>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Alerts with custom icons
 */
export const CustomIcons: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <Alert
          variant="info"
          title="Custom Icon"
          icon={<BellIcon />}
        >
          This alert uses a custom bell icon.
        </Alert>
        <Alert
          variant="success"
          title="Custom Success Icon"
          icon={<CheckCircleIcon />}
        >
          This alert uses a custom check circle icon.
        </Alert>
        <Alert
          variant="warning"
          title="Custom Warning Icon"
          icon={<ExclamationIcon />}
        >
          This alert uses a custom exclamation icon.
        </Alert>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Alerts without icons
 */
export const WithoutIcons: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <Alert variant="success" title="No Icon" showIcon={false}>
          This alert doesn't show an icon.
        </Alert>
        <Alert variant="warning" title="No Icon" showIcon={false}>
          Another alert without an icon.
        </Alert>
        <Alert variant="error" title="No Icon" showIcon={false}>
          Error alert without an icon.
        </Alert>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dismissible with actions
 */
export const DismissibleWithActions: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    return (
      <div className="space-y-4">
        {visible && (
          <Alert
            variant="warning"
            title="Session Expiring"
            dismissible
            onDismiss={() => setVisible(false)}
            actions={[
              { label: 'Extend Session', onClick: () => alert('Session extended'), variant: 'primary' },
              { label: 'Logout', onClick: () => setVisible(false), variant: 'default' },
            ]}
          >
            Your session will expire in 5 minutes. Would you like to extend it?
          </Alert>
        )}
        {!visible && (
          <button
            onClick={() => setVisible(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Show Alert Again
          </button>
        )}
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Long content alert
 */
export const LongContent: Story = {
  args: {
    variant: 'info',
    title: 'Important Information',
    children:
      'This is a longer alert message that contains more detailed information. It demonstrates how the alert component handles longer content. The text should wrap naturally and remain readable. This is useful for displaying more comprehensive messages to users.',
  },
};

/**
 * All style variants for each color
 */
export const AllStyleVariants: Story = {
  render: () => {
    const variants: Array<'default' | 'success' | 'warning' | 'error' | 'info'> = [
      'default',
      'success',
      'warning',
      'error',
      'info',
    ];
    const styles: Array<'solid' | 'outlined' | 'soft'> = ['solid', 'outlined', 'soft'];

    return (
      <div className="space-y-6">
        {variants.map((variant) => (
          <div key={variant} className="space-y-3">
            <h3 className="text-sm font-semibold capitalize">{variant} Variant</h3>
            <div className="space-y-2">
              {styles.map((style) => (
                <Alert
                  key={style}
                  variant={variant}
                  style={style}
                  title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} ${style.charAt(0).toUpperCase() + style.slice(1)}`}
                >
                  This is a {variant} alert with {style} style.
                </Alert>
              ))}
            </div>
          </div>
        ))}
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
    return (
      <ThemeWrapper theme="dark">
        <div className="space-y-4 p-6">
          <Alert variant="default" title="Default Alert">
            This is a default alert in dark theme.
          </Alert>
          <Alert variant="success" title="Success Alert">
            Operation completed successfully in dark theme.
          </Alert>
          <Alert variant="info" title="Info Alert">
            Here is some information in dark theme.
          </Alert>
          <Alert variant="warning" title="Warning Alert">
            This is a warning message in dark theme.
          </Alert>
          <Alert variant="error" title="Error Alert">
            An error occurred in dark theme.
          </Alert>
          <Alert
            variant="info"
            title="Dismissible Alert"
            dismissible
            actions={[
              { label: 'Action', onClick: () => alert('Action clicked'), variant: 'primary' },
            ]}
          >
            This alert is dismissible and has actions in dark theme.
          </Alert>
        </div>
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Real-world examples
 */
export const RealWorldExamples: Story = {
  render: () => {
    const [dismissed, setDismissed] = useState(false);

    return (
      <div className="space-y-4 max-w-2xl">
        <Alert
          variant="success"
          title="Payment Successful"
          dismissible
          visible={!dismissed}
          onDismiss={() => setDismissed(true)}
        >
          Your payment of $99.99 has been processed successfully. A confirmation email has been sent to your inbox.
        </Alert>

        <Alert
          variant="warning"
          title="Low Storage Space"
          actions={[
            { label: 'Upgrade Plan', onClick: () => alert('Upgrade clicked'), variant: 'primary' },
            { label: 'Free Up Space', onClick: () => alert('Free space clicked') },
          ]}
        >
          You're running low on storage space. You have 2.5 GB remaining out of 10 GB.
        </Alert>

        <Alert
          variant="error"
          title="Login Failed"
          dismissible
          actions={[
            { label: 'Try Again', onClick: () => alert('Retry clicked'), variant: 'primary' },
            { label: 'Reset Password', onClick: () => alert('Reset clicked'), variant: 'default' },
          ]}
        >
          Invalid email or password. Please check your credentials and try again.
        </Alert>

        <Alert
          variant="info"
          title="New Feature Available"
          dismissible
          actions={[
            { label: 'Learn More', onClick: () => alert('Learn more clicked'), variant: 'primary' },
          ]}
        >
          We've just released a new feature! Check out our latest updates in the dashboard.
        </Alert>

        <Alert
          variant="warning"
          title="Maintenance Scheduled"
          style="outlined"
        >
          Scheduled maintenance will occur on Saturday, March 15th from 2:00 AM to 4:00 AM EST. Some services may be temporarily unavailable.
        </Alert>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Compact alerts (small size, no title)
 */
export const CompactAlerts: Story = {
  render: () => {
    return (
      <div className="space-y-2">
        <Alert variant="success" size="small">
          Changes saved successfully.
        </Alert>
        <Alert variant="info" size="small">
          New message received.
        </Alert>
        <Alert variant="warning" size="small">
          Please review your settings.
        </Alert>
        <Alert variant="error" size="small">
          Failed to load data.
        </Alert>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Alert with HTML content
 */
export const WithHTMLContent: Story = {
  render: () => {
    return (
      <Alert
        variant="info"
        title="Rich Content Alert"
      >
        <div>
          <p className="mb-2">This alert supports rich HTML content:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Bullet points</li>
            <li>Formatted text</li>
            <li>Links and more</li>
          </ul>
          <p className="mt-2">
            Visit our <a href="#" className="underline text-blue-600 dark:text-blue-400">documentation</a> for more information.
          </p>
        </div>
      </Alert>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Interactive example
 */
export const Interactive: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    const [visible, setVisible] = useState(true);

    return (
      <div className="space-y-4">
        {visible && (
          <Alert
            variant="info"
            title="Interactive Alert"
            dismissible
            onDismiss={() => setVisible(false)}
            actions={[
              {
                label: `Clicked ${count} times`,
                onClick: () => setCount(count + 1),
                variant: 'primary',
              },
            ]}
          >
            Click the action button to see the counter increase. Click the X to dismiss this alert.
          </Alert>
        )}
        {!visible && (
          <button
            onClick={() => {
              setVisible(true);
              setCount(0);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Show Alert Again
          </button>
        )}
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

