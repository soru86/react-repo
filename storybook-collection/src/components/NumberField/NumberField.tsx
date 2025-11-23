import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export interface NumberFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
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
   * Whether the input should take full width
   */
  fullWidth?: boolean;
  /**
   * Minimum value
   */
  min?: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Step value for increment/decrement
   */
  step?: number;
  /**
   * Show increment/decrement buttons
   */
  showControls?: boolean;
  /**
   * Variant type: 'default', 'spinner', or 'slider'
   */
  type?: 'default' | 'spinner' | 'slider';
  /**
   * Callback when value changes
   */
  onChange?: (value: number | undefined) => void;
}

/**
 * Number Field component with incrementer/decrementer, spinner, and slider variants
 */
export const NumberField: React.FC<NumberFieldProps> = ({
  label,
  helperText,
  error,
  success,
  warning,
  required = false,
  size = 'medium',
  variant,
  styleVariant = 'outlined',
  fullWidth = false,
  min,
  max,
  step = 1,
  showControls = false,
  type = 'default',
  className = '',
  disabled,
  id,
  value,
  defaultValue,
  onChange,
  ...props
}) => {
  const inputId = id || `number-field-${Math.random().toString(36).substr(2, 9)}`;
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState<number | undefined>(
    value !== undefined ? Number(value) : defaultValue !== undefined ? Number(defaultValue) : undefined
  );
  const [sliderValue, setSliderValue] = useState<number>(
    value !== undefined ? Number(value) : defaultValue !== undefined ? Number(defaultValue) : min || 0
  );
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const hasError = !!error || variant === 'error';
  const hasSuccess = !!success || variant === 'success';
  const hasWarning = !!warning || variant === 'warning';
  const isFloatingLabel = styleVariant === 'floating-label';
  const isFilled = styleVariant === 'filled';
  const isSlider = type === 'slider';
  const isSpinner = type === 'spinner';

  const currentValue = value !== undefined ? Number(value) : internalValue;
  const hasValue = currentValue !== undefined && currentValue !== null && !isNaN(currentValue);
  const isFloatingLabelActive = isFloatingLabel && (hasValue || isFocused);

  // Determine variant based on error/success/warning
  const inputVariant = hasError ? 'error' : hasSuccess ? 'success' : hasWarning ? 'warning' : variant || 'default';

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

  const variantClasses = styleVariantClasses[styleVariant][inputVariant];

  // Handle value change
  const handleChange = (newValue: number | undefined) => {
    let finalValue = newValue;

    if (finalValue !== undefined) {
      if (min !== undefined && finalValue < min) finalValue = min;
      if (max !== undefined && finalValue > max) finalValue = max;
    }

    setInternalValue(finalValue);
    onChange?.(finalValue);
  };

  // Handle increment
  const handleIncrement = () => {
    const current = currentValue ?? min ?? 0;
    const newValue = current + step;
    handleChange(newValue);
  };

  // Handle decrement
  const handleDecrement = () => {
    const current = currentValue ?? min ?? 0;
    const newValue = current - step;
    handleChange(newValue);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      handleChange(undefined);
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        handleChange(numValue);
      }
    }
  };

  // Slider handlers
  const handleSliderMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    isDraggingRef.current = true;
    updateSliderValue(e);
  };

  const handleSliderMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    updateSliderValue(e);
  };

  const handleSliderMouseUp = () => {
    isDraggingRef.current = false;
  };

  const updateSliderValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const range = (max ?? 100) - (min ?? 0);
    const newValue = (min ?? 0) + percentage * range;
    const steppedValue = Math.round(newValue / step) * step;
    setSliderValue(steppedValue);
    handleChange(steppedValue);
  };

  useEffect(() => {
    if (isSlider && isDraggingRef.current) {
      document.addEventListener('mousemove', handleSliderMouseMove);
      document.addEventListener('mouseup', handleSliderMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleSliderMouseMove);
        document.removeEventListener('mouseup', handleSliderMouseUp);
      };
    }
  }, [isSlider]);

  // Base input classes
  const baseInputClasses = [
    'w-full',
    'transition-all',
    'duration-200',
    'outline-none',
    !isFilled && 'border',
    // Border radius - rounded on sides without buttons
    !isFilled && !isSpinner && 'rounded-lg',
    !isFilled && isSpinner && 'rounded-none',
    isFilled && 'rounded-t-lg',
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
    // Hide native spinner arrows
    '[appearance:textfield]',
    '[&::-webkit-outer-spin-button]:appearance-none',
    '[&::-webkit-inner-spin-button]:appearance-none',
    // Padding for buttons
    showControls && !isSpinner && 'pr-20',
    isSpinner && 'pl-10 pr-10',
  ];

  const inputClasses = clsx(baseInputClasses, className);

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

  // Calculate slider percentage
  const sliderPercentage =
    min !== undefined && max !== undefined
      ? ((currentValue ?? min) - min) / (max - min)
      : currentValue !== undefined
      ? currentValue / 100
      : 0;

  if (isSlider) {
    return (
      <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <div
            ref={sliderRef}
            className={clsx(
              'relative h-2 bg-gray-200 rounded-full cursor-pointer',
              hasError && 'bg-red-100',
              hasSuccess && 'bg-green-100',
              hasWarning && 'bg-yellow-100'
            )}
            onMouseDown={handleSliderMouseDown}
          >
            <div
              className={clsx(
                'absolute h-full rounded-full transition-all duration-200',
                hasError
                  ? 'bg-red-500'
                  : hasSuccess
                  ? 'bg-green-500'
                  : hasWarning
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
              )}
              style={{ width: `${sliderPercentage * 100}%` }}
            />
            <div
              className={clsx(
                'absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing',
                hasError
                  ? 'bg-red-500'
                  : hasSuccess
                  ? 'bg-green-500'
                  : hasWarning
                  ? 'bg-yellow-500'
                  : 'bg-blue-500',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              style={{ left: `calc(${sliderPercentage * 100}% - 8px)` }}
            />
          </div>
          <input
            id={inputId}
            type="number"
            className={clsx(
              'mt-2 w-full',
              sizeClasses[size],
              'border border-gray-300 rounded-lg px-3 py-2',
              'focus:border-blue-500 focus:ring-2 focus:ring-blue-500',
              disabled && 'bg-gray-50 cursor-not-allowed'
            )}
            value={currentValue ?? ''}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={messageText ? `${inputId}-message` : undefined}
          />
        </div>
        {messageText && (
          <span id={`${inputId}-message`} className={messageClasses[messageType]} role={hasError ? 'alert' : undefined}>
            {messageText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
      {label && !isFloatingLabel && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={clsx('relative', isSpinner && 'flex items-stretch')}>
        {isFloatingLabel && label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type="number"
          className={clsx(
            inputClasses,
            isSpinner && 'border-l-0 border-r-0'
          )}
          value={currentValue ?? ''}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={messageText ? `${inputId}-message` : undefined}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {showControls && !isSpinner && (
          <div className="absolute right-0 top-0 h-full flex flex-col border-l border-gray-300">
            <button
              type="button"
              onClick={handleIncrement}
              disabled={disabled || (max !== undefined && (currentValue ?? 0) >= max)}
              className={clsx(
                'flex-1 px-2 flex items-center justify-center',
                'border-b border-gray-300',
                'hover:bg-gray-100 active:bg-gray-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors'
              )}
              aria-label="Increment"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              disabled={disabled || (min !== undefined && (currentValue ?? 0) <= min)}
              className={clsx(
                'flex-1 px-2 flex items-center justify-center',
                'hover:bg-gray-100 active:bg-gray-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors'
              )}
              aria-label="Decrement"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
        {isSpinner && (
          <>
            {/* Left arrow - Decrement */}
            <button
              type="button"
              onClick={handleDecrement}
              disabled={disabled || (min !== undefined && (currentValue ?? 0) <= min)}
              className={clsx(
                'absolute left-0 top-0 h-full w-10 flex items-center justify-center',
                'border border-r-0 border-gray-300 rounded-l-lg',
                'hover:bg-gray-100 active:bg-gray-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors',
                'bg-white',
                hasError && 'border-red-500',
                hasSuccess && 'border-green-500',
                hasWarning && 'border-yellow-500'
              )}
              aria-label="Decrement"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {/* Right arrow - Increment */}
            <button
              type="button"
              onClick={handleIncrement}
              disabled={disabled || (max !== undefined && (currentValue ?? 0) >= max)}
              className={clsx(
                'absolute right-0 top-0 h-full w-10 flex items-center justify-center',
                'border border-l-0 border-gray-300 rounded-r-lg',
                'hover:bg-gray-100 active:bg-gray-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors',
                'bg-white',
                hasError && 'border-red-500',
                hasSuccess && 'border-green-500',
                hasWarning && 'border-yellow-500'
              )}
              aria-label="Increment"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
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

export default NumberField;

