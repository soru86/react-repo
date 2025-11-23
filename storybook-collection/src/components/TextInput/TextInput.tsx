import React, { useState } from 'react';
import { clsx } from 'clsx';

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
    /**
     * Label text displayed above the input
     */
    label?: string;
    /**
     * Helper text displayed below the input
     */
    helperText?: string;
    /**
     * Error message displayed below the input (overrides helperText)
     */
    error?: string;
    /**
     * Success message displayed below the input
     */
    success?: string;
    /**
     * Warning message displayed below the input
     */
    warning?: string;
    /**
     * Whether the field is required
     */
    required?: boolean;
    /**
     * Size of the input
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Variant style of the input
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
     * Whether the input should take full width
     */
    fullWidth?: boolean;
    /**
     * Input type
     */
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
    /**
     * Whether to render as textarea (multiline)
     */
    multiline?: boolean;
    /**
     * Number of rows for textarea
     */
    rows?: number;
}

/**
 * Text input component with label and helper text support
 */
export const TextInput: React.FC<TextInputProps> = ({
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
    multiline = false,
    rows = 4,
    className = '',
    disabled,
    id,
    value,
    ...props
}) => {
    const inputId = id || `text-input-${Math.random().toString(36).substr(2, 9)}`;
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!error || variant === 'error';
    const hasSuccess = !!success || variant === 'success';
    const hasWarning = !!warning || variant === 'warning';
    const isFloatingLabel = styleVariant === 'floating-label';
    const isFilled = styleVariant === 'filled';
    const inputValue = value !== undefined ? value : (props as any).defaultValue;
    const hasValue = inputValue !== undefined && inputValue !== null && String(inputValue) !== '';
    const isFloatingLabelActive = isFloatingLabel && (hasValue || isFocused);

    // Determine variant based on error/success/warning
    const inputVariant = hasError ? 'error' : hasSuccess ? 'success' : hasWarning ? 'warning' : variant || 'default';

    // Size classes
    const sizeClasses = {
        small: multiline ? 'px-3 py-1.5 text-sm' : 'px-3 py-1.5 text-sm',
        medium: multiline ? 'px-4 py-2 text-base' : 'px-4 py-2 text-base',
        large: multiline ? 'px-5 py-3 text-lg' : 'px-5 py-3 text-lg',
    };

    // Style variant classes
    const styleVariantClasses = {
        outlined: {
            default: clsx(
                'border-gray-300 bg-white text-gray-900',
                'focus:border-blue-500 focus:ring-blue-500',
                'placeholder:text-gray-400'
            ),
            error: clsx(
                'border-red-500 bg-white text-gray-900',
                'focus:border-red-600 focus:ring-red-500',
                'placeholder:text-gray-400'
            ),
            success: clsx(
                'border-green-500 bg-white text-gray-900',
                'focus:border-green-600 focus:ring-green-500',
                'placeholder:text-gray-400'
            ),
            warning: clsx(
                'border-yellow-500 bg-white text-gray-900',
                'focus:border-yellow-600 focus:ring-yellow-500',
                'placeholder:text-gray-400'
            ),
        },
        filled: {
            default: clsx(
                'border-0 border-b-2 border-gray-300 bg-gray-50 text-gray-900 rounded-t-lg',
                'focus:border-blue-500 focus:bg-gray-100 focus:ring-0',
                'placeholder:text-gray-400'
            ),
            error: clsx(
                'border-0 border-b-2 border-red-500 bg-red-50 text-gray-900 rounded-t-lg',
                'focus:border-red-600 focus:bg-red-100 focus:ring-0',
                'placeholder:text-gray-400'
            ),
            success: clsx(
                'border-0 border-b-2 border-green-500 bg-green-50 text-gray-900 rounded-t-lg',
                'focus:border-green-600 focus:bg-green-100 focus:ring-0',
                'placeholder:text-gray-400'
            ),
            warning: clsx(
                'border-0 border-b-2 border-yellow-500 bg-yellow-50 text-gray-900 rounded-t-lg',
                'focus:border-yellow-600 focus:bg-yellow-100 focus:ring-0',
                'placeholder:text-gray-400'
            ),
        },
        'floating-label': {
            default: clsx(
                'border-gray-300 bg-white text-gray-900',
                'focus:border-blue-500 focus:ring-blue-500',
                'placeholder:text-transparent'
            ),
            error: clsx(
                'border-red-500 bg-white text-gray-900',
                'focus:border-red-600 focus:ring-red-500',
                'placeholder:text-transparent'
            ),
            success: clsx(
                'border-green-500 bg-white text-gray-900',
                'focus:border-green-600 focus:ring-green-500',
                'placeholder:text-transparent'
            ),
            warning: clsx(
                'border-yellow-500 bg-white text-gray-900',
                'focus:border-yellow-600 focus:ring-yellow-500',
                'placeholder:text-transparent'
            ),
        },
    };

    // Variant classes based on style variant
    const variantClasses = styleVariantClasses[styleVariant][inputVariant];

    // Base input classes
    const baseInputClasses = [
        'w-full',
        multiline ? 'resize-y' : '',
        !isFilled && 'border',
        !isFilled && 'rounded-lg',
        isFilled && 'rounded-t-lg',
        'transition-all',
        'duration-200',
        'outline-none',
        !isFilled && 'focus:ring-2',
        'focus:ring-offset-0',
        'disabled:bg-gray-50',
        'disabled:text-gray-500',
        'disabled:cursor-not-allowed',
        !isFilled && 'disabled:border-gray-200',
        'read-only:bg-gray-50',
        'read-only:cursor-default',
        sizeClasses[size],
        variantClasses,
        isFloatingLabel && hasValue && 'pt-6',
        isFloatingLabel && !hasValue && 'pt-6',
    ];

    const inputClasses = clsx(
        baseInputClasses,
        leftIcon && !multiline && 'pl-10',
        rightIcon && !multiline && 'pr-10',
        isFloatingLabel && label && 'pb-2',
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

    const InputComponent = multiline ? 'textarea' : 'input';

    return (
        <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
            {label && !isFloatingLabel && (
                <label htmlFor={inputId} className={labelClasses}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {isFloatingLabel && label && (
                    <label htmlFor={inputId} className={labelClasses}>
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                {leftIcon && !multiline && (
                    <div className={clsx('absolute text-gray-400 pointer-events-none', isFloatingLabel && label ? 'left-4 top-4' : 'left-3 top-1/2 -translate-y-1/2')}>
                        {leftIcon}
                    </div>
                )}
                {React.createElement(InputComponent, {
                    id: inputId,
                    className: inputClasses,
                    disabled,
                    'aria-invalid': hasError,
                    'aria-describedby': messageText ? `${inputId}-message` : undefined,
                    rows: multiline ? rows : undefined,
                    value,
                    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setIsFocused(true);
                        props.onFocus?.(e as any);
                    },
                    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setIsFocused(false);
                        props.onBlur?.(e as any);
                    },
                    ...props,
                } as any)}
                {rightIcon && !multiline && (
                    <div className={clsx('absolute text-gray-400 pointer-events-none', isFloatingLabel && label ? 'right-4 top-4' : 'right-3 top-1/2 -translate-y-1/2')}>
                        {rightIcon}
                    </div>
                )}
            </div>
            {messageText && (
                <span id={`${inputId}-message`} className={messageClasses[messageType]} role={hasError ? 'alert' : undefined}>
                    {messageText}
                </span>
            )}
        </div>
    );
};

export default TextInput;

