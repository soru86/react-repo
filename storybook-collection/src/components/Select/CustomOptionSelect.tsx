import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { UserIcon, MailIcon, LockIcon, CheckCircleIcon } from '../TextInput/icons';

export interface CustomOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  showCheckbox?: boolean;
}

export interface CustomOptionSelectProps {
  /**
   * Label text displayed above the select
   */
  label?: string;
  /**
   * Helper text displayed below the select
   */
  helperText?: string;
  /**
   * Error message displayed below the select
   */
  error?: string;
  /**
   * Options array with custom content
   */
  options: CustomOption[];
  /**
   * Selected value
   */
  value?: string | number;
  /**
   * Callback when value changes
   */
  onChange?: (value: string | number) => void;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Size of the select
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether the select should take full width
   */
  fullWidth?: boolean;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
}

/**
 * Select component with custom options (icons, checkboxes, descriptions)
 */
export const CustomOptionSelect: React.FC<CustomOptionSelectProps> = ({
  label,
  helperText,
  error,
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  required = false,
  size = 'medium',
  fullWidth = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(value);
  const selectRef = useRef<HTMLDivElement>(null);

  const hasError = !!error;

  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle selection
  const handleSelect = (option: CustomOption) => {
    if (option.disabled) return;
    setSelectedValue(option.value);
    setIsOpen(false);
    onChange?.(option.value);
  };

  // Get selected option
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div className={clsx('flex flex-col', fullWidth && 'w-full')} ref={selectRef}>
      {label && (
        <label className={clsx('block text-sm font-medium mb-1.5', hasError ? 'text-red-700' : 'text-gray-700')}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          className={clsx(
            'w-full border rounded-lg transition-all duration-200 outline-none cursor-pointer',
            'flex items-center justify-between',
            hasError
              ? 'border-red-500 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-500'
              : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500',
            disabled && 'bg-gray-50 cursor-not-allowed',
            sizeClasses[size]
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedOption ? (
              <>
                {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
                <span className="truncate">{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
          <svg
            className={clsx('w-5 h-5 text-gray-400 shrink-0 transition-transform', isOpen && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={clsx(
                    'px-4 py-3 cursor-pointer transition-colors',
                    isSelected
                      ? 'bg-blue-50 text-blue-900'
                      : 'hover:bg-gray-50 text-gray-900',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {option.showCheckbox && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    )}
                    {option.icon && <span className="shrink-0 text-gray-500">{option.icon}</span>}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-gray-500 mt-0.5">{option.description}</div>
                      )}
                    </div>
                    {isSelected && (
                      <CheckCircleIcon size={20} className="text-blue-600 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <span className={clsx('text-sm mt-1.5', error ? 'text-red-600' : 'text-gray-500')}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export default CustomOptionSelect;

