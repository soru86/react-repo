import React, { useRef, useId } from 'react';
import { clsx } from 'clsx';

export interface ToggleSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * Label text
   */
  label?: string;
  /**
   * Helper text displayed below the toggle
   */
  helperText?: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Size of the toggle switch
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /**
   * Label position
   */
  labelPosition?: 'left' | 'right';
  /**
   * Custom icon for checked state
   */
  checkedIcon?: React.ReactNode;
  /**
   * Custom icon for unchecked state
   */
  uncheckedIcon?: React.ReactNode;
  /**
   * Whether to show icons
   */
  showIcons?: boolean;
  /**
   * Whether toggle is disabled
   */
  disabled?: boolean;
  /**
   * Additional className for the container
   */
  containerClassName?: string;
  /**
   * Whether toggle is loading
   */
  isLoading?: boolean;
  /**
   * Custom width (for custom sizing)
   */
  customWidth?: number | string;
  /**
   * Custom height (for custom sizing)
   */
  customHeight?: number | string;
}

/**
 * ToggleSwitch Component
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  helperText,
  error,
  size = 'medium',
  variant = 'default',
  labelPosition = 'right',
  checkedIcon,
  uncheckedIcon,
  showIcons = false,
  disabled = false,
  containerClassName,
  className,
  checked,
  onChange,
  isLoading = false,
  customWidth,
  customHeight,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const { id: propId, ...inputProps } = props;
  const inputId = propId || generatedId;

  // Size classes
  const sizeClasses = {
    small: {
      track: 'w-9 h-5',
      thumb: 'w-4 h-4',
      label: 'text-sm',
      helper: 'text-xs',
      icon: 'w-3 h-3',
    },
    medium: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      label: 'text-base',
      helper: 'text-sm',
      icon: 'w-4 h-4',
    },
    large: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      label: 'text-lg',
      helper: 'text-base',
      icon: 'w-5 h-5',
    },
  };

  // Variant classes
  const variantClasses = {
    default: {
      checked: 'bg-gray-600 dark:bg-gray-500',
      unchecked: 'bg-gray-300 dark:bg-gray-600',
      thumb: 'bg-white',
    },
    primary: {
      checked: 'bg-blue-600 dark:bg-blue-500',
      unchecked: 'bg-gray-300 dark:bg-gray-600',
      thumb: 'bg-white',
    },
    success: {
      checked: 'bg-green-600 dark:bg-green-500',
      unchecked: 'bg-gray-300 dark:bg-gray-600',
      thumb: 'bg-white',
    },
    warning: {
      checked: 'bg-yellow-500 dark:bg-yellow-400',
      unchecked: 'bg-gray-300 dark:bg-gray-600',
      thumb: 'bg-white',
    },
    danger: {
      checked: 'bg-red-600 dark:bg-red-500',
      unchecked: 'bg-gray-300 dark:bg-gray-600',
      thumb: 'bg-white',
    },
  };

  const sizes = sizeClasses[size];
  const variants = variantClasses[variant];

  // Default icons
  const defaultCheckedIcon = (
    <svg className={sizes.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const defaultUncheckedIcon = (
    <svg className={sizes.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const displayCheckedIcon = checkedIcon || defaultCheckedIcon;
  const displayUncheckedIcon = uncheckedIcon || defaultUncheckedIcon;

  const isChecked = checked || false;
  const hasError = !!error;

  // Custom dimensions
  const trackStyle: React.CSSProperties = {};
  const thumbStyle: React.CSSProperties = {};

  if (customWidth) {
    trackStyle.width = typeof customWidth === 'number' ? `${customWidth}px` : customWidth;
  }
  if (customHeight) {
    trackStyle.height = typeof customHeight === 'number' ? `${customHeight}px` : customHeight;
    // Calculate thumb size based on height (thumb should be slightly smaller)
    const heightValue = typeof customHeight === 'number' ? customHeight : parseInt(customHeight.toString().replace('px', ''));
    thumbStyle.width = `${heightValue - 4}px`;
    thumbStyle.height = `${heightValue - 4}px`;
  }

  const trackClasses = clsx(
    'relative inline-block rounded-full transition-colors duration-200 ease-in-out focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
    sizes.track,
    isChecked ? variants.checked : variants.unchecked,
    disabled && 'opacity-50 cursor-not-allowed',
    hasError && !isChecked && 'border-2 border-red-500',
    isLoading && 'opacity-75 cursor-wait'
  );

  const thumbClasses = clsx(
    'absolute top-0.5 rounded-full transition-all duration-200 ease-in-out',
    sizes.thumb,
    variants.thumb,
    showIcons && 'flex items-center justify-center',
    'shadow-sm'
  );

  // Calculate thumb position based on size
  const getThumbPosition = () => {
    if (isChecked) {
      if (customWidth && customHeight) {
        const widthValue = typeof customWidth === 'number' ? customWidth : parseInt(customWidth.toString().replace('px', ''));
        const heightValue = typeof customHeight === 'number' ? customHeight : parseInt(customHeight.toString().replace('px', ''));
        const thumbSize = heightValue - 4;
        return `${widthValue - thumbSize - 2}px`;
      }
      // Default positions for each size (track width - thumb width - padding)
      if (size === 'small') {
        return 'calc(100% - 1rem - 2px)'; // 36px track - 16px thumb - 2px padding
      } else if (size === 'large') {
        return 'calc(100% - 1.5rem - 2px)'; // 56px track - 24px thumb - 2px padding
      } else {
        return 'calc(100% - 1.25rem - 2px)'; // 44px track - 20px thumb - 2px padding
      }
    }
    return '2px';
  };

  thumbStyle.left = getThumbPosition();

  const labelClasses = clsx(
    sizes.label,
    'font-medium select-none',
    disabled ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300',
    labelPosition === 'left' && 'mr-3',
    labelPosition === 'right' && 'ml-3'
  );

  return (
    <div className={clsx('flex flex-col', containerClassName)}>
      <div className="flex items-center">
        {label && labelPosition === 'left' && (
          <label
            htmlFor={inputId}
            className={clsx(labelClasses, !disabled && 'cursor-pointer')}
          >
            {label}
          </label>
        )}

        <div className="relative inline-flex items-center">
          <input
            ref={inputRef}
            type="checkbox"
            role="switch"
            aria-checked={isChecked}
            id={inputId}
            checked={isChecked}
            disabled={disabled || isLoading}
            onChange={onChange}
            className="sr-only"
            {...inputProps}
          />
          <label
            htmlFor={inputId}
            className={clsx(
              trackClasses,
              !disabled && !isLoading && 'cursor-pointer',
              className
            )}
            style={trackStyle}
          >
            <span
              className={thumbClasses}
              style={thumbStyle}
            >
              {showIcons && (
                <span
                  className={clsx(
                    'flex items-center justify-center transition-colors duration-200',
                    // When checked, use variant color (visible on white thumb)
                    // When unchecked, use gray (visible on gray track)
                    isChecked
                      ? variant === 'default'
                        ? 'text-gray-700 dark:text-gray-800'
                        : variant === 'primary'
                        ? 'text-blue-600 dark:text-blue-700'
                        : variant === 'success'
                        ? 'text-green-600 dark:text-green-700'
                        : variant === 'warning'
                        ? 'text-yellow-600 dark:text-yellow-700'
                        : 'text-red-600 dark:text-red-700'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {isChecked ? displayCheckedIcon : displayUncheckedIcon}
                </span>
              )}
            </span>
          </label>
        </div>

        {label && labelPosition === 'right' && (
          <label
            htmlFor={inputId}
            className={clsx(labelClasses, !disabled && 'cursor-pointer')}
          >
            {label}
          </label>
        )}
      </div>

      {(helperText || error) && (
        <span
          className={clsx(
            sizes.helper,
            'mt-1',
            labelPosition === 'left' ? 'ml-0' : labelPosition === 'right' ? 'ml-0' : 'ml-0',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export default ToggleSwitch;

