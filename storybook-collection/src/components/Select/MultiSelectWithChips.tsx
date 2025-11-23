import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { XCircleIcon } from '../TextInput/icons';
import type { SelectOption } from './Select';

export interface MultiSelectWithChipsProps {
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
   * Options array
   */
  options: SelectOption[];
  /**
   * Selected values
   */
  value?: (string | number)[];
  /**
   * Callback when values change
   */
  onChange?: (values: (string | number)[]) => void;
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
 * Multi-select component with chips for selected values
 */
export const MultiSelectWithChips: React.FC<MultiSelectWithChipsProps> = ({
  label,
  helperText,
  error,
  options,
  value = [],
  onChange,
  placeholder = 'Select options...',
  required = false,
  size = 'medium',
  fullWidth = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>(value);
  const selectRef = useRef<HTMLDivElement>(null);

  const hasError = !!error;

  // Size classes
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-3 py-1.5 text-base',
    large: 'px-4 py-2 text-lg',
  };

  // Chip size classes
  const chipSizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1 text-base',
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

  // Handle toggle selection
  const handleToggle = (optionValue: string | number) => {
    if (disabled || options.find((opt) => opt.value === optionValue)?.disabled) return;

    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];

    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  // Handle remove chip
  const handleRemoveChip = (chipValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== chipValue);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  // Get selected options
  const selectedOptions = options.filter((opt) => selectedValues.includes(opt.value));

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
            'w-full border rounded-lg transition-all duration-200 outline-none cursor-pointer min-h-[42px]',
            'flex flex-wrap items-center gap-2',
            hasError
              ? 'border-red-500 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-500'
              : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500',
            disabled && 'bg-gray-50 cursor-not-allowed',
            sizeClasses[size]
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {selectedOptions.length > 0 ? (
            <>
              {selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className={clsx(
                    'inline-flex items-center gap-1 bg-blue-100 text-blue-800 rounded-md',
                    chipSizeClasses[size],
                    disabled && 'opacity-50'
                  )}
                >
                  {option.label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveChip(option.value, e)}
                      className="hover:text-blue-900"
                    >
                      <XCircleIcon size={12} />
                    </button>
                  )}
                </span>
              ))}
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => handleToggle(option.value)}
                  className={clsx(
                    'px-4 py-2 cursor-pointer transition-colors flex items-center gap-2',
                    isSelected
                      ? 'bg-blue-50 text-blue-900'
                      : 'hover:bg-gray-50 text-gray-900',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>{option.label}</span>
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

export default MultiSelectWithChips;

