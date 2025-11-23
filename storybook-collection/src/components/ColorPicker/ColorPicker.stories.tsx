import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from './ColorPicker';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive color picker component with spectrum selection, hue slider, alpha channel, color presets, and multiple input formats.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'inline', 'popover'],
      description: 'Visual variant',
    },
    format: {
      control: 'select',
      options: ['hex', 'rgb', 'hsl', 'hsla'],
      description: 'Color format for output',
    },
    showAlpha: {
      control: 'boolean',
      description: 'Show alpha channel',
    },
    showPresets: {
      control: 'boolean',
      description: 'Show color presets',
    },
    showInputs: {
      control: 'boolean',
      description: 'Show input fields',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the color picker',
    },
  },
  args: {
    defaultValue: '#3b82f6',
    format: 'hex',
    showAlpha: false,
    showPresets: true,
    showInputs: true,
    disabled: false,
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default color picker
 */
export const Default: Story = {
  render: (args) => {
    const [color, setColor] = useState('#3b82f6');
    return (
      <div className="space-y-4">
        <ColorPicker {...args} value={color} onChange={setColor} />
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Selected Color: {color}</p>
          <div
            className="w-full h-20 rounded border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    );
  },
};

/**
 * With alpha channel
 */
export const WithAlpha: Story = {
  render: () => {
    const [color, setColor] = useState('rgba(59, 130, 246, 0.5)');

    return (
      <div className="space-y-4">
        <ColorPicker value={color} onChange={setColor} showAlpha={true} format="rgb" />
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Selected Color: {color}</p>
          <div className="relative">
            {/* Checkerboard background - using SVG pattern for better rendering */}
            <div
              className="absolute inset-0 rounded overflow-hidden"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='4' height='4' fill='%23e0e0e0'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23e0e0e0'/%3E%3C/svg%3E")`,
                backgroundSize: '8px 8px',
              }}
            />
            {/* Color overlay */}
            <div
              className="relative w-full h-20 rounded border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Color formats
 */
export const ColorFormats: Story = {
  render: () => {
    const [hexColor, setHexColor] = useState('#3b82f6');
    const [rgbColor, setRgbColor] = useState('rgb(59, 130, 246)');
    const [hslColor, setHslColor] = useState('hsl(217, 91%, 60%)');
    const [hslaColor, setHslaColor] = useState('hsla(217, 91%, 60%, 0.5)');

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Hex Format</h3>
          <ColorPicker value={hexColor} onChange={setHexColor} format="hex" />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Value: {hexColor}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">RGB Format</h3>
          <ColorPicker value={rgbColor} onChange={setRgbColor} format="rgb" />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Value: {rgbColor}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">HSL Format</h3>
          <ColorPicker value={hslColor} onChange={setHslColor} format="hsl" />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Value: {hslColor}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">HSLA Format</h3>
          <ColorPicker value={hslaColor} onChange={setHslaColor} format="hsla" showAlpha={true} />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Value: {hslaColor}</p>
        </div>
      </div>
    );
  },
};

/**
 * Custom presets
 */
export const CustomPresets: Story = {
  render: () => {
    const [color, setColor] = useState('#3b82f6');

    const customPresets = [
      {
        name: 'Brand Colors',
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
      },
      {
        name: 'Material Design',
        colors: [
          '#f44336',
          '#e91e63',
          '#9c27b0',
          '#673ab7',
          '#3f51b5',
          '#2196f3',
          '#03a9f4',
          '#00bcd4',
          '#009688',
          '#4caf50',
          '#8bc34a',
          '#cddc39',
          '#ffeb3b',
          '#ffc107',
          '#ff9800',
          '#ff5722',
        ],
      },
      {
        name: 'Tailwind Colors',
        colors: [
          '#ef4444',
          '#f97316',
          '#f59e0b',
          '#eab308',
          '#84cc16',
          '#22c55e',
          '#10b981',
          '#14b8a6',
          '#06b6d4',
          '#0ea5e9',
          '#3b82f6',
          '#6366f1',
          '#8b5cf6',
          '#a855f7',
          '#d946ef',
          '#ec4899',
          '#f43f5e',
        ],
      },
    ];

    return (
      <div className="space-y-4">
        <ColorPicker value={color} onChange={setColor} presets={customPresets} />
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Selected Color: {color}</p>
          <div
            className="w-full h-20 rounded border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    );
  },
};

/**
 * Without presets
 */
export const WithoutPresets: Story = {
  render: () => {
    const [color, setColor] = useState('#3b82f6');
    return <ColorPicker value={color} onChange={setColor} showPresets={false} />;
  },
};

/**
 * Without inputs
 */
export const WithoutInputs: Story = {
  render: () => {
    const [color, setColor] = useState('#3b82f6');
    return <ColorPicker value={color} onChange={setColor} showInputs={false} />;
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => {
    return <ColorPicker defaultValue="#3b82f6" disabled={true} />;
  },
};

/**
 * With label
 */
export const WithLabel: Story = {
  render: () => {
    const [color, setColor] = useState('#3b82f6');
    return (
      <div className="space-y-4">
        <ColorPicker value={color} onChange={setColor} label="Select Background Color" />
        <ColorPicker value={color} onChange={setColor} label="Select Text Color" variant="popover" />
      </div>
    );
  },
};

/**
 * Dark theme example
 */
export const DarkTheme: Story = {
  decorators: [
    (Story: React.ComponentType) => (
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
  render: () => {
    const [color1, setColor1] = useState('#3b82f6');
    const [color2, setColor2] = useState('#10b981');

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-300">Default</h3>
          <ColorPicker value={color1} onChange={setColor1} />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-300">With Alpha</h3>
          <ColorPicker value={color2} onChange={setColor2} showAlpha={true} format="rgb" />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-300">Popover</h3>
          <ColorPicker value={color1} onChange={setColor1} variant="popover" label="Pick Color" />
        </div>
      </div>
    );
  },
};

