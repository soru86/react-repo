import React, { useState } from 'react';
import { clsx } from 'clsx';

export interface RatingProps {
  /**
   * Current rating value (0 to max)
   */
  value?: number;
  /**
   * Default rating value
   */
  defaultValue?: number;
  /**
   * Maximum number of stars
   */
  max?: number;
  /**
   * Whether rating can be changed (interactive)
   */
  readOnly?: boolean;
  /**
   * Whether to allow half stars
   */
  allowHalf?: boolean;
  /**
   * Size of the stars
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /**
   * Show rating value as text
   */
  showValue?: boolean;
  /**
   * Show label
   */
  label?: string;
  /**
   * Show helper text
   */
  helperText?: string;
  /**
   * Callback when rating changes
   */
  onChange?: (value: number) => void;
  /**
   * Callback when hovering over a star
   */
  onHover?: (value: number) => void;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Rating component with stars
 */
export const Rating: React.FC<RatingProps> = ({
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  readOnly = false,
  allowHalf = false,
  size = 'medium',
  variant = 'default',
  showValue = false,
  label,
  helperText,
  onChange,
  onHover,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [hoverHalf, setHoverHalf] = useState<boolean>(false);

  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  const displayValue = hoverValue !== null ? hoverValue : currentValue;
  const isInteractive = !readOnly;

  // Size classes
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  // Color classes
  const colorClasses = {
    default: 'text-yellow-400',
    primary: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
  };

  const emptyColor = 'text-gray-300';

  // Handle star click
  const handleStarClick = (starValue: number) => {
    if (!isInteractive) return;
    setInternalValue(starValue);
    onChange?.(starValue);
  };

  // Handle star hover
  const handleStarHover = (starValue: number, isHalf: boolean = false) => {
    if (!isInteractive) return;
    const finalValue = isHalf && allowHalf ? starValue - 0.5 : starValue;
    setHoverValue(finalValue);
    setHoverHalf(isHalf && allowHalf);
    onHover?.(finalValue);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (!isInteractive) return;
    setHoverValue(null);
    setHoverHalf(false);
  };

  // Render star
  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = displayValue >= starValue;
    const isHalfFilled = allowHalf && displayValue >= starValue - 0.5 && displayValue < starValue;
    const isHovered = hoverValue !== null && hoverValue >= starValue - 0.5 && hoverValue < starValue + 0.5;

    const starClasses = clsx(
      sizeClasses[size],
      'transition-colors duration-150',
      isFilled || isHalfFilled || (isHovered && hoverValue !== null && hoverValue >= starValue - 0.5) ? colorClasses[variant] : emptyColor,
      isInteractive && 'cursor-pointer'
    );

    const handleClick = (half: boolean = false) => {
      if (!isInteractive) return;
      const clickValue = half ? starValue - 0.5 : starValue;
      handleStarClick(clickValue);
    };

    const handleMouseEnter = (half: boolean = false) => {
      if (!isInteractive) return;
      handleStarHover(starValue, half);
    };

    if (allowHalf) {
      return (
        <div
          key={index}
          className="relative inline-block"
          style={{ width: size === 'small' ? '16px' : size === 'large' ? '24px' : '20px' }}
          onMouseLeave={handleMouseLeave}
        >
          {/* Full star background (empty) */}
          <svg
            className={clsx(starClasses, emptyColor, 'absolute inset-0')}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {/* Left half (filled) */}
          {(isHalfFilled || (isHovered && hoverValue !== null && hoverValue < starValue)) && (
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <svg
                className={clsx(starClasses, colorClasses[variant])}
                fill="currentColor"
                viewBox="0 0 20 20"
                onClick={() => handleClick(true)}
                onMouseEnter={() => handleMouseEnter(true)}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}
          {/* Full star (filled) */}
          {isFilled && (
            <svg
              className={clsx(starClasses, colorClasses[variant], 'absolute inset-0')}
              fill="currentColor"
              viewBox="0 0 20 20"
              onClick={() => handleClick(false)}
              onMouseEnter={() => handleMouseEnter(false)}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
          {/* Right half clickable area */}
          {!isFilled && (
            <div
              className="absolute inset-0"
              style={{ left: '50%' }}
              onClick={() => handleClick(false)}
              onMouseEnter={() => handleMouseEnter(false)}
            />
          )}
        </div>
      );
    }

    return (
      <svg
        key={index}
        className={starClasses}
        fill={isFilled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={isFilled ? 0 : 1}
        viewBox="0 0 20 20"
        onClick={() => handleClick(false)}
        onMouseEnter={() => handleMouseEnter(false)}
        onMouseLeave={handleMouseLeave}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  };

  return (
    <div className={clsx('flex flex-col', className)}>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-gray-700">
          {label}
        </label>
      )}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: max }, (_, i) => renderStar(i))}
        </div>
        {showValue && (
          <span className={clsx('ml-2 text-sm font-medium', colorClasses[variant])}>
            {displayValue.toFixed(allowHalf ? 1 : 0)} / {max}
          </span>
        )}
      </div>
      {helperText && (
        <span className="text-gray-500 text-sm mt-1.5">{helperText}</span>
      )}
    </div>
  );
};

export default Rating;

