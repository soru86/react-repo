import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Slider } from './Slider';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

// Icons for examples
const VolumeMuteIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
);

const VolumeLowIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const VolumeHighIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const BrightnessLowIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const BrightnessHighIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const TemperatureLowIcon = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TemperatureHighIcon = () => (
  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SpeedLowIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const SpeedHighIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile slider component with various sizes, colors, orientations, and features. Supports single value, range slider, marks, tooltips, and more.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Current value (controlled)',
    },
    defaultValue: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Default value (uncontrolled)',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum value',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value',
    },
    step: {
      control: { type: 'number', min: 0.1, step: 0.1 },
      description: 'Step value',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
      description: 'Color variant',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show tooltip with current value',
    },
    showValue: {
      control: 'boolean',
      description: 'Show value labels',
    },
    marks: {
      control: 'boolean',
      description: 'Show marks/ticks',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    range: {
      control: 'boolean',
      description: 'Range slider (dual handles)',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when value changes',
    },
    onChangeCommitted: {
      action: 'committed',
      description: 'Callback when value change is committed',
    },
  },
  args: {
    onChange: fn(),
    onChangeCommitted: fn(),
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default slider - basic usage
 */
export const Default: Story = {
  args: {
    defaultValue: 50,
  },
};

/**
 * Slider with different values
 */
export const WithValues: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <Slider defaultValue={0} label="Value: 0" />
      <Slider defaultValue={25} label="Value: 25" />
      <Slider defaultValue={50} label="Value: 50" />
      <Slider defaultValue={75} label="Value: 75" />
      <Slider defaultValue={100} label="Value: 100" />
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
    <div className="space-y-8 w-96">
      <Slider defaultValue={50} size="small" label="Small" />
      <Slider defaultValue={50} size="medium" label="Medium" />
      <Slider defaultValue={50} size="large" label="Large" />
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
    <div className="space-y-8 w-96">
      <Slider defaultValue={50} variant="default" label="Default" />
      <Slider defaultValue={50} variant="primary" label="Primary" />
      <Slider defaultValue={50} variant="success" label="Success" />
      <Slider defaultValue={50} variant="warning" label="Warning" />
      <Slider defaultValue={50} variant="danger" label="Danger" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    defaultValue: 50,
    disabled: true,
    label: 'Disabled Slider',
  },
};

/**
 * With tooltip
 */
export const WithTooltip: Story = {
  args: {
    defaultValue: 50,
    showTooltip: true,
    label: 'Slider with Tooltip',
  },
};

/**
 * With value display
 */
export const WithValue: Story = {
  args: {
    defaultValue: 50,
    showValue: true,
    label: 'Slider with Value',
  },
};

/**
 * With label and helper text
 */
export const WithLabelAndHelper: Story = {
  args: {
    defaultValue: 50,
    label: 'Volume',
    helperText: 'Adjust the volume level',
  },
};

/**
 * With error state
 */
export const WithError: Story = {
  args: {
    defaultValue: 50,
    label: 'Price Range',
    error: 'Please select a valid range',
  },
};

/**
 * Range slider (dual handles)
 */
export const Range: Story = {
  args: {
    defaultValue: [20, 80],
    range: true,
    label: 'Price Range',
    showValue: true,
  },
};

/**
 * Range slider with tooltip
 */
export const RangeWithTooltip: Story = {
  args: {
    defaultValue: [30, 70],
    range: true,
    showTooltip: true,
    label: 'Select Range',
  },
};

/**
 * With marks/ticks
 */
export const WithMarks: Story = {
  args: {
    defaultValue: 50,
    marks: true,
    step: 10,
    label: 'Slider with Marks',
  },
};

/**
 * Custom marks
 */
export const CustomMarks: Story = {
  args: {
    defaultValue: 50,
    marks: [
      { value: 0, label: '0%' },
      { value: 25, label: '25%' },
      { value: 50, label: '50%' },
      { value: 75, label: '75%' },
      { value: 100, label: '100%' },
    ],
    label: 'Custom Marks',
  },
};

/**
 * Custom step value
 */
export const CustomStep: Story = {
  args: {
    defaultValue: 50,
    step: 5,
    marks: true,
    label: 'Step: 5',
  },
};

/**
 * Custom min/max values
 */
export const CustomMinMax: Story = {
  args: {
    defaultValue: 500,
    min: 0,
    max: 1000,
    step: 50,
    marks: true,
    showValue: true,
    label: 'Price ($)',
  },
};

/**
 * Vertical slider
 */
export const Vertical: Story = {
  args: {
    defaultValue: 50,
    orientation: 'vertical',
    showTooltip: true,
    label: 'Vertical Slider',
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Vertical range slider
 */
export const VerticalRange: Story = {
  args: {
    defaultValue: [20, 80],
    range: true,
    orientation: 'vertical',
    showTooltip: true,
    label: 'Vertical Range',
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Interactive slider
 */
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    return (
      <div className="w-96">
        <Slider
          value={value}
          onChange={(val) => setValue(Array.isArray(val) ? val[0] : val)}
          showValue={true}
          label="Interactive Slider"
        />
        <p className="text-sm text-gray-600 mt-4">
          Current value: {value}
        </p>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Interactive range slider
 */
export const InteractiveRange: Story = {
  render: () => {
    const [value, setValue] = useState<[number, number]>([20, 80]);
    return (
      <div className="w-96">
        <Slider
          value={value}
          onChange={(val) => setValue(val as [number, number])}
          range={true}
          showValue={true}
          label="Price Range"
        />
        <p className="text-sm text-gray-600 mt-4">
          Range: ${value[0]} - ${value[1]}
        </p>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * All variants showcase
 */
export const AllVariantsShowcase: Story = {
  render: () => (
    <div className="space-y-12 w-96">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Sizes</h3>
        <div className="space-y-6">
          <Slider defaultValue={50} size="small" />
          <Slider defaultValue={50} size="medium" />
          <Slider defaultValue={50} size="large" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Variants</h3>
        <div className="space-y-6">
          <Slider defaultValue={50} variant="default" />
          <Slider defaultValue={50} variant="primary" />
          <Slider defaultValue={50} variant="success" />
          <Slider defaultValue={50} variant="warning" />
          <Slider defaultValue={50} variant="danger" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Features</h3>
        <div className="space-y-6">
          <Slider defaultValue={50} showTooltip={true} label="With Tooltip" />
          <Slider defaultValue={50} showValue={true} label="With Value" />
          <Slider defaultValue={50} marks={true} step={10} label="With Marks" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Form example
 */
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      volume: 50,
      brightness: 75,
      priceRange: [100, 500] as [number, number],
    });

    return (
      <form className="space-y-8 w-96" onSubmit={(e) => e.preventDefault()}>
        <Slider
          label="Volume"
          value={formData.volume}
          onChange={(val) =>
            setFormData({ ...formData, volume: Array.isArray(val) ? val[0] : val })
          }
          showValue={true}
          helperText="Adjust the volume level"
        />
        <Slider
          label="Brightness"
          value={formData.brightness}
          onChange={(val) =>
            setFormData({
              ...formData,
              brightness: Array.isArray(val) ? val[0] : val,
            })
          }
          showValue={true}
          variant="warning"
          helperText="Adjust screen brightness"
        />
        <Slider
          label="Price Range"
          value={formData.priceRange}
          onChange={(val) =>
            setFormData({ ...formData, priceRange: val as [number, number] })
          }
          range={true}
          min={0}
          max={1000}
          step={50}
          showValue={true}
          helperText="Select your price range"
        />
      </form>
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
      <div className="w-96">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium">🔇</span>
          <Slider
            value={volume}
            onChange={(val) => setVolume(Array.isArray(val) ? val[0] : val)}
            min={0}
            max={100}
            showTooltip={true}
            variant="primary"
            className="flex-1"
          />
          <span className="text-sm font-medium">🔊</span>
        </div>
        <p className="text-sm text-gray-600 text-center">
          Volume: {volume}%
        </p>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Price filter example
 */
export const PriceFilter: Story = {
  render: () => {
    const [priceRange, setPriceRange] = useState<[number, number]>([100, 500]);
    return (
      <div className="w-96">
        <Slider
          value={priceRange}
          onChange={(val) => setPriceRange(val as [number, number])}
          range={true}
          min={0}
          max={1000}
          step={50}
          marks={[
            { value: 0, label: '$0' },
            { value: 250, label: '$250' },
            { value: 500, label: '$500' },
            { value: 750, label: '$750' },
            { value: 1000, label: '$1000' },
          ]}
          showValue={true}
          label="Price Range"
          helperText="Select your preferred price range"
        />
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">
            Selected Range: ${priceRange[0]} - ${priceRange[1]}
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
 * Gradient colored slider - Rainbow
 */
export const GradientRainbow: Story = {
  args: {
    defaultValue: 50,
    gradientColors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
    label: 'Rainbow Gradient',
    showValue: true,
  },
};

/**
 * Gradient colored slider - Temperature
 */
export const GradientTemperature: Story = {
  args: {
    defaultValue: 50,
    gradientColors: ['#0066ff', '#00ffff', '#ffff00', '#ff6600', '#ff0000'],
    label: 'Temperature Gradient',
    showValue: true,
  },
};

/**
 * Gradient colored slider - Heat map
 */
export const GradientHeatMap: Story = {
  args: {
    defaultValue: 50,
    gradientColors: ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'],
    label: 'Heat Map Gradient',
    showValue: true,
  },
};

/**
 * Custom colored slider
 */
export const CustomColors: Story = {
  args: {
    defaultValue: 50,
    trackColor: '#e0e0e0',
    filledColor: '#9c27b0',
    thumbColor: '#7b1fa2',
    label: 'Custom Purple Slider',
    showValue: true,
  },
};

/**
 * Slider with volume icons
 */
export const WithVolumeIcons: Story = {
  render: () => {
    const [volume, setVolume] = useState(50);
    return (
      <div className="w-96">
        <Slider
          value={volume}
          onChange={(val) => setVolume(Array.isArray(val) ? val[0] : val)}
          min={0}
          max={100}
          startIcon={<VolumeMuteIcon />}
          endIcon={<VolumeHighIcon />}
          variant="primary"
          showValue={true}
          label="Volume"
        />
        <p className="text-sm text-gray-600 mt-2 text-center">
          Volume: {volume}%
        </p>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Slider with brightness icons
 */
export const WithBrightnessIcons: Story = {
  render: () => {
    const [brightness, setBrightness] = useState(75);
    return (
      <div className="w-96">
        <Slider
          value={brightness}
          onChange={(val) => setBrightness(Array.isArray(val) ? val[0] : val)}
          min={0}
          max={100}
          startIcon={<BrightnessLowIcon />}
          endIcon={<BrightnessHighIcon />}
          variant="warning"
          showValue={true}
          label="Brightness"
        />
        <p className="text-sm text-gray-600 mt-2 text-center">
          Brightness: {brightness}%
        </p>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Slider with temperature icons
 */
export const WithTemperatureIcons: Story = {
  render: () => {
    const [temperature, setTemperature] = useState(20);
    return (
      <div className="w-96">
        <Slider
          value={temperature}
          onChange={(val) => setTemperature(Array.isArray(val) ? val[0] : val)}
          min={0}
          max={40}
          startIcon={<TemperatureLowIcon />}
          endIcon={<TemperatureHighIcon />}
          gradientColors={['#0066ff', '#00ffff', '#ffff00', '#ff6600', '#ff0000']}
          showValue={true}
          label="Temperature (°C)"
        />
        <p className="text-sm text-gray-600 mt-2 text-center">
          Temperature: {temperature}°C
        </p>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Slider with speed icons
 */
export const WithSpeedIcons: Story = {
  render: () => {
    const [speed, setSpeed] = useState(50);
    return (
      <div className="w-96">
        <Slider
          value={speed}
          onChange={(val) => setSpeed(Array.isArray(val) ? val[0] : val)}
          min={0}
          max={100}
          startIcon={<SpeedLowIcon />}
          endIcon={<SpeedHighIcon />}
          variant="success"
          showValue={true}
          label="Speed"
        />
        <p className="text-sm text-gray-600 mt-2 text-center">
          Speed: {speed}%
        </p>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Range slider with icons
 */
export const RangeWithIcons: Story = {
  render: () => {
    const [range, setRange] = useState<[number, number]>([20, 80]);
    return (
      <div className="w-96">
        <Slider
          value={range}
          onChange={(val) => setRange(val as [number, number])}
          range={true}
          startIcon={<VolumeMuteIcon />}
          endIcon={<VolumeHighIcon />}
          variant="primary"
          showValue={true}
          label="Volume Range"
        />
        <p className="text-sm text-gray-600 mt-2 text-center">
          Range: {range[0]}% - {range[1]}%
        </p>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Gradient slider with icons
 */
export const GradientWithIcons: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    return (
      <div className="w-96">
        <Slider
          value={value}
          onChange={(val) => setValue(Array.isArray(val) ? val[0] : val)}
          gradientColors={['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff']}
          startIcon={<VolumeMuteIcon />}
          endIcon={<VolumeHighIcon />}
          showValue={true}
          label="Gradient with Icons"
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * All colored slider variants
 */
export const AllColoredVariants: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Gradient Sliders</h3>
        <div className="space-y-6">
          <Slider
            defaultValue={50}
            gradientColors={['#ff0000', '#ffff00', '#00ff00']}
            label="Red to Green"
            showValue={true}
          />
          <Slider
            defaultValue={50}
            gradientColors={['#0066ff', '#00ffff', '#ffff00', '#ff6600', '#ff0000']}
            label="Temperature Gradient"
            showValue={true}
          />
          <Slider
            defaultValue={50}
            gradientColors={['#9400d3', '#4b0082', '#0000ff', '#00ff00', '#ffff00', '#ff7f00', '#ff0000']}
            label="Rainbow Gradient"
            showValue={true}
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Custom Colors</h3>
        <div className="space-y-6">
          <Slider
            defaultValue={50}
            trackColor="#e3f2fd"
            filledColor="#2196f3"
            thumbColor="#1976d2"
            label="Custom Blue"
            showValue={true}
          />
          <Slider
            defaultValue={50}
            trackColor="#f3e5f5"
            filledColor="#9c27b0"
            thumbColor="#7b1fa2"
            label="Custom Purple"
            showValue={true}
          />
          <Slider
            defaultValue={50}
            trackColor="#fff3e0"
            filledColor="#ff9800"
            thumbColor="#f57c00"
            label="Custom Orange"
            showValue={true}
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
 * Dark theme - Slider variants
 */
export const DarkTheme: Story = {
  render: () => (
    <ThemeWrapper theme="dark">
      <div className="space-y-8 w-96">
        <Slider defaultValue={50} label="Default Slider" showValue={true} />
        <Slider defaultValue={50} variant="primary" label="Primary Slider" showValue={true} />
        <Slider defaultValue={50} variant="success" label="Success Slider" showValue={true} />
        <Slider defaultValue={50} variant="warning" label="Warning Slider" showValue={true} />
        <Slider defaultValue={50} variant="danger" label="Danger Slider" showValue={true} />
        <Slider defaultValue={[20, 80]} range={true} label="Range Slider" showValue={true} />
        <Slider defaultValue={50} marks={true} step={10} label="With Marks" />
      </div>
    </ThemeWrapper>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
