import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Button, type ButtonProps } from '../Button/Button';
import { XCircleIcon } from '../TextInput/icons';

export interface ButtonGroupOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export interface ButtonGroupProps {
  /**
   * Buttons in the group
   */
  buttons: ButtonGroupOption[];
  /**
   * Selected button value(s)
   */
  selected?: string | number | (string | number)[];
  /**
   * Callback when selection changes
   */
  onSelect?: (value: string | number) => void;
  /**
   * Orientation of the button group
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Size of buttons
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Variant of buttons
   */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  /**
   * Whether buttons are outlined
   */
  outlined?: boolean;
  /**
   * Whether to allow multiple selections
   */
  multiple?: boolean;
  /**
   * Whether buttons should take full width
   */
  fullWidth?: boolean;
  /**
   * Whether to show icons only (hide labels)
   */
  iconOnly?: boolean;
  /**
   * Whether to show icons with labels
   */
  showIcons?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Button Group component for grouping related buttons
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  buttons,
  selected,
  onSelect,
  orientation = 'horizontal',
  size = 'medium',
  variant = 'primary',
  outlined = false,
  multiple = false,
  fullWidth = false,
  iconOnly = false,
  showIcons = false,
  className = '',
}) => {
  const [internalSelected, setInternalSelected] = useState<string | number | (string | number)[]>(
    selected || (multiple ? [] : '')
  );

  useEffect(() => {
    if (selected !== undefined) {
      setInternalSelected(selected);
    }
  }, [selected]);

  const handleClick = (button: ButtonGroupOption) => {
    if (button.disabled) return;

    if (multiple) {
      const currentSelected = Array.isArray(internalSelected) ? internalSelected : [];
      const newSelected = currentSelected.includes(button.value)
        ? currentSelected.filter((v) => v !== button.value)
        : [...currentSelected, button.value];
      setInternalSelected(newSelected);
      onSelect?.(button.value);
    } else {
      setInternalSelected(button.value);
      onSelect?.(button.value);
    }

    button.onClick?.();
  };

  const isSelected = (value: string | number) => {
    if (multiple) {
      return Array.isArray(internalSelected) && internalSelected.includes(value);
    }
    return internalSelected === value;
  };

  const groupClasses = clsx(
    'inline-flex',
    orientation === 'vertical' ? 'flex-col' : 'flex-row',
    fullWidth && 'w-full',
    className
  );

  return (
    <div className={groupClasses} role="group">
      {buttons.map((button, index) => {
        const isFirst = index === 0;
        const isLast = index === buttons.length - 1;
        const isSelectedButton = isSelected(button.value);

        const buttonClasses = clsx(
          orientation === 'horizontal'
            ? clsx(
                !isFirst && 'rounded-l-none -ml-px',
                !isLast && 'rounded-r-none',
                isFirst && 'rounded-l-lg',
                isLast && 'rounded-r-lg'
              )
            : clsx(
                !isFirst && 'rounded-t-none -mt-px',
                !isLast && 'rounded-b-none',
                isFirst && 'rounded-t-lg',
                isLast && 'rounded-b-lg'
              )
        );

        return (
          <Button
            key={button.value}
            variant={variant}
            size={size}
            outlined={outlined}
            icon={showIcons || iconOnly ? button.icon : undefined}
            iconOnly={iconOnly}
            iconPosition="left"
            disabled={button.disabled}
            className={buttonClasses}
            onClick={() => handleClick(button)}
            style={{
              ...(isSelectedButton && !outlined
                ? {}
                : isSelectedButton && outlined
                ? { backgroundColor: 'transparent', borderColor: 'currentColor' }
                : {}),
            }}
          >
            {!iconOnly && button.label}
          </Button>
        );
      })}
    </div>
  );
};

export interface SplitButtonProps {
  /**
   * Main button label
   */
  label: string;
  /**
   * Main button icon
   */
  icon?: React.ReactNode;
  /**
   * Dropdown options
   */
  options: ButtonGroupOption[];
  /**
   * Callback when main button is clicked
   */
  onClick?: () => void;
  /**
   * Callback when dropdown option is selected
   */
  onSelect?: (value: string | number) => void;
  /**
   * Size of the button
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Variant of the button
   */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  /**
   * Whether button is outlined
   */
  outlined?: boolean;
  /**
   * Whether button is disabled
   */
  disabled?: boolean;
}

/**
 * Split Button component - button with dropdown
 */
export const SplitButton: React.FC<SplitButtonProps> = ({
  label,
  icon,
  options,
  onClick,
  onSelect,
  size = 'medium',
  variant = 'primary',
  outlined = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleMainClick = () => {
    onClick?.();
  };

  const handleOptionClick = (option: ButtonGroupOption) => {
    if (option.disabled) return;
    setIsOpen(false);
    onSelect?.(option.value);
    option.onClick?.();
  };

  return (
    <div className="inline-flex relative" ref={dropdownRef}>
      <Button
        variant={variant}
        size={size}
        outlined={outlined}
        icon={icon}
        iconPosition="left"
        disabled={disabled}
        onClick={handleMainClick}
        className="rounded-r-none -mr-px"
      >
        {label}
      </Button>
      <Button
        variant={variant}
        size={size}
        outlined={outlined}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-l-none px-2"
        aria-label="Toggle dropdown"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          className={clsx('w-5 h-5 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <div 
          className="absolute z-50 top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
          role="menu"
          aria-orientation="vertical"
        >
          {options.length > 0 ? (
            options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option)}
                disabled={option.disabled}
                role="menuitem"
                className={clsx(
                  'w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2',
                  option.disabled
                    ? 'opacity-50 cursor-not-allowed text-gray-400'
                    : 'hover:bg-gray-50 text-gray-900'
                )}
              >
                {option.icon && <span className="shrink-0 flex items-center">{option.icon}</span>}
                <span className="flex-1">{option.label}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ButtonGroup;

