import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';
import { PlusIcon, DownloadIcon, HeartIcon, ShoppingCartIcon, SettingsIcon, ExternalLinkIcon } from './icons';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states. Perfect for user interactions throughout your application.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
      description: 'The visual style variant of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    outlined: {
      control: 'boolean',
      description: 'Use outlined style (transparent background with border)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width of its container',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button - primary variant
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * All button variants
 */
export const Variants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="info">Info</Button>
    </div>
  ),
};

/**
 * Button sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

/**
 * Outlined buttons
 */
export const Outlined: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button variant="primary" outlined>Primary</Button>
      <Button variant="secondary" outlined>Secondary</Button>
      <Button variant="success" outlined>Success</Button>
      <Button variant="danger" outlined>Danger</Button>
      <Button variant="warning" outlined>Warning</Button>
      <Button variant="info" outlined>Info</Button>
    </div>
  ),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button disabled>Disabled</Button>
      <Button variant="primary" disabled>Disabled Primary</Button>
      <Button variant="primary" outlined disabled>Disabled Outlined</Button>
    </div>
  ),
};

/**
 * Loading state
 */
export const Loading: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button loading>Loading</Button>
      <Button variant="primary" loading>Loading Primary</Button>
      <Button variant="success" loading>Loading Success</Button>
    </div>
  ),
};

/**
 * Full width button
 */
export const FullWidth: Story = {
  render: () => (
    <div className="w-64">
      <Button fullWidth>Full Width Button</Button>
    </div>
  ),
};

/**
 * Buttons with icons
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Button icon={<PlusIcon />} iconPosition="left">Add Item</Button>
        <Button icon={<DownloadIcon />} iconPosition="right">Download</Button>
        <Button icon={<HeartIcon />} iconPosition="left" variant="danger">Like</Button>
      </div>
      <div className="flex gap-2">
        <Button icon={<ShoppingCartIcon />} iconOnly aria-label="Shopping Cart" />
        <Button icon={<SettingsIcon />} iconOnly variant="secondary" aria-label="Settings" />
        <Button icon={<ExternalLinkIcon />} iconOnly variant="info" aria-label="External Link" />
      </div>
    </div>
  ),
};

/**
 * Buttons with badges
 */
export const WithBadges: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button badge={5}>Notifications</Button>
      <Button badge={99} variant="success">Messages</Button>
      <Button badge={12} variant="danger">Alerts</Button>
      <Button badge={3} variant="warning">Warnings</Button>
      <Button icon={<ShoppingCartIcon />} badge={7}>Cart</Button>
    </div>
  ),
};

/**
 * Link as button
 */
export const LinkAsButton: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button as="a" href="#" variant="primary">Link Button</Button>
      <Button as="a" href="#" variant="primary" outlined>Outlined Link</Button>
      <Button as="a" href="#" variant="info">Info Link</Button>
    </div>
  ),
};

/**
 * Floating Action Button
 */
export const FloatingButton: Story = {
  render: () => (
    <div className="relative w-full" style={{ height: '400px', padding: '40px', boxSizing: 'border-box' }}>
      <div className="h-full w-full relative">
        <Button icon={<PlusIcon />} iconOnly floating variant="primary" aria-label="Add" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Floating Action Button positioned at bottom-right corner.',
      },
    },
  },
};

/**
 * Floating buttons with different sizes
 */
export const FloatingButtonSizes: Story = {
  render: () => (
    <div className="relative w-full" style={{ height: '400px', padding: '40px', boxSizing: 'border-box' }}>
      <div className="relative" style={{ height: '100%', width: '100%' }}>
        <div style={{ position: 'absolute', bottom: '24px', right: '24px', display: 'flex', gap: '12px', flexDirection: 'column-reverse', alignItems: 'flex-end', zIndex: 1000 }}>
          <Button 
            icon={<PlusIcon />} 
            iconOnly 
            size="small" 
            variant="primary" 
            aria-label="Small FAB"
            className="rounded-full shadow-lg hover:shadow-xl"
          />
          <Button 
            icon={<PlusIcon />} 
            iconOnly 
            size="medium" 
            variant="primary" 
            aria-label="Medium FAB"
            className="rounded-full shadow-lg hover:shadow-xl"
          />
          <Button 
            icon={<PlusIcon />} 
            iconOnly 
            size="large" 
            variant="primary" 
            aria-label="Large FAB"
            className="rounded-full shadow-lg hover:shadow-xl"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Floating button with text only
 */
export const FloatingButtonTextOnly: Story = {
  render: () => (
    <div className="relative w-full" style={{ height: '400px', padding: '40px', boxSizing: 'border-box' }}>
      <div className="h-full w-full relative">
        <Button floating variant="primary">
          Add Item
        </Button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Floating Action Button with text only, positioned at bottom-right corner.',
      },
    },
  },
};

/**
 * Floating button with icon and text
 */
export const FloatingButtonWithIcon: Story = {
  render: () => (
    <div className="relative w-full" style={{ height: '400px', padding: '40px', boxSizing: 'border-box' }}>
      <div className="h-full w-full relative">
        <Button floating variant="primary" icon={<PlusIcon />} iconPosition="left">
          Add Item
        </Button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Floating Action Button with icon and text, positioned at bottom-right corner.',
      },
    },
  },
};

/**
 * Floating button text variants
 */
export const FloatingButtonTextVariants: Story = {
  render: () => (
    <div className="relative w-full" style={{ height: '500px', padding: '40px', boxSizing: 'border-box' }}>
      <div className="h-full w-full relative">
        <div className="absolute bottom-6 right-6 flex flex-col-reverse gap-3 items-end z-[1000]">
          <Button className="rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 px-4 py-3 text-base h-auto min-h-fit" variant="primary">
            Text Only
          </Button>
          <Button className="rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 px-4 py-3 text-base h-auto min-h-fit" variant="success" icon={<PlusIcon />} iconPosition="left">
            Add Item
          </Button>
          <Button className="rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 px-4 py-3 text-base h-auto min-h-fit" variant="info" icon={<DownloadIcon />} iconPosition="left">
            Download
          </Button>
          <Button className="rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 px-4 py-3 text-base h-auto min-h-fit" variant="warning" icon={<HeartIcon />} iconPosition="right">
            Like
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dark theme - All button variants
 */
export const DarkTheme: Story = {
  render: () => (
    <ThemeWrapper theme="dark">
      <div className="space-y-6">
        <div className="space-x-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
        </div>
        <div className="space-x-2">
          <Button variant="primary" outlined>Primary Outlined</Button>
          <Button variant="secondary" outlined>Secondary Outlined</Button>
          <Button variant="success" outlined>Success Outlined</Button>
          <Button variant="danger" outlined>Danger Outlined</Button>
        </div>
        <div className="space-x-2">
          <Button variant="primary" size="small">Small</Button>
          <Button variant="primary" size="medium">Medium</Button>
          <Button variant="primary" size="large">Large</Button>
        </div>
        <div className="space-x-2">
          <Button variant="primary" icon={<PlusIcon />}>With Icon</Button>
          <Button variant="primary" icon={<PlusIcon />} iconOnly aria-label="Add" />
          <Button variant="primary" badge={5}>With Badge</Button>
        </div>
      </div>
    </ThemeWrapper>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
