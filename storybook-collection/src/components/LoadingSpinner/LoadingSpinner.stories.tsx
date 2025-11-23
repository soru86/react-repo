import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
    title: 'Components/LoadingSpinner',
    component: LoadingSpinner,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A versatile loading spinner component with multiple shapes, sizes, and color variants. Perfect for indicating loading states throughout your application.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: [
                'circular',
                'dots',
                'pulse',
                'bars',
                'ripple',
                'orbit',
                'grid',
                'clock',
                'spinner',
                'ring',
                'dual-ring',
                'ellipsis',
            ],
            description: 'Spinner type/shape',
        },
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
            description: 'Size variant',
        },
        variant: {
            control: 'select',
            options: ['default', 'primary', 'success', 'warning', 'danger', 'info', 'gray'],
            description: 'Color variant',
        },
        label: {
            control: 'text',
            description: 'Loading text/label',
        },
        labelPosition: {
            control: 'select',
            options: ['top', 'bottom', 'left', 'right'],
            description: 'Label position',
        },
        showLabel: {
            control: 'boolean',
            description: 'Whether to show label',
        },
        overlay: {
            control: 'boolean',
            description: 'Full screen overlay',
        },
    },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default circular spinner
 */
export const Default: Story = {
    args: {
        type: 'circular',
        size: 'md',
        variant: 'primary',
    },
};

/**
 * All spinner types
 */
export const AllTypes: Story = {
    render: () => (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-8 p-8">
            {[
                'circular',
                'dots',
                'pulse',
                'bars',
                'ripple',
                'orbit',
                'grid',
                'clock',
                'spinner',
                'ring',
                'dual-ring',
                'ellipsis',
            ].map((type) => (
                <div key={type} className="flex flex-col items-center gap-2">
                    <LoadingSpinner type={type as any} size="md" variant="primary" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{type}</span>
                </div>
            ))}
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
        <div className="flex items-center gap-8 p-8">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                    <LoadingSpinner type="circular" size={size} variant="primary" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 uppercase">{size}</span>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8">
            {(['default', 'primary', 'success', 'warning', 'danger', 'info', 'gray'] as const).map(
                (variant) => (
                    <div key={variant} className="flex flex-col items-center gap-2">
                        <LoadingSpinner type="circular" size="md" variant={variant} />
                        <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{variant}</span>
                    </div>
                )
            )}
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Spinners with labels
 */
export const WithLabels: Story = {
    render: () => (
        <div className="space-y-8 p-8">
            <div className="flex flex-col items-center gap-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Label Positions</h3>
                <div className="flex flex-wrap items-center gap-8">
                    <LoadingSpinner type="circular" size="md" variant="primary" label="Loading..." labelPosition="top" />
                    <LoadingSpinner type="circular" size="md" variant="primary" label="Loading..." labelPosition="bottom" />
                    <LoadingSpinner type="circular" size="md" variant="primary" label="Loading..." labelPosition="left" />
                    <LoadingSpinner type="circular" size="md" variant="primary" label="Loading..." labelPosition="right" />
                </div>
            </div>
            <div className="flex flex-col items-center gap-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Custom Labels</h3>
                <div className="flex flex-wrap items-center gap-8">
                    <LoadingSpinner type="dots" size="md" variant="success" label="Processing..." />
                    <LoadingSpinner type="pulse" size="md" variant="warning" label="Please wait..." />
                    <LoadingSpinner type="bars" size="md" variant="danger" label="Uploading..." />
                </div>
            </div>
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Custom colors
 */
export const CustomColors: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-8 p-8">
            <LoadingSpinner type="circular" size="md" color="#8b5cf6" />
            <LoadingSpinner type="dots" size="md" color="#ec4899" />
            <LoadingSpinner type="pulse" size="md" color="#f59e0b" />
            <LoadingSpinner type="bars" size="md" color="#10b981" />
            <LoadingSpinner type="ripple" size="md" color="#3b82f6" />
            <LoadingSpinner type="ring" size="md" color="#ef4444" />
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Overlay spinner
 */
export const Overlay: Story = {
    render: () => (
        <div className="relative w-full h-64 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300">Content behind overlay</p>
            </div>
            <LoadingSpinner
                type="circular"
                size="lg"
                variant="primary"
                label="Loading..."
                overlay={true}
                overlayColor="rgba(255, 255, 255, 0.9)"
            />
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * All types with different sizes
 */
export const TypesAndSizes: Story = {
    render: () => (
        <div className="space-y-12 p-8">
            {(['circular', 'dots', 'pulse', 'bars', 'ripple', 'orbit'] as const).map((type) => (
                <div key={type} className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">{type}</h3>
                    <div className="flex items-center gap-8">
                        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
                            <div key={size} className="flex flex-col items-center gap-2">
                                <LoadingSpinner type={type} size={size} variant="primary" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">{size}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * All types with different variants
 */
export const TypesAndVariants: Story = {
    render: () => (
        <div className="space-y-8 p-8">
            {(['circular', 'dots', 'pulse', 'bars'] as const).map((type) => (
                <div key={type} className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">{type}</h3>
                    <div className="flex items-center gap-8">
                        {(['primary', 'success', 'warning', 'danger', 'info'] as const).map((variant) => (
                            <div key={variant} className="flex flex-col items-center gap-2">
                                <LoadingSpinner type={type} size="md" variant={variant} />
                                <span className="text-xs text-gray-600 dark:text-gray-400">{variant}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Button loading states
 */
export const ButtonLoading: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-4 p-8">
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                disabled
            >
                <LoadingSpinner type="circular" size="sm" variant="default" color="#ffffff" />
                Loading...
            </button>
            <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                disabled
            >
                <LoadingSpinner type="dots" size="sm" variant="default" color="#ffffff" />
                Processing
            </button>
            <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                disabled
            >
                <LoadingSpinner type="pulse" size="sm" variant="default" color="#ffffff" />
                Deleting
            </button>
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Inline loading states
 */
export const InlineLoading: Story = {
    render: () => (
        <div className="space-y-6 p-8">
            <div className="flex items-center gap-3">
                <LoadingSpinner type="circular" size="sm" variant="primary" />
                <span className="text-gray-700 dark:text-gray-300">Loading data...</span>
            </div>
            <div className="flex items-center gap-3">
                <LoadingSpinner type="dots" size="sm" variant="success" />
                <span className="text-gray-700 dark:text-gray-300">Processing request...</span>
            </div>
            <div className="flex items-center gap-3">
                <LoadingSpinner type="pulse" size="sm" variant="warning" />
                <span className="text-gray-700 dark:text-gray-300">Uploading file...</span>
            </div>
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Card loading states
 */
export const CardLoading: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center gap-4 min-h-[200px]"
                >
                    <LoadingSpinner type="circular" size="lg" variant="primary" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Loading card content...</p>
                </div>
            ))}
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Page loading overlay
 */
export const PageLoading: Story = {
    render: () => (
        <div className="relative w-full h-96 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <div className="p-8">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Page Content</h2>
                <p className="text-gray-700 dark:text-gray-300">
                    This is the page content that would be visible normally.
                </p>
            </div>
            <LoadingSpinner
                type="circular"
                size="xl"
                variant="primary"
                label="Loading page..."
                overlay={true}
            />
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Gradient spinners
 */
export const GradientSpinners: Story = {
    render: () => {
        const gradientStyles = [
            { colors: ['#3b82f6', '#8b5cf6'], name: 'Blue to Purple' },
            { colors: ['#ec4899', '#f59e0b'], name: 'Pink to Orange' },
            { colors: ['#10b981', '#3b82f6'], name: 'Green to Blue' },
            { colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'], name: 'Rainbow' },
        ];

        return (
            <div className="space-y-8 p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {gradientStyles.map((gradient, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <LoadingSpinner type="circular" size="lg" variant="primary" />
                                <style>{`
                  .gradient-spinner-${idx} {
                    background: conic-gradient(from 0deg, ${gradient.colors.join(', ')});
                    mask: radial-gradient(farthest-side, transparent calc(100% - 4px), currentColor calc(100% - 4px));
                    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), currentColor calc(100% - 4px));
                  }
                `}</style>
                                <div
                                    className={`gradient-spinner-${idx} w-16 h-16 rounded-full animate-spin`}
                                />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                {gradient.name}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {(['circular', 'ring', 'dual-ring'] as const).map((type) => (
                        <div key={type} className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div
                                    className="w-16 h-16 rounded-full animate-spin"
                                    style={{
                                        background: `conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)`,
                                        mask: `radial-gradient(farthest-side, transparent calc(100% - 4px), currentColor calc(100% - 4px))`,
                                        WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - 4px), currentColor calc(100% - 4px))`,
                                    }}
                                />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                                {type} Gradient
                            </span>
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

/**
 * Dark theme - All spinner variants
 */
export const DarkTheme: Story = {
    render: () => (
        <ThemeWrapper theme="dark">
            <div className="space-y-8 p-8">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-8">
                    {(['circular', 'dots', 'pulse', 'bars', 'ripple', 'orbit'] as const).map((type) => (
                        <div key={type} className="flex flex-col items-center gap-2">
                            <LoadingSpinner type={type} size="md" variant="primary" />
                            <span className="text-xs text-gray-400 capitalize">{type}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-8">
                    {(['primary', 'success', 'warning', 'danger', 'info'] as const).map((variant) => (
                        <div key={variant} className="flex flex-col items-center gap-2">
                            <LoadingSpinner type="circular" size="md" variant={variant} />
                            <span className="text-xs text-gray-400">{variant}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center gap-8">
                    <div
                        className="w-16 h-16 rounded-full animate-spin"
                        style={{
                            background: `conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)`,
                            mask: `radial-gradient(farthest-side, transparent calc(100% - 4px), currentColor calc(100% - 4px))`,
                            WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - 4px), currentColor calc(100% - 4px))`,
                        }}
                    />
                    <span className="text-xs text-gray-400">Gradient Spinner</span>
                </div>
            </div>
        </ThemeWrapper>
    ),
    parameters: {
        layout: 'fullscreen',
    },
};

