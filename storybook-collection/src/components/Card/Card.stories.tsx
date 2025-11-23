import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Card, CardGroup, CardProps } from './Card';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
    title: 'Components/Card',
    component: Card,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'A versatile card component with support for complex content, graphs, collapsible sections, shadows, and card groups with flexible layouts.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'elevated', 'outlined', 'filled'],
            description: 'Visual variant',
        },
        shadow: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
            description: 'Shadow level',
        },
        collapsible: {
            control: 'boolean',
            description: 'Enable collapsible content',
        },
        width: {
            control: 'text',
            description: 'Custom width',
        },
        height: {
            control: 'text',
            description: 'Custom height',
        },
    },
    args: {
        title: 'Card Title',
        children: 'Card content goes here',
    },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default card
 */
export const Default: Story = {
    args: {
        title: 'Card Title',
        children: 'This is a default card with basic content.',
    },
};

/**
 * All variants
 */
export const Variants: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-4">
            <Card title="Default" variant="default">
                Default variant card
            </Card>
            <Card title="Elevated" variant="elevated" shadow="lg">
                Elevated variant card
            </Card>
            <Card title="Outlined" variant="outlined">
                Outlined variant card
            </Card>
            <Card title="Filled" variant="filled">
                Filled variant card
            </Card>
        </div>
    ),
};

/**
 * All shadow levels
 */
export const Shadows: Story = {
    render: () => (
        <div className="grid grid-cols-3 gap-4">
            <Card title="No Shadow" shadow="none">
                Card without shadow
            </Card>
            <Card title="Small Shadow" shadow="sm">
                Card with small shadow
            </Card>
            <Card title="Medium Shadow" shadow="md">
                Card with medium shadow
            </Card>
            <Card title="Large Shadow" shadow="lg">
                Card with large shadow
            </Card>
            <Card title="XL Shadow" shadow="xl">
                Card with XL shadow
            </Card>
            <Card title="2XL Shadow" shadow="2xl">
                Card with 2XL shadow
            </Card>
        </div>
    ),
};

/**
 * Without title
 */
export const WithoutTitle: Story = {
    args: {
        children: 'This card does not have a title.',
    },
};

/**
 * Collapsible card
 */
export const Collapsible: Story = {
    args: {
        title: 'Collapsible Card',
        collapsible: true,
        defaultCollapsed: false,
        children: (
            <div>
                <p>This card can be collapsed and expanded.</p>
                <p className="mt-2">Click the header or the collapse icon to toggle.</p>
            </div>
        ),
    },
};

/**
 * Complex content
 */
export const ComplexContent: Story = {
    args: {
        title: 'User Profile',
        children: (
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <img
                        src="https://i.pravatar.cc/150?img=1"
                        alt="Avatar"
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">John Doe</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Software Engineer</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">john.doe@example.com</p>
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Skills</h5>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm">
                            React
                        </span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-sm">
                            Node.js
                        </span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded text-sm">
                            TypeScript
                        </span>
                    </div>
                </div>
            </div>
        ),
    },
};

/**
 * With graph
 */
export const WithGraph: Story = {
    args: {
        title: 'Sales Overview',
        children: (
            <div className="space-y-4">
                <div className="flex items-end justify-between h-32 gap-2">
                    {[65, 80, 45, 90, 70, 85, 60].map((height, index) => (
                        <div
                            key={index}
                            className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                            style={{ height: `${height}%` }}
                            title={`${height}%`}
                        />
                    ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Sales</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">$12,345</span>
                    </div>
                </div>
            </div>
        ),
    },
};

/**
 * With footer
 */
export const WithFooter: Story = {
    args: {
        title: 'Project Card',
        children: (
            <div>
                <p className="text-gray-700 dark:text-gray-300">
                    This is a project card with a footer section containing action buttons.
                </p>
            </div>
        ),
        footer: (
            <div className="flex justify-end gap-2">
                <button className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                    Cancel
                </button>
                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Save
                </button>
            </div>
        ),
    },
};

/**
 * With header actions
 */
export const WithHeaderActions: Story = {
    args: {
        title: 'Card with Actions',
        headerActions: (
            <>
                <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
                <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </>
        ),
        children: (
            <div>
                <p className="text-gray-700 dark:text-gray-300">
                    This card has action buttons in the header.
                </p>
            </div>
        ),
    },
};

/**
 * Custom dimensions
 */
export const CustomDimensions: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Card title="Fixed Width" width="300px">
                This card has a fixed width of 300px
            </Card>
            <Card title="Fixed Height" height="200px">
                This card has a fixed height of 200px. The content will overflow if it exceeds this height.
            </Card>
            <Card title="Both Fixed" width="250px" height="150px">
                This card has both width and height fixed.
            </Card>
            <Card title="Percentage Width" width="50%">
                This card takes 50% of the container width
            </Card>
        </div>
    ),
};

/**
 * Horizontal card group
 */
export const HorizontalGroup: Story = {
    render: () => {
        const cards: CardProps[] = [
            { title: 'Card 1', children: 'Content of card 1' },
            { title: 'Card 2', children: 'Content of card 2' },
            { title: 'Card 3', children: 'Content of card 3' },
        ];

        return <CardGroup cards={cards} direction="horizontal" gap="md" />;
    },
};

/**
 * Vertical card group
 */
export const VerticalGroup: Story = {
    render: () => {
        const cards: CardProps[] = [
            { title: 'Card 1', children: 'Content of card 1' },
            { title: 'Card 2', children: 'Content of card 2' },
            { title: 'Card 3', children: 'Content of card 3' },
        ];

        return <CardGroup cards={cards} direction="vertical" gap="md" />;
    },
};

/**
 * Card group with columns
 */
export const GroupWithColumns: Story = {
    render: () => {
        const cards: CardProps[] = [
            { title: 'Card 1', children: 'Content 1' },
            { title: 'Card 2', children: 'Content 2' },
            { title: 'Card 3', children: 'Content 3' },
            { title: 'Card 4', children: 'Content 4' },
            { title: 'Card 5', children: 'Content 5' },
            { title: 'Card 6', children: 'Content 6' },
        ];

        return (
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">2 Columns</h3>
                    <CardGroup cards={cards} direction="horizontal" columns={2} gap="md" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">3 Columns</h3>
                    <CardGroup cards={cards} direction="horizontal" columns={3} gap="md" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">4 Columns</h3>
                    <CardGroup cards={cards} direction="horizontal" columns={4} gap="md" />
                </div>
            </div>
        );
    },
};

/**
 * Card group with flexSpan
 */
export const GroupWithFlexSpan: Story = {
    render: () => {
        const cards: CardProps[] = [
            { title: 'Full Width', children: 'This card spans full width', flexSpan: 1 },
            { title: 'Half Width', children: 'This card spans half width', flexSpan: 0.5 },
            { title: 'Half Width', children: 'This card also spans half width', flexSpan: 0.5 },
            { title: 'Third Width', children: 'This card spans one third', flexSpan: 0.33 },
            { title: 'Third Width', children: 'This card spans one third', flexSpan: 0.33 },
            { title: 'Third Width', children: 'This card spans one third', flexSpan: 0.33 },
        ];

        return (
            <div className="space-y-6">
                <CardGroup cards={cards} direction="horizontal" gap="md" />
            </div>
        );
    },
};

/**
 * Complex card group
 */
export const ComplexCardGroup: Story = {
    render: () => {
        const cards: CardProps[] = [
            {
                title: 'Sales Chart',
                variant: 'elevated',
                shadow: 'lg',
                children: (
                    <div className="space-y-4">
                        <div className="flex items-end justify-between h-32 gap-2">
                            {[65, 80, 45, 90, 70, 85, 60].map((height, index) => (
                                <div
                                    key={index}
                                    className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                                    style={{ height: `${height}%` }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>
                    </div>
                ),
                flexSpan: 2,
            },
            {
                title: 'Stats',
                variant: 'outlined',
                children: (
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Sales</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$12,345</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Growth</p>
                            <p className="text-2xl font-bold text-green-600">+12.5%</p>
                        </div>
                    </div>
                ),
                flexSpan: 1,
            },
            {
                title: 'Recent Activity',
                collapsible: true,
                children: (
                    <ul className="space-y-2">
                        <li className="text-sm text-gray-700 dark:text-gray-300">Order #1234 completed</li>
                        <li className="text-sm text-gray-700 dark:text-gray-300">New customer registered</li>
                        <li className="text-sm text-gray-700 dark:text-gray-300">Product updated</li>
                    </ul>
                ),
                flexSpan: 1,
            },
        ];

        return <CardGroup cards={cards} direction="horizontal" gap="lg" />;
    },
};

/**
 * Dashboard example
 */
export const DashboardExample: Story = {
    render: () => {
        const cardsRow1: CardProps[] = [
            {
                title: 'Revenue',
                variant: 'elevated',
                shadow: 'xl',
                children: (
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">$45,231</p>
                        <p className="text-sm text-green-600 mt-1">+20.1% from last month</p>
                    </div>
                ),
                flexSpan: 1,
                width: '100%',
            },
            {
                title: 'Users',
                variant: 'elevated',
                shadow: 'xl',
                children: (
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">2,350</p>
                        <p className="text-sm text-blue-600 mt-1">+15.3% from last month</p>
                    </div>
                ),
                flexSpan: 1,
                width: '100%',
            },
            {
                title: 'Orders',
                variant: 'elevated',
                shadow: 'xl',
                children: (
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">1,234</p>
                        <p className="text-sm text-purple-600 mt-1">+8.2% from last month</p>
                    </div>
                ),
                flexSpan: 1,
                width: '100%',
            }
        ];

        const cardsRow2: CardProps[] = [
            {
                title: 'Sales Chart',
                variant: 'elevated',
                shadow: 'lg',
                children: (
                    <div className="space-y-4">
                        <div className="flex items-end justify-between h-40 gap-1 min-h-[160px]">
                            {[40, 60, 35, 80, 50, 70, 45, 90, 65, 75, 55, 85].map((height, index) => (
                                <div
                                    key={index}
                                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-700 hover:to-blue-500 min-w-0"
                                    style={{ height: `${height}%`, minHeight: '4px' }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                            {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month) => (
                                <span key={month}>{month}</span>
                            ))}
                        </div>
                    </div>
                ),
                flexSpan: 3,
                width: '100%',
            },
            {
                title: 'Notifications',
                variant: 'outlined',
                collapsible: true,
                children: (
                    <div className="space-y-2">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                            New order received
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm">
                            Payment processed
                        </div>
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
                            Low stock alert
                        </div>
                    </div>
                ),
                flexSpan: 2,
                width: '100%',
            },
        ];

        return (
            <div className="space-y-6">
                <div className="w-full max-w-7xl">
                    <CardGroup cards={cardsRow1} direction="horizontal" gap="lg" />
                </div>
                <div className="w-full max-w-7xl">
                    <CardGroup cards={cardsRow2} direction="horizontal" gap="lg" />
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
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card title="Default" variant="default">
                    Default variant card
                </Card>
                <Card title="Elevated" variant="elevated" shadow="lg">
                    Elevated variant card
                </Card>
                <Card title="Outlined" variant="outlined">
                    Outlined variant card
                </Card>
                <Card title="Filled" variant="filled">
                    Filled variant card
                </Card>
            </div>
            <CardGroup
                cards={[
                    { title: 'Card 1', children: 'Content 1' },
                    { title: 'Card 2', children: 'Content 2' },
                    { title: 'Card 3', children: 'Content 3' },
                ]}
                direction="horizontal"
                columns={3}
                gap="md"
            />
        </div>
    ),
};

