import React, { useState } from 'react';
import { clsx } from 'clsx';

export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
    separator?: boolean;
}

export interface SelectGroup {
    label: string;
    options: SelectOption[];
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    /**
     * Label text displayed above the select
     */
    label?: string;
    /**
     * Helper text displayed below the select
     */
    helperText?: string;
    /**
     * Error message displayed below the select (overrides helperText)
     */
    error?: string;
    /**
     * Success message displayed below the select
     */
    success?: string;
    /**
     * Warning message displayed below the select
     */
    warning?: string;
    /**
     * Whether the field is required
     */
    required?: boolean;
    /**
     * Size of the select
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Variant style of the select
     */
    variant?: 'default' | 'error' | 'success' | 'warning';
    /**
     * Style variant: 'outlined' (default), 'filled', or 'floating-label'
     */
    styleVariant?: 'outlined' | 'filled' | 'floating-label';
    /**
     * Icon element to display on the left side
     */
    leftIcon?: React.ReactNode;
    /**
     * Icon element to display on the right side
     */
    rightIcon?: React.ReactNode;
    /**
     * Whether the select should take full width
     */
    fullWidth?: boolean;
    /**
     * Whether to allow multiple selections
     */
    multiple?: boolean;
    /**
     * Show separator option (horizontal line)
     */
    showSeparator?: boolean;
    /**
     * Options array for simple select
     */
    options?: SelectOption[];
    /**
     * Grouped options array
     */
    groups?: SelectGroup[];
    /**
     * Placeholder text when no option is selected
     */
    placeholder?: string;
}

/**
 * Select component with label and helper text support
 */
export const Select: React.FC<SelectProps> = ({
    label,
    helperText,
    error,
    success,
    warning,
    required = false,
    size = 'medium',
    variant,
    styleVariant = 'outlined',
    leftIcon,
    rightIcon,
    fullWidth = false,
    multiple = false,
    showSeparator = false,
    options = [],
    groups = [],
    placeholder,
    className = '',
    disabled,
    id,
    value,
    children,
    ...props
}) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!error || variant === 'error';
    const hasSuccess = !!success || variant === 'success';
    const hasWarning = !!warning || variant === 'warning';
    const isFloatingLabel = styleVariant === 'floating-label';
    const isFilled = styleVariant === 'filled';
    const hasValue = value !== undefined && value !== null && value !== '';
    const isFloatingLabelActive = isFloatingLabel && (hasValue || isFocused);

    // Determine variant based on error/success/warning
    const selectVariant = hasError ? 'error' : hasSuccess ? 'success' : hasWarning ? 'warning' : variant || 'default';

    // Size classes
    const sizeClasses = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-5 py-3 text-lg',
    };

    // Style variant classes
    const styleVariantClasses = {
        outlined: {
            default: clsx(
                'border-gray-300 bg-white text-gray-900',
                'focus:border-blue-500 focus:ring-blue-500',
                'disabled:bg-gray-50 disabled:text-gray-500'
            ),
            error: clsx(
                'border-red-500 bg-white text-gray-900',
                'focus:border-red-600 focus:ring-red-500',
                'disabled:bg-gray-50 disabled:text-gray-500'
            ),
            success: clsx(
                'border-green-500 bg-white text-gray-900',
                'focus:border-green-600 focus:ring-green-500',
                'disabled:bg-gray-50 disabled:text-gray-500'
            ),
            warning: clsx(
                'border-yellow-500 bg-white text-gray-900',
                'focus:border-yellow-600 focus:ring-yellow-500',
                'disabled:bg-gray-50 disabled:text-gray-500'
            ),
        },
        filled: {
            default: clsx(
                'border-0 border-b-2 border-gray-300 bg-gray-50 text-gray-900 rounded-t-lg',
                'focus:border-blue-500 focus:bg-gray-100 focus:ring-0',
                'disabled:bg-gray-50 disabled:text-gray-500'
            ),
            error: clsx(
                'border-0 border-b-2 border-red-500 bg-red-50 text-gray-900 rounded-t-lg',
                'focus:border-red-600 focus:bg-red-100 focus:ring-0',
                'disabled:bg-gray-50 disabled:text-gray-500'
            ),
            success: clsx(
                'border-0 border-b-2 border-green-500 bg-green-50 text-gray-900 rounded-t-lg',
                'focus:border-green-600 focus:bg-green-100 focus:ring-0',
                'disabled:bg-gray-50 disabled:text-gray-500'
            ),
            warning: clsx(
                'border-0 border-b-2 border-yellow-500 bg-yellow-50 text-gray-900 rounded-t-lg',
                'focus:border-yellow-600 focus:bg-yellow-100 focus:ring-0',
                'disabled:bg-gray-50 disabled:text-gray-500'
            ),
        },
        'floating-label': {
            default: clsx(
                'border-gray-300 bg-white text-gray-900',
                'focus:border-blue-500 focus:ring-blue-500',
                'disabled:bg-gray-50 disabled:text-gray-500'
            ),
            error: clsx(
                'border-red-500 bg-white text-gray-900',
                'focus:border-red-600 focus:ring-red-500',
                'disabled:bg-gray-50 disabled:text-gray-500'
            ),
            success: clsx(
                'border-green-500 bg-white text-gray-900',
                'focus:border-green-600 focus:ring-green-500',
                'disabled:bg-gray-50 disabled:text-gray-500'
            ),
            warning: clsx(
                'border-yellow-500 bg-white text-gray-900',
                'focus:border-yellow-600 focus:ring-yellow-500',
                'disabled:bg-gray-50 disabled:text-gray-500'
            ),
        },
    };

    // Variant classes based on style variant
    const variantClasses = styleVariantClasses[styleVariant][selectVariant];

    // Base select classes
    const baseSelectClasses = [
        'w-full',
        !isFilled && 'border',
        !isFilled && 'rounded-lg',
        isFilled && 'rounded-t-lg',
        'transition-all',
        'duration-200',
        'outline-none',
        !isFilled && 'focus:ring-2',
        'focus:ring-offset-0',
        'appearance-none',
        'bg-no-repeat',
        'bg-right',
        'pr-10',
        'cursor-pointer',
        'disabled:cursor-not-allowed',
        'disabled:border-gray-200',
        sizeClasses[size],
        variantClasses,
        isFloatingLabel && hasValue && 'pt-6',
        isFloatingLabel && !hasValue && 'pt-6',
    ];

    const selectClasses = clsx(
        baseSelectClasses,
        leftIcon && 'pl-10',
        rightIcon && 'pr-12',
        !rightIcon && 'pr-10',
        className
    );

    // Label classes
    const labelClasses = clsx(
        isFloatingLabel
            ? clsx(
                'absolute left-4 transition-all duration-200 pointer-events-none z-10',
                isFloatingLabelActive
                    ? 'top-2 text-xs'
                    : 'top-1/2 -translate-y-1/2 text-base',
                isFloatingLabelActive && hasError
                    ? 'text-red-500'
                    : isFloatingLabelActive && hasSuccess
                        ? 'text-green-500'
                        : isFloatingLabelActive && hasWarning
                            ? 'text-yellow-500'
                            : isFloatingLabelActive
                                ? 'text-blue-500'
                                : hasError
                                    ? 'text-red-500'
                                    : hasSuccess
                                        ? 'text-green-500'
                                        : hasWarning
                                            ? 'text-yellow-500'
                                            : 'text-gray-500'
            )
            : clsx(
                'block text-sm font-medium mb-1.5',
                hasError ? 'text-red-700' : hasSuccess ? 'text-green-700' : hasWarning ? 'text-yellow-700' : 'text-gray-700',
                disabled && 'text-gray-400'
            )
    );

    // Message classes
    const messageClasses = {
        error: 'text-red-600 text-sm mt-1.5',
        success: 'text-green-600 text-sm mt-1.5',
        warning: 'text-yellow-600 text-sm mt-1.5',
        helper: 'text-gray-500 text-sm mt-1.5',
    };

    const messageText = error || success || warning || helperText;
    const messageType = error ? 'error' : success ? 'success' : warning ? 'warning' : 'helper';

    // Render options
    const renderOptions = () => {
        if (children) {
            return children;
        }

        const optionElements: React.ReactNode[] = [];

        if (placeholder && !multiple) {
            optionElements.push(
                <option key="placeholder" value="" disabled>
                    {placeholder}
                </option>
            );
        }

        if (groups.length > 0) {
            groups.forEach((group, groupIndex) => {
                optionElements.push(
                    <optgroup key={`group-${groupIndex}`} label={group.label}>
                        {group.options.map((option, optIndex) => {
                            if (option.separator || (showSeparator && optIndex > 0 && optIndex % 3 === 0)) {
                                return (
                                    <option key={`separator-${optIndex}`} disabled style={{ borderTop: '1px solid #e5e7eb' }}>
                                        ─────────────────
                                    </option>
                                );
                            }
                            return (
                                <option key={option.value} value={option.value} disabled={option.disabled}>
                                    {option.label}
                                </option>
                            );
                        })}
                    </optgroup>
                );
            });
        } else if (options.length > 0) {
            options.forEach((option, optIndex) => {
                if (option.separator || (showSeparator && optIndex > 0 && optIndex % 3 === 0)) {
                    optionElements.push(
                        <option key={`separator-${optIndex}`} disabled style={{ borderTop: '1px solid #e5e7eb' }}>
                            ─────────────────
                        </option>
                    );
                } else {
                    optionElements.push(
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    );
                }
            });
        }

        return optionElements;
    };

    return (
        <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
            {label && !isFloatingLabel && (
                <label htmlFor={selectId} className={labelClasses}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {isFloatingLabel && label && (
                    <label htmlFor={selectId} className={labelClasses}>
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                {leftIcon && (
                    <div className={clsx('absolute text-gray-400 pointer-events-none z-10', isFloatingLabel && label ? 'left-4 top-4' : 'left-3 top-1/2 -translate-y-1/2')}>
                        {leftIcon}
                    </div>
                )}
                <select
                    id={selectId}
                    className={selectClasses}
                    disabled={disabled}
                    multiple={multiple}
                    aria-invalid={hasError}
                    aria-describedby={messageText ? `${selectId}-message` : undefined}
                    value={value}
                    {...(multiple && { size: size === 'small' ? 4 : size === 'large' ? 6 : 5 })}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    style={{
                        backgroundImage: multiple
                            ? 'none'
                            : `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: multiple ? 'unset' : 'right 0.5rem center',
                        backgroundSize: multiple ? 'unset' : '1.5em 1.5em',
                        paddingRight: multiple ? undefined : rightIcon ? '3rem' : '2.5rem',
                    }}
                    {...props}
                >
                    {renderOptions()}
                </select>
                {rightIcon && !multiple && (
                    <div className={clsx('absolute text-gray-400 pointer-events-none z-10', isFloatingLabel && label ? 'right-12 top-4' : 'right-12 top-1/2 -translate-y-1/2')}>
                        {rightIcon}
                    </div>
                )}
            </div>
            {messageText && (
                <span id={`${selectId}-message`} className={messageClasses[messageType]} role={hasError ? 'alert' : undefined}>
                    {messageText}
                </span>
            )}
        </div>
    );
};

export default Select;

