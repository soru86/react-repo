import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Splitter, SplitterPanel } from './Splitter';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/Splitter',
  component: Splitter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A splitter component that separates and resizes panels. Supports horizontal and vertical layouts, custom sizes, minimum/maximum constraints, and keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation',
    },
  },
  args: {
    onResize: fn(),
    onResizeStart: fn(),
    onResizeEnd: fn(),
  },
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic horizontal splitter with two panels
 */
export const Horizontal: Story = {
  render: () => {
    return (
      <Splitter style={{ height: '300px' }}>
        <SplitterPanel className="flex items-center justify-center bg-gray-50 dark:bg-gray-800">
          Panel 1
        </SplitterPanel>
        <SplitterPanel className="flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          Panel 2
        </SplitterPanel>
      </Splitter>
    );
  },
};

/**
 * Splitter with custom panel sizes
 */
export const WithSizes: Story = {
  render: () => {
    return (
      <Splitter style={{ height: '300px' }}>
        <SplitterPanel
          size={25}
          minSize={10}
          className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20"
        >
          Panel 1 (25%, min 10%)
        </SplitterPanel>
        <SplitterPanel
          size={75}
          className="flex items-center justify-center bg-green-50 dark:bg-green-900/20"
        >
          Panel 2 (75%)
        </SplitterPanel>
      </Splitter>
    );
  },
};

/**
 * Vertical splitter with stacked panels
 */
export const Vertical: Story = {
  render: () => {
    return (
      <Splitter layout="vertical" style={{ height: '300px' }}>
        <SplitterPanel className="flex items-center justify-center bg-gray-50 dark:bg-gray-800">
          Panel 1
        </SplitterPanel>
        <SplitterPanel className="flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          Panel 2
        </SplitterPanel>
      </Splitter>
    );
  },
};

/**
 * Nested splitters for complex layouts
 */
export const Nested: Story = {
  render: () => {
    return (
      <div className="w-full max-w-6xl">
        <Splitter style={{ height: '600px', width: '800px' }}>
          <SplitterPanel size={20} minSize={10} className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
            Panel 1
          </SplitterPanel>
          <SplitterPanel size={80} className="p-2">
            <Splitter layout="vertical" style={{ height: '100%' }}>
              <SplitterPanel size={15} className="flex items-center justify-center bg-green-50 dark:bg-green-900/20">
                Panel 2
              </SplitterPanel>
              <SplitterPanel size={85} className="p-2">
                <Splitter style={{ height: '100%' }}>
                  <SplitterPanel size={20} className="flex items-center justify-center bg-yellow-50 dark:bg-yellow-900/20">
                    Panel 3
                  </SplitterPanel>
                  <SplitterPanel size={80} className="flex items-center justify-center bg-purple-50 dark:bg-purple-900/20">
                    Panel 4
                  </SplitterPanel>
                </Splitter>
              </SplitterPanel>
            </Splitter>
          </SplitterPanel>
        </Splitter>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Splitter with three panels
 */
export const ThreePanels: Story = {
  render: () => {
    return (
      <Splitter style={{ height: '300px' }}>
        <SplitterPanel size={30} className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
          Left Panel (30%)
        </SplitterPanel>
        <SplitterPanel size={40} className="flex items-center justify-center bg-green-50 dark:bg-green-900/20">
          Center Panel (40%)
        </SplitterPanel>
        <SplitterPanel size={30} className="flex items-center justify-center bg-purple-50 dark:bg-purple-900/20">
          Right Panel (30%)
        </SplitterPanel>
      </Splitter>
    );
  },
};

/**
 * Splitter with content examples
 */
export const WithContent: Story = {
  render: () => {
    return (
      <Splitter style={{ height: '400px' }}>
        <SplitterPanel size={30} className="p-4 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-semibold mb-4">Navigation</h3>
          <nav className="space-y-2">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {item}
              </a>
            ))}
          </nav>
        </SplitterPanel>
        <SplitterPanel size={70} className="p-4 bg-white dark:bg-gray-900">
          <h2 className="text-2xl font-bold mb-4">Main Content</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This is the main content area. You can resize the panels by dragging the divider.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Section 1</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Content goes here...
              </p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Section 2</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                More content goes here...
              </p>
            </div>
          </div>
        </SplitterPanel>
      </Splitter>
    );
  },
};

/**
 * Code editor layout example
 */
export const CodeEditorLayout: Story = {
  render: () => {
    return (
      <Splitter style={{ height: '500px' }}>
        <SplitterPanel size={20} minSize={15} className="p-2 bg-gray-900 text-gray-100">
          <div className="text-sm font-mono">
            <div className="mb-2 font-semibold">File Explorer</div>
            <div className="space-y-1 text-xs">
              <div className="pl-2">📁 src</div>
              <div className="pl-4">📄 App.tsx</div>
              <div className="pl-4">📄 index.tsx</div>
              <div className="pl-2">📁 components</div>
              <div className="pl-4">📄 Button.tsx</div>
              <div className="pl-4">📄 Card.tsx</div>
            </div>
          </div>
        </SplitterPanel>
        <SplitterPanel size={60} className="p-2 bg-gray-950 text-green-400 font-mono text-sm">
          <div className="mb-2 text-gray-500">Editor.tsx</div>
          <pre className="text-xs">
            {`import React from 'react';

export const Editor = () => {
  return (
    <div>
      <h1>Code Editor</h1>
    </div>
  );
};`}
          </pre>
        </SplitterPanel>
        <SplitterPanel size={20} minSize={15} className="p-2 bg-gray-800 text-gray-200">
          <div className="text-sm">
            <div className="mb-2 font-semibold">Properties</div>
            <div className="space-y-2 text-xs">
              <div>
                <div className="text-gray-400">Name</div>
                <div>Editor.tsx</div>
              </div>
              <div>
                <div className="text-gray-400">Size</div>
                <div>2.5 KB</div>
              </div>
              <div>
                <div className="text-gray-400">Lines</div>
                <div>12</div>
              </div>
            </div>
          </div>
        </SplitterPanel>
      </Splitter>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dashboard layout example
 */
export const DashboardLayout: Story = {
  render: () => {
    return (
      <Splitter layout="vertical" style={{ height: '500px' }}>
        <SplitterPanel size={20} minSize={15} className="p-4 bg-blue-50 dark:bg-blue-900/20">
          <h3 className="font-semibold mb-4">Header</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dashboard header with navigation and user info
          </p>
        </SplitterPanel>
        <SplitterPanel size={80} className="p-2">
          <Splitter style={{ height: '100%' }}>
            <SplitterPanel size={25} minSize={20} className="p-4 bg-gray-50 dark:bg-gray-800">
              <h3 className="font-semibold mb-4">Sidebar</h3>
              <nav className="space-y-2">
                {['Dashboard', 'Analytics', 'Reports', 'Settings'].map((item) => (
                  <div
                    key={item}
                    className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </nav>
            </SplitterPanel>
            <SplitterPanel size={75} className="p-4 bg-white dark:bg-gray-900">
              <h2 className="text-2xl font-bold mb-4">Dashboard Content</h2>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <h3 className="font-semibold mb-2">Card {i}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Content</p>
                  </div>
                ))}
              </div>
            </SplitterPanel>
          </Splitter>
        </SplitterPanel>
      </Splitter>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Splitter with resize callbacks
 */
export const WithCallbacks: Story = {
  render: () => {
    const [sizes, setSizes] = useState<number[]>([]);
    const [isResizing, setIsResizing] = useState(false);

    return (
      <div className="space-y-4">
        <Splitter
          style={{ height: '300px' }}
          onResize={(newSizes) => {
            setSizes(newSizes);
            console.log('Resized:', newSizes);
          }}
          onResizeStart={() => {
            setIsResizing(true);
            console.log('Resize started');
          }}
          onResizeEnd={() => {
            setIsResizing(false);
            console.log('Resize ended');
          }}
        >
          <SplitterPanel size={30} className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
            Panel 1
          </SplitterPanel>
          <SplitterPanel size={70} className="flex items-center justify-center bg-green-50 dark:bg-green-900/20">
            Panel 2
          </SplitterPanel>
        </Splitter>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-semibold mb-2">Panel Sizes:</p>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {sizes.length > 0 ? (
              <div>
                Panel 1: {sizes[0].toFixed(1)}% | Panel 2: {sizes[1].toFixed(1)}%
              </div>
            ) : (
              <div>Panel 1: 30% | Panel 2: 70%</div>
            )}
          </div>
          {isResizing && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Resizing...</p>
          )}
        </div>
      </div>
    );
  },
};

/**
 * Splitter with min/max constraints
 */
export const WithConstraints: Story = {
  render: () => {
    return (
      <Splitter style={{ height: '300px' }}>
        <SplitterPanel
          size={30}
          minSize={20}
          maxSize={50}
          className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20"
        >
          <div className="text-center">
            <div className="font-semibold">Panel 1</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Min: 20%, Max: 50%
            </div>
          </div>
        </SplitterPanel>
        <SplitterPanel
          size={70}
          minSize={50}
          maxSize={80}
          className="flex items-center justify-center bg-green-50 dark:bg-green-900/20"
        >
          <div className="text-center">
            <div className="font-semibold">Panel 2</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Min: 50%, Max: 80%
            </div>
          </div>
        </SplitterPanel>
      </Splitter>
    );
  },
};

/**
 * Dark theme splitter
 */
export const DarkTheme: Story = {
  render: () => {
    return (
      <ThemeWrapper theme="dark">
        <div className="p-8 min-h-screen bg-gray-900">
          <h2 className="text-2xl font-bold text-white mb-6">Splitter (Dark Theme)</h2>
          <Splitter style={{ height: '400px' }}>
            <SplitterPanel size={30} className="p-4 bg-gray-800">
              <h3 className="font-semibold text-white mb-4">Sidebar</h3>
              <nav className="space-y-2">
                {['Home', 'About', 'Contact'].map((item) => (
                  <div
                    key={item}
                    className="px-3 py-2 rounded text-gray-300 hover:bg-gray-700 cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </nav>
            </SplitterPanel>
            <SplitterPanel size={70} className="p-4 bg-gray-900">
              <h2 className="text-2xl font-bold text-white mb-4">Main Content</h2>
              <p className="text-gray-300">
                This is the main content area in dark theme. Drag the divider to resize.
              </p>
            </SplitterPanel>
          </Splitter>
        </div>
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Vertical splitter with multiple panels
 */
export const VerticalMultiple: Story = {
  render: () => {
    return (
      <Splitter layout="vertical" style={{ height: '400px' }}>
        <SplitterPanel size={25} className="flex items-center justify-center bg-red-50 dark:bg-red-900/20">
          Top Panel (25%)
        </SplitterPanel>
        <SplitterPanel size={50} className="flex items-center justify-center bg-yellow-50 dark:bg-yellow-900/20">
          Middle Panel (50%)
        </SplitterPanel>
        <SplitterPanel size={25} className="flex items-center justify-center bg-green-50 dark:bg-green-900/20">
          Bottom Panel (25%)
        </SplitterPanel>
      </Splitter>
    );
  },
};

/**
 * Image viewer layout
 */
export const ImageViewer: Story = {
  render: () => {
    return (
      <Splitter style={{ height: '500px' }}>
        <SplitterPanel size={30} minSize={20} className="p-4 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-semibold mb-4">Image Gallery</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center"
              >
                Image {i}
              </div>
            ))}
          </div>
        </SplitterPanel>
        <SplitterPanel size={70} className="p-4 bg-white dark:bg-gray-900">
          <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
            <div className="text-center">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-gray-600 dark:text-gray-400">Selected Image Preview</p>
            </div>
          </div>
        </SplitterPanel>
      </Splitter>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

