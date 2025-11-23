import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { SearchIcon, XCircleIcon } from '../TextInput/icons';
import type { SelectOption } from './Select';

export interface ComboboxProps {
  /**
   * Label text displayed above the combobox
   */
  label?: string;
  /**
   * Helper text displayed below the combobox
   */
  helperText?: string;
  /**
   * Error message displayed below the combobox
   */
  error?: string;
  /**
   * Options array
   */
  options: SelectOption[];
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
   * Size of the combobox
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether the combobox should take full width
   */
  fullWidth?: boolean;
  /**
   * Whether the combobox is disabled
   */
  disabled?: boolean;
}

/**
 * Combobox component - searchable select dropdown
 */
export const Combobox: React.FC<ComboboxProps> = ({
  label,
  helperText,
  error,
  options,
  value,
  onChange,
  placeholder = 'Type to search...',
  required = false,
  size = 'medium',
  fullWidth = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(value);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasError = !!error;

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const displayValue = selectedOption ? selectedOption.label : '';

  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle selection
  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    setSelectedValue(option.value);
    setSearchTerm('');
    setIsOpen(false);
    onChange?.(option.value);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValue(undefined);
    setSearchTerm('');
    onChange?.(undefined as any);
  };

  return (
    <div className={clsx('flex flex-col', fullWidth && 'w-full')} ref={comboboxRef}>
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
            'flex items-center gap-2',
            hasError
              ? 'border-red-500 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-500'
              : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500',
            disabled && 'bg-gray-50 cursor-not-allowed',
            sizeClasses[size]
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <SearchIcon size={size === 'small' ? 16 : size === 'large' ? 24 : 20} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchTerm : displayValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none border-none text-gray-900 placeholder:text-gray-400 disabled:text-gray-500"
          />
          {selectedValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon size={16} />
            </button>
          )}
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={clsx(
                    'px-4 py-2 cursor-pointer transition-colors',
                    option.value === selectedValue
                      ? 'bg-blue-50 text-blue-900'
                      : 'hover:bg-gray-50 text-gray-900',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm">No options found</div>
            )}
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

export default Combobox;

