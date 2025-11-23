import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonGroup } from './Skeleton';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Skeleton components for displaying loading states. Perfect for forms, lists, grids, and complete UI layouts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular', 'rounded'],
      description: 'Skeleton shape variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size variant',
    },
    animation: {
      control: 'select',
      options: ['pulse', 'wave', 'none'],
      description: 'Animation type',
    },
    width: {
      control: 'text',
      description: 'Custom width',
    },
    height: {
      control: 'text',
      description: 'Custom height',
    },
    lines: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of lines (for text variant)',
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default text skeleton
 */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Skeleton variant="text" size="md" animation="pulse" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * All variants
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md p-4">
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Text</span>
        <Skeleton variant="text" width="100%" />
      </div>
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Circular</span>
        <Skeleton variant="circular" size="md" />
      </div>
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Rectangular</span>
        <Skeleton variant="rectangular" width="100%" height="100px" />
      </div>
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Rounded</span>
        <Skeleton variant="rounded" width="100%" height="100px" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md p-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="space-y-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {size}
          </span>
          <Skeleton variant="text" size={size} width="100%" />
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Different animations
 */
export const Animations: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md p-4">
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pulse</span>
        <Skeleton variant="text" animation="pulse" width="100%" />
      </div>
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Wave</span>
        <Skeleton variant="text" animation="wave" width="100%" />
      </div>
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">None</span>
        <Skeleton variant="text" animation="none" width="100%" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Text with multiple lines
 */
export const TextLines: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md p-4">
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">2 Lines</span>
        <Skeleton variant="text" lines={2} width="100%" />
      </div>
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">3 Lines</span>
        <Skeleton variant="text" lines={3} width="100%" />
      </div>
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">5 Lines</span>
        <Skeleton variant="text" lines={5} width="100%" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Form skeleton
 */
export const FormSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-6 p-6 border border-gray-300 dark:border-gray-600 rounded-lg">
      <div className="space-y-2">
        <Skeleton variant="text" width="40%" height="20px" />
        <Skeleton variant="rectangular" width="100%" height="40px" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width="35%" height="20px" />
        <Skeleton variant="rectangular" width="100%" height="40px" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width="45%" height="20px" />
        <Skeleton variant="rectangular" width="100%" height="100px" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" size="sm" />
        <Skeleton variant="text" width="60%" />
      </div>
      <div className="flex gap-3">
        <Skeleton variant="rounded" width="100px" height="40px" />
        <Skeleton variant="rounded" width="100px" height="40px" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * List skeleton
 */
export const ListSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="flex items-center gap-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          <Skeleton variant="circular" size="md" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" size="sm" />
          </div>
          <Skeleton variant="rounded" width="60px" height="30px" />
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Grid skeleton
 */
export const GridSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
          >
            <Skeleton variant="rectangular" width="100%" height="200px" />
            <div className="p-4 space-y-3">
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" size="sm" />
              <div className="flex gap-2 pt-2">
                <Skeleton variant="rounded" width="60px" height="24px" />
                <Skeleton variant="rounded" width="60px" height="24px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Card skeleton
 */
export const CardSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-sm border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <Skeleton variant="rectangular" width="100%" height="200px" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" size="sm" />
          <Skeleton variant="text" width="40%" />
        </div>
        <Skeleton variant="text" lines={3} />
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant="text" width="30%" size="sm" />
          <Skeleton variant="rounded" width="80px" height="32px" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Table skeleton
 */
export const TableSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              {[1, 2, 3, 4].map((col) => (
                <th key={col} className="p-4 text-left">
                  <Skeleton variant="text" width="80px" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="border-b border-gray-200 dark:border-gray-700">
                {[1, 2, 3, 4].map((col) => (
                  <td key={col} className="p-4">
                    <Skeleton variant="text" width={col === 1 ? '60%' : '80%'} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Profile skeleton
 */
export const ProfileSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-6 p-6 border border-gray-300 dark:border-gray-600 rounded-lg">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton variant="circular" size="xl" />
        <div className="text-center space-y-2 w-full">
          <Skeleton variant="text" width="60%" className="mx-auto" />
          <Skeleton variant="text" width="40%" size="sm" className="mx-auto" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="rectangular" width="100%" height="40px" />
        <Skeleton variant="text" width="25%" />
        <Skeleton variant="rectangular" width="100%" height="40px" />
        <Skeleton variant="text" width="35%" />
        <Skeleton variant="rectangular" width="100%" height="100px" />
      </div>
      <div className="flex gap-3">
        <Skeleton variant="rounded" width="100%" height="40px" />
        <Skeleton variant="rounded" width="100%" height="40px" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dashboard skeleton
 */
export const DashboardSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="200px" height="32px" />
        <div className="flex gap-3">
          <Skeleton variant="circular" size="md" />
          <Skeleton variant="circular" size="md" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg space-y-3"
          >
            <Skeleton variant="text" width="60%" size="sm" />
            <Skeleton variant="text" width="40%" height="32px" />
            <Skeleton variant="text" width="80%" size="xs" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg space-y-4">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" width="100%" height="200px" />
        </div>
        <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg space-y-4">
          <Skeleton variant="text" width="45%" />
          <Skeleton variant="rectangular" width="100%" height="200px" />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-300 dark:border-gray-600">
          <Skeleton variant="text" width="30%" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center gap-4">
              <Skeleton variant="circular" size="sm" />
              <Skeleton variant="text" width="25%" />
              <Skeleton variant="text" width="20%" />
              <Skeleton variant="text" width="15%" />
              <Skeleton variant="rounded" width="80px" height="24px" className="ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Article skeleton
 */
export const ArticleSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-3xl space-y-6">
      <div className="space-y-4">
        <Skeleton variant="text" width="60%" height="40px" />
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" size="sm" />
          <Skeleton variant="text" width="150px" size="sm" />
          <Skeleton variant="text" width="100px" size="sm" />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height="400px" />
      <div className="space-y-4">
        <Skeleton variant="text" lines={4} />
        <Skeleton variant="text" lines={3} />
        <Skeleton variant="text" lines={5} />
      </div>
      <div className="flex gap-3 pt-4">
        <Skeleton variant="rounded" width="100px" height="36px" />
        <Skeleton variant="rounded" width="100px" height="36px" />
        <Skeleton variant="rounded" width="100px" height="36px" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Skeleton group examples
 */
export const SkeletonGroupExamples: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-6 p-4">
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Vertical Group
        </span>
        <SkeletonGroup direction="column" spacing="md">
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
        </SkeletonGroup>
      </div>
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Horizontal Group
        </span>
        <SkeletonGroup direction="row" spacing="md">
          <Skeleton variant="circular" size="md" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rounded" width="80px" height="32px" />
        </SkeletonGroup>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Custom sizes
 */
export const CustomSizes: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md p-4">
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Custom Width & Height
        </span>
        <Skeleton variant="rectangular" width="300px" height="50px" />
        <Skeleton variant="rectangular" width="80%" height="30px" />
        <Skeleton variant="rectangular" width="200px" height="100px" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dark theme - Skeleton variants
 */
export const DarkTheme: Story = {
  render: () => (
    <ThemeWrapper theme="dark">
      <div className="space-y-8 p-8">
        <div className="space-y-4">
          <Skeleton variant="text" />
          <Skeleton variant="circular" size="md" />
          <Skeleton variant="rectangular" width="100%" height="100px" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <Skeleton variant="rectangular" width="100%" height="150px" />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </div>
          ))}
        </div>
      </div>
    </ThemeWrapper>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

