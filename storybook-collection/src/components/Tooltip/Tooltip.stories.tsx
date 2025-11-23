import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tooltip } from './Tooltip';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive non-native tooltip component with multiple positions, variants, types, close button, timeout, and support for complex UI content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top',
        'top-left',
        'top-right',
        'bottom',
        'bottom-left',
        'bottom-right',
        'left',
        'left-top',
        'left-bottom',
        'right',
        'right-top',
        'right-bottom',
      ],
      description: 'Position of the tooltip',
    },
    variant: {
      control: 'select',
      options: ['default', 'light', 'dark', 'info', 'success', 'warning', 'error'],
      description: 'Color variant',
    },
    type: {
      control: 'select',
      options: ['tooltip', 'popover', 'info'],
      description: 'Type of tooltip',
    },
    closable: {
      control: 'boolean',
      description: 'Show close button',
    },
    timeout: {
      control: { type: 'number', min: 0, max: 10000, step: 500 },
      description: 'Auto-hide timeout (ms)',
    },
  },
  args: {
    content: 'This is a tooltip',
    position: 'top',
    variant: 'default',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default tooltip
 */
export const Default: Story = {
  args: {
    children: <button className="px-4 py-2 bg-blue-600 text-white rounded">Hover me</button>,
    content: 'This is a default tooltip',
  },
};

/**
 * All positions
 */
export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-8 p-16">
      <Tooltip content="Top" position="top">
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Top</button>
      </Tooltip>
      <Tooltip content="Top Left" position="top-left">
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Top Left</button>
      </Tooltip>
      <Tooltip content="Top Right" position="top-right">
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Top Right</button>
      </Tooltip>
      <Tooltip content="Bottom" position="bottom">
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Bottom</button>
      </Tooltip>
      <Tooltip content="Bottom Left" position="bottom-left">
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Bottom Left</button>
      </Tooltip>
      <Tooltip content="Bottom Right" position="bottom-right">
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Bottom Right</button>
      </Tooltip>
      <Tooltip content="Left" position="left">
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Left</button>
      </Tooltip>
      <Tooltip content="Left Top" position="left-top">
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Left Top</button>
      </Tooltip>
      <Tooltip content="Left Bottom" position="left-bottom">
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Left Bottom</button>
      </Tooltip>
      <Tooltip content="Right" position="right">
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Right</button>
      </Tooltip>
      <Tooltip content="Right Top" position="right-top">
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Right Top</button>
      </Tooltip>
      <Tooltip content="Right Bottom" position="right-bottom">
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Right Bottom</button>
      </Tooltip>
    </div>
  ),
};

/**
 * All variants
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tooltip content="Default variant" variant="default">
        <button className="px-4 py-2 bg-gray-600 text-white rounded">Default</button>
      </Tooltip>
      <Tooltip content="Light variant" variant="light">
        <button className="px-4 py-2 bg-gray-200 text-gray-900 rounded">Light</button>
      </Tooltip>
      <Tooltip content="Dark variant" variant="dark">
        <button className="px-4 py-2 bg-gray-800 text-white rounded">Dark</button>
      </Tooltip>
      <Tooltip content="Info variant" variant="info">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Info</button>
      </Tooltip>
      <Tooltip content="Success variant" variant="success">
        <button className="px-4 py-2 bg-green-600 text-white rounded">Success</button>
      </Tooltip>
      <Tooltip content="Warning variant" variant="warning">
        <button className="px-4 py-2 bg-yellow-600 text-white rounded">Warning</button>
      </Tooltip>
      <Tooltip content="Error variant" variant="error">
        <button className="px-4 py-2 bg-red-600 text-white rounded">Error</button>
      </Tooltip>
    </div>
  ),
};

/**
 * All types
 */
export const Types: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tooltip content="This is a tooltip type" type="tooltip">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Tooltip</button>
      </Tooltip>
      <Tooltip
        content="This is a popover type with more content. It can contain longer text and more complex UI elements."
        type="popover"
      >
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Popover</button>
      </Tooltip>
      <Tooltip
        content="This is an info type tooltip. It's designed for informational content and can be wider to accommodate more details."
        type="info"
      >
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Info</button>
      </Tooltip>
    </div>
  ),
};

/**
 * With close button
 */
export const Closable: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tooltip content="This tooltip can be closed manually" closable>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Closable Tooltip</button>
      </Tooltip>
      <Tooltip content="Click the X to close" closable variant="info">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Info with Close</button>
      </Tooltip>
    </div>
  ),
};

/**
 * With timeout
 */
export const WithTimeout: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tooltip content="This tooltip will auto-hide in 3 seconds" timeout={3000}>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">3s Timeout</button>
      </Tooltip>
      <Tooltip content="This tooltip will auto-hide in 5 seconds" timeout={5000} variant="success">
        <button className="px-4 py-2 bg-green-600 text-white rounded">5s Timeout</button>
      </Tooltip>
    </div>
  ),
};

/**
 * Complex UI content
 */
export const ComplexContent: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tooltip
        content={
          <div className="space-y-2">
            <h4 className="font-semibold text-base">User Profile</h4>
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/150?img=1"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm opacity-80">Software Engineer</p>
              </div>
            </div>
            <div className="pt-2 border-t border-current/20">
              <p className="text-sm">Email: john.doe@example.com</p>
              <p className="text-sm">Phone: +1 234 567 8900</p>
            </div>
          </div>
        }
        type="popover"
        variant="light"
      >
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Complex Content</button>
      </Tooltip>
      <Tooltip
        content={
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-semibold">Notification</h4>
            </div>
            <p className="text-sm">You have 3 new messages</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">View</button>
              <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm">Dismiss</button>
            </div>
          </div>
        }
        type="popover"
        variant="info"
      >
        <button className="px-4 py-2 bg-blue-600 text-white rounded">With Actions</button>
      </Tooltip>
    </div>
  ),
};

/**
 * Bulleted list
 */
export const BulletedList: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tooltip
        content={
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Feature one</li>
              <li>Feature two</li>
              <li>Feature three</li>
              <li>Feature four</li>
            </ul>
          </div>
        }
        type="popover"
        variant="light"
      >
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Bulleted List</button>
      </Tooltip>
      <Tooltip
        content={
          <div>
            <h4 className="font-semibold mb-2">Benefits:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Fast performance</li>
              <li>Easy to use</li>
              <li>Highly customizable</li>
              <li>Accessible</li>
            </ul>
          </div>
        }
        type="popover"
        variant="success"
      >
        <button className="px-4 py-2 bg-green-600 text-white rounded">Success List</button>
      </Tooltip>
    </div>
  ),
};

/**
 * Interactive button
 */
export const InteractiveButton: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tooltip
        content="Click the button below to learn more about this feature."
        showInteractiveButton
        interactiveButtonLabel="Learn More"
        onInteractiveButtonClick={() => alert('Learn more clicked!')}
        triggerOnFocus
      >
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Focus me</button>
      </Tooltip>
      <Tooltip
        content={
          <div>
            <p className="mb-2">This tooltip has an interactive button.</p>
            <p className="text-sm opacity-80">Click the button to perform an action.</p>
          </div>
        }
        showInteractiveButton
        interactiveButtonLabel="Get Started"
        onInteractiveButtonClick={() => alert('Get started clicked!')}
        type="popover"
        variant="info"
      >
        <button className="px-4 py-2 bg-blue-600 text-white rounded">With Interactive</button>
      </Tooltip>
    </div>
  ),
};

/**
 * Click trigger
 */
export const ClickTrigger: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tooltip
        content="This tooltip appears on click"
        triggerOnClick
        triggerOnHover={false}
        closable
      >
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Click me</button>
      </Tooltip>
    </div>
  ),
};

/**
 * Focus trigger
 */
export const FocusTrigger: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tooltip
        content="This tooltip appears on focus"
        triggerOnFocus
        triggerOnHover={false}
        showInteractiveButton
        interactiveButtonLabel="Learn More"
      >
        <input
          type="text"
          placeholder="Focus me"
          className="px-4 py-2 border border-gray-300 rounded"
        />
      </Tooltip>
    </div>
  ),
};

/**
 * Combined features
 */
export const CombinedFeatures: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tooltip
        content={
          <div className="space-y-2">
            <h4 className="font-semibold">Complete Example</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Close button</li>
              <li>Auto-hide timeout</li>
              <li>Interactive button</li>
            </ul>
          </div>
        }
        type="popover"
        variant="info"
        closable
        timeout={10000}
        showInteractiveButton
        interactiveButtonLabel="View Details"
        onInteractiveButtonClick={() => alert('Details clicked!')}
      >
        <button className="px-4 py-2 bg-blue-600 text-white rounded">All Features</button>
      </Tooltip>
    </div>
  ),
};

/**
 * Dark theme
 */
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeWrapper theme="dark">
        <div style={{ minHeight: '100vh', width: '100%', position: 'relative', margin: 0, padding: '2rem' }}>
          <Story />
        </div>
      </ThemeWrapper>
    ),
  ],
  parameters: {
    backgrounds: {
      disable: true,
    },
  },
  render: () => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Tooltip content="Default variant" variant="default">
          <button className="px-4 py-2 bg-gray-600 text-white rounded">Default</button>
        </Tooltip>
        <Tooltip content="Light variant" variant="light">
          <button className="px-4 py-2 bg-gray-200 text-gray-900 rounded">Light</button>
        </Tooltip>
        <Tooltip content="Info variant" variant="info">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Info</button>
        </Tooltip>
      </div>
      <div className="flex flex-wrap gap-4">
        <Tooltip content="With close button" closable>
          <button className="px-4 py-2 bg-gray-600 text-white rounded">Closable</button>
        </Tooltip>
        <Tooltip content="With interactive button" showInteractiveButton>
          <button className="px-4 py-2 bg-gray-600 text-white rounded">Interactive</button>
        </Tooltip>
      </div>
    </div>
  ),
};

