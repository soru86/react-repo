import React, { useRef, useCallback } from 'react';
import { clsx } from 'clsx';

export interface MultiStateCheckboxOption {
  /**
   * Value of the option
   */
  value: any;
  /**
   * Icon to display for this state
   */
  icon?: React.ReactNode;
  /**
   * Label for accessibility
   */
  label?: string;
}

export interface MultiStateCheckboxProps {
  /**
   * Current value (controlled)
   */
  value?: any;
  /**
   * Default value (uncontrolled)
   */
  defaultValue?: any;
  /**
   * Options array defining the states
   */
  options: MultiStateCheckboxOption[];
  /**
   * Property name to use for option value (if options are objects)
   */
  optionValue?: string;
  /**
   * Property name to use for option icon (if options are objects)
   */
  optionIcon?: string;
  /**
   * Property name to use for option label (if options are objects)
   */
  optionLabel?: string;
  /**
   * Callback when value changes
   */
  onChange?: (e: { value: any }) => void;
  /**
   * Whether checkbox is disabled
   */
  disabled?: boolean;
  /**
   * Whether checkbox is invalid
   */
  invalid?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * ARIA label
   */
  'aria-label'?: string;
  /**
   * ARIA labelled by
   */
  'aria-labelledby'?: string;
}

const sizeClasses = {
  small: 'w-4 h-4',
  medium: 'w-5 h-5',
  large: 'w-6 h-6',
};

const iconSizeClasses = {
  small: 'w-3 h-3',
  medium: 'w-4 h-4',
  large: 'w-5 h-5',
};

export const MultiStateCheckbox: React.FC<MultiStateCheckboxProps> = ({
  value: controlledValue,
  defaultValue,
  options,
  optionValue,
  optionIcon = 'icon',
  optionLabel,
  onChange,
  disabled = false,
  invalid = false,
  className,
  size = 'medium',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const checkboxRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Normalize options to always have value, icon, and label
  const normalizedOptions = React.useMemo(() => {
    return options.map((option) => {
      if (typeof option === 'object' && option !== null) {
        const value = optionValue ? option[optionValue] : option.value ?? option;
        const icon = optionIcon ? option[optionIcon] : option.icon;
        const label = optionLabel ? option[optionLabel] : option.label ?? String(value);
        return { value, icon, label };
      }
      return { value: option, icon: undefined, label: String(option) };
    });
  }, [options, optionValue, optionIcon, optionLabel]);

  // Find current state index
  const currentIndex = React.useMemo(() => {
    if (currentValue === null || currentValue === undefined) {
      return -1; // Unchecked state
    }
    return normalizedOptions.findIndex((opt) => {
      if (optionValue && typeof currentValue === 'object') {
        return opt.value === currentValue[optionValue];
      }
      return opt.value === currentValue;
    });
  }, [currentValue, normalizedOptions, optionValue]);

  // Get current state display
  const currentState = React.useMemo(() => {
    if (currentIndex === -1) {
      return null; // Unchecked
    }
    return normalizedOptions[currentIndex];
  }, [currentIndex, normalizedOptions]);

  const handleClick = useCallback(() => {
    if (disabled) return;

    let nextIndex = currentIndex + 1;
    
    // Cycle through: unchecked -> option1 -> option2 -> ... -> unchecked
    if (nextIndex >= normalizedOptions.length) {
      nextIndex = -1; // Back to unchecked
    }

    const nextValue = nextIndex === -1 ? null : normalizedOptions[nextIndex].value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.({ value: nextValue });
  }, [disabled, currentIndex, normalizedOptions, isControlled, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleClick();
      }
    },
    [disabled, handleClick]
  );

  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    if (currentState) {
      return `Current state: ${currentState.label}`;
    }
    return 'Unchecked';
  };

  const sizeClass = sizeClasses[size];
  const iconSizeClass = iconSizeClasses[size];

  return (
    <div
      ref={checkboxRef}
      role="checkbox"
      aria-checked={currentIndex !== -1}
      aria-label={getAriaLabel()}
      aria-labelledby={ariaLabelledBy}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        'inline-flex items-center justify-center',
        'border-2 rounded',
        'cursor-pointer select-none',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        sizeClass,
        disabled
          ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
          : invalid
          ? 'border-red-500 dark:border-red-500 focus:ring-red-500 bg-white dark:bg-gray-900'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-blue-500 dark:hover:border-blue-400 focus:ring-blue-500',
        className
      )}
    >
      {/* Screen reader only text for current state */}
      <span className="sr-only" aria-live="polite">
        {currentState ? currentState.label : 'Unchecked'}
      </span>

      {/* Display current state icon or checkmark */}
      {currentState && (
        <div className={clsx('flex items-center justify-center', iconSizeClass)}>
          {currentState.icon ? (
            <span className="text-current">{currentState.icon}</span>
          ) : (
            <svg
              className="w-full h-full"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

