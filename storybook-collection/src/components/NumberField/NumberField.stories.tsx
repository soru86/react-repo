import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { NumberField } from './NumberField';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/NumberField',
  component: NumberField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile number input component with incrementer/decrementer buttons, spinner controls, and animated slider variant. Perfect for numeric input in forms throughout your application.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the input',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the input',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the input',
    },
    type: {
      control: 'select',
      options: ['default', 'spinner', 'slider'],
      description: 'Type of number field',
    },
    showControls: {
      control: 'boolean',
      description: 'Show increment/decrement buttons',
    },
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    step: {
      control: 'number',
      description: 'Step value for increment/decrement',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when value changes',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default number field
 */
export const Default: Story = {
  args: {
    label: 'Quantity',
    placeholder: 'Enter quantity',
  },
};

/**
 * Number field with incrementer/decrementer buttons
 */
export const WithControls: Story = {
  args: {
    label: 'Quantity',
    placeholder: 'Enter quantity',
    showControls: true,
    min: 0,
    max: 100,
    step: 1,
  },
};

/**
 * Multiple number fields with controls
 */
export const WithControlsExamples: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <NumberField
        label="Quantity"
        placeholder="Enter quantity"
        showControls
        min={0}
        max={100}
        step={1}
      />
      <NumberField
        label="Price"
        placeholder="Enter price"
        showControls
        min={0}
        max={1000}
        step={0.01}
        helperText="Price in dollars"
      />
      <NumberField
        label="Discount (%)"
        placeholder="Enter discount"
        showControls
        min={0}
        max={100}
        step={5}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Spinner field - number input with spinner controls
 */
export const SpinnerField: Story = {
  args: {
    label: 'Quantity',
    type: 'spinner',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 10,
  },
};

/**
 * Multiple spinner fields
 */
export const SpinnerFields: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <NumberField
        label="Items"
        type="spinner"
        min={1}
        max={50}
        step={1}
        defaultValue={5}
      />
      <NumberField
        label="Weight (kg)"
        type="spinner"
        min={0}
        max={1000}
        step={0.1}
        defaultValue={10.5}
      />
      <NumberField
        label="Rating"
        type="spinner"
        min={1}
        max={5}
        step={1}
        defaultValue={3}
        helperText="Rate from 1 to 5"
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Animated slider number field
 */
export const SliderField: Story = {
  args: {
    label: 'Volume',
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
  },
};

/**
 * Multiple slider fields
 */
export const SliderFields: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <NumberField
        label="Volume"
        type="slider"
        min={0}
        max={100}
        step={1}
        defaultValue={50}
        helperText="Adjust volume level"
      />
      <NumberField
        label="Brightness"
        type="slider"
        min={0}
        max={100}
        step={1}
        defaultValue={75}
        helperText="Screen brightness"
      />
      <NumberField
        label="Temperature"
        type="slider"
        min={16}
        max={30}
        step={1}
        defaultValue={22}
        helperText="Room temperature in Celsius"
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Slider with different ranges
 */
export const SliderRanges: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <NumberField
        label="0-100"
        type="slider"
        min={0}
        max={100}
        step={1}
        defaultValue={50}
      />
      <NumberField
        label="0-1000"
        type="slider"
        min={0}
        max={1000}
        step={10}
        defaultValue={500}
      />
      <NumberField
        label="-50 to 50"
        type="slider"
        min={-50}
        max={50}
        step={1}
        defaultValue={0}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">With Controls</h3>
        <NumberField
          label="Quantity"
          showControls
          min={0}
          max={100}
          step={1}
          defaultValue={10}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Spinner</h3>
        <NumberField
          label="Items"
          type="spinner"
          min={0}
          max={100}
          step={1}
          defaultValue={10}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Slider</h3>
        <NumberField
          label="Volume"
          type="slider"
          min={0}
          max={100}
          step={1}
          defaultValue={50}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * With error state
 */
export const WithError: Story = {
  args: {
    label: 'Quantity',
    type: 'spinner',
    min: 0,
    max: 100,
    error: 'Value must be between 0 and 100',
    defaultValue: 150,
  },
};

/**
 * With success state
 */
export const WithSuccess: Story = {
  args: {
    label: 'Quantity',
    type: 'spinner',
    min: 0,
    max: 100,
    success: 'Valid quantity',
    defaultValue: 50,
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Quantity',
    type: 'spinner',
    min: 0,
    max: 100,
    defaultValue: 25,
    disabled: true,
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <NumberField label="Small" size="small" showControls min={0} max={100} />
      <NumberField label="Medium" size="medium" showControls min={0} max={100} />
      <NumberField label="Large" size="large" showControls min={0} max={100} />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * With helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Quantity',
    type: 'spinner',
    min: 0,
    max: 100,
    helperText: 'Enter a quantity between 0 and 100',
    defaultValue: 10,
  },
};

/**
 * Required field
 */
export const Required: Story = {
  args: {
    label: 'Quantity',
    type: 'spinner',
    min: 0,
    max: 100,
    required: true,
    helperText: 'This field is required',
  },
};

/**
 * Step variations
 */
export const StepVariations: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <NumberField
        label="Step: 1"
        showControls
        min={0}
        max={100}
        step={1}
        defaultValue={10}
      />
      <NumberField
        label="Step: 5"
        showControls
        min={0}
        max={100}
        step={5}
        defaultValue={10}
      />
      <NumberField
        label="Step: 10"
        showControls
        min={0}
        max={100}
        step={10}
        defaultValue={10}
      />
      <NumberField
        label="Step: 0.1"
        showControls
        min={0}
        max={10}
        step={0.1}
        defaultValue={5.5}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Slider with different styles
 */
export const SliderStyles: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <NumberField
        label="Default"
        type="slider"
        min={0}
        max={100}
        defaultValue={50}
      />
      <NumberField
        label="Error"
        type="slider"
        min={0}
        max={100}
        defaultValue={50}
        error="Invalid value"
      />
      <NumberField
        label="Success"
        type="slider"
        min={0}
        max={100}
        defaultValue={50}
        success="Valid value"
      />
      <NumberField
        label="Warning"
        type="slider"
        min={0}
        max={100}
        defaultValue={50}
        warning="Please review"
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Full width
 */
export const FullWidth: Story = {
  args: {
    label: 'Quantity',
    type: 'spinner',
    fullWidth: true,
    min: 0,
    max: 100,
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Interactive example with controls
 */
export const Interactive: Story = {
  args: {
    label: 'Number Field',
    type: 'spinner',
    min: 0,
    max: 100,
    step: 1,
    helperText: 'Use controls or type a value',
  },
};

/**
 * Dark theme - Number field variants
 */
export const DarkTheme: Story = {
  render: () => (
    <ThemeWrapper theme="dark">
      <div className="space-y-6 max-w-md">
        <NumberField label="Default Number Field" defaultValue={10} />
        <NumberField label="With Controls" type="controls" defaultValue={5} min={0} max={10} />
        <NumberField label="Spinner Field" type="spinner" defaultValue={50} />
        <NumberField label="Slider Field" type="slider" defaultValue={30} min={0} max={100} />
        <NumberField label="With Helper Text" helperText="Enter a number" defaultValue={10} />
        <NumberField label="With Error" error="Invalid number" defaultValue={10} />
      </div>
    </ThemeWrapper>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

