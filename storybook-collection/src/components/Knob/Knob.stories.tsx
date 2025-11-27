import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Knob } from './Knob';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/Knob',
  component: Knob,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A circular knob component for numeric input with a dial interface. Supports drag interaction, keyboard navigation, and customizable appearance. Perfect for volume controls, settings panels, and numeric inputs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Current value',
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
      description: 'Step size',
    },
    size: {
      control: 'number',
      description: 'Size in pixels',
    },
    strokeWidth: {
      control: 'number',
      description: 'Stroke width in pixels',
    },
    valueColor: {
      control: 'color',
      description: 'Color of the value arc',
    },
    rangeColor: {
      control: 'color',
      description: 'Color of the range arc',
    },
    textColor: {
      control: 'color',
      description: 'Color of the text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether knob is disabled',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether knob is read-only',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Knob>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic knob with default settings
 */
export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <div className="flex flex-col items-center gap-4">
        <Knob value={value} onChange={(e) => setValue(e.value)} />
        <p className="text-sm text-gray-600 dark:text-gray-400">Value: {value}</p>
      </div>
    );
  },
};

/**
 * Knob with custom min/max range
 */
export const MinMax: Story = {
  render: () => {
    const [value, setValue] = useState(10);

    return (
      <div className="flex flex-col items-center gap-4">
        <Knob
          value={value}
          onChange={(e) => setValue(e.value)}
          min={-50}
          max={50}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">Value: {value}</p>
      </div>
    );
  },
};

/**
 * Knob with step size
 */
export const Step: Story = {
  render: () => {
    const [value, setValue] = useState(10);

    return (
      <div className="flex flex-col items-center gap-4">
        <Knob
          value={value}
          onChange={(e) => setValue(e.value)}
          step={10}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">Value: {value} (step: 10)</p>
      </div>
    );
  },
};

/**
 * Knob with custom value template
 */
export const ValueTemplate: Story = {
  render: () => {
    const [value, setValue] = useState(60);

    return (
      <div className="flex flex-col items-center gap-4">
        <Knob
          value={value}
          onChange={(e) => setValue(e.value)}
          valueTemplate="{value}%"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">Value: {value}%</p>
      </div>
    );
  },
};

/**
 * Knob with custom stroke width
 */
export const StrokeWidth: Story = {
  render: () => {
    const [value, setValue] = useState(40);

    return (
      <div className="flex flex-col items-center gap-4">
        <Knob
          value={value}
          onChange={(e) => setValue(e.value)}
          strokeWidth={5}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">Stroke width: 5px</p>
      </div>
    );
  },
};

/**
 * Knob with custom size
 */
export const Size: Story = {
  render: () => {
    const [value, setValue] = useState(60);

    return (
      <div className="flex flex-col items-center gap-4">
        <Knob
          value={value}
          onChange={(e) => setValue(e.value)}
          size={200}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">Size: 200px</p>
      </div>
    );
  },
};

/**
 * Knob with custom colors
 */
export const Colors: Story = {
  render: () => {
    const [value, setValue] = useState(75);

    return (
      <div className="flex flex-col items-center gap-4">
        <Knob
          value={value}
          onChange={(e) => setValue(e.value)}
          valueColor="#708090"
          rangeColor="#48d1cc"
          textColor="#2c3e50"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">Custom colors</p>
      </div>
    );
  },
};

/**
 * Reactive knob controlled by buttons
 */
export const Reactive: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <div className="flex flex-col items-center gap-4">
        <Knob value={value} size={150} />
        <div className="flex gap-2">
          <button
            onClick={() => setValue(Math.min(100, value + 1))}
            disabled={value === 100}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
          <button
            onClick={() => setValue(Math.max(0, value - 1))}
            disabled={value === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Value: {value}</p>
      </div>
    );
  },
};

/**
 * Read-only knob
 */
export const ReadOnly: Story = {
  render: () => {
    return (
      <div className="flex flex-col items-center gap-4">
        <Knob value={50} readOnly />
        <p className="text-sm text-gray-600 dark:text-gray-400">Read-only (value cannot be changed)</p>
      </div>
    );
  },
};

/**
 * Disabled knob
 */
export const Disabled: Story = {
  render: () => {
    return (
      <div className="flex flex-col items-center gap-4">
        <Knob value={50} disabled />
        <p className="text-sm text-gray-600 dark:text-gray-400">Disabled (cannot be interacted with)</p>
      </div>
    );
  },
};

/**
 * Multiple knobs with different configurations
 */
export const MultipleKnobs: Story = {
  render: () => {
    const [volume, setVolume] = useState(75);
    const [brightness, setBrightness] = useState(50);
    const [contrast, setContrast] = useState(60);

    return (
      <div className="space-y-8 p-8">
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold">Volume</h3>
          <Knob
            value={volume}
            onChange={(e) => setVolume(e.value)}
            valueTemplate="{value}%"
            valueColor="#3b82f6"
            size={120}
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold">Brightness</h3>
          <Knob
            value={brightness}
            onChange={(e) => setBrightness(e.value)}
            valueTemplate="{value}%"
            valueColor="#f59e0b"
            size={120}
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold">Contrast</h3>
          <Knob
            value={contrast}
            onChange={(e) => setContrast(e.value)}
            valueTemplate="{value}%"
            valueColor="#10b981"
            size={120}
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
 * Different sizes showcase
 */
export const DifferentSizes: Story = {
  render: () => {
    const [value1, setValue1] = useState(50);
    const [value2, setValue2] = useState(50);
    const [value3, setValue3] = useState(50);

    return (
      <div className="flex items-center justify-center gap-8 p-8">
        <div className="flex flex-col items-center gap-2">
          <Knob value={value1} onChange={(e) => setValue1(e.value)} size={80} />
          <p className="text-xs text-gray-600 dark:text-gray-400">Small (80px)</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Knob value={value2} onChange={(e) => setValue2(e.value)} size={120} />
          <p className="text-xs text-gray-600 dark:text-gray-400">Medium (120px)</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Knob value={value3} onChange={(e) => setValue3(e.value)} size={180} />
          <p className="text-xs text-gray-600 dark:text-gray-400">Large (180px)</p>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Temperature control example
 */
export const TemperatureControl: Story = {
  render: () => {
    const [temperature, setTemperature] = useState(22);

    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <div>
          <h3 className="text-2xl font-bold mb-2 text-center">Temperature Control</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Drag the knob or use arrow keys to adjust
          </p>
        </div>
        <Knob
          value={temperature}
          onChange={(e) => setTemperature(e.value)}
          min={16}
          max={30}
          step={1}
          valueTemplate="{value}°C"
          valueColor="#ef4444"
          size={200}
          strokeWidth={16}
        />
        <div className="text-center">
          <p className="text-lg font-semibold">{temperature}°C</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Range: 16°C - 30°C
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
 * Volume control example
 */
export const VolumeControl: Story = {
  render: () => {
    const [volume, setVolume] = useState(50);

    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <div>
          <h3 className="text-2xl font-bold mb-2 text-center">Volume Control</h3>
        </div>
        <Knob
          value={volume}
          onChange={(e) => setVolume(e.value)}
          min={0}
          max={100}
          step={1}
          valueTemplate="{value}%"
          valueColor="#3b82f6"
          size={180}
        />
        <div className="flex items-center gap-4">
          <button
            onClick={() => setVolume(Math.max(0, volume - 10))}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            -10
          </button>
          <span className="text-lg font-semibold w-16 text-center">{volume}%</span>
          <button
            onClick={() => setVolume(Math.min(100, volume + 10))}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            +10
          </button>
        </div>
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
    const [value1, setValue1] = useState(60);
    const [value2, setValue2] = useState(40);
    const [value3, setValue3] = useState(80);

    return (
      <ThemeWrapper theme="dark">
        <div className="p-8 min-h-screen bg-gray-900 space-y-8">
          <h2 className="text-2xl font-bold text-white mb-6">Knob Components (Dark Theme)</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="flex flex-col items-center gap-4">
              <Knob
                value={value1}
                onChange={(e) => setValue1(e.value)}
                valueTemplate="{value}%"
                valueColor="#60a5fa"
              />
              <p className="text-sm text-gray-400">Default</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Knob
                value={value2}
                onChange={(e) => setValue2(e.value)}
                valueTemplate="{value}%"
                valueColor="#34d399"
                rangeColor="#1f2937"
              />
              <p className="text-sm text-gray-400">Green</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Knob
                value={value3}
                onChange={(e) => setValue3(e.value)}
                valueTemplate="{value}%"
                valueColor="#f472b6"
                rangeColor="#374151"
              />
              <p className="text-sm text-gray-400">Pink</p>
            </div>
          </div>
        </div>
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * All variants showcase
 */
export const AllVariants: Story = {
  render: () => {
    const [values, setValues] = useState({
      default: 50,
      primary: 60,
      success: 70,
      warning: 40,
      danger: 30,
    });

    const variants = [
      { key: 'default', label: 'Default', color: '#3b82f6' },
      { key: 'primary', label: 'Primary', color: '#6366f1' },
      { key: 'success', label: 'Success', color: '#10b981' },
      { key: 'warning', label: 'Warning', color: '#f59e0b' },
      { key: 'danger', label: 'Danger', color: '#ef4444' },
    ];

    return (
      <div className="p-8 space-y-8">
        <h2 className="text-2xl font-bold mb-6">All Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {variants.map((variant) => (
            <div key={variant.key} className="flex flex-col items-center gap-4">
              <Knob
                value={values[variant.key as keyof typeof values]}
                onChange={(e) =>
                  setValues({ ...values, [variant.key]: e.value })
                }
                valueTemplate="{value}%"
                valueColor={variant.color}
                size={120}
              />
              <p className="text-sm font-semibold">{variant.label}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {values[variant.key as keyof typeof values]}%
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

