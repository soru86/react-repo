import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { LinearLoader } from './LinearLoader';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/LinearLoader',
  component: LinearLoader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A linear progress bar component with determinate, indeterminate, buffer, and query types. Supports multiple animations, sizes, and color variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['determinate', 'indeterminate', 'buffer', 'query'],
      description: 'Loader type',
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
      description: 'Color variant',
    },
    animation: {
      control: 'select',
      options: ['linear', 'pulse', 'wave', 'stripes', 'gradient'],
      description: 'Animation style',
    },
    showLabel: {
      control: 'boolean',
      description: 'Show percentage label',
    },
    rounded: {
      control: 'boolean',
      description: 'Rounded corners',
    },
    striped: {
      control: 'boolean',
      description: 'Striped pattern',
    },
  },
} satisfies Meta<typeof LinearLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default indeterminate progress bar
 */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <LinearLoader type="indeterminate" size="md" variant="primary" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Determinate progress bar
 */
export const Determinate: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="w-full max-w-md space-y-4">
        <LinearLoader type="determinate" value={progress} showLabel={true} />
        <LinearLoader type="determinate" value={progress} showLabel={true} variant="success" />
        <LinearLoader type="determinate" value={progress} showLabel={true} variant="warning" />
        <LinearLoader type="determinate" value={progress} showLabel={true} variant="danger" />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Indeterminate progress bars
 */
export const Indeterminate: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <LinearLoader type="indeterminate" variant="primary" />
      <LinearLoader type="indeterminate" variant="success" />
      <LinearLoader type="indeterminate" variant="warning" />
      <LinearLoader type="indeterminate" variant="danger" />
      <LinearLoader type="indeterminate" variant="info" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Buffer progress bar
 */
export const Buffer: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [buffer, setBuffer] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 5;
        });
        setBuffer((prev) => {
          if (prev >= 100) return 0;
          return prev + 8;
        });
      }, 300);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="w-full max-w-md space-y-4">
        <LinearLoader type="buffer" value={progress} buffer={buffer} variant="primary" />
        <LinearLoader type="buffer" value={progress} buffer={buffer} variant="success" />
        <LinearLoader type="buffer" value={progress} buffer={buffer} variant="warning" />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Query progress bar
 */
export const Query: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <LinearLoader type="query" variant="primary" />
      <LinearLoader type="query" variant="success" />
      <LinearLoader type="query" variant="warning" />
      <LinearLoader type="query" variant="danger" />
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
    <div className="w-full max-w-md space-y-6">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="space-y-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 uppercase">{size}</span>
          <LinearLoader type="indeterminate" size={size} variant="primary" />
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Different color variants
 */
export const Variants: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      {(['default', 'primary', 'success', 'warning', 'danger', 'info'] as const).map((variant) => (
        <div key={variant} className="space-y-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{variant}</span>
          <LinearLoader type="indeterminate" variant={variant} />
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
    <div className="w-full max-w-md space-y-6">
      {(['linear', 'pulse', 'wave', 'stripes', 'gradient'] as const).map((animation) => (
        <div key={animation} className="space-y-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{animation}</span>
          <LinearLoader
            type="indeterminate"
            animation={animation}
            variant="primary"
            gradientColors={
              animation === 'gradient'
                ? ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']
                : undefined
            }
          />
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * With labels
 */
export const WithLabels: Story = {
  render: () => {
    const [progress, setProgress] = useState(45);

    return (
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Label Outside</span>
          <LinearLoader type="determinate" value={progress} showLabel={true} labelPosition="outside" />
        </div>
        <div className="space-y-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Label Inside</span>
          <LinearLoader type="determinate" value={progress} showLabel={true} labelPosition="inside" />
        </div>
        <div className="space-y-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Label Top</span>
          <LinearLoader type="determinate" value={progress} showLabel={true} labelPosition="top" />
        </div>
        <div className="space-y-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Custom Label</span>
          <LinearLoader
            type="determinate"
            value={progress}
            label="Uploading files..."
            labelPosition="outside"
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
 * Rounded progress bars
 */
export const Rounded: Story = {
  render: () => {
    const [progress, setProgress] = useState(60);

    return (
      <div className="w-full max-w-md space-y-4">
        <LinearLoader type="determinate" value={progress} rounded={true} variant="primary" />
        <LinearLoader type="indeterminate" rounded={true} variant="success" />
        <LinearLoader type="determinate" value={progress} rounded={true} variant="warning" showLabel={true} />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Striped progress bars
 */
export const Striped: Story = {
  render: () => {
    const [progress, setProgress] = useState(75);

    return (
      <div className="w-full max-w-md space-y-4">
        <LinearLoader type="determinate" value={progress} striped={true} variant="primary" />
        <LinearLoader type="determinate" value={progress} striped={true} variant="success" />
        <LinearLoader type="determinate" value={progress} striped={true} variant="warning" />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Custom colors
 */
export const CustomColors: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <LinearLoader type="indeterminate" color="#8b5cf6" />
      <LinearLoader type="indeterminate" color="#ec4899" />
      <LinearLoader type="indeterminate" color="#f59e0b" />
      <LinearLoader type="indeterminate" color="#10b981" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Gradient progress bars
 */
export const Gradient: Story = {
  render: () => {
    const [progress, setProgress] = useState(65);

    return (
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Determinate Gradient</span>
          <LinearLoader
            type="determinate"
            value={progress}
            gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
            rounded={true}
          />
        </div>
        <div className="space-y-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Indeterminate Gradient</span>
          <LinearLoader
            type="indeterminate"
            animation="gradient"
            gradientColors={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']}
            rounded={true}
          />
        </div>
        <div className="space-y-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Rainbow Gradient</span>
          <LinearLoader
            type="indeterminate"
            animation="gradient"
            gradientColors={['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']}
            rounded={true}
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
 * File upload example
 */
export const FileUpload: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const simulateUpload = () => {
      setUploading(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 300);
    };

    return (
      <div className="w-full max-w-md space-y-4 p-6 border border-gray-300 dark:border-gray-600 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">File Upload</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">document.pdf</span>
            <span className="text-gray-600 dark:text-gray-400">{Math.round(progress)}%</span>
          </div>
          <LinearLoader
            type="determinate"
            value={progress}
            variant="primary"
            rounded={true}
            showLabel={false}
          />
        </div>
        <button
          onClick={simulateUpload}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Start Upload'}
        </button>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Page loading example
 */
export const PageLoading: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <LinearLoader type="indeterminate" variant="primary" size="sm" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading page content...</p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dark theme - Linear loader variants
 */
export const DarkTheme: Story = {
  render: () => (
    <ThemeWrapper theme="dark">
      <div className="w-full max-w-md space-y-6 p-8">
        <LinearLoader type="indeterminate" variant="primary" />
        <LinearLoader type="determinate" value={65} variant="success" showLabel={true} />
        <LinearLoader type="buffer" value={50} buffer={75} variant="warning" />
        <LinearLoader
          type="indeterminate"
          animation="gradient"
          gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
          rounded={true}
        />
      </div>
    </ThemeWrapper>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

