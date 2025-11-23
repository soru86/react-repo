import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Notification, NotificationContainer, type NotificationVariant, type NotificationPosition } from './Notification';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/Notification',
  component: Notification,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive notification component with multiple positions, auto-dismiss, actions, collapsible content, and stacking support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      description: 'Color variant',
    },
    position: {
      control: 'select',
      options: ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'],
      description: 'Position on screen',
    },
    duration: {
      control: { type: 'number', min: 0, max: 10000, step: 500 },
      description: 'Auto-dismiss duration (ms)',
    },
    closable: {
      control: 'boolean',
      description: 'Show close button',
    },
    collapsible: {
      control: 'boolean',
      description: 'Enable collapsible content',
    },
  },
  args: {
    title: 'Notification Title',
    message: 'This is a notification message.',
    visible: true,
    position: 'top-right',
  },
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default notification
 */
export const Default: Story = {
  args: {
    title: 'Notification Title',
    message: 'This is a default notification message.',
    visible: true,
    position: 'top-right',
  },
  render: (args) => <Notification {...args} />,
  parameters: {
    docs: {
      layout: 'fullscreen',
    },
  },
};

/**
 * All variants
 */
export const Variants: Story = {
  render: () => (
    <>
      <Notification
        title="Success"
        message="Operation completed successfully!"
        variant="success"
        visible={true}
        position="top-left"
      />
      <Notification
        title="Warning"
        message="Please review your input."
        variant="warning"
        visible={true}
        position="top-center"
      />
      <Notification
        title="Error"
        message="Something went wrong. Please try again."
        variant="error"
        visible={true}
        position="top-right"
      />
      <Notification
        title="Info"
        message="Here's some helpful information."
        variant="info"
        visible={true}
        position="bottom-left"
      />
    </>
  ),
};

/**
 * All positions
 */
export const Positions: Story = {
  render: () => (
    <>
      <Notification
        title="Top Left"
        message="Notification in top-left corner"
        visible={true}
        position="top-left"
      />
      <Notification
        title="Top Center"
        message="Notification in top-center"
        visible={true}
        position="top-center"
      />
      <Notification
        title="Top Right"
        message="Notification in top-right corner"
        visible={true}
        position="top-right"
      />
      <Notification
        title="Bottom Left"
        message="Notification in bottom-left corner"
        visible={true}
        position="bottom-left"
      />
      <Notification
        title="Bottom Center"
        message="Notification in bottom-center"
        visible={true}
        position="bottom-center"
      />
      <Notification
        title="Bottom Right"
        message="Notification in bottom-right corner"
        visible={true}
        position="bottom-right"
      />
    </>
  ),
};

/**
 * With actions - Confirmation
 */
export const Confirmation: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return (
      <Notification
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
        variant="warning"
        visible={visible}
        position="top-center"
        actions={[
          {
            label: 'Yes',
            onClick: () => alert('Confirmed!'),
            variant: 'primary',
          },
          {
            label: 'No',
            onClick: () => setVisible(false),
            variant: 'default',
          },
        ]}
        onClose={() => setVisible(false)}
      />
    );
  },
};

/**
 * With actions - OK/Cancel
 */
export const OkCancel: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return (
      <Notification
        title="Save Changes?"
        message="You have unsaved changes. Do you want to save them?"
        variant="info"
        visible={visible}
        position="top-center"
        actions={[
          {
            label: 'OK',
            onClick: () => alert('Saved!'),
            variant: 'primary',
          },
          {
            label: 'Cancel',
            onClick: () => setVisible(false),
            variant: 'default',
          },
        ]}
        onClose={() => setVisible(false)}
      />
    );
  },
};

/**
 * With actions - Error recovery
 */
export const ErrorRecovery: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return (
      <Notification
        title="Upload Failed"
        message="The file upload failed. Please try again."
        variant="error"
        visible={visible}
        position="top-center"
        actions={[
          {
            label: 'Retry',
            onClick: () => alert('Retrying upload...'),
            variant: 'primary',
          },
          {
            label: 'Dismiss',
            onClick: () => setVisible(false),
            variant: 'default',
          },
        ]}
        onClose={() => setVisible(false)}
      />
    );
  },
};

/**
 * With custom icon
 */
export const CustomIcon: Story = {
  render: () => (
    <Notification
      title="Custom Icon"
      message="This notification has a custom icon."
      visible={true}
      position="top-right"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  ),
};

/**
 * Without icon
 */
export const WithoutIcon: Story = {
  render: () => (
    <Notification
      title="No Icon"
      message="This notification doesn't have an icon."
      visible={true}
      position="top-right"
      icon={null}
    />
  ),
};

/**
 * Without title
 */
export const WithoutTitle: Story = {
  render: () => (
    <Notification
      message="This notification doesn't have a title, only a message."
      visible={true}
      position="top-right"
      variant="info"
    />
  ),
};

/**
 * Collapsible content
 */
export const Collapsible: Story = {
  render: () => (
    <Notification
      title="Collapsible Notification"
      message="Click 'Show more' to see additional details."
      visible={true}
      position="top-right"
      variant="info"
      collapsible={true}
      defaultCollapsed={true}
    >
      <div className="text-sm space-y-2">
        <p>This is the expanded content that can be collapsed.</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Detail item 1</li>
          <li>Detail item 2</li>
          <li>Detail item 3</li>
        </ul>
      </div>
    </Notification>
  ),
};

/**
 * Complex content
 */
export const ComplexContent: Story = {
  render: () => (
    <Notification
      title="Complex Notification"
      visible={true}
      position="top-right"
      variant="success"
    >
      <div className="space-y-3">
        <p className="text-sm">Your order has been processed successfully!</p>
        <div className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
            <span className="font-medium">#12345</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600 dark:text-gray-400">Total:</span>
            <span className="font-medium">$99.99</span>
          </div>
        </div>
      </div>
    </Notification>
  ),
};

/**
 * Auto-dismiss
 */
export const AutoDismiss: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return (
      <Notification
        title="Auto-dismiss"
        message="This notification will automatically close in 3 seconds."
        visible={visible}
        position="top-center"
        variant="info"
        duration={3000}
        onClose={() => setVisible(false)}
      />
    );
  },
};

/**
 * No auto-dismiss
 */
export const NoAutoDismiss: Story = {
  render: () => (
    <Notification
      title="Persistent"
      message="This notification will stay until manually closed."
      visible={true}
      position="top-right"
      variant="warning"
      duration={0}
    />
  ),
};

/**
 * Without close button
 */
export const WithoutCloseButton: Story = {
  render: () => (
    <Notification
      title="No Close Button"
      message="This notification cannot be manually closed."
      visible={true}
      position="top-right"
      variant="info"
      closable={false}
      duration={5000}
    />
  ),
};

/**
 * Stacked notifications
 */
export const Stacked: Story = {
  render: () => {
    const [notifications, setNotifications] = useState([
      { id: '1', title: 'First', message: 'First notification', variant: 'success' as const },
      { id: '2', title: 'Second', message: 'Second notification', variant: 'info' as const },
      { id: '3', title: 'Third', message: 'Third notification', variant: 'warning' as const },
    ]);

    return (
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <NotificationContainer
          notifications={notifications}
          position="top-right"
          stacked={true}
          onNotificationClose={(id) => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
          }}
        />
      </div>
    );
  },
};

/**
 * Single notification (non-stacked)
 */
export const Single: Story = {
  render: () => {
    const [notifications, setNotifications] = useState([
      { id: '1', title: 'First', message: 'First notification', variant: 'success' as const },
      { id: '2', title: 'Second', message: 'Second notification', variant: 'info' as const },
      { id: '3', title: 'Third', message: 'Third notification', variant: 'warning' as const },
    ]);

    return (
      <NotificationContainer
        notifications={notifications}
        position="top-right"
        stacked={false}
        onNotificationClose={(id) => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }}
      />
    );
  },
};

/**
 * Interactive example
 */
export const Interactive: Story = {
  render: () => {
    const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; variant: NotificationVariant }>>([]);
    const [position, setPosition] = useState<NotificationPosition>('top-right');

    const addNotification = (variant: NotificationVariant) => {
      const id = Date.now().toString();
      setNotifications((prev) => [
        ...prev,
        {
          id,
          title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Notification`,
          message: `This is a ${variant} notification.`,
          variant,
        },
      ]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    };

    return (
      <div style={{ minHeight: '100vh', position: 'relative', padding: '2rem' }}>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position:
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as NotificationPosition)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="top-left">Top Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => addNotification('success')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Success
              </button>
              <button
                onClick={() => addNotification('info')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Info
              </button>
              <button
                onClick={() => addNotification('warning')}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Warning
              </button>
              <button
                onClick={() => addNotification('error')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Error
              </button>
            </div>
          </div>
        </div>
        <NotificationContainer
          notifications={notifications}
          position={position}
          stacked={true}
          onNotificationClose={(id) => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
          }}
        />
      </div>
    );
  },
};

/**
 * All action variants
 */
export const ActionVariants: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return (
      <Notification
        title="Action Variants"
        message="Different action button styles."
        visible={visible}
        position="top-center"
        variant="info"
        actions={[
          { label: 'Default', onClick: () => {}, variant: 'default' },
          { label: 'Primary', onClick: () => {}, variant: 'primary' },
          { label: 'Success', onClick: () => {}, variant: 'success' },
          { label: 'Warning', onClick: () => {}, variant: 'warning' },
          { label: 'Danger', onClick: () => setVisible(false), variant: 'danger' },
        ]}
        onClose={() => setVisible(false)}
      />
    );
  },
};

/**
 * Dark theme - Notification variants
 */
export const DarkTheme: Story = {
  render: () => (
    <ThemeWrapper theme="dark">
      <div style={{ minHeight: '100vh', width: '100%', position: 'relative', margin: 0, padding: 0 }}>
        <Notification
          title="Success"
          message="Operation completed successfully!"
          variant="success"
          visible={true}
          position="top-left"
        />
        <Notification
          title="Warning"
          message="Please review your input."
          variant="warning"
          visible={true}
          position="top-center"
        />
        <Notification
          title="Error"
          message="Something went wrong."
          variant="error"
          visible={true}
          position="top-right"
        />
        <Notification
          title="Info"
          message="Here's some helpful information."
          variant="info"
          visible={true}
          position="bottom-left"
        />
      </div>
    </ThemeWrapper>
  ),
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      disable: true, // Disable Storybook's background addon to prevent override
    },
  },
};

