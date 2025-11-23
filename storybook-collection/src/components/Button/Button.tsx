import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'as'> {
    /**
     * The variant style of the button
     */
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    /**
     * The size of the button
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Whether the button should take full width
     */
    fullWidth?: boolean;
    /**
     * Whether the button is in loading state
     */
    isLoading?: boolean;
    /**
     * Whether to use outlined style (transparent background with border)
     */
    outlined?: boolean;
    /**
     * Icon element to display (for icon + text or icon only buttons)
     */
    icon?: React.ReactNode;
    /**
     * Position of the icon relative to text
     */
    iconPosition?: 'left' | 'right';
    /**
     * Whether to show only icon (hides text)
     */
    iconOnly?: boolean;
    /**
     * Whether the button is floating (for FAB style)
     */
    floating?: boolean;
    /**
     * Badge content to display on the button
     */
    badge?: string | number;
    /**
     * Render as a link instead of button
     */
    as?: 'button' | 'a';
    /**
     * href for link variant
     */
    href?: string;
    /**
     * The content of the button
     */
    children?: React.ReactNode;
}

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    isLoading = false,
    icon,
    iconPosition = 'left',
    iconOnly = false,
    floating = false,
    badge,
    outlined = false,
    as = 'button',
    href,
    children,
    disabled,
    className = '',
    ...props
}) => {
    // Base classes
    const baseClasses = [
        'font-inherit',
        'font-medium',
        'border-none',
        'rounded-lg',
        'cursor-pointer',
        'transition-all',
        'duration-200',
        'ease-in-out',
        'inline-flex',
        'items-center',
        'justify-center',
        'gap-2',
        'relative',
        'no-underline',
        'outline-none',
        'shadow-sm',
        'focus-visible:outline-2',
        'focus-visible:outline',
        'focus-visible:outline-offset-2',
        'focus-visible:outline-current',
        'disabled:opacity-60',
        'disabled:cursor-not-allowed',
    ];

    // Size classes
    const sizeClasses = {
        small: iconOnly
            ? 'p-1.5 min-h-8'
            : 'px-3 py-1.5 text-sm min-h-8',
        medium: iconOnly
            ? 'p-2.5 min-h-10'
            : 'px-5 py-2.5 text-base min-h-10',
        large: iconOnly
            ? 'p-3.5 min-h-12'
            : 'px-7 py-3.5 text-lg min-h-12',
    };

    // Variant classes - using arbitrary values for custom colors
    const variantClasses = {
        primary: outlined
            ? 'bg-transparent border-2 border-[#007bff] text-[#007bff] hover:bg-[#007bff] hover:text-white active:bg-[#004085]'
            : 'bg-[#007bff] text-white hover:bg-[#0056b3] active:bg-[#004085] hover:shadow-lg hover:shadow-[#007bff]/30 active:translate-y-px',
        secondary: outlined
            ? 'bg-transparent border-2 border-[#6c757d] text-[#6c757d] hover:bg-[#6c757d] hover:text-white active:bg-[#3e444a]'
            : 'bg-[#6c757d] text-white hover:bg-[#545b62] active:bg-[#3e444a] hover:shadow-lg hover:shadow-[#6c757d]/30 active:translate-y-px',
        success: outlined
            ? 'bg-transparent border-2 border-[#28a745] text-[#28a745] hover:bg-[#28a745] hover:text-white active:bg-[#1e7e34]'
            : 'bg-[#28a745] text-white hover:bg-[#218838] active:bg-[#1e7e34] hover:shadow-lg hover:shadow-[#28a745]/30 active:translate-y-px',
        danger: outlined
            ? 'bg-transparent border-2 border-[#dc3545] text-[#dc3545] hover:bg-[#dc3545] hover:text-white active:bg-[#bd2130]'
            : 'bg-[#dc3545] text-white hover:bg-[#c82333] active:bg-[#bd2130] hover:shadow-lg hover:shadow-[#dc3545]/30 active:translate-y-px',
        warning: outlined
            ? 'bg-transparent border-2 border-[#ffc107] text-[#ffc107] hover:bg-[#ffc107] hover:text-gray-900 active:bg-[#d39e00]'
            : 'bg-[#ffc107] text-gray-900 hover:bg-[#e0a800] active:bg-[#d39e00] hover:shadow-lg hover:shadow-[#ffc107]/30 active:translate-y-px',
        info: outlined
            ? 'bg-transparent border-2 border-[#17a2b8] text-[#17a2b8] hover:bg-[#17a2b8] hover:text-white active:bg-[#117a8b]'
            : 'bg-[#17a2b8] text-white hover:bg-[#138496] active:bg-[#117a8b] hover:shadow-lg hover:shadow-[#17a2b8]/30 active:translate-y-px',
    };

    // Floating button classes
    const floatingClasses = floating
        ? [
            'absolute',
            'bottom-6',
            'right-6',
            'rounded-full',
            'shadow-lg',
            'z-[1000]',
            'hover:shadow-xl',
            'hover:-translate-y-0.5',
            iconOnly
                ? [
                    'p-0',
                    size === 'small' ? 'w-10 h-10' : size === 'large' ? 'w-16 h-16' : 'w-14 h-14',
                  ]
                : [
                    'px-4',
                    size === 'small' ? 'py-2 text-sm' : size === 'large' ? 'py-4 text-lg' : 'py-3 text-base',
                    'h-auto',
                    'min-h-fit',
                  ],
          ].flat()
        : [];

    // Full width class
    const fullWidthClass = fullWidth ? 'w-full' : '';

    // Loading state class
    const loadingClass = isLoading ? 'pointer-events-none' : '';

    // Icon only class
    const iconOnlyClass = iconOnly ? 'aspect-square' : '';

    const buttonClasses = clsx(
        baseClasses,
        // Don't apply size classes to floating buttons with text (they have their own sizing)
        !floating || iconOnly ? sizeClasses[size] : '',
        variantClasses[variant],
        floatingClasses,
        fullWidthClass,
        loadingClass,
        iconOnlyClass,
        className
    );

    const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
    const iconElement = icon && React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any>, { size: iconSize })
        : icon;

    const content = (
        <>
            {isLoading && (
                <span
                    className={clsx(
                        'absolute border-2 border-current border-t-transparent rounded-full animate-spin',
                        size === 'small' ? 'w-3 h-3' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4'
                    )}
                    aria-hidden="true"
                />
            )}
            <span className={clsx(isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-200')}>
                {icon && iconPosition === 'left' && !iconOnly && (
                    <span className="inline-flex items-center shrink-0 mr-2">{iconElement}</span>
                )}
                {!iconOnly && children && <span className="inline-block">{children}</span>}
                {icon && iconPosition === 'right' && !iconOnly && (
                    <span className="inline-flex items-center shrink-0 ml-2">{iconElement}</span>
                )}
                {iconOnly && icon && <span className="inline-flex items-center shrink-0">{iconElement}</span>}
            </span>
            {badge !== undefined && badge !== null && (
                <span
                    className={clsx(
                        'absolute bg-[#dc3545] text-white rounded-[10px] font-semibold text-center shadow-md',
                        floating
                            ? 'top-0 right-0'
                            : size === 'small'
                                ? '-top-1.5 -right-1.5 text-[10px] px-1.5 py-0.5 min-w-4'
                                : size === 'large'
                                    ? '-top-2.5 -right-2.5 text-xs px-1.5 py-1 min-w-5'
                                    : '-top-2 -right-2 text-[11px] px-1.5 py-0.5 min-w-[18px]'
                    )}
                    aria-label={`Badge: ${badge}`}
                >
                    {badge}
                </span>
            )}
        </>
    );

    if (as === 'a' || href) {
        return (
            <a
                className={buttonClasses}
                href={href}
                {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            className={buttonClasses}
            disabled={disabled || isLoading}
            {...props}
        >
            {content}
        </button>
    );
};

export default Button;
