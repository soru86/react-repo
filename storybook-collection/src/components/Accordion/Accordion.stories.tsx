import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Accordion, AccordionItemProps } from './Accordion';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible accordion component that supports single or multiple expansion, custom icons, nested accordions, and complex content including images.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    allowMultiple: {
      control: 'boolean',
      description: 'Allow multiple items to be expanded at once',
    },
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'filled', 'minimal'],
      description: 'Visual variant style',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the accordion',
    },
    width: {
      control: 'text',
      description: 'Width of the accordion (e.g., "600px", "100%", "50vw")',
    },
  },
  args: {
    width: '600px',
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems: AccordionItemProps[] = [
  {
    id: '1',
    header: 'What is React?',
    children: (
      <div>
        React is a JavaScript library for building user interfaces. It lets you compose complex UIs
        from small and isolated pieces of code called "components".
      </div>
    ),
  },
  {
    id: '2',
    header: 'How do I get started?',
    children: (
      <div>
        You can get started with React by installing it via npm or yarn, or by using Create React
        App which sets up a modern development environment.
      </div>
    ),
  },
  {
    id: '3',
    header: 'What are hooks?',
    children: (
      <div>
        Hooks are functions that let you "hook into" React state and lifecycle features from
        function components. They were introduced in React 16.8.
      </div>
    ),
  },
];

/**
 * Default accordion - single expansion
 */
export const Default: Story = {
  args: {
    items: basicItems,
    allowMultiple: false,
    width: '600px',
  },
};

/**
 * Multiple expansion allowed
 */
export const AllowMultiple: Story = {
  args: {
    items: basicItems,
    allowMultiple: true,
    width: '600px',
  },
};

/**
 * With custom icon
 */
export const CustomIcon: Story = {
  args: {
    items: [
      {
        id: '1',
        header: 'Custom Plus Icon',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
        children: <div>This accordion uses a custom plus icon instead of the default chevron.</div>,
      },
      {
        id: '2',
        header: 'Custom Arrow Icon',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ),
        children: <div>This accordion uses a custom arrow icon.</div>,
      },
    ],
    allowMultiple: true,
    width: '600px',
  },
};

/**
 * Nested accordions
 */
export const Nested: Story = {
  render: () => {
    const nestedItems: AccordionItemProps[] = [
      {
        id: 'parent-1',
        header: 'Frontend Technologies',
        children: (
          <div>
            <Accordion
              items={[
                {
                  id: 'nested-1',
                  header: 'React',
                  children: <div>React is a library for building user interfaces.</div>,
                },
                {
                  id: 'nested-2',
                  header: 'Vue',
                  children: <div>Vue is a progressive JavaScript framework.</div>,
                },
                {
                  id: 'nested-3',
                  header: 'Angular',
                  children: <div>Angular is a platform for building mobile and desktop web applications.</div>,
                },
              ]}
              allowMultiple={true}
              variant="minimal"
              size="small"
              width="100%"
            />
          </div>
        ),
      },
      {
        id: 'parent-2',
        header: 'Backend Technologies',
        children: (
          <div>
            <Accordion
              items={[
                {
                  id: 'nested-4',
                  header: 'Node.js',
                  children: <div>Node.js is a JavaScript runtime built on Chrome's V8 engine.</div>,
                },
                {
                  id: 'nested-5',
                  header: 'Python',
                  children: <div>Python is a high-level programming language.</div>,
                },
                {
                  id: 'nested-6',
                  header: 'Java',
                  children: <div>Java is a class-based, object-oriented programming language.</div>,
                },
              ]}
              allowMultiple={true}
              variant="minimal"
              size="small"
              width="100%"
            />
          </div>
        ),
      },
    ];

    return <Accordion items={nestedItems} allowMultiple={false} width="600px" />;
  },
};

/**
 * Complex content with images
 */
export const WithImages: Story = {
  args: {
    items: [
      {
        id: '1',
        header: 'Nature Photography',
        children: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Explore the beauty of nature through stunning photography. Each image captures a
              unique moment in time.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                alt="Mountain landscape"
                className="rounded-lg w-full h-auto"
              />
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
                alt="Forest path"
                className="rounded-lg w-full h-auto"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              These images showcase the diverse landscapes found in nature.
            </p>
          </div>
        ),
      },
      {
        id: '2',
        header: 'Urban Architecture',
        children: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Modern architecture blends functionality with aesthetic appeal, creating spaces that
              inspire and amaze.
            </p>
            <img
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=400&fit=crop"
              alt="Modern building"
              className="rounded-lg w-full h-auto"
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Design Principles</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Form follows function</li>
                  <li>Sustainable materials</li>
                  <li>Integration with environment</li>
                </ul>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Energy efficient</li>
                  <li>Accessible design</li>
                  <li>Modern aesthetics</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
    ],
    allowMultiple: true,
    width: '600px',
  },
};

/**
 * Complex content with forms and lists
 */
export const ComplexContent: Story = {
  args: {
    items: [
      {
        id: '1',
        header: 'User Profile Settings',
        children: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="john.doe@example.com"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        ),
      },
      {
        id: '2',
        header: 'Notification Preferences',
        children: (
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Push notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm text-gray-700 dark:text-gray-300">SMS notifications</span>
            </label>
          </div>
        ),
      },
      {
        id: '3',
        header: 'Security Settings',
        children: (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Add an extra layer of security to your account.
              </p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                Enable 2FA
              </button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Active Sessions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Chrome on Windows</span>
                  <button className="text-red-600 hover:text-red-700">Revoke</button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Safari on macOS</span>
                  <button className="text-red-600 hover:text-red-700">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    allowMultiple: true,
    width: '600px',
  },
};

/**
 * All variants
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Default</h3>
        <Accordion items={basicItems} allowMultiple={false} variant="default" width="600px" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Bordered</h3>
        <Accordion items={basicItems} allowMultiple={false} variant="bordered" width="600px" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Filled</h3>
        <Accordion items={basicItems} allowMultiple={false} variant="filled" width="600px" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Minimal</h3>
        <Accordion items={basicItems} allowMultiple={false} variant="minimal" width="600px" />
      </div>
    </div>
  ),
};

/**
 * All sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Small</h3>
        <Accordion items={basicItems} allowMultiple={false} size="small" width="600px" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Medium</h3>
        <Accordion items={basicItems} allowMultiple={false} size="medium" width="600px" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Large</h3>
        <Accordion items={basicItems} allowMultiple={false} size="large" width="600px" />
      </div>
    </div>
  ),
};

/**
 * With default expanded items
 */
export const DefaultExpanded: Story = {
  args: {
    items: [
      {
        id: '1',
        header: 'This is expanded by default',
        defaultExpanded: true,
        children: <div>This accordion item is expanded when the component first renders.</div>,
      },
      {
        id: '2',
        header: 'This is collapsed by default',
        children: <div>This accordion item starts collapsed.</div>,
      },
      {
        id: '3',
        header: 'This is also expanded',
        defaultExpanded: true,
        children: <div>Multiple items can be expanded by default when allowMultiple is true.</div>,
      },
    ],
    allowMultiple: true,
    width: '600px',
  },
};

/**
 * Disabled items
 */
export const Disabled: Story = {
  args: {
    items: [
      {
        id: '1',
        header: 'Enabled Item',
        children: <div>This item can be expanded.</div>,
      },
      {
        id: '2',
        header: 'Disabled Item',
        disabled: true,
        children: <div>This item cannot be expanded.</div>,
      },
      {
        id: '3',
        header: 'Another Enabled Item',
        children: <div>This item can also be expanded.</div>,
      },
    ],
    allowMultiple: false,
    width: '600px',
  },
};

/**
 * Controlled accordion
 */
export const Controlled: Story = {
  render: () => {
    const [expandedItems, setExpandedItems] = useState<string[]>(['1']);

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setExpandedItems(['1'])}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Expand First
          </button>
          <button
            onClick={() => setExpandedItems(['2'])}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Expand Second
          </button>
          <button
            onClick={() => setExpandedItems([])}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Collapse All
          </button>
        </div>
        <Accordion
          items={basicItems}
          allowMultiple={false}
          expandedItems={expandedItems}
          onExpandedChange={setExpandedItems}
          width="600px"
        />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Currently expanded: {expandedItems.join(', ') || 'none'}
        </div>
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
    <div className="space-y-8">
      <Accordion items={basicItems} allowMultiple={false} variant="default" width="600px" />
      <Accordion items={basicItems} allowMultiple={true} variant="filled" width="600px" />
    </div>
  ),
};

