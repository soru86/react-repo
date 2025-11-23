import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
    title: 'Components/Breadcrumb',
    component: Breadcrumb,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'A breadcrumb component for navigation, supporting configurable separators, color variants, bordered and filled styles.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'bordered', 'filled'],
            description: 'Visual variant',
        },
        color: {
            control: 'select',
            options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
            description: 'Color scheme',
        },
        separator: {
            control: 'text',
            description: 'Separator between items',
        },
        maxItems: {
            control: 'number',
            description: 'Maximum number of items to show',
        },
    },
    args: {
        items: [
            { label: 'Home', href: '#' },
            { label: 'Products', href: '#' },
            { label: 'Electronics', href: '#' },
            { label: 'Laptops' },
        ],
    },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default breadcrumb
 */
export const Default: Story = {
    args: {
        items: [
            { label: 'Home', href: '#' },
            { label: 'Products', href: '#' },
            { label: 'Electronics', href: '#' },
            { label: 'Laptops' },
        ],
    },
};

/**
 * Breadcrumb variants
 */
export const Variants: Story = {
    render: () => (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Default</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    variant="default"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Bordered</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    variant="bordered"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Filled</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    variant="filled"
                />
            </div>
        </div>
    ),
};

/**
 * Color variants
 */
export const Colors: Story = {
    render: () => (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Default</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    color="default"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Primary</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    color="primary"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Success</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    color="success"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Warning</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    color="warning"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Error</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    color="error"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Info</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    color="info"
                />
            </div>
        </div>
    ),
};

/**
 * Separator options
 */
export const Separators: Story = {
    render: () => (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Slash (/)</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    separator="/"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Greater Than (&gt;)</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    separator=">"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Arrow (→)</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    separator="→"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Bullet (•)</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    separator="•"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Pipe (|)</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    separator="|"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Custom Icon Separator</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    separator={
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    }
                />
            </div>
        </div>
    ),
};

/**
 * Breadcrumb with icons
 */
export const WithIcons: Story = {
    render: () => {
        const HomeIcon = (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        );

        const FolderIcon = (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
        );

        const FileIcon = (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        );

        return (
            <div className="space-y-4">
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#', icon: HomeIcon },
                        { label: 'Documents', href: '#', icon: FolderIcon },
                        { label: 'Report.pdf', icon: FileIcon },
                    ]}
                />
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#', icon: HomeIcon },
                        { label: 'Documents', href: '#', icon: FolderIcon },
                        { label: 'Report.pdf', icon: FileIcon },
                    ]}
                    variant="bordered"
                    color="primary"
                />
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#', icon: HomeIcon },
                        { label: 'Documents', href: '#', icon: FolderIcon },
                        { label: 'Report.pdf', icon: FileIcon },
                    ]}
                    variant="filled"
                    color="success"
                />
            </div>
        );
    },
};

/**
 * Breadcrumb with max items (collapsed)
 */
export const MaxItems: Story = {
    render: () => {
        const longPath: BreadcrumbItem[] = [
            { label: 'Home', href: '#' },
            { label: 'Category 1', href: '#' },
            { label: 'Category 2', href: '#' },
            { label: 'Category 3', href: '#' },
            { label: 'Category 4', href: '#' },
            { label: 'Category 5', href: '#' },
            { label: 'Current Page' },
        ];

        return (
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">All Items (No Limit)</h3>
                    <Breadcrumb items={longPath} />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Max 3 Items</h3>
                    <Breadcrumb items={longPath} maxItems={3} />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Max 4 Items</h3>
                    <Breadcrumb items={longPath} maxItems={4} />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Max 5 Items (Bordered)</h3>
                    <Breadcrumb items={longPath} maxItems={5} variant="bordered" color="primary" />
                </div>
            </div>
        );
    },
};

/**
 * Interactive breadcrumb with onClick handlers
 */
export const Interactive: Story = {
    render: () => {
        const [currentPath, setCurrentPath] = React.useState<string>('Electronics');

        const items: BreadcrumbItem[] = [
            {
                label: 'Home',
                onClick: () => {
                    setCurrentPath('Home');
                    console.log('Navigated to Home');
                },
            },
            {
                label: 'Products',
                onClick: () => {
                    setCurrentPath('Products');
                    console.log('Navigated to Products');
                },
            },
            {
                label: 'Electronics',
                onClick: () => {
                    setCurrentPath('Electronics');
                    console.log('Navigated to Electronics');
                },
            },
            {
                label: currentPath,
            },
        ];

        return (
            <div className="space-y-4">
                <Breadcrumb items={items} color="primary" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current path: <strong>{currentPath}</strong> (Check console for click events)
                </p>
            </div>
        );
    },
};

/**
 * Disabled items
 */
export const Disabled: Story = {
    render: () => (
        <div className="space-y-4">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '#' },
                    { label: 'Products', href: '#', disabled: true },
                    { label: 'Electronics' },
                ]}
            />
            <Breadcrumb
                items={[
                    { label: 'Home', href: '#' },
                    { label: 'Products', href: '#', disabled: true },
                    { label: 'Electronics' },
                ]}
                variant="bordered"
                color="warning"
            />
        </div>
    ),
};

/**
 * Long labels
 */
export const LongLabels: Story = {
    render: () => (
        <div className="space-y-4">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '#' },
                    { label: 'Very Long Category Name That Might Overflow', href: '#' },
                    { label: 'Another Extremely Long Product Name That Should Be Handled Properly' },
                ]}
            />
            <Breadcrumb
                items={[
                    { label: 'Home', href: '#' },
                    { label: 'Very Long Category Name That Might Overflow', href: '#' },
                    { label: 'Another Extremely Long Product Name That Should Be Handled Properly' },
                ]}
                variant="filled"
                color="info"
            />
        </div>
    ),
};

/**
 * Combined variants
 */
export const CombinedVariants: Story = {
    render: () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Bordered + Primary</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    variant="bordered"
                    color="primary"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Filled + Success</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    variant="filled"
                    color="success"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Bordered + Error + Custom Separator</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    variant="bordered"
                    color="error"
                    separator="→"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Filled + Warning + Icons</h3>
                <Breadcrumb
                    items={[
                        {
                            label: 'Home',
                            href: '#',
                            icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            ),
                        },
                        {
                            label: 'Products',
                            href: '#',
                            icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            ),
                        },
                        {
                            label: 'Electronics',
                            icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            ),
                        },
                    ]}
                    variant="filled"
                    color="warning"
                />
            </div>
        </div>
    ),
};

/**
 * Collapsed breadcrumb (expandable)
 */
export const CollapsedExpandable: Story = {
    render: () => {
        const longPath: BreadcrumbItem[] = [
            { label: 'Home', href: '#' },
            { label: 'Category 1', href: '#' },
            { label: 'Category 2', href: '#' },
            { label: 'Category 3', href: '#' },
            { label: 'Category 4', href: '#' },
            { label: 'Category 5', href: '#' },
            { label: 'Current Page' },
        ];

        return (
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Collapsed (Click ellipsis to expand)</h3>
                    <Breadcrumb items={longPath} maxItems={3} collapseMode="expandable" />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">With Bordered Variant</h3>
                    <Breadcrumb items={longPath} maxItems={3} collapseMode="expandable" variant="bordered" color="primary" />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">With Filled Variant</h3>
                    <Breadcrumb items={longPath} maxItems={3} collapseMode="expandable" variant="filled" color="success" />
                </div>
            </div>
        );
    },
};

/**
 * Condensed breadcrumb with menu
 */
export const CondensedWithMenu: Story = {
    render: () => {
        const longPath: BreadcrumbItem[] = [
            { label: 'Home', href: '#' },
            { label: 'Products', href: '#' },
            { label: 'Electronics', href: '#' },
            { label: 'Computers', href: '#' },
            { label: 'Laptops', href: '#' },
            { label: 'Gaming Laptops', href: '#' },
            { label: 'Current Product' },
        ];

        return (
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Condensed with Menu (Click ellipsis to see menu)</h3>
                    <Breadcrumb items={longPath} maxItems={3} collapseMode="menu" />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">With Icons</h3>
                    <Breadcrumb
                        items={[
                            {
                                label: 'Home',
                                href: '#',
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                ),
                            },
                            {
                                label: 'Products',
                                href: '#',
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                ),
                            },
                            {
                                label: 'Electronics',
                                href: '#',
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                    </svg>
                                ),
                            },
                            {
                                label: 'Computers',
                                href: '#',
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                    </svg>
                                ),
                            },
                            {
                                label: 'Laptops',
                                href: '#',
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                ),
                            },
                            {
                                label: 'Gaming Laptops',
                                href: '#',
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                                    </svg>
                                ),
                            },
                            {
                                label: 'Current Product',
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                ),
                            },
                        ]}
                        maxItems={3}
                        collapseMode="menu"
                        variant="bordered"
                        color="primary"
                    />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">With Custom Separator</h3>
                    <Breadcrumb items={longPath} maxItems={3} collapseMode="menu" separator="→" color="info" />
                </div>
            </div>
        );
    },
};

/**
 * Breadcrumb items rendered as chips
 */
export const AsChips: Story = {
    render: () => {
        const items: BreadcrumbItem[] = [
            { label: 'Home', href: '#' },
            { label: 'Products', href: '#' },
            { label: 'Electronics', href: '#' },
            { label: 'Laptops' },
        ];

        return (
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Default Style</h3>
                    <Breadcrumb items={items} renderAsChip={true} />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Primary Color</h3>
                    <Breadcrumb items={items} renderAsChip={true} color="primary" />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Success Color</h3>
                    <Breadcrumb items={items} renderAsChip={true} color="success" />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">With Bordered Variant (Outlined Chips)</h3>
                    <Breadcrumb items={items} renderAsChip={true} variant="bordered" color="primary" />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">With Icons</h3>
                    <Breadcrumb
                        items={[
                            {
                                label: 'Home',
                                href: '#',
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                ),
                            },
                            {
                                label: 'Documents',
                                href: '#',
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                ),
                            },
                            {
                                label: 'Report.pdf',
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                ),
                            },
                        ]}
                        renderAsChip={true}
                        color="info"
                    />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Long Path with Chips</h3>
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '#' },
                            { label: 'Category 1', href: '#' },
                            { label: 'Category 2', href: '#' },
                            { label: 'Category 3', href: '#' },
                            { label: 'Current Page' },
                        ]}
                        renderAsChip={true}
                        maxItems={3}
                        collapseMode="expandable"
                        color="warning"
                    />
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Chips with Menu</h3>
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '#' },
                            { label: 'Products', href: '#' },
                            { label: 'Electronics', href: '#' },
                            { label: 'Computers', href: '#' },
                            { label: 'Laptops', href: '#' },
                            { label: 'Current Product' },
                        ]}
                        renderAsChip={true}
                        maxItems={3}
                        collapseMode="menu"
                        color="error"
                    />
                </div>
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
    render: () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-300">Default</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-300">Bordered</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    variant="bordered"
                    color="primary"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-300">Filled</h3>
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Products', href: '#' },
                        { label: 'Electronics' },
                    ]}
                    variant="filled"
                    color="success"
                />
            </div>
            <div>
                <h3 className="text-sm font-medium mb-2 text-gray-300">With Icons</h3>
                <Breadcrumb
                    items={[
                        {
                            label: 'Home',
                            href: '#',
                            icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            ),
                        },
                        {
                            label: 'Documents',
                            href: '#',
                            icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            ),
                        },
                        {
                            label: 'Report.pdf',
                            icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            ),
                        },
                    ]}
                    variant="filled"
                    color="info"
                />
            </div>
        </div>
    ),
};

