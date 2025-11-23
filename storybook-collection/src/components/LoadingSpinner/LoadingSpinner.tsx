import React from 'react';
import { clsx } from 'clsx';

export type SpinnerType =
    | 'circular'
    | 'dots'
    | 'pulse'
    | 'bars'
    | 'ripple'
    | 'orbit'
    | 'grid'
    | 'clock'
    | 'spinner'
    | 'ring'
    | 'dual-ring'
    | 'ellipsis';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SpinnerVariant =
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'gray';

export interface LoadingSpinnerProps {
    /**
     * Spinner type/shape
     */
    type?: SpinnerType;
    /**
     * Size variant
     */
    size?: SpinnerSize;
    /**
     * Color variant
     */
    variant?: SpinnerVariant;
    /**
     * Custom color (overrides variant)
     */
    color?: string;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Loading text/label
     */
    label?: string;
    /**
     * Label position
     */
    labelPosition?: 'top' | 'bottom' | 'left' | 'right';
    /**
     * Whether to show label
     */
    showLabel?: boolean;
    /**
     * Full screen overlay
     */
    overlay?: boolean;
    /**
     * Overlay background color
     */
    overlayColor?: string;
}

/**
 * Loading Spinner component with multiple shapes and variants
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    type = 'circular',
    size = 'md',
    variant = 'primary',
    color,
    className,
    label,
    labelPosition = 'bottom',
    showLabel = false,
    overlay = false,
    overlayColor = 'rgba(0, 0, 0, 0.5)',
}) => {
    // Size classes
    const sizeClasses: Record<SpinnerSize, { spinner: string; text: string }> = {
        xs: { spinner: 'w-3 h-3', text: 'text-xs' },
        sm: { spinner: 'w-4 h-4', text: 'text-sm' },
        md: { spinner: 'w-8 h-8', text: 'text-base' },
        lg: { spinner: 'w-12 h-12', text: 'text-lg' },
        xl: { spinner: 'w-16 h-16', text: 'text-xl' },
    };

    // Variant colors
    const variantColors: Record<SpinnerVariant, string> = {
        default: 'text-gray-600 dark:text-gray-400',
        primary: 'text-blue-600 dark:text-blue-400',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        danger: 'text-red-600 dark:text-red-400',
        info: 'text-cyan-600 dark:text-cyan-400',
        gray: 'text-gray-500 dark:text-gray-500',
    };

    const spinnerColor = color || variantColors[variant];
    const sizes = sizeClasses[size];

    // Render spinner based on type
    const renderSpinner = () => {
        const spinnerClasses = clsx(sizes.spinner, spinnerColor, className);

        switch (type) {
            case 'circular':
                return (
                    <div className={clsx(spinnerClasses, 'animate-spin')}>
                        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                );

            case 'dots':
                return (
                    <div className={clsx('flex items-center gap-1', sizes.spinner)}>
                        <div
                            className={clsx('rounded-full animate-bounce', sizes.spinner)}
                            style={{
                                animationDelay: '0ms',
                                animationDuration: '1.4s',
                                backgroundColor: color || 'currentColor',
                            }}
                        />
                        <div
                            className={clsx('rounded-full animate-bounce', sizes.spinner)}
                            style={{
                                animationDelay: '160ms',
                                animationDuration: '1.4s',
                                backgroundColor: color || 'currentColor',
                            }}
                        />
                        <div
                            className={clsx('rounded-full animate-bounce', sizes.spinner)}
                            style={{
                                animationDelay: '320ms',
                                animationDuration: '1.4s',
                                backgroundColor: color || 'currentColor',
                            }}
                        />
                    </div>
                );

            case 'pulse':
                return (
                    <div
                        className={clsx(
                            spinnerClasses,
                            'rounded-full animate-pulse',
                            !color && 'bg-current'
                        )}
                        style={color ? { backgroundColor: color } : {}}
                    />
                );

            case 'bars':
                return (
                    <div className={clsx('flex items-end gap-1', sizes.spinner)}>
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={clsx(
                                    'animate-pulse',
                                    !color && 'bg-current',
                                    size === 'xs' && 'w-0.5',
                                    size === 'sm' && 'w-1',
                                    size === 'md' && 'w-1.5',
                                    size === 'lg' && 'w-2',
                                    size === 'xl' && 'w-2.5'
                                )}
                                style={{
                                    height: `${(i + 1) * 25}%`,
                                    animationDelay: `${i * 100}ms`,
                                    animationDuration: '1s',
                                    backgroundColor: color || 'currentColor',
                                }}
                            />
                        ))}
                    </div>
                );

            case 'ripple':
                return (
                    <div className={clsx('relative', sizes.spinner)}>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={clsx(
                                    'absolute inset-0 rounded-full border-2 animate-ping',
                                    spinnerColor,
                                    'border-current'
                                )}
                                style={{
                                    animationDelay: `${i * 0.3}s`,
                                    opacity: 0.75 - i * 0.25,
                                }}
                            />
                        ))}
                    </div>
                );

            case 'orbit':
                return (
                    <div className={clsx('relative', sizes.spinner)}>
                        <div
                            className={clsx(
                                'absolute top-0 left-1/2 -translate-x-1/2 rounded-full',
                                size === 'xs' && 'w-1 h-1',
                                size === 'sm' && 'w-1.5 h-1.5',
                                size === 'md' && 'w-2 h-2',
                                size === 'lg' && 'w-3 h-3',
                                size === 'xl' && 'w-4 h-4',
                                !color && 'bg-current'
                            )}
                            style={{
                                backgroundColor: color || 'currentColor',
                                animation: `orbit-${size} 1.5s linear infinite`,
                            }}
                        />
                        <style>{`
              @keyframes orbit-xs {
                0% { transform: translate(-50%, 0) rotate(0deg) translateX(6px) rotate(0deg); }
                100% { transform: translate(-50%, 0) rotate(360deg) translateX(6px) rotate(-360deg); }
              }
              @keyframes orbit-sm {
                0% { transform: translate(-50%, 0) rotate(0deg) translateX(8px) rotate(0deg); }
                100% { transform: translate(-50%, 0) rotate(360deg) translateX(8px) rotate(-360deg); }
              }
              @keyframes orbit-md {
                0% { transform: translate(-50%, 0) rotate(0deg) translateX(12px) rotate(0deg); }
                100% { transform: translate(-50%, 0) rotate(360deg) translateX(12px) rotate(-360deg); }
              }
              @keyframes orbit-lg {
                0% { transform: translate(-50%, 0) rotate(0deg) translateX(18px) rotate(0deg); }
                100% { transform: translate(-50%, 0) rotate(360deg) translateX(18px) rotate(-360deg); }
              }
              @keyframes orbit-xl {
                0% { transform: translate(-50%, 0) rotate(0deg) translateX(24px) rotate(0deg); }
                100% { transform: translate(-50%, 0) rotate(360deg) translateX(24px) rotate(-360deg); }
              }
            `}</style>
                    </div>
                );

            case 'grid':
                return (
                    <div className={clsx('grid grid-cols-3 gap-1', sizes.spinner)}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div
                                key={i}
                                className={clsx(
                                    'rounded-sm animate-pulse',
                                    !color && 'bg-current'
                                )}
                                style={{
                                    backgroundColor: color || 'currentColor',
                                    animationDelay: `${(i % 3) * 0.1}s`,
                                    animationDuration: '1.2s',
                                }}
                            />
                        ))}
                    </div>
                );

            case 'clock':
                return (
                    <div className={clsx('relative', sizes.spinner)}>
                        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                            <circle
                                className={clsx('opacity-25', spinnerColor)}
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <line
                                className={clsx('animate-spin origin-center', spinnerColor)}
                                x1="12"
                                y1="12"
                                x2="12"
                                y2="6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                style={{ animationDuration: '1s' }}
                            />
                        </svg>
                    </div>
                );

            case 'spinner':
                return (
                    <div className={clsx(spinnerClasses, 'animate-spin')}>
                        <div
                            className={clsx(
                                'border-t-2 border-r-2 border-transparent rounded-full',
                                spinnerColor,
                                'border-t-current border-r-current'
                            )}
                            style={{
                                borderWidth: size === 'xs' ? '1px' : size === 'sm' ? '2px' : '3px',
                            }}
                        />
                    </div>
                );

            case 'ring':
                return (
                    <div className={clsx('relative', sizes.spinner)}>
                        <div
                            className={clsx(
                                'absolute inset-0 border-4 border-transparent rounded-full animate-spin',
                                spinnerColor,
                                'border-t-current'
                            )}
                            style={{
                                borderWidth: size === 'xs' ? '2px' : size === 'sm' ? '3px' : '4px',
                            }}
                        />
                    </div>
                );

            case 'dual-ring':
                return (
                    <div className={clsx('relative', sizes.spinner)}>
                        <div
                            className={clsx(
                                'absolute inset-0 border-4 border-transparent rounded-full animate-spin',
                                spinnerColor,
                                'border-t-current'
                            )}
                            style={{
                                borderWidth: size === 'xs' ? '2px' : size === 'sm' ? '3px' : '4px',
                                animationDuration: '1s',
                            }}
                        />
                        <div
                            className={clsx(
                                'absolute inset-0 border-4 border-transparent rounded-full animate-spin',
                                spinnerColor,
                                'border-b-current'
                            )}
                            style={{
                                borderWidth: size === 'xs' ? '2px' : size === 'sm' ? '3px' : '4px',
                                animationDuration: '1.5s',
                                animationDirection: 'reverse',
                            }}
                        />
                    </div>
                );

            case 'ellipsis':
                return (
                    <div className={clsx('flex items-center gap-1', sizes.spinner)}>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={clsx(
                                    'rounded-full animate-pulse',
                                    size === 'xs' && 'w-1 h-1',
                                    size === 'sm' && 'w-1.5 h-1.5',
                                    size === 'md' && 'w-2 h-2',
                                    size === 'lg' && 'w-3 h-3',
                                    size === 'xl' && 'w-4 h-4',
                                    !color && 'bg-current'
                                )}
                                style={{
                                    backgroundColor: color || 'currentColor',
                                    animationDelay: `${i * 0.2}s`,
                                    animationDuration: '1.4s',
                                }}
                            />
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    const spinnerElement = renderSpinner();
    const displayLabel = showLabel || label;

    // Label position classes
    const containerClasses = clsx(
        'flex items-center justify-center',
        labelPosition === 'top' && 'flex-col-reverse',
        labelPosition === 'bottom' && 'flex-col',
        labelPosition === 'left' && 'flex-row-reverse',
        labelPosition === 'right' && 'flex-row',
        labelPosition === 'top' && 'gap-2',
        labelPosition === 'bottom' && 'gap-2',
        labelPosition === 'left' && 'gap-3',
        labelPosition === 'right' && 'gap-3'
    );

    const content = (
        <div className={containerClasses}>
            {spinnerElement}
            {displayLabel && (
                <span className={clsx(sizes.text, 'text-gray-600 dark:text-gray-400')}>
                    {label || 'Loading...'}
                </span>
            )}
        </div>
    );

    if (overlay) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ backgroundColor: overlayColor }}
            >
                {content}
            </div>
        );
    }

    return content;
};

export default LoadingSpinner;

