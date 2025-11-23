import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Rating } from './Rating';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/Rating',
  component: Rating,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile rating component with stars. Supports interactive ratings, half stars, different sizes, and color variants. Perfect for displaying and collecting user ratings.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 5, step: 0.5 },
      description: 'Current rating value',
    },
    defaultValue: {
      control: { type: 'number', min: 0, max: 5, step: 0.5 },
      description: 'Default rating value',
    },
    max: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'Maximum number of stars',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether rating is read-only',
    },
    allowHalf: {
      control: 'boolean',
      description: 'Whether to allow half stars',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the stars',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
      description: 'Color variant',
    },
    showValue: {
      control: 'boolean',
      description: 'Show rating value as text',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when rating changes',
    },
    onHover: {
      action: 'hovered',
      description: 'Callback when hovering over stars',
    },
  },
  args: {
    onChange: fn(),
    onHover: fn(),
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default rating - interactive 5-star rating
 */
export const Default: Story = {
  args: {
    defaultValue: 3,
  },
};

/**
 * Rating with different values
 */
export const WithValues: Story = {
  render: () => (
    <div className="space-y-6">
      <Rating value={1} readOnly />
      <Rating value={2} readOnly />
      <Rating value={3} readOnly />
      <Rating value={4} readOnly />
      <Rating value={5} readOnly />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Interactive rating - click to rate
 */
export const Interactive: Story = {
  args: {
    defaultValue: 0,
    readOnly: false,
  },
};

/**
 * Read-only rating - display only
 */
export const ReadOnly: Story = {
  args: {
    value: 4,
    readOnly: true,
  },
};

/**
 * Rating with half stars
 */
export const WithHalfStars: Story = {
  args: {
    defaultValue: 3.5,
    allowHalf: true,
  },
};

/**
 * Half star examples
 */
export const HalfStarExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <Rating value={0.5} allowHalf readOnly />
      <Rating value={1.5} allowHalf readOnly />
      <Rating value={2.5} allowHalf readOnly />
      <Rating value={3.5} allowHalf readOnly />
      <Rating value={4.5} allowHalf readOnly />
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
    <div className="space-y-6">
      <Rating value={4} size="small" readOnly label="Small" />
      <Rating value={4} size="medium" readOnly label="Medium" />
      <Rating value={4} size="large" readOnly label="Large" />
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
    <div className="space-y-6">
      <Rating value={4} variant="default" readOnly label="Default (Yellow)" />
      <Rating value={4} variant="primary" readOnly label="Primary (Blue)" />
      <Rating value={4} variant="success" readOnly label="Success (Green)" />
      <Rating value={4} variant="warning" readOnly label="Warning (Orange)" />
      <Rating value={4} variant="danger" readOnly label="Danger (Red)" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Rating with label
 */
export const WithLabel: Story = {
  args: {
    value: 4,
    label: 'Product Rating',
    readOnly: true,
  },
};

/**
 * Rating with helper text
 */
export const WithHelperText: Story = {
  args: {
    value: 4,
    label: 'Rate this product',
    helperText: 'Based on 123 reviews',
    readOnly: true,
  },
};

/**
 * Rating with value display
 */
export const WithValue: Story = {
  args: {
    value: 4.5,
    showValue: true,
    allowHalf: true,
    readOnly: true,
  },
};

/**
 * Rating with label and value
 */
export const WithLabelAndValue: Story = {
  args: {
    value: 4.5,
    label: 'Customer Rating',
    showValue: true,
    allowHalf: true,
    helperText: 'Based on 456 reviews',
    readOnly: true,
  },
};

/**
 * Custom max stars (10 stars)
 */
export const CustomMax: Story = {
  args: {
    value: 7,
    max: 10,
    readOnly: true,
  },
};

/**
 * Different max values
 */
export const MaxValues: Story = {
  render: () => (
    <div className="space-y-6">
      <Rating value={3} max={3} readOnly label="3 Stars" />
      <Rating value={4} max={5} readOnly label="5 Stars" />
      <Rating value={6} max={10} readOnly label="10 Stars" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Interactive with half stars
 */
export const InteractiveHalfStars: Story = {
  args: {
    defaultValue: 0,
    allowHalf: true,
    readOnly: false,
  },
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Default</h3>
        <Rating value={4} variant="default" readOnly />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Primary</h3>
        <Rating value={4} variant="primary" readOnly />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Success</h3>
        <Rating value={4} variant="success" readOnly />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Warning</h3>
        <Rating value={4} variant="warning" readOnly />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Danger</h3>
        <Rating value={4} variant="danger" readOnly />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <Rating value={4} size="small" readOnly label="Small" />
      <Rating value={4} size="medium" readOnly label="Medium" />
      <Rating value={4} size="large" readOnly label="Large" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Form example with multiple ratings
 */
export const FormExample: Story = {
  render: () => (
    <form className="space-y-6 w-96" onSubmit={(e) => e.preventDefault()}>
      <Rating
        label="Product Quality"
        defaultValue={0}
        helperText="Rate the quality of the product"
      />
      <Rating
        label="Value for Money"
        defaultValue={0}
        helperText="How would you rate the value?"
      />
      <Rating
        label="Customer Service"
        defaultValue={0}
        allowHalf
        helperText="Rate our customer service"
      />
      <Rating
        label="Overall Experience"
        defaultValue={0}
        allowHalf
        showValue
        helperText="Your overall rating"
      />
    </form>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Product review example
 */
export const ProductReview: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-2">Wireless Headphones</h3>
        <Rating value={4.5} allowHalf showValue readOnly helperText="Based on 1,234 reviews" />
        <p className="text-sm text-gray-600 mt-2">
          Excellent sound quality and comfortable fit. Great value for money.
        </p>
      </div>
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-2">Smart Watch</h3>
        <Rating value={3.5} allowHalf showValue readOnly helperText="Based on 567 reviews" />
        <p className="text-sm text-gray-600 mt-2">
          Good features but battery life could be better.
        </p>
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
export const InteractiveExample: Story = {
  args: {
    defaultValue: 3,
    allowHalf: false,
    showValue: false,
    label: 'Rate this product',
  },
};

