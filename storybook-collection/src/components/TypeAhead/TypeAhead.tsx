import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import { SearchIcon, XIcon, ChevronDownIcon, ChevronUpIcon, LoaderIcon } from './icons';

export interface TypeAheadOption {
  id: string | number;
  label: string;
  value?: string | number;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  group?: string;
  [key: string]: any;
}

export type TypeAheadVariant = 'default' | 'outlined' | 'filled' | 'minimal';
export type TypeAheadSize = 'small' | 'medium' | 'large';

export interface TypeAheadProps {
  /**
   * Options array to search through
   */
  options: TypeAheadOption[];
  /**
   * Selected value(s) - string for single, array for multiple
   */
  value?: string | number | (string | number)[];
  /**
   * Callback when selection changes
   */
  onChange?: (value: string | number | (string | number)[] | null) => void;
  /**
   * Callback when input value changes
   */
  onInputChange?: (value: string) => void;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Label text
   */
  label?: string;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Success message
   */
  success?: string;
  /**
   * Warning message
   */
  warning?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  /**
   * Whether to allow multiple selections
   */
  multiple?: boolean;
  /**
   * Minimum characters before showing results (default: 3)
   */
  minChars?: number;
  /**
   * Debounce delay in milliseconds (default: 300)
   */
  debounceMs?: number;
  /**
   * Maximum number of results to show
   */
  maxResults?: number;
  /**
   * Custom filter function
   */
  filterFunction?: (options: TypeAheadOption[], searchTerm: string) => TypeAheadOption[];
  /**
   * Custom render function for options
   */
  renderOption?: (option: TypeAheadOption, searchTerm: string) => React.ReactNode;
  /**
   * Custom render function for selected value(s)
   */
  renderValue?: (option: TypeAheadOption | TypeAheadOption[]) => React.ReactNode;
  /**
   * Whether to show loading state
   */
  isLoading?: boolean;
  /**
   * Loading message
   */
  loadingText?: string;
  /**
   * Empty state message
   */
  emptyText?: string;
  /**
   * No results message
   */
  noResultsText?: string;
  /**
   * Size variant
   */
  size?: TypeAheadSize;
  /**
   * Style variant
   */
  variant?: TypeAheadVariant;
  /**
   * Whether to take full width
   */
  fullWidth?: boolean;
  /**
   * Icon to display on the left
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to display on the right
   */
  rightIcon?: React.ReactNode;
  /**
   * Whether to clear on selection
   */
  clearOnSelect?: boolean;
  /**
   * Whether to highlight matched text
   */
  highlightMatch?: boolean;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Whether to show clear button
   */
  showClearButton?: boolean;
  /**
   * Group options by a field
   */
  groupBy?: string;
}

/**
 * Debounce hook
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Highlight matching text in a string
 */
function highlightText(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 font-semibold">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

/**
 * Default filter function - case-insensitive search
 */
function defaultFilter(options: TypeAheadOption[], searchTerm: string): TypeAheadOption[] {
  const term = searchTerm.toLowerCase();
  return options.filter((option) => {
    const label = String(option.label || '').toLowerCase();
    const description = option.description ? String(option.description).toLowerCase() : '';
    return label.includes(term) || description.includes(term);
  });
}

/**
 * TypeAhead/Autocomplete component with debouncing and keyboard navigation
 */
export const TypeAhead: React.FC<TypeAheadProps> = ({
  options = [],
  value,
  onChange,
  onInputChange,
  placeholder = 'Type to search...',
  label,
  helperText,
  error,
  success,
  warning,
  required = false,
  disabled = false,
  multiple = false,
  minChars = 3,
  debounceMs = 300,
  maxResults,
  filterFunction = defaultFilter,
  renderOption,
  renderValue,
  isLoading = false,
  loadingText = 'Loading...',
  emptyText = 'No options available',
  noResultsText = 'No results found',
  size = 'medium',
  variant = 'default',
  fullWidth = false,
  leftIcon,
  rightIcon,
  clearOnSelect = false,
  highlightMatch = true,
  className = '',
  showClearButton = true,
  groupBy,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedOptions, setSelectedOptions] = useState<TypeAheadOption[]>([]);
  const [openedViaCaret, setOpenedViaCaret] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debouncedSearchTerm = useDebounce(inputValue, debounceMs);

  // Get selected options from value prop
  useEffect(() => {
    if (value === undefined || value === null) {
      setSelectedOptions([]);
      return;
    }

    const valueArray = Array.isArray(value) ? value : [value];
    const selected = valueArray
      .map((val) => options.find((opt) => opt.id === val || opt.value === val))
      .filter((opt): opt is TypeAheadOption => opt !== undefined);

    setSelectedOptions(selected);
  }, [value, options]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    // If opened via caret, show all options (or filtered if search term exists)
    const shouldShowAll = openedViaCaret && (!debouncedSearchTerm || debouncedSearchTerm.length < minChars);
    
    // If search term is too short and not opened via caret, return empty
    if (!shouldShowAll && (!debouncedSearchTerm || debouncedSearchTerm.length < minChars)) {
      return [];
    }

    // Filter options based on search term (or show all if opened via caret with no search)
    let filtered = shouldShowAll 
      ? options 
      : filterFunction(options, debouncedSearchTerm);

    // Filter out already selected options in multiple mode
    if (multiple && selectedOptions.length > 0) {
      const selectedIds = selectedOptions.map((opt) => opt.id);
      filtered = filtered.filter((opt) => !selectedIds.includes(opt.id));
    }

    // Apply max results limit
    if (maxResults && filtered.length > maxResults) {
      filtered = filtered.slice(0, maxResults);
    }

    return filtered;
  }, [debouncedSearchTerm, options, filterFunction, minChars, multiple, selectedOptions, maxResults, openedViaCaret]);

  // Group options if groupBy is specified
  const groupedOptions = useMemo(() => {
    if (!groupBy || filteredOptions.length === 0) {
      return { ungrouped: filteredOptions };
    }

    const groups: { [key: string]: TypeAheadOption[] } = {};
    filteredOptions.forEach((option) => {
      const group = option[groupBy] || option.group || 'ungrouped';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
    });

    return groups;
  }, [filteredOptions, groupBy]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsOpen(true);
      setHighlightedIndex(-1);
      setOpenedViaCaret(false); // Reset caret flag when user types
      onInputChange?.(newValue);
    },
    [onInputChange]
  );

  // Handle option selection
  const handleSelect = useCallback(
    (option: TypeAheadOption) => {
      if (option.disabled) return;

      if (multiple) {
        const newSelected = [...selectedOptions, option];
        setSelectedOptions(newSelected);
        onChange?.(newSelected.map((opt) => opt.id));
        if (clearOnSelect) {
          setInputValue('');
        } else {
          setInputValue('');
        }
        setOpenedViaCaret(false);
      } else {
        setSelectedOptions([option]);
        onChange?.(option.id);
        setInputValue(clearOnSelect ? '' : option.label);
        setIsOpen(false);
        setOpenedViaCaret(false);
        inputRef.current?.blur();
      }
    },
    [multiple, selectedOptions, onChange, clearOnSelect]
  );

  // Handle remove selected option (for multiple mode)
  const handleRemove = useCallback(
    (optionId: string | number) => {
      const newSelected = selectedOptions.filter((opt) => opt.id !== optionId);
      setSelectedOptions(newSelected);
      onChange?.(newSelected.length > 0 ? newSelected.map((opt) => opt.id) : null);
    },
    [selectedOptions, onChange]
  );

  // Handle clear all
  const handleClear = useCallback(() => {
    setInputValue('');
    setSelectedOptions([]);
    setIsOpen(false);
    setOpenedViaCaret(false);
    onChange?.(null);
    inputRef.current?.focus();
  }, [onChange]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          setOpenedViaCaret(false);
          inputRef.current?.blur();
          break;
        case 'Backspace':
          if (
            !inputValue &&
            multiple &&
            selectedOptions.length > 0 &&
            !isOpen
          ) {
            handleRemove(selectedOptions[selectedOptions.length - 1].id);
          }
          break;
      }
    },
    [
      disabled,
      filteredOptions,
      highlightedIndex,
      handleSelect,
      inputValue,
      multiple,
      selectedOptions,
      handleRemove,
    ]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        setOpenedViaCaret(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [highlightedIndex]);

  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm min-h-8',
    medium: 'px-4 py-2 text-base min-h-10',
    large: 'px-5 py-3 text-lg min-h-12',
  };

  // Variant classes
  const variantClasses = {
    default: clsx(
      'border border-gray-300 bg-white dark:bg-gray-800',
      'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
      success && 'border-green-500 focus:border-green-500 focus:ring-green-500',
      warning && 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500'
    ),
    outlined: clsx(
      'border-2 border-gray-300 bg-white dark:bg-gray-800',
      'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
      success && 'border-green-500 focus:border-green-500 focus:ring-green-500',
      warning && 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500'
    ),
    filled: clsx(
      'border-0 border-b-2 border-gray-300 bg-gray-50 dark:bg-gray-900 rounded-t-lg',
      'focus:border-blue-500 focus:bg-gray-100 dark:focus:bg-gray-800 focus:ring-0',
      error && 'border-red-500 focus:border-red-500',
      success && 'border-green-500 focus:border-green-500',
      warning && 'border-yellow-500 focus:border-yellow-500'
    ),
    minimal: clsx(
      'border-0 bg-transparent',
      'focus:ring-0 focus:outline-none',
      'border-b border-gray-300 dark:border-gray-700',
      error && 'border-red-500',
      success && 'border-green-500',
      warning && 'border-yellow-500'
    ),
  };

  const hasError = !!error;
  const hasSuccess = !!success;
  const hasWarning = !!warning;
  const showResults = isOpen && (openedViaCaret || debouncedSearchTerm.length >= minChars);
  const displayValue = multiple
    ? ''
    : selectedOptions.length > 0
    ? selectedOptions[0].label
    : inputValue;

  return (
    <div
      ref={containerRef}
      className={clsx('relative', fullWidth && 'w-full', className)}
    >
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Selected chips for multiple mode */}
      {multiple && selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-sm"
            >
              {renderValue ? renderValue(option) : option.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(option.id)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5"
                  aria-label={`Remove ${option.label}`}
                >
                  <XIcon size={14} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Input container */}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {leftIcon}
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={multiple ? inputValue : displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            'w-full rounded-lg transition-all duration-200 outline-none',
            sizeClasses[size],
            variantClasses[variant],
            leftIcon && 'pl-10',
            (rightIcon || showClearButton) && 'pr-10',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900',
            'text-gray-900 dark:text-gray-100'
          )}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="typeahead-options"
        />

        {/* Right side icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <LoaderIcon size={size === 'small' ? 16 : size === 'large' ? 20 : 18} className="text-gray-400" />
          )}
          {!isLoading && showClearButton && (inputValue || selectedOptions.length > 0) && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear"
            >
              <XIcon size={size === 'small' ? 16 : size === 'large' ? 20 : 18} />
            </button>
          )}
          {rightIcon && !isLoading && (!showClearButton || (!inputValue && selectedOptions.length === 0)) && (
            <div className="text-gray-400 pointer-events-none">{rightIcon}</div>
          )}
          {!rightIcon && !isLoading && (!showClearButton || (!inputValue && selectedOptions.length === 0)) && (
            <button
              type="button"
              onClick={() => {
                if (!isOpen) {
                  setOpenedViaCaret(true);
                  setIsOpen(true);
                  inputRef.current?.focus();
                } else {
                  setIsOpen(false);
                  setOpenedViaCaret(false);
                }
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Toggle dropdown"
            >
              {isOpen ? (
                <ChevronUpIcon size={size === 'small' ? 16 : size === 'large' ? 20 : 18} />
              ) : (
                <ChevronDownIcon size={size === 'small' ? 16 : size === 'large' ? 20 : 18} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {showResults && (
        <div
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto"
          id="typeahead-options"
          role="listbox"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              {loadingText}
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              {openedViaCaret && (!debouncedSearchTerm || debouncedSearchTerm.length < minChars)
                ? emptyText
                : noResultsText}
            </div>
          ) : (
            <ul ref={listRef} className="py-1">
              {Object.keys(groupedOptions).map((groupKey) => {
                const groupOptions = groupedOptions[groupKey];
                if (groupOptions.length === 0) return null;

                return (
                  <React.Fragment key={groupKey}>
                    {groupBy && groupKey !== 'ungrouped' && (
                      <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900 sticky top-0">
                        {groupKey}
                      </li>
                    )}
                    {groupOptions.map((option, index) => {
                      const globalIndex = filteredOptions.indexOf(option);
                      const isHighlighted = globalIndex === highlightedIndex;
                      const isSelected = selectedOptions.some((opt) => opt.id === option.id);

                      return (
                        <li
                          key={option.id}
                          role="option"
                          aria-selected={isSelected}
                          className={clsx(
                            'px-4 py-2 cursor-pointer transition-colors',
                            isHighlighted && 'bg-blue-50 dark:bg-blue-900',
                            option.disabled && 'opacity-50 cursor-not-allowed',
                            !option.disabled && 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          )}
                          onClick={() => !option.disabled && handleSelect(option)}
                          onMouseEnter={() => !option.disabled && setHighlightedIndex(globalIndex)}
                        >
                          {renderOption ? (
                            renderOption(option, debouncedSearchTerm)
                          ) : (
                            <div className="flex items-center gap-2">
                              {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                  {highlightMatch
                                    ? highlightText(option.label, debouncedSearchTerm)
                                    : option.label}
                                </div>
                                {option.description && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {option.description}
                                  </div>
                                )}
                              </div>
                              {isSelected && (
                                <span className="text-blue-500 flex-shrink-0">
                                  ✓
                                </span>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Helper/Error/Success/Warning text */}
      {(helperText || error || success || warning) && (
        <div
          className={clsx(
            'mt-1.5 text-sm',
            error && 'text-red-600 dark:text-red-400',
            success && 'text-green-600 dark:text-green-400',
            warning && 'text-yellow-600 dark:text-yellow-400',
            !error && !success && !warning && 'text-gray-500 dark:text-gray-400'
          )}
        >
          {error || success || warning || helperText}
        </div>
      )}
    </div>
  );
};

export default TypeAhead;

