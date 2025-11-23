import React, { useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * Label text
   */
  label?: string;
  /**
   * Helper text displayed below the checkbox
   */
  helperText?: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Size of the checkbox
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Shape variant
   */
  shape?: 'square' | 'rounded' | 'circle';
  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /**
   * Indeterminate state (partially checked)
   */
  indeterminate?: boolean;
  /**
   * Label position
   */
  labelPosition?: 'left' | 'right';
  /**
   * Additional className for the container
   */
  containerClassName?: string;
}

/**
 * Checkbox component with various variants
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  helperText,
  error,
  size = 'medium',
  shape = 'square',
  variant = 'default',
  indeterminate = false,
  labelPosition = 'right',
  containerClassName,
  className,
  checked,
  disabled,
  onChange,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Set indeterminate state
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  // Handle change event - ensure onChange is called
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  // Size classes
  const sizeClasses = {
    small: {
      checkbox: 'w-4 h-4',
      label: 'text-sm',
      helper: 'text-xs',
    },
    medium: {
      checkbox: 'w-5 h-5',
      label: 'text-base',
      helper: 'text-sm',
    },
    large: {
      checkbox: 'w-6 h-6',
      label: 'text-lg',
      helper: 'text-base',
    },
  };

  // Shape classes
  const shapeClasses = {
    square: 'rounded',
    rounded: 'rounded-md',
    circle: 'rounded-full',
  };

  // Color classes
  const colorClasses = {
    default: {
      checked: 'bg-gray-900 border-gray-900',
      unchecked: 'border-gray-300',
      hover: 'hover:border-gray-400',
      focus: 'focus:ring-gray-500',
      indeterminate: 'bg-gray-900 border-gray-900',
    },
    primary: {
      checked: 'bg-blue-600 border-blue-600',
      unchecked: 'border-gray-300',
      hover: 'hover:border-blue-400',
      focus: 'focus:ring-blue-500',
      indeterminate: 'bg-blue-600 border-blue-600',
    },
    success: {
      checked: 'bg-green-600 border-green-600',
      unchecked: 'border-gray-300',
      hover: 'hover:border-green-400',
      focus: 'focus:ring-green-500',
      indeterminate: 'bg-green-600 border-green-600',
    },
    warning: {
      checked: 'bg-yellow-500 border-yellow-500',
      unchecked: 'border-gray-300',
      focus: 'focus:ring-yellow-500',
      hover: 'hover:border-yellow-400',
      indeterminate: 'bg-yellow-500 border-yellow-500',
    },
    danger: {
      checked: 'bg-red-600 border-red-600',
      unchecked: 'border-gray-300',
      hover: 'hover:border-red-400',
      focus: 'focus:ring-red-500',
      indeterminate: 'bg-red-600 border-red-600',
    },
  };

  const isChecked = checked || indeterminate;
  const colors = colorClasses[variant];
  const sizes = sizeClasses[size];

  const checkboxClasses = clsx(
    sizeClasses[size].checkbox,
    shapeClasses[shape],
    'border-2 transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    disabled
      ? 'opacity-50 cursor-not-allowed bg-gray-100'
      : isChecked
      ? `${colors.checked} ${colors.focus}`
      : `${colors.unchecked} ${colors.hover} ${colors.focus}`,
    className
  );

  const labelClasses = clsx(
    sizes.label,
    'font-medium',
    disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700',
    'select-none'
  );

  const hasError = !!error;

  return (
    <div className={clsx('flex flex-col', containerClassName)}>
      <div className="flex items-start gap-2">
        {label && labelPosition === 'left' && (
          <label
            htmlFor={props.id}
            className={clsx(labelClasses, 'cursor-pointer', disabled && 'cursor-not-allowed')}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center justify-center">
          <input
            ref={inputRef}
            type="checkbox"
            {...props}
            {...(checked !== undefined ? { checked } : {})}
            disabled={disabled}
            onChange={handleChange}
            className={clsx(
              checkboxClasses,
              'appearance-none cursor-pointer',
              disabled && 'cursor-not-allowed',
              hasError && 'border-red-500 focus:ring-red-500'
            )}
            aria-invalid={hasError}
            aria-describedby={helperText || error ? `${props.id}-helper` : undefined}
          />
          {/* Checkmark icon */}
          {isChecked && !indeterminate && (
            <svg
              className={clsx(
                'absolute pointer-events-none',
                'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                size === 'small' ? 'w-2.5 h-2.5' : 
                size === 'large' ? 'w-4 h-4' : 
                'w-3 h-3'
              )}
              fill="none"
              stroke="white"
              strokeWidth={size === 'small' ? 2.5 : size === 'large' ? 3 : 2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {/* Indeterminate icon */}
          {indeterminate && (
            <svg
              className={clsx(
                'absolute pointer-events-none',
                'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                size === 'small' ? 'w-2.5 h-2.5' : 
                size === 'large' ? 'w-4 h-4' : 
                'w-3 h-3'
              )}
              fill="none"
              stroke="white"
              strokeWidth={size === 'small' ? 2.5 : size === 'large' ? 3 : 2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          )}
        </div>
        {label && labelPosition === 'right' && (
          <label
            htmlFor={props.id}
            className={clsx(labelClasses, 'cursor-pointer', disabled && 'cursor-not-allowed')}
          >
            {label}
          </label>
        )}
      </div>
      {(helperText || error) && (
        <span
          id={props.id ? `${props.id}-helper` : undefined}
          className={clsx(
            sizes.helper,
            'mt-1',
            error ? 'text-red-600' : 'text-gray-500'
          )}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export default Checkbox;

