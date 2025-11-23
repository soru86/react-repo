import React from 'react';
import { clsx } from 'clsx';

export type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type ChipSize = 'small' | 'medium' | 'large';
export type ChipShape = 'rounded' | 'pill' | 'square';

export interface ChipProps {
    /**
     * Chip label/content
     */
    label: string;
    /**
     * Variant/color theme
     */
    variant?: ChipVariant;
    /**
     * Size
     */
    size?: ChipSize;
    /**
     * Shape style
     */
    shape?: ChipShape;
    /**
     * Show delete icon
     */
    deletable?: boolean;
    /**
     * Callback when delete is clicked
     */
    onDelete?: () => void;
    /**
     * Icon on the left
     */
    icon?: React.ReactNode;
    /**
     * Avatar/image on the left
     */
    avatar?: React.ReactNode;
    /**
     * Badge/count number
     */
    badge?: number | string;
    /**
     * Whether chip is disabled
     */
    disabled?: boolean;
    /**
     * Whether chip is clickable
     */
    clickable?: boolean;
    /**
     * Click handler
     */
    onClick?: () => void;
    /**
     * Outlined style (transparent background with border)
     */
    outlined?: boolean;
    /**
     * Custom color (overrides variant)
     */
    color?: string;
    /**
     * Custom className
     */
    className?: string;
}

/**
 * Chip Component
 */
export const Chip: React.FC<ChipProps> = ({
    label,
    variant = 'default',
    size = 'medium',
    shape = 'rounded',
    deletable = false,
    onDelete,
    icon,
    avatar,
    badge,
    disabled = false,
    clickable = false,
    onClick,
    outlined = false,
    color,
    className,
}) => {
    // Variant colors
    const variantColors: Record<ChipVariant, { bg: string; text: string; border: string; hover: string; delete: string }> = {
        default: {
            bg: 'bg-gray-100 dark:bg-gray-700',
            text: 'text-gray-800 dark:text-gray-200',
            border: 'border-gray-300 dark:border-gray-600',
            hover: 'hover:bg-gray-200 dark:hover:bg-gray-600',
            delete: 'text-gray-500 dark:text-gray-400',
        },
        primary: {
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            text: 'text-blue-800 dark:text-blue-200',
            border: 'border-blue-300 dark:border-blue-700',
            hover: 'hover:bg-blue-200 dark:hover:bg-blue-900/50',
            delete: 'text-blue-600 dark:text-blue-400',
        },
        success: {
            bg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-800 dark:text-green-200',
            border: 'border-green-300 dark:border-green-700',
            hover: 'hover:bg-green-200 dark:hover:bg-green-900/50',
            delete: 'text-green-600 dark:text-green-400',
        },
        warning: {
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
            text: 'text-yellow-800 dark:text-yellow-200',
            border: 'border-yellow-300 dark:border-yellow-700',
            hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-900/50',
            delete: 'text-yellow-600 dark:text-yellow-400',
        },
        error: {
            bg: 'bg-red-100 dark:bg-red-900/30',
            text: 'text-red-800 dark:text-red-200',
            border: 'border-red-300 dark:border-red-700',
            hover: 'hover:bg-red-200 dark:hover:bg-red-900/50',
            delete: 'text-red-600 dark:text-red-400',
        },
        info: {
            bg: 'bg-cyan-100 dark:bg-cyan-900/30',
            text: 'text-cyan-800 dark:text-cyan-200',
            border: 'border-cyan-300 dark:border-cyan-700',
            hover: 'hover:bg-cyan-200 dark:hover:bg-cyan-900/50',
            delete: 'text-cyan-600 dark:text-cyan-400',
        },
    };

    // Size styles
    const sizeStyles: Record<ChipSize, { padding: string; text: string; icon: string; avatar: string }> = {
        small: {
            padding: 'px-2 py-0.5',
            text: 'text-xs',
            icon: 'w-3 h-3',
            avatar: 'w-4 h-4',
        },
        medium: {
            padding: 'px-3 py-1',
            text: 'text-sm',
            icon: 'w-4 h-4',
            avatar: 'w-5 h-5',
        },
        large: {
            padding: 'px-4 py-1.5',
            text: 'text-base',
            icon: 'w-5 h-5',
            avatar: 'w-6 h-6',
        },
    };

    // Shape styles
    const shapeStyles: Record<ChipShape, string> = {
        rounded: 'rounded-md',
        pill: 'rounded-full',
        square: 'rounded-none',
    };

    const colors = variantColors[variant];
    const sizes = sizeStyles[size];
    const shapeStyle = shapeStyles[shape];

    // Custom color styles
    const customColorStyle = color
        ? {
            backgroundColor: outlined ? 'transparent' : color,
            color: outlined ? color : '#ffffff',
            borderColor: color,
        }
        : {};

    const baseClasses = clsx(
        'inline-flex items-center gap-1.5 font-medium transition-colors',
        sizes.padding,
        sizes.text,
        shapeStyle,
        !outlined && !color && colors.bg,
        !outlined && !color && colors.text,
        outlined && !color && 'border bg-transparent',
        outlined && !color && colors.border,
        outlined && !color && colors.text,
        clickable && !disabled && !outlined && !color && colors.hover,
        clickable && !disabled && 'cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
    );

    const handleClick = () => {
        if (!disabled && clickable && onClick) {
            onClick();
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!disabled && onDelete) {
            onDelete();
        }
    };

    const Component = (deletable || clickable) ? 'button' : 'span';

    const baseProps = {
        className: baseClasses,
        style: customColorStyle,
        onClick: handleClick,
    };

    const clickableProps = clickable
        ? {
            role: 'button' as const,
            tabIndex: disabled ? undefined : 0,
            onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
                if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick?.();
                }
            },
        }
        : {};

    return (
        <Component {...baseProps} {...clickableProps}>
            {/* Avatar */}
            {avatar && (
                <span className={clsx('flex-shrink-0', sizes.avatar, shape === 'pill' && 'rounded-full', shape !== 'pill' && 'rounded')}>
                    {avatar}
                </span>
            )}

            {/* Icon */}
            {icon && !avatar && (
                <span className={clsx('flex-shrink-0', sizes.icon)}>{icon}</span>
            )}

            {/* Label */}
            <span>{label}</span>

            {/* Badge */}
            {badge !== undefined && (
                <span
                    className={clsx(
                        'flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-semibold',
                        outlined || color
                            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                            : variant === 'default'
                                ? 'bg-gray-600 dark:bg-gray-400 text-white'
                                : variant === 'primary'
                                    ? 'bg-blue-600 dark:bg-blue-400 text-white'
                                    : variant === 'success'
                                        ? 'bg-green-600 dark:bg-green-400 text-white'
                                        : variant === 'warning'
                                            ? 'bg-yellow-600 dark:bg-yellow-400 text-white'
                                            : variant === 'error'
                                                ? 'bg-red-600 dark:bg-red-400 text-white'
                                                : 'bg-cyan-600 dark:bg-cyan-400 text-white'
                    )}
                >
                    {badge}
                </span>
            )}

            {/* Delete icon */}
            {deletable && (
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={disabled}
                    className={clsx(
                        'flex-shrink-0 ml-1 -mr-1 p-0.5 rounded-full transition-colors',
                        !color && colors.delete,
                        !disabled && 'hover:bg-black/10 dark:hover:bg-white/10',
                        disabled && 'cursor-not-allowed'
                    )}
                    style={color ? { color: outlined ? color : '#ffffff' } : {}}
                    aria-label="Delete"
                >
                    <svg className={sizes.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </Component>
    );
};

export default Chip;

