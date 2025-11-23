import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Chip } from './Chip';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A versatile chip/badge component with multiple variants, sizes, shapes, icons, avatars, badges, and interactive features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
      description: 'Color variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the chip',
    },
    shape: {
      control: 'select',
      options: ['rounded', 'pill', 'square'],
      description: 'Shape style',
    },
    deletable: {
      control: 'boolean',
      description: 'Show delete button',
    },
    clickable: {
      control: 'boolean',
      description: 'Make chip clickable',
    },
    outlined: {
      control: 'boolean',
      description: 'Use outlined style',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the chip',
    },
  },
  args: {
    label: 'Chip',
    variant: 'default',
    size: 'medium',
    shape: 'rounded',
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default chip
 */
export const Default: Story = {
  args: {
    label: 'Default Chip',
  },
};

/**
 * All variants
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Default" variant="default" />
      <Chip label="Primary" variant="primary" />
      <Chip label="Success" variant="success" />
      <Chip label="Warning" variant="warning" />
      <Chip label="Error" variant="error" />
      <Chip label="Info" variant="info" />
    </div>
  ),
};

/**
 * All sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip label="Small" size="small" />
      <Chip label="Medium" size="medium" />
      <Chip label="Large" size="large" />
    </div>
  ),
};

/**
 * All shapes
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Rounded" shape="rounded" />
      <Chip label="Pill" shape="pill" />
      <Chip label="Square" shape="square" />
    </div>
  ),
};

/**
 * With icons
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip
        label="With Icon"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        }
      />
      <Chip
        label="Success"
        variant="success"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <Chip
        label="Warning"
        variant="warning"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      />
      <Chip
        label="Error"
        variant="error"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  ),
};

/**
 * With avatars
 */
export const WithAvatars: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip
        label="John Doe"
        avatar={
          <img
            src="https://i.pravatar.cc/150?img=1"
            alt="Avatar"
            className="w-5 h-5 rounded-full object-cover"
          />
        }
      />
      <Chip
        label="Jane Smith"
        variant="primary"
        avatar={
          <img
            src="https://i.pravatar.cc/150?img=2"
            alt="Avatar"
            className="w-5 h-5 rounded-full object-cover"
          />
        }
      />
      <Chip
        label="Bob Johnson"
        variant="success"
        shape="pill"
        avatar={
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            BJ
          </div>
        }
      />
    </div>
  ),
};

/**
 * Deletable chips
 */
export const Deletable: Story = {
  render: () => {
    const [chips, setChips] = useState(['React', 'Vue', 'Angular', 'Svelte']);

    return (
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            deletable
            onDelete={() => setChips(chips.filter((c) => c !== chip))}
          />
        ))}
      </div>
    );
  },
};

/**
 * Clickable chips
 */
export const Clickable: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip
        label="Click Me"
        clickable
        onClick={() => alert('Chip clicked!')}
      />
      <Chip
        label="Primary Clickable"
        variant="primary"
        clickable
        onClick={() => alert('Primary chip clicked!')}
      />
      <Chip
        label="Success Clickable"
        variant="success"
        clickable
        onClick={() => alert('Success chip clicked!')}
      />
    </div>
  ),
};

/**
 * With badges
 */
export const WithBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Notifications" badge={5} />
      <Chip label="Messages" variant="primary" badge={12} />
      <Chip label="Tasks" variant="success" badge={3} />
      <Chip label="Alerts" variant="warning" badge={99} />
      <Chip label="Errors" variant="error" badge="!" />
      <Chip label="Info" variant="info" badge={0} />
    </div>
  ),
};

/**
 * Outlined chips
 */
export const Outlined: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Default Outlined" outlined />
      <Chip label="Primary Outlined" variant="primary" outlined />
      <Chip label="Success Outlined" variant="success" outlined />
      <Chip label="Warning Outlined" variant="warning" outlined />
      <Chip label="Error Outlined" variant="error" outlined />
      <Chip label="Info Outlined" variant="info" outlined />
    </div>
  ),
};

/**
 * Disabled chips
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Disabled" disabled />
      <Chip label="Disabled Primary" variant="primary" disabled />
      <Chip label="Disabled Deletable" deletable disabled />
      <Chip label="Disabled Clickable" clickable disabled />
      <Chip label="Disabled Outlined" outlined disabled />
    </div>
  ),
};

/**
 * Custom colors
 */
export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Purple" color="#9333ea" />
      <Chip label="Pink" color="#ec4899" />
      <Chip label="Indigo" color="#6366f1" />
      <Chip label="Teal" color="#14b8a6" />
      <Chip label="Purple Outlined" color="#9333ea" outlined />
      <Chip label="Pink Outlined" color="#ec4899" outlined />
    </div>
  ),
};

/**
 * Complex examples
 */
export const ComplexExamples: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Chip
          label="React Developer"
          variant="primary"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          badge={5}
          deletable
          onDelete={() => alert('Deleted!')}
        />
        <Chip
          label="Team Lead"
          variant="success"
          shape="pill"
          avatar={
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
              TL
            </div>
          }
          clickable
          onClick={() => alert('Clicked!')}
        />
        <Chip
          label="New Feature"
          variant="info"
          outlined
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
          badge="New"
        />
      </div>
    </div>
  ),
};

/**
 * Filter chips
 */
export const FilterChips: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['all']);

    const filters = ['all', 'active', 'completed', 'archived'];

    return (
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Chip
            key={filter}
            label={filter.charAt(0).toUpperCase() + filter.slice(1)}
            variant={selected.includes(filter) ? 'primary' : 'default'}
            clickable
            onClick={() => {
              if (filter === 'all') {
                setSelected(['all']);
              } else {
                setSelected((prev) =>
                  prev.includes(filter)
                    ? prev.filter((f) => f !== filter && f !== 'all')
                    : [...prev.filter((f) => f !== 'all'), filter]
                );
              }
            }}
          />
        ))}
      </div>
    );
  },
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
      <div className="flex flex-wrap gap-2">
        <Chip label="Default" variant="default" />
        <Chip label="Primary" variant="primary" />
        <Chip label="Success" variant="success" />
        <Chip label="Warning" variant="warning" />
        <Chip label="Error" variant="error" />
        <Chip label="Info" variant="info" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip label="Outlined" outlined />
        <Chip label="Primary Outlined" variant="primary" outlined />
        <Chip label="With Badge" badge={5} />
        <Chip label="Deletable" deletable />
        <Chip label="Clickable" clickable />
      </div>
    </div>
  ),
};

